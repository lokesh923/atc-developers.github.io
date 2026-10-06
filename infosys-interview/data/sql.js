IV.sql = {
 "schema": [
  {
   "table": "departments",
   "cols": [
    "dept_id",
    "dept_name",
    "city"
   ],
   "rows": [
    [
     10,
     "Engineering",
     "Bengaluru"
    ],
    [
     20,
     "Sales",
     "Mumbai"
    ],
    [
     30,
     "HR",
     "Pune"
    ],
    [
     40,
     "Finance",
     "Chennai"
    ]
   ]
  },
  {
   "table": "employees",
   "cols": [
    "emp_id",
    "name",
    "dept_id",
    "salary",
    "manager_id",
    "hire_year"
   ],
   "rows": [
    [
     1,
     "Asha",
     10,
     90000,
     null,
     2015
    ],
    [
     2,
     "Ravi",
     10,
     75000,
     1,
     2018
    ],
    [
     3,
     "Meena",
     10,
     75000,
     1,
     2019
    ],
    [
     4,
     "Karan",
     20,
     60000,
     null,
     2016
    ],
    [
     5,
     "Divya",
     20,
     55000,
     4,
     2020
    ],
    [
     6,
     "Sanjay",
     20,
     48000,
     4,
     2021
    ],
    [
     7,
     "Neha",
     30,
     52000,
     null,
     2017
    ],
    [
     8,
     "Imran",
     30,
     45000,
     7,
     2022
    ],
    [
     9,
     "Pooja",
     10,
     82000,
     1,
     2017
    ],
    [
     10,
     "Vikram",
     null,
     40000,
     null,
     2023
    ]
   ]
  },
  {
   "table": "projects",
   "cols": [
    "proj_id",
    "proj_name",
    "dept_id"
   ],
   "rows": [
    [
     101,
     "Portal",
     10
    ],
    [
     102,
     "CRM",
     20
    ],
    [
     103,
     "Payroll",
     30
    ],
    [
     104,
     "Audit",
     40
    ]
   ]
  },
  {
   "table": "assignments",
   "cols": [
    "emp_id",
    "proj_id",
    "hours"
   ],
   "rows": [
    [
     1,
     101,
     120
    ],
    [
     2,
     101,
     200
    ],
    [
     3,
     101,
     150
    ],
    [
     9,
     101,
     90
    ],
    [
     4,
     102,
     100
    ],
    [
     5,
     102,
     160
    ],
    [
     6,
     102,
     80
    ],
    [
     7,
     103,
     140
    ],
    [
     8,
     103,
     60
    ],
    [
     2,
     102,
     40
    ]
   ]
  }
 ],
 "items": [
  {
   "lvl": "basic",
   "q": "Show all employees with their salary, highest salary first.",
   "sql": "SELECT name, salary FROM employees ORDER BY salary DESC;",
   "out": {
    "cols": [
     "name",
     "salary"
    ],
    "rows": [
     [
      "Asha",
      90000
     ],
     [
      "Pooja",
      82000
     ],
     [
      "Ravi",
      75000
     ],
     [
      "Meena",
      75000
     ],
     [
      "Karan",
      60000
     ],
     [
      "Divya",
      55000
     ],
     [
      "Neha",
      52000
     ],
     [
      "Sanjay",
      48000
     ],
     [
      "Imran",
      45000
     ],
     [
      "Vikram",
      40000
     ]
    ]
   },
   "explain": "`ORDER BY ... DESC` sorts descending. The default is ascending (`ASC`). Two people with the same salary may appear in either order unless you add a second sort key."
  },
  {
   "lvl": "basic",
   "q": "List the distinct hire years.",
   "sql": "SELECT DISTINCT hire_year FROM employees ORDER BY hire_year;",
   "out": {
    "cols": [
     "hire_year"
    ],
    "rows": [
     [
      2015
     ],
     [
      2016
     ],
     [
      2017
     ],
     [
      2018
     ],
     [
      2019
     ],
     [
      2020
     ],
     [
      2021
     ],
     [
      2022
     ],
     [
      2023
     ]
    ]
   },
   "explain": "`DISTINCT` removes duplicate rows from the result."
  },
  {
   "lvl": "basic",
   "q": "Find employees whose salary is between 50000 and 80000 and who are in department 10 or 20.",
   "sql": "SELECT name, dept_id, salary FROM employees\nWHERE salary BETWEEN 50000 AND 80000 AND dept_id IN (10, 20);",
   "out": {
    "cols": [
     "name",
     "dept_id",
     "salary"
    ],
    "rows": [
     [
      "Ravi",
      10,
      75000
     ],
     [
      "Meena",
      10,
      75000
     ],
     [
      "Karan",
      20,
      60000
     ],
     [
      "Divya",
      20,
      55000
     ]
    ]
   },
   "explain": "`BETWEEN` is inclusive on both ends. `IN` is a shorter way to write several `OR` conditions. Vikram has no department (NULL), so he can never match `IN`."
  },
  {
   "lvl": "basic",
   "q": "Find employees whose name starts with A or ends with a.",
   "sql": "SELECT name FROM employees WHERE name LIKE 'A%' OR name LIKE '%a';",
   "out": {
    "cols": [
     "name"
    ],
    "rows": [
     [
      "Asha"
     ],
     [
      "Meena"
     ],
     [
      "Divya"
     ],
     [
      "Neha"
     ],
     [
      "Pooja"
     ]
    ]
   },
   "explain": "`%` matches any number of characters and `_` matches exactly one. In SQLite, LIKE is case-insensitive for plain letters; in some databases it is case-sensitive."
  },
  {
   "lvl": "basic",
   "q": "Find employees who have no department.",
   "sql": "SELECT name FROM employees WHERE dept_id IS NULL;",
   "out": {
    "cols": [
     "name"
    ],
    "rows": [
     [
      "Vikram"
     ]
    ]
   },
   "explain": "Comparing with NULL using `=` never works, because NULL means \"unknown\". Always use `IS NULL` or `IS NOT NULL`."
  },
  {
   "lvl": "basic",
   "q": "Count the employees and show the total, average, minimum and maximum salary.",
   "sql": "SELECT COUNT(*) AS total, SUM(salary) AS payroll, ROUND(AVG(salary), 2) AS avg_salary,\n       MIN(salary) AS lowest, MAX(salary) AS highest\nFROM employees;",
   "out": {
    "cols": [
     "total",
     "payroll",
     "avg_salary",
     "lowest",
     "highest"
    ],
    "rows": [
     [
      10,
      622000,
      62200.0,
      40000,
      90000
     ]
    ]
   },
   "explain": "Aggregate functions collapse many rows into one. `COUNT(*)` counts rows; `COUNT(column)` ignores NULLs."
  },
  {
   "lvl": "basic",
   "q": "Show the number of employees and the average salary in each department.",
   "sql": "SELECT dept_id, COUNT(*) AS emp_count, ROUND(AVG(salary), 1) AS avg_salary\nFROM employees\nGROUP BY dept_id\nORDER BY dept_id;",
   "out": {
    "cols": [
     "dept_id",
     "emp_count",
     "avg_salary"
    ],
    "rows": [
     [
      null,
      1,
      40000.0
     ],
     [
      10,
      4,
      80500.0
     ],
     [
      20,
      3,
      54333.3
     ],
     [
      30,
      2,
      48500.0
     ]
    ]
   },
   "explain": "`GROUP BY` makes one group per department. Employees with a NULL department form a group of their own."
  },
  {
   "lvl": "basic",
   "q": "Show departments that have more than 2 employees.",
   "sql": "SELECT dept_id, COUNT(*) AS emp_count\nFROM employees\nGROUP BY dept_id\nHAVING COUNT(*) > 2;",
   "out": {
    "cols": [
     "dept_id",
     "emp_count"
    ],
    "rows": [
     [
      10,
      4
     ],
     [
      20,
      3
     ]
    ]
   },
   "explain": "`WHERE` filters rows **before** grouping; `HAVING` filters groups **after** aggregation. You cannot use `COUNT(*)` in a WHERE clause."
  },
  {
   "lvl": "basic",
   "q": "Show the 3 highest paid employees, then the next 3 (page 2).",
   "sql": "SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3;",
   "out": {
    "cols": [
     "name",
     "salary"
    ],
    "rows": [
     [
      "Asha",
      90000
     ],
     [
      "Pooja",
      82000
     ],
     [
      "Ravi",
      75000
     ]
    ]
   },
   "explain": "`LIMIT n` returns n rows, `OFFSET k` skips k rows first. In SQL Server use `TOP 3` or `OFFSET ... FETCH`; in Oracle `FETCH FIRST 3 ROWS ONLY`."
  },
  {
   "lvl": "basic",
   "q": "Show each employee with a salary grade using CASE.",
   "sql": "SELECT name, salary,\n  CASE WHEN salary >= 80000 THEN 'High'\n       WHEN salary >= 50000 THEN 'Medium'\n       ELSE 'Low' END AS grade\nFROM employees ORDER BY emp_id;",
   "out": {
    "cols": [
     "name",
     "salary",
     "grade"
    ],
    "rows": [
     [
      "Asha",
      90000,
      "High"
     ],
     [
      "Ravi",
      75000,
      "Medium"
     ],
     [
      "Meena",
      75000,
      "Medium"
     ],
     [
      "Karan",
      60000,
      "Medium"
     ],
     [
      "Divya",
      55000,
      "Medium"
     ],
     [
      "Sanjay",
      48000,
      "Low"
     ],
     [
      "Neha",
      52000,
      "Medium"
     ],
     [
      "Imran",
      45000,
      "Low"
     ],
     [
      "Pooja",
      82000,
      "High"
     ],
     [
      "Vikram",
      40000,
      "Low"
     ]
    ]
   },
   "explain": "`CASE` is the SQL if-else. Conditions are checked top to bottom and the first match wins."
  },
  {
   "lvl": "medium",
   "q": "Show each employee with the name of their department (INNER JOIN).",
   "sql": "SELECT e.name, d.dept_name\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.dept_id\nORDER BY e.emp_id;",
   "out": {
    "cols": [
     "name",
     "dept_name"
    ],
    "rows": [
     [
      "Asha",
      "Engineering"
     ],
     [
      "Ravi",
      "Engineering"
     ],
     [
      "Meena",
      "Engineering"
     ],
     [
      "Karan",
      "Sales"
     ],
     [
      "Divya",
      "Sales"
     ],
     [
      "Sanjay",
      "Sales"
     ],
     [
      "Neha",
      "HR"
     ],
     [
      "Imran",
      "HR"
     ],
     [
      "Pooja",
      "Engineering"
     ]
    ]
   },
   "explain": "An inner join returns only rows that match in both tables. Vikram (no department) does not appear."
  },
  {
   "lvl": "medium",
   "q": "Show all employees including those without a department (LEFT JOIN).",
   "sql": "SELECT e.name, d.dept_name\nFROM employees e\nLEFT JOIN departments d ON e.dept_id = d.dept_id\nORDER BY e.emp_id;",
   "out": {
    "cols": [
     "name",
     "dept_name"
    ],
    "rows": [
     [
      "Asha",
      "Engineering"
     ],
     [
      "Ravi",
      "Engineering"
     ],
     [
      "Meena",
      "Engineering"
     ],
     [
      "Karan",
      "Sales"
     ],
     [
      "Divya",
      "Sales"
     ],
     [
      "Sanjay",
      "Sales"
     ],
     [
      "Neha",
      "HR"
     ],
     [
      "Imran",
      "HR"
     ],
     [
      "Pooja",
      "Engineering"
     ],
     [
      "Vikram",
      null
     ]
    ]
   },
   "explain": "A left join keeps **every** row of the left table and fills NULL where the right table has no match."
  },
  {
   "lvl": "medium",
   "q": "Find departments that have no employees.",
   "sql": "SELECT d.dept_name\nFROM departments d\nLEFT JOIN employees e ON e.dept_id = d.dept_id\nWHERE e.emp_id IS NULL;",
   "out": {
    "cols": [
     "dept_name"
    ],
    "rows": [
     [
      "Finance"
     ]
    ]
   },
   "explain": "The classic **anti-join**: left join, then keep rows where the right side is NULL. `NOT EXISTS` and `NOT IN` give the same result (be careful: `NOT IN` returns nothing if the subquery contains a NULL)."
  },
  {
   "lvl": "medium",
   "q": "Show every employee together with their manager's name (self join).",
   "sql": "SELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.emp_id\nORDER BY e.emp_id;",
   "out": {
    "cols": [
     "employee",
     "manager"
    ],
    "rows": [
     [
      "Asha",
      null
     ],
     [
      "Ravi",
      "Asha"
     ],
     [
      "Meena",
      "Asha"
     ],
     [
      "Karan",
      null
     ],
     [
      "Divya",
      "Karan"
     ],
     [
      "Sanjay",
      "Karan"
     ],
     [
      "Neha",
      null
     ],
     [
      "Imran",
      "Neha"
     ],
     [
      "Pooja",
      "Asha"
     ],
     [
      "Vikram",
      null
     ]
    ]
   },
   "explain": "The same table is used twice under different aliases. The top-level people have a NULL manager."
  },
  {
   "lvl": "medium",
   "q": "Find employees who earn more than their manager.",
   "sql": "SELECT e.name, e.salary, m.name AS manager, m.salary AS manager_salary\nFROM employees e\nJOIN employees m ON e.manager_id = m.emp_id\nWHERE e.salary > m.salary;",
   "out": {
    "cols": [
     "name",
     "salary",
     "manager",
     "manager_salary"
    ],
    "rows": []
   },
   "explain": "The result is empty: nobody earns more than their manager in this data. An empty result is a valid answer, and the query is still correct."
  },
  {
   "lvl": "medium",
   "q": "Find the employee with the highest salary using a subquery.",
   "sql": "SELECT name, salary FROM employees\nWHERE salary = (SELECT MAX(salary) FROM employees);",
   "out": {
    "cols": [
     "name",
     "salary"
    ],
    "rows": [
     [
      "Asha",
      90000
     ]
    ]
   },
   "explain": "The inner query runs first and returns one value, then the outer query filters with it. Using this form (not `ORDER BY ... LIMIT 1`) correctly returns **all** employees tied for the top salary."
  },
  {
   "lvl": "medium",
   "q": "Find the second highest salary (with other ways in the notes).",
   "sql": "-- 1. Subquery\nSELECT MAX(salary) AS second_highest\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);",
   "out": {
    "cols": [
     "second_highest"
    ],
    "rows": [
     [
      82000
     ]
    ]
   },
   "explain": "Other ways: `SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1;` or `DENSE_RANK()` and pick rank 2. Replace 1 with N-1 in the OFFSET form for the Nth highest. The `DISTINCT` matters: two people earn 75000."
  },
  {
   "lvl": "medium",
   "q": "Find the Nth highest salary using DENSE_RANK (here N = 3).",
   "sql": "SELECT salary FROM (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n) t\nWHERE rnk = 3\nGROUP BY salary;",
   "out": {
    "cols": [
     "salary"
    ],
    "rows": [
     [
      75000
     ]
    ]
   },
   "explain": "`DENSE_RANK` gives tied values the same rank and does **not** skip numbers (`RANK` skips). Salaries 90000, 82000, 75000 are ranks 1, 2, 3."
  },
  {
   "lvl": "medium",
   "q": "Find employees who earn more than the average salary of their own department (correlated subquery).",
   "sql": "SELECT e.name, e.dept_id, e.salary\nFROM employees e\nWHERE e.salary > (SELECT AVG(salary) FROM employees x WHERE x.dept_id = e.dept_id)\nORDER BY e.emp_id;",
   "out": {
    "cols": [
     "name",
     "dept_id",
     "salary"
    ],
    "rows": [
     [
      "Asha",
      10,
      90000
     ],
     [
      "Karan",
      20,
      60000
     ],
     [
      "Divya",
      20,
      55000
     ],
     [
      "Neha",
      30,
      52000
     ],
     [
      "Pooja",
      10,
      82000
     ]
    ]
   },
   "explain": "A **correlated subquery** refers to the outer row (`e.dept_id`), so it is evaluated once per outer row. Vikram has no department, so his comparison is with NULL and he is excluded."
  },
  {
   "lvl": "medium",
   "q": "Show the highest paid employee in each department.",
   "sql": "SELECT d.dept_name, e.name, e.salary\nFROM employees e\nJOIN departments d ON d.dept_id = e.dept_id\nWHERE e.salary = (SELECT MAX(salary) FROM employees WHERE dept_id = e.dept_id)\nORDER BY d.dept_id;",
   "out": {
    "cols": [
     "dept_name",
     "name",
     "salary"
    ],
    "rows": [
     [
      "Engineering",
      "Asha",
      90000
     ],
     [
      "Sales",
      "Karan",
      60000
     ],
     [
      "HR",
      "Neha",
      52000
     ]
    ]
   },
   "explain": "Joining on a group maximum is a very common interview pattern. A window function (`ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC)`) is the alternative."
  },
  {
   "lvl": "medium",
   "q": "Find salaries that appear more than once (detect duplicates).",
   "sql": "SELECT salary, COUNT(*) AS times\nFROM employees\nGROUP BY salary\nHAVING COUNT(*) > 1;",
   "out": {
    "cols": [
     "salary",
     "times"
    ],
    "rows": [
     [
      75000,
      2
     ]
    ]
   },
   "explain": "Group by the column you suspect has duplicates and keep groups with a count above 1. To **delete** duplicates but keep one row, delete rows whose id is not the `MIN(id)` of each group."
  },
  {
   "lvl": "medium",
   "q": "Show total project hours per department using multiple joins.",
   "sql": "SELECT d.dept_name, SUM(a.hours) AS total_hours\nFROM assignments a\nJOIN projects p ON p.proj_id = a.proj_id\nJOIN departments d ON d.dept_id = p.dept_id\nGROUP BY d.dept_name\nORDER BY total_hours DESC;",
   "out": {
    "cols": [
     "dept_name",
     "total_hours"
    ],
    "rows": [
     [
      "Engineering",
      560
     ],
     [
      "Sales",
      380
     ],
     [
      "HR",
      200
     ]
    ]
   },
   "explain": "Follow the foreign keys: assignments -> projects -> departments. The Finance department has a project but nobody is assigned, so it does not appear in an inner join."
  },
  {
   "lvl": "medium",
   "q": "List employees who are assigned to more than one project.",
   "sql": "SELECT e.name, COUNT(*) AS projects\nFROM assignments a\nJOIN employees e ON e.emp_id = a.emp_id\nGROUP BY e.emp_id, e.name\nHAVING COUNT(*) > 1;",
   "out": {
    "cols": [
     "name",
     "projects"
    ],
    "rows": [
     [
      "Ravi",
      2
     ]
    ]
   },
   "explain": "Group by the employee, then use HAVING on the count."
  },
  {
   "lvl": "medium",
   "q": "Find employees who are not assigned to any project (NOT EXISTS).",
   "sql": "SELECT name FROM employees e\nWHERE NOT EXISTS (SELECT 1 FROM assignments a WHERE a.emp_id = e.emp_id);",
   "out": {
    "cols": [
     "name"
    ],
    "rows": [
     [
      "Vikram"
     ]
    ]
   },
   "explain": "`EXISTS` stops at the first matching row, so it is often faster than `IN` for large subqueries. Only Vikram has no assignment."
  },
  {
   "lvl": "medium",
   "q": "Combine two result sets: names of managers and names of employees in department 30 (UNION).",
   "sql": "SELECT name FROM employees WHERE emp_id IN (SELECT manager_id FROM employees WHERE manager_id IS NOT NULL)\nUNION\nSELECT name FROM employees WHERE dept_id = 30\nORDER BY name;",
   "out": {
    "cols": [
     "name"
    ],
    "rows": [
     [
      "Asha"
     ],
     [
      "Imran"
     ],
     [
      "Karan"
     ],
     [
      "Neha"
     ]
    ]
   },
   "explain": "`UNION` removes duplicates (Neha is in both sets); `UNION ALL` keeps them and is faster. Both queries must return the same number of columns with compatible types."
  },
  {
   "lvl": "adv",
   "q": "Rank employees by salary inside each department with RANK and ROW_NUMBER.",
   "sql": "SELECT dept_id, name, salary,\n  RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk,\n  ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC, emp_id) AS rn\nFROM employees WHERE dept_id IS NOT NULL\nORDER BY dept_id, rn;",
   "out": {
    "cols": [
     "dept_id",
     "name",
     "salary",
     "rnk",
     "rn"
    ],
    "rows": [
     [
      10,
      "Asha",
      90000,
      1,
      1
     ],
     [
      10,
      "Pooja",
      82000,
      2,
      2
     ],
     [
      10,
      "Ravi",
      75000,
      3,
      3
     ],
     [
      10,
      "Meena",
      75000,
      3,
      4
     ],
     [
      20,
      "Karan",
      60000,
      1,
      1
     ],
     [
      20,
      "Divya",
      55000,
      2,
      2
     ],
     [
      20,
      "Sanjay",
      48000,
      3,
      3
     ],
     [
      30,
      "Neha",
      52000,
      1,
      1
     ],
     [
      30,
      "Imran",
      45000,
      2,
      2
     ]
    ]
   },
   "explain": "`PARTITION BY` restarts the numbering for each department. Ravi and Meena tie at 75000, so `RANK` gives both rank 3 (and the next rank would be 5), while `ROW_NUMBER` always gives unique numbers (the second ORDER BY key breaks the tie)."
  },
  {
   "lvl": "adv",
   "q": "Top 2 earners from each department.",
   "sql": "SELECT * FROM (\n  SELECT dept_id, name, salary,\n         ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC, emp_id) AS rn\n  FROM employees WHERE dept_id IS NOT NULL\n) t\nWHERE rn <= 2\nORDER BY dept_id, rn;",
   "out": {
    "cols": [
     "dept_id",
     "name",
     "salary",
     "rn"
    ],
    "rows": [
     [
      10,
      "Asha",
      90000,
      1
     ],
     [
      10,
      "Pooja",
      82000,
      2
     ],
     [
      20,
      "Karan",
      60000,
      1
     ],
     [
      20,
      "Divya",
      55000,
      2
     ],
     [
      30,
      "Neha",
      52000,
      1
     ],
     [
      30,
      "Imran",
      45000,
      2
     ]
    ]
   },
   "explain": "You cannot use a window function directly in `WHERE`, so wrap it in a subquery (or CTE) and filter the rank outside."
  },
  {
   "lvl": "adv",
   "q": "Running total of salary ordered by hire year (and a CTE).",
   "sql": "WITH ordered AS (\n  SELECT emp_id, name, hire_year, salary FROM employees\n)\nSELECT name, hire_year, salary,\n       SUM(salary) OVER (ORDER BY hire_year, emp_id) AS running_total\nFROM ordered ORDER BY hire_year, emp_id;",
   "out": {
    "cols": [
     "name",
     "hire_year",
     "salary",
     "running_total"
    ],
    "rows": [
     [
      "Asha",
      2015,
      90000,
      90000
     ],
     [
      "Karan",
      2016,
      60000,
      150000
     ],
     [
      "Neha",
      2017,
      52000,
      202000
     ],
     [
      "Pooja",
      2017,
      82000,
      284000
     ],
     [
      "Ravi",
      2018,
      75000,
      359000
     ],
     [
      "Meena",
      2019,
      75000,
      434000
     ],
     [
      "Divya",
      2020,
      55000,
      489000
     ],
     [
      "Sanjay",
      2021,
      48000,
      537000
     ],
     [
      "Imran",
      2022,
      45000,
      582000
     ],
     [
      "Vikram",
      2023,
      40000,
      622000
     ]
    ]
   },
   "explain": "`SUM() OVER (ORDER BY ...)` accumulates row by row. A **CTE** (`WITH ... AS`) names a subquery to keep the main query readable."
  },
  {
   "lvl": "adv",
   "q": "Compare each employee salary with the previous hire (LAG) and the department average.",
   "sql": "SELECT name, hire_year, salary,\n  LAG(salary) OVER (ORDER BY hire_year, emp_id) AS prev_salary,\n  ROUND(AVG(salary) OVER (PARTITION BY dept_id), 0) AS dept_avg\nFROM employees ORDER BY hire_year, emp_id;",
   "out": {
    "cols": [
     "name",
     "hire_year",
     "salary",
     "prev_salary",
     "dept_avg"
    ],
    "rows": [
     [
      "Asha",
      2015,
      90000,
      null,
      80500.0
     ],
     [
      "Karan",
      2016,
      60000,
      90000,
      54333.0
     ],
     [
      "Neha",
      2017,
      52000,
      60000,
      48500.0
     ],
     [
      "Pooja",
      2017,
      82000,
      52000,
      80500.0
     ],
     [
      "Ravi",
      2018,
      75000,
      82000,
      80500.0
     ],
     [
      "Meena",
      2019,
      75000,
      75000,
      80500.0
     ],
     [
      "Divya",
      2020,
      55000,
      75000,
      54333.0
     ],
     [
      "Sanjay",
      2021,
      48000,
      55000,
      54333.0
     ],
     [
      "Imran",
      2022,
      45000,
      48000,
      48500.0
     ],
     [
      "Vikram",
      2023,
      40000,
      45000,
      40000.0
     ]
    ]
   },
   "explain": "`LAG` looks at the previous row (`LEAD` the next one) without a self join. `AVG() OVER (PARTITION BY ...)` shows the group average on every row without collapsing rows."
  },
  {
   "lvl": "adv",
   "q": "Managers and the number of people reporting to them, with the team's total salary.",
   "sql": "SELECT m.name AS manager, COUNT(e.emp_id) AS reports, SUM(e.salary) AS team_salary\nFROM employees m\nJOIN employees e ON e.manager_id = m.emp_id\nGROUP BY m.emp_id, m.name\nORDER BY reports DESC;",
   "out": {
    "cols": [
     "manager",
     "reports",
     "team_salary"
    ],
    "rows": [
     [
      "Asha",
      3,
      232000
     ],
     [
      "Karan",
      2,
      103000
     ],
     [
      "Neha",
      1,
      45000
     ]
    ]
   },
   "explain": "A self join where the left side is the manager and the right side is the reports."
  },
  {
   "lvl": "basic",
   "q": "Replace NULL department with the text \"Unassigned\" (COALESCE) and show string functions.",
   "sql": "SELECT name, COALESCE(CAST(dept_id AS TEXT), 'Unassigned') AS dept, UPPER(name) AS upper_name, LENGTH(name) AS len, SUBSTR(name, 1, 3) AS first3\nFROM employees WHERE emp_id IN (1, 10) ORDER BY emp_id;",
   "out": {
    "cols": [
     "name",
     "dept",
     "upper_name",
     "len",
     "first3"
    ],
    "rows": [
     [
      "Asha",
      "10",
      "ASHA",
      4,
      "Ash"
     ],
     [
      "Vikram",
      "Unassigned",
      "VIKRAM",
      6,
      "Vik"
     ]
    ]
   },
   "explain": "`COALESCE(a, b)` returns the first non-NULL argument. Names of string functions differ by database: `SUBSTR`/`SUBSTRING`, `LENGTH`/`LEN`, `||`/`CONCAT`."
  }
 ]
};
