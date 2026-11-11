"""Build the SQL practice question bank (questions.json) and validate it with SQLite.

Each question has: schema (shown to the candidate), the expected output columns, whether row order
matters, a reference solution, a sample dataset (Run Query + Example) and 4 hidden datasets.
Test case 1 = sample dataset, test cases 2-5 = hidden datasets with edge cases.

Validation:
  * the reference solution runs on every dataset and returns rows;
  * every listed "trap" query (a typical wrong answer) fails at least one test case,
    so the hidden datasets really catch that mistake.

Usage: python3 build_sql_bank.py out/questions.json
"""
import json
import random
import sqlite3
import sys

FIRST = ["Aarav", "Diya", "Kabir", "Meera", "Rohan", "Isha", "Arjun", "Sneha", "Vikram", "Ananya", "Rahul",
         "Pooja", "Karan", "Neha", "Siddharth", "Tanvi", "Aditya", "Riya", "Manav", "Kavya", "Yash", "Nisha",
         "Dev", "Simran", "Harsh", "Priya", "Nikhil", "Aisha", "Varun", "Zoya"]
LAST = ["Sharma", "Verma", "Iyer", "Reddy", "Patel", "Gupta", "Nair", "Khan", "Mehta", "Singh", "Das", "Rao",
        "Joshi", "Kapoor", "Bose", "Menon", "Shah", "Pillai", "Malhotra", "Chopra"]


def T(name, cols):
    """Table spec: cols = [(column, type, description)]."""
    return {"name": name, "cols": [{"name": c, "type": t, "desc": d} for c, t, d in cols]}


def ddl(table):
    m = {"INT": "INTEGER", "DECIMAL(10,2)": "REAL"}
    cols = ", ".join(f"{c['name']} {m.get(c['type'], 'TEXT' if c['type'].startswith('VARCHAR') else c['type'])}"
                     for c in table["cols"])
    return f"CREATE TABLE {table['name']} ({cols});"


def inserts(table, rows):
    def lit(v):
        if v is None:
            return "NULL"
        if isinstance(v, str):
            return "'" + v.replace("'", "''") + "'"
        return repr(v)
    return [f"INSERT INTO {table['name']} VALUES ({', '.join(lit(v) for v in r)});" for r in rows]


def names(rng, n):
    seen, out = set(), []
    while len(out) < n:
        f, l = rng.choice(FIRST), rng.choice(LAST)
        if (f, l) not in seen:
            seen.add((f, l))
            out.append((f, l))
    return out


QUESTIONS = []


def question(**kw):
    QUESTIONS.append(kw)
    return kw


# ------------------------------------------------------------------ 1 (original pattern)
CUST = T("Customers", [("CustomerID", "INT", "Unique ID of the customer"),
                       ("FirstName", "VARCHAR(50)", "First name of the customer"),
                       ("LastName", "VARCHAR(50)", "Last name of the customer"),
                       ("AccountID", "INT", "Account ID of the customer")])
TXN = T("Transactions", [("TransactionID", "INT", "Unique ID of the transaction"),
                         ("AccountID", "INT", "Account ID of the customer"),
                         ("TransactionAmount", "INT", "Amount of the transaction")])


def q1_data(rng, k):
    if k == 0:
        c = [(1, "Aarav", "Sharma", 1001), (2, "Diya", "Verma", 1002), (3, "Kabir", "Iyer", 1003),
             (4, "Meera", "Reddy", 1004)]
        t = [(1, 1001, 45000), (2, 1002, 12000), (3, 1003, 30000), (4, 1004, 52000), (5, 1002, 8000)]
        return {"Customers": c, "Transactions": t}
    n = rng.randint(6, 10)
    c = [(i + 1, f, l, 2000 + k * 100 + i) for i, (f, l) in enumerate(names(rng, n))]
    t, tid = [], 1
    for cid, f, l, acc in c:
        for _ in range(rng.randint(0, 3)):
            t.append((tid, acc, rng.choice([rng.randint(1000, 29999), rng.randint(30001, 90000)])))
            tid += 1
    acc = c[0][3]
    t += [(tid, acc, 30000), (tid + 1, c[1][3], 75000), (tid + 2, c[1][3], 41000)]  # boundary + repeat customer
    return {"Customers": c, "Transactions": t}


question(
    id="q1", original=True, difficulty="Easy", topic="JOIN + WHERE + DISTINCT",
    title="Customers with a High-Value Transaction",
    statement="First name, last name and Account ID of customers who have ever made a transaction of "
              "<b>strictly greater than 30000</b>. Use aliases as “First_Name”, “Last_Name” "
              "and “Account_ID”.",
    columns=["First_Name", "Last_Name", "Account_ID"], ordered=False, tables=[CUST, TXN], gen=q1_data,
    solution="SELECT DISTINCT c.FirstName AS First_Name,\n       c.LastName  AS Last_Name,\n"
             "       c.AccountID AS Account_ID\nFROM Customers c\nJOIN Transactions t ON c.AccountID = t.AccountID\n"
             "WHERE t.TransactionAmount > 30000;",
    explain="Join the two tables on AccountID, keep transactions above 30000 (strictly, so exactly 30000 is "
            "excluded), and use DISTINCT so a customer with several big transactions appears only once.",
    traps=["SELECT c.FirstName AS First_Name, c.LastName AS Last_Name, c.AccountID AS Account_ID FROM Customers c "
           "JOIN Transactions t ON c.AccountID = t.AccountID WHERE t.TransactionAmount > 30000",
           "SELECT DISTINCT c.FirstName AS First_Name, c.LastName AS Last_Name, c.AccountID AS Account_ID FROM "
           "Customers c JOIN Transactions t ON c.AccountID = t.AccountID WHERE t.TransactionAmount >= 30000"])

