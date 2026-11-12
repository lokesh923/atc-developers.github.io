"""Build CS Fundamentals mock tests in Graphy Word format.

Rules enforced by the builder: every question in a mock has a different topic AND a different format.
Computable answers are checked by execution before the file is written:
  C snippets → gcc, data-structure / formula answers → Python, SQL → SQLite.
Code snippets are drawn as images with ../pseudocode/render_code.js.
Usage: python3 build_csf_mock.py <mock no> <out.docx> <workdir>
"""
import json
import os
import sqlite3
import subprocess
import sys

import docx
from docx.shared import Inches
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(HERE, "..", "pseudocode", "template8.docx")
RENDER = os.path.join(HERE, "..", "pseudocode", "render_code.js")
SUBJECT, TOPIC = "Technical Assessment", "CS Fundamentals"

# ---------------------------------------------------------------- answer checks
def c_out(body):
    """Compile and run a C main() body, return stdout."""
    return ("c", body)


def check_c(body, work, name):
    os.makedirs(work, exist_ok=True)
    src = os.path.join(work, name + ".c")
    open(src, "w").write("#include <stdio.h>\nint main(void){\n" + body + "\nreturn 0;}\n")
    exe = os.path.join(work, name)
    subprocess.run(["gcc", "-O0", "-w", "-o", exe, src], check=True)
    return subprocess.run([exe], capture_output=True, text=True).stdout.strip()


def stack_possible(push, pops):
    st, i = [], 0
    for x in pops:
        while (not st or st[-1] != x) and i < len(push):
            st.append(push[i])
            i += 1
        if not st or st[-1] != x:
            return False
        st.pop()
    return True


def bsearch_trace(a, key):
    lo, hi, seen = 0, len(a) - 1, []
    while lo <= hi:
        mid = (lo + hi) // 2
        seen.append(a[mid])
        if a[mid] == key:
            break
        if a[mid] < key:
            lo = mid + 1
        else:
            hi = mid - 1
    return seen


def selection_pass(a):
    a = a[:]
    m = a.index(min(a))
    a[0], a[m] = a[m], a[0]
    return a


def sql_rows(schema, q):
    con = sqlite3.connect(":memory:")
    con.executescript(schema)
    return con.execute(q).fetchall()


Q2_C = 'printf("%d", 10 + 3 * 2 % 4 - 8 / 3);'
Q3_C = 'int i, count = 0;\nfor (i = 1; i <= 20; i += 3) {\n    count++;\n}\nprintf("%d", count);'
Q12_COUNT = "long c = 0; int n = 1024, i, j;\nfor (i = 1; i < n; i = i * 2)\n    for (j = 0; j < n; j++)\n        c++;\nprintf(\"%ld\", c);"
Q13_SCHEMA = """CREATE TABLE Employee(id INT, name TEXT, dept TEXT, salary INT);
INSERT INTO Employee VALUES (1,'Asha','IT',60000),(2,'Ravi','HR',40000),(3,'Meena','IT',75000),
(4,'John','Sales',45000),(5,'Priya','HR',42000),(6,'Arjun','IT',52000);"""
Q13_SQL = "SELECT dept, COUNT(*) FROM Employee WHERE salary > 41000 GROUP BY dept HAVING COUNT(*) > 1;"