# ------------------------------------------------------------------ 2 (original pattern)
DOC = T("Doctors", [("DoctorID", "INT", "Unique ID of the doctor"),
                    ("DoctorName", "VARCHAR(100)", "Name of the doctor"),
                    ("DeptName", "VARCHAR(50)", "Department of the doctor"),
                    ("Salary", "INT", "Salary of the doctor")])
DEPTS = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology", "Dermatology", "Radiology"]


def q2_data(rng, k):
    if k == 0:
        return {"Doctors": [(1, "John", "Cardiology", 50000), (2, "Alice", "Cardiology", 60000),
                            (3, "Bob", "Neurology", 75000), (4, "Carol", "Neurology", 65000),
                            (5, "David", "Orthopedics", 55000)]}
    while True:
        depts = rng.sample(DEPTS, rng.randint(3, 6))
        rows, i = [], 1
        for d in depts:
            for _ in range(rng.randint(1, 4)):
                rows.append((i, rng.choice(FIRST), d, rng.randint(30, 120) * 1000))
                i += 1
        totals = {}
        for r in rows:
            totals[r[2]] = totals.get(r[2], 0) + r[3]
        if len(set(totals.values())) == len(totals):  # no ties, so the order is unique
            rng.shuffle(rows)
            return {"Doctors": rows}


question(
    id="q2", original=True, difficulty="Easy", topic="GROUP BY + COUNT + SUM + ORDER BY",
    title="Department Salary Summary",
    statement="The department name (use alias <b>'DeptName'</b>), the count of doctors (use alias "
              "<b>'TotalDoctors'</b>), and the total salary (use alias <b>'TotalSalary'</b>) for each department. "
              "Sort the results by the total salary in descending order.",
    columns=["DeptName", "TotalDoctors", "TotalSalary"], ordered=True, tables=[DOC], gen=q2_data,
    solution="SELECT DeptName,\n       COUNT(*)    AS TotalDoctors,\n       SUM(Salary) AS TotalSalary\n"
             "FROM Doctors\nGROUP BY DeptName\nORDER BY TotalSalary DESC;",
    explain="GROUP BY DeptName makes one row per department; COUNT(*) counts its doctors and SUM(Salary) adds "
            "their salaries. ORDER BY TotalSalary DESC puts the highest total first.",
    traps=["SELECT DeptName, COUNT(*) AS TotalDoctors, SUM(Salary) AS TotalSalary FROM Doctors GROUP BY DeptName "
           "ORDER BY TotalSalary"])

# ------------------------------------------------------------------ 3 (original pattern)
STU = T("Students", [("StudentID", "INT", "Unique ID of the student"),
                     ("FirstName", "VARCHAR(50)", "First name of the student"),
                     ("LastName", "VARCHAR(50)", "Last name of the student")])
CRS = T("Courses", [("CourseID", "INT", "Unique ID of the course"),
                    ("StudentID", "INT", "ID of the enrolled student"),
                    ("Room", "VARCHAR(10)", "Room in which the course is held")])


def q3_data(rng, k):
    if k == 0:
        s = [(101, "Riya", "Nair"), (102, "Yash", "Khan"), (103, "Tanvi", "Rao"), (104, "Dev", "Shah")]
        c = [(1, 101, "R1"), (2, 102, "R2"), (3, 103, "R1"), (4, 104, "R3"), (5, 102, "R3")]
        return {"Students": s, "Courses": c}
    n = rng.randint(6, 10)
    s = [(200 + k * 20 + i, f, l) for i, (f, l) in enumerate(names(rng, n))]
    c, cid = [], 1
    for sid, _, _ in s:
        for _ in range(rng.randint(0, 2)):
            c.append((cid, sid, rng.choice(["R1", "R2", "R3", "R10", "R4"])))
            cid += 1
    c += [(cid, s[0][0], "R1"), (cid + 1, s[0][0], "R1"), (cid + 2, s[1][0], "R10")]  # repeat + R10 trap
    return {"Students": s, "Courses": c}


question(
    id="q3", original=True, difficulty="Easy", topic="JOIN + string filter",
    title="Students in Room R1",
    statement="The student ID, first name, last name of students enrolled in a course held in room "
              "<b>'R1'</b>. Use aliases “Student ID”, “First Name”, “Last Name”. "
              "Show each student only once.",
    columns=["Student ID", "First Name", "Last Name"], ordered=False, tables=[STU, CRS], gen=q3_data,
    solution="SELECT DISTINCT s.StudentID AS \"Student ID\",\n       s.FirstName AS \"First Name\",\n"
             "       s.LastName  AS \"Last Name\"\nFROM Students s\nJOIN Courses c ON s.StudentID = c.StudentID\n"
             "WHERE c.Room = 'R1';",
    explain="Aliases containing a space must be quoted (\"Student ID\" or `Student ID`). Join on StudentID and "
            "filter Room = 'R1' exactly; LIKE 'R1%' would wrongly include room R10. DISTINCT removes a student "
            "who has two courses in R1.",
    traps=["SELECT DISTINCT s.StudentID AS \"Student ID\", s.FirstName AS \"First Name\", s.LastName AS "
           "\"Last Name\" FROM Students s JOIN Courses c ON s.StudentID = c.StudentID WHERE c.Room LIKE 'R1%'",
           "SELECT s.StudentID AS \"Student ID\", s.FirstName AS \"First Name\", s.LastName AS \"Last Name\" "
           "FROM Students s JOIN Courses c ON s.StudentID = c.StudentID WHERE c.Room = 'R1'"])

# ------------------------------------------------------------------ 4 correlated subquery
EMPD = T("Employees", [("EmpID", "INT", "Unique ID of the employee"),
                       ("EmpName", "VARCHAR(50)", "Name of the employee"),
                       ("DeptID", "INT", "Department ID of the employee"),
                       ("Salary", "INT", "Monthly salary of the employee")])


def q4_data(rng, k):
    if k == 0:
        return {"Employees": [(1, "Aarav", 10, 30000), (2, "Diya", 10, 50000), (3, "Kabir", 20, 70000),
                              (4, "Meera", 20, 90000), (5, "Rohan", 30, 40000), (6, "Isha", 30, 40000)]}
    rows, i = [], 1
    for d in (10, 20, 30, 40)[:rng.randint(3, 4)]:
        base = rng.choice([25, 45, 80])
        for _ in range(rng.randint(2, 4)):
            rows.append((i, rng.choice(FIRST), d, (base + rng.randint(0, 30)) * 1000))
            i += 1
    rows.append((i, "Zoya", 50, 60000))  # single-employee department: never above its own average
    return {"Employees": rows}


question(
    id="q4", difficulty="Medium", topic="Correlated subquery + AVG",
    title="Above Department Average",
    statement="The name (alias <b>'Employee_Name'</b>), department ID (alias <b>'Dept_ID'</b>) and salary "
              "(alias <b>'Salary'</b>) of every employee who earns <b>more than the average salary of their own "
              "department</b>.",
    columns=["Employee_Name", "Dept_ID", "Salary"], ordered=False, tables=[EMPD], gen=q4_data,
    solution="SELECT e.EmpName AS Employee_Name,\n       e.DeptID  AS Dept_ID,\n       e.Salary  AS Salary\n"
             "FROM Employees e\nWHERE e.Salary > (SELECT AVG(x.Salary)\n                  FROM Employees x\n"
             "                  WHERE x.DeptID = e.DeptID);",
    explain="The inner query is correlated: it runs for each outer row and averages only that employee's "
            "department (x.DeptID = e.DeptID). Comparing with the company-wide average is the common mistake.",
    traps=["SELECT EmpName AS Employee_Name, DeptID AS Dept_ID, Salary FROM Employees WHERE Salary > "
           "(SELECT AVG(Salary) FROM Employees)",
           "SELECT e.EmpName AS Employee_Name, e.DeptID AS Dept_ID, e.Salary AS Salary FROM Employees e WHERE "
           "e.Salary >= (SELECT AVG(x.Salary) FROM Employees x WHERE x.DeptID = e.DeptID)"])

# ------------------------------------------------------------------ 5 anti-join
PROD = T("Products", [("ProductID", "INT", "Unique ID of the product"),
                      ("ProductName", "VARCHAR(50)", "Name of the product"),
                      ("Price", "INT", "Price of the product")])
ORD = T("Orders", [("OrderID", "INT", "Unique ID of the order"),
                   ("ProductID", "INT", "Product that was ordered"),
                   ("Quantity", "INT", "Quantity ordered")])
ITEMS = ["Keyboard", "Mouse", "Monitor", "Webcam", "Headset", "Laptop Stand", "USB Hub", "Speaker", "Printer",
         "Router", "SSD", "Charger", "Microphone", "Tablet"]


def q5_data(rng, k):
    if k == 0:
        p = [(1, "Keyboard", 1200), (2, "Mouse", 500), (3, "Monitor", 9000), (4, "Webcam", 2500)]
        o = [(1, 1, 2), (2, 3, 1), (3, 1, 5)]
        return {"Products": p, "Orders": o}
    items = rng.sample(ITEMS, rng.randint(6, 10))
    p = [(i + 1, it, rng.randint(3, 90) * 100) for i, it in enumerate(items)]
    o, oid = [], 1
    for pid, _, _ in p:
        if rng.random() < 0.55:
            for _ in range(rng.randint(1, 3)):
                o.append((oid, pid, rng.randint(1, 5)))
                oid += 1
    if len(o) == 0:
        o.append((1, p[0][0], 1))
    return {"Products": p, "Orders": o}


question(
    id="q5", difficulty="Medium", topic="LEFT JOIN … IS NULL (anti-join)",
    title="Products Never Ordered",
    statement="The name (alias <b>'Product_Name'</b>) and price (alias <b>'Price'</b>) of products that have "
              "<b>never been ordered</b>.",
    columns=["Product_Name", "Price"], ordered=False, tables=[PROD, ORD], gen=q5_data,
    solution="SELECT p.ProductName AS Product_Name,\n       p.Price       AS Price\nFROM Products p\n"
             "LEFT JOIN Orders o ON p.ProductID = o.ProductID\nWHERE o.OrderID IS NULL;",
    explain="A LEFT JOIN keeps every product; products with no matching order get NULLs in the Orders columns, "
            "so WHERE o.OrderID IS NULL keeps exactly those. NOT IN (SELECT ProductID FROM Orders) or NOT EXISTS "
            "also work.",
    traps=["SELECT p.ProductName AS Product_Name, p.Price AS Price FROM Products p JOIN Orders o ON "
           "p.ProductID = o.ProductID"])