# (topic, format, question, code lines or None, options, right, explanation, difficulty, check)
MOCK_1 = [
    ("Data types", "Numerical",
     "How many different values can be stored in a 16-bit unsigned integer, and what is the largest of them?",
     None, ["65,536 values; largest 65,535", "65,535 values; largest 65,536", "32,768 values; largest 32,767",
            "65,536 values; largest 32,767"], 1,
     "n bits give 2^n patterns: 2^16 = 65,536 values. An unsigned type starts at 0, so the largest is "
     "2^16 - 1 = 65,535. A signed 16-bit integer instead ranges from -32,768 to 32,767.", "Easy",
     lambda w: f"{2**16:,} values; largest {2**16 - 1:,}"),
    ("Operators", "Predict the output",
     "What will be the output of the following C statement?",
     Q2_C.split("\n"), ["10", "8", "11", "9"], 1,
     "*, / and % have higher precedence than + and -, and are evaluated left to right: 3 * 2 = 6, 6 % 4 = 2, "
     "8 / 3 = 2 (integer division). Then 10 + 2 - 2 = 10.", "Medium",
     lambda w: check_c(Q2_C, w, "q2")),
    ("Control structures", "Count the iterations",
     "How many times does the body of the loop below execute? (The program prints the count.)",
     Q3_C.split("\n"), ["6", "7", "20", "8"], 2,
     "i takes the values 1, 4, 7, 10, 13, 16, 19; the next value, 22, fails i <= 20. That is 7 iterations.",
     "Easy", lambda w: check_c(Q3_C, w, "q3")),
    ("Functions", "Assertion – Reason",
     "Assertion (A): A C function swap(int a, int b) that exchanges a and b inside its body does not exchange the "
     "caller's variables.<br>Reason (R): In call by value, the function works on copies of the arguments.",
     None, ["A is true but R is false", "Both A and R are true, and R is the correct explanation of A",
            "A is false but R is true", "Both A and R are true, but R is not the explanation of A"], 2,
     "Both are true and R explains A: the parameters are copies, so swapping them does not affect the originals. "
     "To change the caller's variables, pass their addresses (swap(int *a, int *b)) or use references.", "Easy",
     None),
    ("Arrays", "Apply the formula",
     "An integer array A[4][5] is stored in row-major order starting at address 1000, and each integer takes 4 "
     "bytes. Indexing starts at 0. What is the address of A[2][3]?",
     None, ["1046", "1092", "1052", "1013"], 3,
     "Row-major address = base + (i × number of columns + j) × size = 1000 + (2 × 5 + 3) × 4 = 1000 + 13 × 4 = "
     "1052. (Column-major would be 1000 + (3 × 4 + 2) × 4 = 1056.)", "Medium",
     lambda w: str(1000 + (2 * 5 + 3) * 4)),
    ("Strings", "Match the following",
     "Match each C string function with what it does.<br>P. strlen   Q. strcmp   R. strcat   S. strcpy<br>"
     "1. Copies one string into another<br>2. Returns the number of characters before '\\0'<br>"
     "3. Appends one string to the end of another<br>4. Returns 0 when two strings are equal",
     None, ["P-2, Q-3, R-4, S-1", "P-1, Q-4, R-3, S-2", "P-4, Q-2, R-1, S-3", "P-2, Q-4, R-3, S-1"], 4,
     "strlen counts characters (excluding the terminating '\\0'), strcmp compares and returns 0 for equal strings "
     "(negative/positive otherwise), strcat concatenates, and strcpy copies the source into the destination.",
     "Easy", None),
    ("Stack", "Which is NOT possible",
     "The numbers 1, 2, 3, 4 are pushed onto a stack in this order. A pop may happen at any time between the "
     "pushes. Which of the following pop sequences is NOT possible?",
     None, ["4 3 2 1", "2 1 4 3", "3 1 4 2", "1 2 3 4"], 3,
     "For 3 1 4 2: to pop 3 first, 1, 2 and 3 must be pushed; after popping 3 the top is 2, so 1 cannot come "
     "next. The others work: 4 3 2 1 (push all, pop all), 2 1 4 3 (push 1, 2, pop, pop, push 3, 4, pop, pop) and "
     "1 2 3 4 (push and pop each in turn).", "Hard",
     lambda w: [s for s in ["4 3 2 1", "2 1 4 3", "3 1 4 2", "1 2 3 4"]
                if not stack_possible([1, 2, 3, 4], list(map(int, s.split())))][0]),
    ("Queue", "Odd one out",
     "Three of these are classic uses of a queue (FIFO). Identify the odd one out.",
     None, ["Printer job scheduling", "Breadth-first search (BFS) of a graph", "Round-robin CPU scheduling",
            "Undo operation in a text editor"], 4,
     "Undo needs the most recent action first (Last In, First Out), so it uses a stack. Printer jobs, BFS and "
     "round-robin scheduling process items in arrival order (First In, First Out), so they use queues.", "Easy",
     None),
    ("Linked list", "Statements I / II / III",
     "Consider a singly linked list with n nodes and a head pointer.<br>I. Inserting a new node at the head takes "
     "O(1) time.<br>II. Accessing the k-th node takes O(1) time.<br>III. Deleting the node after a given node "
     "(when you already have a pointer to that node) takes O(1) time.<br>Which statements are correct?",
     None, ["I and II only", "II and III only", "I and III only", "I, II and III"], 3,
     "I: only the new node and the head pointer change, O(1). II is false: there is no index, so you must walk k "
     "nodes, O(k), up to O(n). III: with a pointer to the previous node, unlinking the next node is just pointer "
     "updates, O(1).", "Medium", None),
    ("Searching", "Trace the algorithm",
     "Binary search is used to find 62 in the sorted array [3, 9, 14, 21, 35, 47, 58, 62, 77] (mid = (low + high) "
     "/ 2, integer division, indexes from 0). Which elements are compared with 62, in order?",
     None, ["35, 58, 62", "35, 62", "21, 47, 62", "35, 47, 58, 62"], 1,
     "low = 0, high = 8 → mid 4 (35) < 62, so low = 5. mid = (5 + 8) / 2 = 6 (58) < 62, so low = 7. mid = (7 + 8) "
     "/ 2 = 7 (62) → found. Three comparisons: 35, 58, 62.", "Medium",
     lambda w: ", ".join(map(str, bsearch_trace([3, 9, 14, 21, 35, 47, 58, 62, 77], 62)))),
    ("Sorting", "Identify the algorithm",
     "A sorting algorithm turns [64, 25, 12, 22, 11] into [11, 25, 12, 22, 64] after its first pass: it found the "
     "smallest element of the unsorted part and swapped it with the first position. Which algorithm is this?",
     None, ["Bubble sort", "Insertion sort", "Selection sort", "Merge sort"], 3,
     "Selection sort picks the minimum of the unsorted part and swaps it into place (one swap per pass). Bubble "
     "sort would move 64 to the end by swapping neighbours, and insertion sort would insert 25 before 64 first.",
     "Easy", lambda w: "Selection sort" if selection_pass([64, 25, 12, 22, 11]) == [11, 25, 12, 22, 64] else "?"),
    ("Time complexity", "Big-O of the code",
     "What is the time complexity of the following code in terms of n?",
     ["for (i = 1; i < n; i = i * 2)", "    for (j = 0; j < n; j++)", "        count++;"],
     ["O(n²)", "O(log n)", "O(n)", "O(n log n)"], 4,
     "The outer loop doubles i, so it runs about log₂ n times; the inner loop runs n times for each of them. "
     "Total ≈ n × log₂ n, i.e. O(n log n). (For n = 1024: 10 × 1024 = 10,240 increments.)", "Medium",
     lambda w: "O(n log n)" if check_c(Q12_COUNT, w, "q12") == str(10 * 1024) else "?"),
    ("DBMS: SQL", "Query result",
     "Table Employee:<br>(1, Asha, IT, 60000), (2, Ravi, HR, 40000), (3, Meena, IT, 75000), (4, John, Sales, 45000), "
     "(5, Priya, HR, 42000), (6, Arjun, IT, 52000)<br>Columns: id, name, dept, salary.<br>"
     "How many rows does this query return?<br>" + Q13_SQL,
     None, ["0", "1", "3", "2"], 2,
     "WHERE runs first and removes Ravi (40000). The groups are then IT: 3 rows, HR: 1 row (Priya), Sales: 1 row "
     "(John). HAVING COUNT(*) > 1 keeps only IT, so the result has 1 row (IT, 3).", "Hard",
     lambda w: str(len(sql_rows(Q13_SCHEMA, Q13_SQL)))),
    ("DBMS: normalization", "Fill in the blank",
     "A relation is in ______ if it is in Second Normal Form and no non-key attribute depends on another non-key "
     "attribute (no transitive dependency).",
     None, ["First Normal Form (1NF)", "Third Normal Form (3NF)", "Fourth Normal Form (4NF)",
            "Boyce–Codd Normal Form (BCNF)"], 2,
     "1NF: atomic values. 2NF: 1NF + no partial dependency on part of a composite key. 3NF: 2NF + no transitive "
     "dependency. BCNF is a stricter 3NF (every determinant is a candidate key).", "Easy", None),
]