# ------------------------------------------------------------------ 6 second highest
STAFF = T("Staff", [("StaffID", "INT", "Unique ID of the staff member"),
                    ("Name", "VARCHAR(50)", "Name of the staff member"),
                    ("Salary", "INT", "Salary of the staff member")])


def q6_data(rng, k):
    if k == 0:
        return {"Staff": [(1, "Arjun", 45000), (2, "Sneha", 72000), (3, "Vikram", 58000), (4, "Ananya", 39000)]}
    vals = rng.sample(range(30, 150), rng.randint(5, 8))
    rows = [(i + 1, rng.choice(FIRST), v * 1000) for i, v in enumerate(vals)]
    top = max(vals) * 1000
    if k in (2, 4):
        rows.append((len(rows) + 1, "Harsh", top))  # tie at the top
    if k == 3:
        rows.append((len(rows) + 1, "Kavya", sorted(vals)[-2] * 1000))  # tie at second place
    return {"Staff": rows}


question(
    id="q6", difficulty="Medium", topic="Subquery with MAX (ties)",
    title="Second Highest Salary",
    statement="The <b>second highest distinct salary</b> in the Staff table, with alias <b>'Second_Highest'</b>. "
              "If several people share the highest salary, the second highest is the next lower amount.",
    columns=["Second_Highest"], ordered=False, tables=[STAFF], gen=q6_data,
    solution="SELECT MAX(Salary) AS Second_Highest\nFROM Staff\n"
             "WHERE Salary < (SELECT MAX(Salary) FROM Staff);",
    explain="The subquery finds the top salary; the outer MAX takes the largest salary below it. This handles "
            "ties at the top, while ORDER BY Salary DESC LIMIT 1 OFFSET 1 would return the top salary again. "
            "SELECT DISTINCT Salary ... ORDER BY Salary DESC LIMIT 1 OFFSET 1 is another correct way.",
    traps=["SELECT Salary AS Second_Highest FROM Staff ORDER BY Salary DESC LIMIT 1 OFFSET 1"])

# ------------------------------------------------------------------ 7 left join + count with zero
CUS2 = T("Customers", [("CustomerID", "INT", "Unique ID of the customer"),
                       ("CustomerName", "VARCHAR(50)", "Name of the customer"),
                       ("City", "VARCHAR(30)", "City of the customer")])
ORD2 = T("Orders", [("OrderID", "INT", "Unique ID of the order"),
                    ("CustomerID", "INT", "Customer who placed the order"),
                    ("Amount", "INT", "Order amount")])
CITIES = ["Pune", "Delhi", "Mumbai", "Chennai", "Bengaluru", "Hyderabad", "Kolkata", "Jaipur"]


def q7_data(rng, k):
    if k == 0:
        c = [(1, "Aditya", "Pune"), (2, "Priya", "Delhi"), (3, "Nikhil", "Mumbai")]
        o = [(1, 1, 1500), (2, 1, 700), (3, 3, 2200)]
        return {"Customers": c, "Orders": o}
    ns = rng.sample(FIRST, rng.randint(5, 9))
    c = [(i + 1, n, rng.choice(CITIES)) for i, n in enumerate(ns)]
    o, oid = [], 1
    for cid, _, _ in c:
        for _ in range(rng.choice([0, 0, 1, 2, 3])):
            o.append((oid, cid, rng.randint(2, 60) * 100))
            oid += 1
    o.append((oid, c[0][0], 900))
    return {"Customers": c, "Orders": o}


question(
    id="q7", difficulty="Medium", topic="LEFT JOIN + COUNT(column)",
    title="Order Count per Customer",
    statement="Every customer's name (alias <b>'Customer_Name'</b>) and the number of orders they placed "
              "(alias <b>'Total_Orders'</b>). Customers with <b>no orders must appear with 0</b>. Sort by "
              "Total_Orders in descending order, then by Customer_Name in ascending order.",
    columns=["Customer_Name", "Total_Orders"], ordered=True, tables=[CUS2, ORD2], gen=q7_data,
    solution="SELECT c.CustomerName    AS Customer_Name,\n       COUNT(o.OrderID)  AS Total_Orders\n"
             "FROM Customers c\nLEFT JOIN Orders o ON c.CustomerID = o.CustomerID\n"
             "GROUP BY c.CustomerID, c.CustomerName\nORDER BY Total_Orders DESC, Customer_Name ASC;",
    explain="LEFT JOIN keeps customers without orders. COUNT(o.OrderID) counts only real orders, so it gives 0 "
            "for them; COUNT(*) would count the NULL-filled row and give 1. An INNER JOIN would drop them.",
    traps=["SELECT c.CustomerName AS Customer_Name, COUNT(*) AS Total_Orders FROM Customers c LEFT JOIN Orders o "
           "ON c.CustomerID = o.CustomerID GROUP BY c.CustomerID, c.CustomerName ORDER BY Total_Orders DESC, "
           "Customer_Name",
           "SELECT c.CustomerName AS Customer_Name, COUNT(o.OrderID) AS Total_Orders FROM Customers c JOIN Orders o "
           "ON c.CustomerID = o.CustomerID GROUP BY c.CustomerID, c.CustomerName ORDER BY Total_Orders DESC, "
           "Customer_Name"])

# ------------------------------------------------------------------ 8 having
EMP3 = T("Employees", [("EmpID", "INT", "Unique ID of the employee"),
                       ("EmpName", "VARCHAR(50)", "Name of the employee"),
                       ("Department", "VARCHAR(30)", "Department name"),
                       ("Salary", "INT", "Salary of the employee")])
DNAMES = ["HR", "IT", "Finance", "Sales", "Marketing", "Operations", "Legal"]


def q8_data(rng, k):
    if k == 0:
        return {"Employees": [(1, "Aarav", "IT", 50000), (2, "Diya", "IT", 62000), (3, "Kabir", "IT", 48000),
                              (4, "Meera", "HR", 40000), (5, "Rohan", "HR", 42000), (6, "Isha", "Sales", 39000)]}
    rows, i = [], 1
    for d in rng.sample(DNAMES, rng.randint(4, 6)):
        for _ in range(rng.choice([1, 2, 3, 3, 4, 5])):
            rows.append((i, rng.choice(FIRST), d, rng.randint(30, 99) * 1000))
            i += 1
    for _ in range(2):  # guarantee a department with exactly 2 (boundary)
        rows.append((i, rng.choice(FIRST), "Audit", 45000))
        i += 1
    for _ in range(3):  # and one with exactly 3
        rows.append((i, rng.choice(FIRST), "Support", 35000))
        i += 1
    return {"Employees": rows}


question(
    id="q8", difficulty="Easy", topic="GROUP BY + HAVING",
    title="Departments with More Than Two Employees",
    statement="The department (alias <b>'Department'</b>) and its number of employees (alias "
              "<b>'Employee_Count'</b>) for departments that have <b>more than 2 employees</b>. Sort by "
              "Department in ascending order.",
    columns=["Department", "Employee_Count"], ordered=True, tables=[EMP3], gen=q8_data,
    solution="SELECT Department,\n       COUNT(*) AS Employee_Count\nFROM Employees\nGROUP BY Department\n"
             "HAVING COUNT(*) > 2\nORDER BY Department;",
    explain="WHERE filters rows before grouping and cannot use COUNT; HAVING filters groups after GROUP BY. "
            "\"More than 2\" means > 2, so a department with exactly 2 employees is excluded.",
    traps=["SELECT Department, COUNT(*) AS Employee_Count FROM Employees GROUP BY Department HAVING COUNT(*) >= 2 "
           "ORDER BY Department"])

# ------------------------------------------------------------------ 9 self join
EMP4 = T("Employees", [("EmpID", "INT", "Unique ID of the employee"),
                       ("EmpName", "VARCHAR(50)", "Name of the employee"),
                       ("ManagerID", "INT", "EmpID of the employee's manager (NULL for the top manager)")])


def q9_data(rng, k):
    if k == 0:
        return {"Employees": [(1, "Varun", None), (2, "Aisha", 1), (3, "Manav", 1), (4, "Nisha", 2)]}
    ns = rng.sample(FIRST, rng.randint(5, 9))
    rows = [(1, ns[0], None)]
    for i, n in enumerate(ns[1:], 2):
        rows.append((i, n, rng.randint(1, i - 1)))
    if k % 2 == 0:
        extra = next(f for f in FIRST if f not in ns)
        rows.append((len(rows) + 1, extra, None))  # a second person with no manager
    return {"Employees": rows}


question(
    id="q9", difficulty="Medium", topic="SELF JOIN (LEFT)",
    title="Employee and Manager Names",
    statement="Each employee's name (alias <b>'Employee'</b>) with their manager's name (alias "
              "<b>'Manager'</b>). Employees without a manager must still appear, with Manager as NULL. Sort by "
              "Employee in ascending order.",
    columns=["Employee", "Manager"], ordered=True, tables=[EMP4], gen=q9_data,
    solution="SELECT e.EmpName AS Employee,\n       m.EmpName AS Manager\nFROM Employees e\n"
             "LEFT JOIN Employees m ON e.ManagerID = m.EmpID\nORDER BY Employee;",
    explain="A self join uses the same table twice with different aliases: e for the employee, m for the "
            "manager. LEFT JOIN keeps employees whose ManagerID is NULL.",
    traps=["SELECT e.EmpName AS Employee, m.EmpName AS Manager FROM Employees e JOIN Employees m ON "
           "e.ManagerID = m.EmpID ORDER BY Employee"])

# ------------------------------------------------------------------ 10 top N
PLY = T("Players", [("PlayerID", "INT", "Unique ID of the player"),
                    ("PlayerName", "VARCHAR(50)", "Name of the player"),
                    ("Team", "VARCHAR(30)", "Team of the player"),
                    ("Score", "INT", "Total score of the player")])