MOCKS = {1: MOCK_1}


def verify(mock, work):
    assert len({q[0] for q in mock}) == len(mock), "a topic repeats"
    assert len({q[1] for q in mock}) == len(mock), "a format repeats"
    for n, (topic, fmt, text, code, opts, right, expl, diff, check) in enumerate(mock, 1):
        assert 1 <= right <= 4 and len(set(opts)) == 4, topic
        if check:
            got = check(work)
            ok = got == opts[right - 1]
            print(f"Q{n:2} {topic:22} computed {got!r:26} {'OK' if ok else 'MISMATCH vs ' + repr(opts[right - 1])}")
            assert ok
        else:
            print(f"Q{n:2} {topic:22} concept question (reviewed)")


def main(mock_no, out, work):
    mock = MOCKS[mock_no]
    verify(mock, work)
    img = os.path.join(HERE, "img", f"m{mock_no}")
    os.makedirs(img, exist_ok=True)
    spec = [{"file": f"q{n:02d}.jpg", "lines": q[3]} for n, q in enumerate(mock, 1) if q[3]]
    json.dump(spec, open(os.path.join(work, "lines.json"), "w"))
    subprocess.run(["node", RENDER, os.path.join(work, "lines.json"), img], check=True)
    d = docx.Document(TEMPLATE)
    body = d.element.body
    sect = body.find(docx.oxml.ns.qn("w:sectPr"))
    for el in list(body):
        if el is not sect:
            body.remove(el)
    for n, (topic, fmt, text, code, opts, right, expl, diff, _) in enumerate(mock, 1):
        tags = f"accenture, technical assessment, cs fundamentals, {topic.lower()}, {fmt.lower()}, mock test {mock_no}, {diff.lower()}"
        for line in ["{QUESTION BEGINS}", f"{{QUESTION NUMBER}} {n}", f"{{SUBJECT}} {SUBJECT}", f"{{TOPIC}} {TOPIC}",
                     f"{{TAGS}} {tags}", "{QUESTION TYPE} SINGLECORRECT"]:
            d.add_paragraph(line)
        par = d.add_paragraph("{QUESTION TEXT} ")
        for k, part in enumerate(text.split("<br>")):
            if k:
                par.add_run().add_break()
            par.add_run(part)
        if code:
            f = os.path.join(img, f"q{n:02d}.jpg")
            par.add_run().add_break()
            par.add_run().add_picture(f, width=Inches(max(3.4, min(5.5, Image.open(f).width / 1.5 / 130))))
        d.add_paragraph("")
        for i in range(10):
            d.add_paragraph(f"{{OPTION {i + 1}}} {opts[i] if i < len(opts) else ''}".rstrip())
        for line in [f"{{RIGHT ANSWER}} {right}", f"{{EXPLANATION}} {expl}", "{CORRECT MARKS} 1",
                     "{NEGATIVE MARKS} 0", f"{{DIFFICULTY}} {diff}", "{QUESTION ENDS}", "", ""]:
            d.add_paragraph(line)
    d.save(out)
    from collections import Counter
    print("answer positions:", dict(Counter(q[5] for q in mock)), "-> wrote", out)


if __name__ == "__main__":
    main(int(sys.argv[1]), sys.argv[2], sys.argv[3])