def q10_data(rng, k):
    if k == 0:
        return {"Players": [(1, "Rahul", "Blue", 88), (2, "Pooja", "Red", 95), (3, "Karan", "Blue", 71),
                            (4, "Neha", "Green", 90), (5, "Yash", "Red", 64)]}
    sc = rng.sample(range(20, 200), rng.randint(5, 9))
    return {"Players": [(i + 1, n, rng.choice(["Blue", "Red", "Green", "Gold"]), s)
                        for i, (n, s) in enumerate(zip(rng.sample(FIRST, len(sc)), sc))]}


question(
    id="q10", difficulty="Easy", topic="ORDER BY + LIMIT",
    title="Top 3 Scorers",
    statement="The name (alias <b>'Player_Name'</b>) and score (alias <b>'Score'</b>) of the <b>3 players with "
              "the highest scores</b>, highest first.",
    columns=["Player_Name", "Score"], ordered=True, tables=[PLY], gen=q10_data,
    solution="SELECT PlayerName AS Player_Name,\n       Score\nFROM Players\nORDER BY Score DESC\nLIMIT 3;",
    explain="Sort by Score descending and keep the first 3 rows with LIMIT 3 (SQL Server uses SELECT TOP 3, "
            "Oracle uses FETCH FIRST 3 ROWS ONLY).",
    traps=["SELECT PlayerName AS Player_Name, Score FROM Players ORDER BY Score LIMIT 3"])

# ------------------------------------------------------------------ 11 LIKE + IN + BETWEEN
CUS3 = T("Customers", [("CustomerID", "INT", "Unique ID of the customer"),
                       ("Name", "VARCHAR(50)", "Name of the customer"),
                       ("City", "VARCHAR(30)", "City of the customer"),
                       ("Age", "INT", "Age of the customer")])
ANAMES = ["Aarav", "Ananya", "Arjun", "Aisha", "Aditya", "Akash", "Amit", "Anika"]


def q11_data(rng, k):
    if k == 0:
        return {"Customers": [(1, "Aarav", "Pune", 30), (2, "Meera", "Delhi", 28), (3, "Ananya", "Delhi", 41),
                              (4, "Arjun", "Mumbai", 35), (5, "Aisha", "Delhi", 25)]}
    rows, i = [], 1
    pool = rng.sample(ANAMES, 5) + rng.sample([f for f in FIRST if not f.startswith("A")], 4) + ["Karan Aggarwal"]
    for n in pool:
        rows.append((i, n, rng.choice(["Pune", "Delhi", "Mumbai", "Chennai"]), rng.choice([22, 25, 31, 40, 41, 36])))
        i += 1
    rows.append((i, "Abhay", "Pune", 40))  # boundaries
    rows.append((i + 1, "Advait", "Delhi", 25))
    return {"Customers": rows}


question(
    id="q11", difficulty="Easy", topic="LIKE + IN + BETWEEN",
    title="Filter Customers by Name, City and Age",
    statement="The name (alias <b>'Name'</b>), city (alias <b>'City'</b>) and age (alias <b>'Age'</b>) of "
              "customers whose name <b>starts with 'A'</b>, who live in <b>Pune or Delhi</b>, and whose age is "
              "<b>between 25 and 40 (both included)</b>. Sort by Name in ascending order.",
    columns=["Name", "City", "Age"], ordered=True, tables=[CUS3], gen=q11_data,
    solution="SELECT Name, City, Age\nFROM Customers\nWHERE Name LIKE 'A%'\n  AND City IN ('Pune', 'Delhi')\n"
             "  AND Age BETWEEN 25 AND 40\nORDER BY Name;",
    explain="'A%' means starts with A (% = any characters; '%A%' would match an A anywhere). IN checks a list of "
            "values, and BETWEEN is inclusive at both ends.",
    traps=["SELECT Name, City, Age FROM Customers WHERE Name LIKE '%A%' AND City IN ('Pune','Delhi') AND Age "
           "BETWEEN 25 AND 40 ORDER BY Name",
           "SELECT Name, City, Age FROM Customers WHERE Name LIKE 'A%' AND City IN ('Pune','Delhi') AND Age > 25 "
           "AND Age < 40 ORDER BY Name"])

# ------------------------------------------------------------------ 12 CASE
RES = T("Results", [("StudentID", "INT", "Unique ID of the student"),
                    ("StudentName", "VARCHAR(50)", "Name of the student"),
                    ("Maths", "INT", "Marks in Maths (out of 100)"),
                    ("Science", "INT", "Marks in Science (out of 100)"),
                    ("English", "INT", "Marks in English (out of 100)")])


def q12_data(rng, k):
    if k == 0:
        return {"Results": [(1, "Kavya", 90, 85, 80), (2, "Dev", 60, 70, 55), (3, "Riya", 50, 40, 45)]}
    rows = []
    totals = set()
    for i, n in enumerate(rng.sample(FIRST, rng.randint(5, 8)), 1):
        while True:
            m = [rng.randint(30, 100) for _ in range(3)]
            if sum(m) not in totals:
                totals.add(sum(m))
                break
        rows.append((i, n, *m))
    if 240 not in totals:
        rows.append((len(rows) + 1, "Simran", 80, 80, 80))  # boundary 240 -> A
    if 180 not in totals:
        rows.append((len(rows) + 1, "Nikhil", 60, 60, 60))  # boundary 180 -> B
    return {"Results": rows}


question(
    id="q12", difficulty="Medium", topic="Computed column + CASE",
    title="Total Marks and Grade",
    statement="Each student's name (alias <b>'Student_Name'</b>), total marks in the three subjects (alias "
              "<b>'Total'</b>) and grade (alias <b>'Grade'</b>): <b>'A'</b> if Total is 240 or more, <b>'B'</b> "
              "if Total is 180 or more, otherwise <b>'C'</b>. Sort by Total in descending order.",
    columns=["Student_Name", "Total", "Grade"], ordered=True, tables=[RES], gen=q12_data,
    solution="SELECT StudentName AS Student_Name,\n       Maths + Science + English AS Total,\n"
             "       CASE\n           WHEN Maths + Science + English >= 240 THEN 'A'\n"
             "           WHEN Maths + Science + English >= 180 THEN 'B'\n           ELSE 'C'\n       END AS Grade\n"
             "FROM Results\nORDER BY Total DESC;",
    explain="Columns can be added in SELECT. CASE checks conditions top to bottom and returns the first match, so "
            "the >= 240 test must come before >= 180. 'or more' means >=.",
    traps=["SELECT StudentName AS Student_Name, Maths + Science + English AS Total, CASE WHEN Maths + Science + "
           "English > 240 THEN 'A' WHEN Maths + Science + English > 180 THEN 'B' ELSE 'C' END AS Grade FROM Results "
           "ORDER BY Total DESC"])

# ------------------------------------------------------------------ 13 group + having avg + round
BOOK = T("Books", [("BookID", "INT", "Unique ID of the book"),
                   ("Title", "VARCHAR(80)", "Title of the book"),
                   ("Category", "VARCHAR(30)", "Category of the book"),
                   ("Price", "INT", "Price of the book")])
CATS = ["Fiction", "Science", "History", "Comics", "Biography", "Travel", "Poetry"]


def q13_data(rng, k):
    if k == 0:
        return {"Books": [(1, "Ocean Tales", "Fiction", 350), (2, "Star Maps", "Science", 520),
                          (3, "Atom World", "Science", 610), (4, "Old Empires", "History", 400),
                          (5, "Dark Forest", "Fiction", 299)]}
    while True:
        rows, i = [], 1
        for c in rng.sample(CATS, rng.randint(4, 6)):
            for _ in range(rng.randint(1, 4)):
                rows.append((i, f"Book {i}", c, rng.randint(150, 900)))
                i += 1
        rows.append((i, f"Book {i}", "Atlas", 400))  # average exactly 400 -> excluded
        avgs = {}
        for r in rows:
            avgs.setdefault(r[2], []).append(r[3])
        a = [round(sum(v) / len(v), 2) for v in avgs.values()]
        if len(set(a)) == len(a) and any(x > 400 for x in a):
            return {"Books": rows}


question(
    id="q13", difficulty="Medium", topic="GROUP BY + HAVING AVG + ROUND",
    title="Premium Book Categories",
    statement="For each category whose <b>average book price is greater than 400</b>, show the category (alias "
              "<b>'Category'</b>), the number of books (alias <b>'Book_Count'</b>) and the average price rounded "
              "to 2 decimal places (alias <b>'Avg_Price'</b>). Sort by Avg_Price in descending order.",
    columns=["Category", "Book_Count", "Avg_Price"], ordered=True, tables=[BOOK], gen=q13_data,
    solution="SELECT Category,\n       COUNT(*)             AS Book_Count,\n       ROUND(AVG(Price), 2) AS Avg_Price\n"
             "FROM Books\nGROUP BY Category\nHAVING AVG(Price) > 400\nORDER BY Avg_Price DESC;",
    explain="Group by Category, keep groups with HAVING AVG(Price) > 400 (an average of exactly 400 is excluded) "
            "and round only for display with ROUND(AVG(Price), 2).",
    traps=["SELECT Category, COUNT(*) AS Book_Count, ROUND(AVG(Price), 2) AS Avg_Price FROM Books WHERE Price > 400 "
           "GROUP BY Category ORDER BY Avg_Price DESC",
           "SELECT Category, COUNT(*) AS Book_Count, ROUND(AVG(Price), 2) AS Avg_Price FROM Books GROUP BY Category "
           "HAVING AVG(Price) >= 400 ORDER BY Avg_Price DESC"])

# ------------------------------------------------------------------ 14 duplicates
USR = T("Users", [("UserID", "INT", "Unique ID of the user"),
                  ("UserName", "VARCHAR(50)", "Name of the user"),
                  ("Email", "VARCHAR(80)", "Email address of the user")])


def q14_data(rng, k):
    if k == 0:
        return {"Users": [(1, "Aarav", "aarav@mail.com"), (2, "Diya", "diya@mail.com"),
                          (3, "Aarav S", "aarav@mail.com"), (4, "Kabir", "kabir@mail.com")]}
    base = [f"{n.lower()}@mail.com" for n in rng.sample(FIRST, rng.randint(5, 8))]
    rows, i = [], 1
    for e in base:
        for _ in range(rng.choice([1, 1, 2, 3])):
            rows.append((i, e.split("@")[0].title(), e))
            i += 1
    rows.append((i, "Extra", base[0]))
    rng.shuffle(rows)
    return {"Users": rows}


question(
    id="q14", difficulty="Easy", topic="Find duplicates (GROUP BY + HAVING COUNT > 1)",
    title="Duplicate Email Addresses",
    statement="Every email address that is used by <b>more than one user</b> (alias <b>'Email'</b>) and how many "
              "times it appears (alias <b>'Occurrences'</b>). Sort by Email in ascending order.",
    columns=["Email", "Occurrences"], ordered=True, tables=[USR], gen=q14_data,
    solution="SELECT Email,\n       COUNT(*) AS Occurrences\nFROM Users\nGROUP BY Email\nHAVING COUNT(*) > 1\n"
             "ORDER BY Email;",
    explain="Grouping by Email puts identical addresses together; HAVING COUNT(*) > 1 keeps only those that "
            "repeat. This is the standard way to find duplicate values.",
    traps=["SELECT Email, COUNT(*) AS Occurrences FROM Users GROUP BY Email ORDER BY Email"])

# ------------------------------------------------------------------ 15 max per group with ties
EMP5 = T("Employees", [("EmpID", "INT", "Unique ID of the employee"),
                       ("EmpName", "VARCHAR(50)", "Name of the employee"),
                       ("Department", "VARCHAR(30)", "Department name"),
                       ("Salary", "INT", "Salary of the employee")])


def q15_data(rng, k):
    if k == 0:
        return {"Employees": [(1, "Aarav", "IT", 70000), (2, "Diya", "IT", 82000), (3, "Kabir", "HR", 45000),
                              (4, "Meera", "HR", 51000), (5, "Rohan", "Sales", 39000)]}
    rows, i = [], 1
    pool = [f"{f} {l[0]}" for f, l in names(rng, 30) if f != "Zoya"]
    for d in rng.sample(DNAMES, rng.randint(3, 5)):
        for _ in range(rng.randint(1, 4)):
            rows.append((i, pool.pop(), d, rng.randint(30, 99) * 1000))
            i += 1
    d0 = rows[0][2]
    top = max(r[3] for r in rows if r[2] == d0)
    rows.append((i, "Zoya K", d0, top))  # tie for the highest salary in a department
    return {"Employees": rows}


question(
    id="q15", difficulty="Hard", topic="Top earner per group (ties)",
    title="Highest Paid Employee in Each Department",
    statement="For each department, the employee(s) with the <b>highest salary in that department</b>: "
              "department (alias <b>'Department'</b>), name (alias <b>'Employee_Name'</b>) and salary (alias "
              "<b>'Salary'</b>). If two people tie for the top salary, show both. Sort by Department, then by "
              "Employee_Name.",
    columns=["Department", "Employee_Name", "Salary"], ordered=True, tables=[EMP5], gen=q15_data,
    solution="SELECT e.Department,\n       e.EmpName AS Employee_Name,\n       e.Salary\nFROM Employees e\n"
             "WHERE e.Salary = (SELECT MAX(x.Salary)\n                  FROM Employees x\n"
             "                  WHERE x.Department = e.Department)\nORDER BY e.Department, Employee_Name;",
    explain="The correlated subquery finds each department's maximum, and the outer query keeps every employee "
            "earning exactly that, so ties are kept. Selecting EmpName with GROUP BY Department is not valid "
            "standard SQL (MySQL with ONLY_FULL_GROUP_BY rejects it) and can only return one name per group.",
    traps=["SELECT Department, EmpName AS Employee_Name, MAX(Salary) AS Salary FROM Employees GROUP BY Department "
           "ORDER BY Department, Employee_Name"])


# ------------------------------------------------------------------ build + validate
def run(con, sql):
    cur = con.execute(sql)
    return [d[0] for d in cur.description], cur.fetchall()


def same(q, a, b):
    ca, ra = a
    cb, rb = b
    if [c.lower() for c in ca] != [c.lower() for c in cb]:
        return False
    norm = lambda rows: [tuple(round(v, 4) if isinstance(v, float) else v for v in r) for r in rows]
    ra, rb = norm(ra), norm(rb)
    return ra == rb if q["ordered"] else sorted(map(repr, ra)) == sorted(map(repr, rb))


def build(path):
    out = []
    for qi, q in enumerate(QUESTIONS):
        rng = random.Random(1000 + qi)
        datasets = []
        for k in range(5):
            data = q["gen"](rng, k)
            sql = []
            for t in q["tables"]:
                sql.append(ddl(t))
                sql += inserts(t, data[t["name"]])
            datasets.append("\n".join(sql))
        # validate
        results = []
        for ds in datasets:
            con = sqlite3.connect(":memory:")
            con.executescript(ds)
            cols, rows = run(con, q["solution"])
            assert [c.lower() for c in cols] == [c.lower() for c in q["columns"]], (q["id"], cols)
            assert rows, (q["id"], "empty result")
            assert len(set(rows)) == len(rows), (q["id"], "duplicate output rows")
            results.append((cols, rows))
        for trap in q.get("traps", []):
            caught = False
            for ds, exp in zip(datasets, results):
                con = sqlite3.connect(":memory:")
                con.executescript(ds)
                if not same(q, run(con, trap), exp):
                    caught = True
                    break
            assert caught, (q["id"], "trap not caught", trap)
        out.append({k: v for k, v in q.items() if k not in ("gen", "traps")} | {"datasets": datasets})
        print(f"{q['id']:>4} ok  rows per test: {[len(r[1]) for r in results]}  traps caught: {len(q.get('traps', []))}")
    json.dump(out, open(path, "w"), ensure_ascii=False)
    print("wrote", len(out), "questions to", path)


if __name__ == "__main__":
    build(sys.argv[1])
