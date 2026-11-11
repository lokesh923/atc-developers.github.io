"""Build the Technical Assessment Zero-to-Hero guide.

Theory pages live in tech_*.html templates; MCQs are defined here.
* Pseudocode MCQs carry a Python function that executes the same logic - the builder
  computes the answer and asserts it is one of the options (and unique).
* Excel-output MCQs are computed from the sample sheet with Python equivalents.
Usage: python3 build_tech_guide.py <base_style.html> <out.html>
"""
import html
import random
import sys

rng = random.Random(45)

def esc(s):
    return html.escape(s, quote=False)

# ---------------------------------------------------------------- helpers to verify pseudocode
def q1():
    a, b = 5, 9; a = a ^ b; b = a & b; return a + b
def q2():
    x, c = 13, 0
    while x > 0: c += x & 1; x >>= 1
    return c
def q3():
    s = 0
    for i in range(1, 5):
        for j in range(i, 5): s += 1
    return s
def q4():
    def fun(n): return 1 if n <= 1 else n + fun(n - 2)
    return fun(7)
def q5():
    a, b = 10, 3; return a % b + a // b
def q6():
    p = 6; return (p << 2) + (p >> 1)
def q7():
    n, r = 1234, 0
    while n != 0: r = r * 10 + n % 10; n //= 10
    return r
def q8():
    a = 7; return ~a + (a & 3)
def q9():
    arr = [3, 8, 1, 9, 4]; m = arr[0]
    for i in range(1, 5):
        if arr[i] > m: m = arr[i]
        else: m = m - 1
    return m
def q10():
    def f(n): return 0 if n == 0 else n % 2 + f(n // 2)
    return f(29)
def q11():
    x, y = 2, 5
    for i in range(3): x = x * y; y = y + x % 7
    return f"{x} {y}"
def q12():
    def g(a, b): return a if b == 0 else g(b, a % b)
    return g(84, 36)
def q13():
    s, c = "ACCENTURE", 0
    for i, ch in enumerate(s):
        if ch == "E": c += i
    return c
def q14():
    a, b = 12, 25; a ^= b; b ^= a; a ^= b; return a - b
def q15():
    s = 0
    for i in range(1, 6):
        for j in range(1, 6):
            if j > i: break
            s += j
    return s
def q16():
    def p(b, e):
        if e == 0: return 1
        if e % 2 == 0: return p(b, e // 2) * p(b, e // 2)
        return b * p(b, e - 1)
    return p(3, 5)
def q17():
    a, b = 10, 6; return (a & b) + (a | b) - (a ^ b)
def q18():
    n, steps = 100, 0
    while n > 1:
        n = n // 2 if n % 2 == 0 else 3 * n + 1; steps += 1
    return steps

PSEUDO = [
    ("Bitwise XOR and AND", "Integer a = 5, b = 9\na = a ^ b\nb = a & b\nPrint a + b", q1, ["14", "20", "13", "17"],
     "a = 0101 ^ 1001 = 1100 = 12. b = 1100 & 1001 = 1000 = 8. 12 + 8 = 20."),
    ("Counting set bits", "Integer x = 13, count = 0\nwhile (x > 0)\n    count = count + (x & 1)\n    x = x >> 1\nend while\nPrint count", q2, ["2", "3", "4", "13"],
     "13 = 1101 in binary. The loop adds the last bit each time and shifts right, so it counts the 1s: 3."),
    ("Nested loop count", "Integer s = 0\nfor (i = 1 to 4)\n    for (j = i to 4)\n        s = s + 1\n    end for\nend for\nPrint s", q3, ["16", "10", "6", "8"],
     "The inner loop runs 4, 3, 2, 1 times: 4 + 3 + 2 + 1 = 10."),
    ("Recursion", "Function fun(Integer n)\n    if (n <= 1) return 1\n    return n + fun(n - 2)\nEnd Function\nPrint fun(7)", q4, ["16", "15", "28", "13"],
     "fun(7) = 7 + fun(5) = 7 + 5 + fun(3) = 7 + 5 + 3 + fun(1) = 7 + 5 + 3 + 1 = 16."),
    ("mod and integer division", "Integer a = 10, b = 3\nInteger c = a mod b + a / b\nPrint c", q5, ["4", "3", "4.33", "1"],
     "10 mod 3 = 1. 10 / 3 = 3 (integer division drops the decimal). 1 + 3 = 4."),
    ("Shift operators", "Integer p = 6\np = (p << 2) + (p >> 1)\nPrint p", q6, ["27", "15", "26", "30"],
     "6 << 2 = 6 × 4 = 24. 6 >> 1 = 6 ÷ 2 = 3. 24 + 3 = 27."),
    ("Digit reversal", "Integer n = 1234, r = 0\nwhile (n != 0)\n    r = r * 10 + n mod 10\n    n = n / 10\nend while\nPrint r", q7, ["1234", "10", "4321", "4123"],
     "Each step takes the last digit (n mod 10) and appends it to r, so the number is reversed: 4321."),
    ("Bitwise NOT (~)", "Integer a = 7\nPrint ~a + (a & 3)", q8, ["-5", "-4", "11", "-8"],
     "~a = -(a + 1) = -8 (two's complement). 7 & 3 = 0111 & 0011 = 3. -8 + 3 = -5."),
    ("Array traversal", "Integer arr[5] = {3, 8, 1, 9, 4}\nInteger m = arr[0]\nfor (i = 1 to 4)\n    if (arr[i] > m) m = arr[i]\n    else m = m - 1\nend for\nPrint m", q9, ["9", "8", "7", "3"],
     "m = 3 → 8 (8 > 3) → 7 (1 is not bigger, so subtract 1) → 9 (9 > 7) → 8 (4 is not bigger). Answer: 8."),
    ("Recursion with mod", "Function f(Integer n)\n    if (n == 0) return 0\n    return (n mod 2) + f(n / 2)\nEnd Function\nPrint f(29)", q10, ["5", "3", "4", "29"],
     "This adds the binary digits of n. 29 = 11101, which has four 1s, so the answer is 4."),
    ("Loop with two variables", "Integer x = 2, y = 5\nfor (i = 1 to 3)\n    x = x * y\n    y = y + x mod 7\nend for\nPrint x, y", q11, ["880 16", "80 11", "880 11", "800 16"],
     "Pass 1: x = 10, y = 5 + 3 = 8. Pass 2: x = 80, y = 8 + 3 = 11. Pass 3: x = 880, y = 11 + (880 mod 7 = 5) = 16."),
    ("Euclid's GCD", "Function g(Integer a, Integer b)\n    if (b == 0) return a\n    return g(b, a mod b)\nEnd Function\nPrint g(84, 36)", q12, ["6", "12", "36", "4"],
     "g(84, 36) → g(36, 12) → g(12, 0) → 12. This is Euclid's algorithm for the greatest common divisor."),
    ("String indexing", "String s = \"ACCENTURE\"\nInteger c = 0\nfor (i = 0 to length(s) - 1)\n    if (s[i] == 'E') c = c + i\nend for\nPrint c", q13, ["11", "2", "12", "8"],
     "Indexes start at 0. The two E's are at positions 3 and 8, and 3 + 8 = 11."),
    ("XOR swap", "Integer a = 12, b = 25\na = a ^ b\nb = a ^ b\na = a ^ b\nPrint a - b", q14, ["-13", "13", "0", "37"],
     "Three XORs swap the values, so a = 25 and b = 12. 25 - 12 = 13."),
    ("Nested loop with break", "Integer s = 0\nfor (i = 1 to 5)\n    for (j = 1 to 5)\n        if (j > i) break\n        s = s + j\n    end for\nend for\nPrint s", q15, ["55", "15", "35", "25"],
     "For each i, the inner loop adds 1 + 2 + … + i. So the total is 1 + 3 + 6 + 10 + 15 = 35."),
    ("Fast power", "Function p(Integer b, Integer e)\n    if (e == 0) return 1\n    if (e mod 2 == 0) return p(b, e/2) * p(b, e/2)\n    return b * p(b, e - 1)\nEnd Function\nPrint p(3, 5)", q16, ["243", "81", "15", "125"],
     "p(3, 5) works out 3⁵ using squaring: 3 × p(3, 4) = 3 × (p(3, 2))² = 3 × 9² = 243."),
    ("AND, OR, XOR together", "Integer a = 10, b = 6\nPrint (a & b) + (a | b) - (a ^ b)", q17, ["4", "16", "2", "14"],
     "1010 & 0110 = 0010 = 2. 1010 | 0110 = 1110 = 14. 1010 ^ 0110 = 1100 = 12. 2 + 14 - 12 = 4."),
    ("While loop with if/else", "Integer n = 100, steps = 0\nwhile (n > 1)\n    if (n mod 2 == 0) n = n / 2\n    else n = 3 * n + 1\n    steps = steps + 1\nend while\nPrint steps", q18, ["25", "7", "100", "24"],
     "This is the Collatz sequence. Trace it: 100 → 50 → 25 → 76 → 38 → 19 → … → 1, which takes 25 steps."),
]

# ---------------------------------------------------------------- Excel sheet MCQs (computed)
SHEET = [("Asha", "HR", 40000), ("Ravi", "IT", 55000), ("Meena", "IT", 62000), ("John", "Sales", 38000), ("Priya", "HR", 45000)]
sal = [r[2] for r in SHEET]
EXCEL_SHEET_Q = [
    ('=COUNTIF(B2:B6,"IT")', sum(1 for r in SHEET if r[1] == "IT"), ["1", "3", "117000"], "COUNTIF counts the cells in B2:B6 equal to \"IT\": Ravi and Meena."),
    ('=SUMIF(B2:B6,"HR",C2:C6)', sum(r[2] for r in SHEET if r[1] == "HR"), ["40000", "45000", "2"], "SUMIF adds the salaries in C where B is \"HR\": 40000 + 45000."),
    ('=VLOOKUP("Meena",A2:C6,3,FALSE)', [r[2] for r in SHEET if r[0] == "Meena"][0], ["IT", "Meena", "#N/A"], "It finds \"Meena\" in the first column (exact match, because of FALSE) and returns the value from column 3 of the range."),
    ("=AVERAGE(C2:C6)", sum(sal) // len(sal), ["240000", "45000", "50000"], "(40000 + 55000 + 62000 + 38000 + 45000) ÷ 5 = 240000 ÷ 5."),
    ("=MAX(C2:C6)-MIN(C2:C6)", max(sal) - min(sal), ["62000", "38000", "17000"], "62000 - 38000."),
    ('=IF(C3>50000,"High","Low")', "High", ["Low", "TRUE", "55000"], "C3 = 55000, which is more than 50000, so IF returns the 'value if true'."),
    ('=LEFT(A3,2)&RIGHT(A4,1)', SHEET[1][0][:2] + SHEET[2][0][-1], ["Ra", "Rav", "Rae"], "LEFT(\"Ravi\", 2) = \"Ra\". RIGHT(\"Meena\", 1) = \"a\". The & sign joins them into \"Raa\"."),
]

def fmt_num(v):
    return f"{v}" if isinstance(v, str) else f"{v}"

# ---------------------------------------------------------------- MCQ banks (A–D options; correct listed first, shuffled later)
OFFICE = [
    ("You copy the formula <code>=A1*$B$1</code> from C1 down to C3. What does C3 contain?", ["=A3*$B$1", "=A3*$B$3", "=A1*$B$1", "=C3*$B$1"],
     "The relative reference A1 changes with the row (A3). The absolute reference $B$1 stays fixed."),
    ("Which key toggles a cell reference between relative, absolute and mixed while you edit a formula?", ["F4", "F2", "F9", "Ctrl + $"],
     "F4 cycles A1 → $A$1 → A$1 → $A1."),
    ("What does <code>=MID(\"Accenture\",3,4)</code> return?", ["cent", "ccen", "ente", "Acce"],
     "MID starts at character 3 (the second c) and takes 4 characters: c-e-n-t."),
    ("What does <code>=INT(-3.7)</code> return in Excel?", ["-4", "-3", "-3.7", "4"],
     "INT rounds down to the nearest whole number. For negatives, 'down' means -4."),
    ("A cell shows <b>#N/A</b> after a VLOOKUP. What is the most likely reason?", ["The lookup value was not found", "Division by zero", "The column is too narrow", "A deleted cell reference"],
     "#N/A means 'not available': the value wasn't found. #DIV/0! is division by zero, #### means the column is too narrow, and #REF! is an invalid reference."),
    ("Which is the difference between COUNT and COUNTA?", ["COUNT counts numbers; COUNTA counts all non-empty cells", "COUNT counts text; COUNTA counts numbers", "They are identical", "COUNTA counts only blank cells"],
     "COUNT counts only numeric cells. COUNTA counts any non-empty cell, including text. COUNTBLANK counts empty cells."),
    ("In MS Word, which shortcut inserts a page break?", ["Ctrl + Enter", "Shift + Enter", "Alt + Enter", "Ctrl + B"],
     "Ctrl + Enter adds a page break. Shift + Enter is a line break within a paragraph."),
    ("Which Word feature creates many personalised letters from one template and a list of names?", ["Mail Merge", "Track Changes", "Section Break", "Styles"],
     "Mail Merge combines a main document with a data source, such as an Excel list."),
    ("In PowerPoint, which key starts the slideshow from the CURRENT slide?", ["Shift + F5", "F5", "Ctrl + F5", "Alt + F5"],
     "F5 starts from the first slide. Shift + F5 starts from the current slide."),
    ("Where do you change the font and logo for ALL slides in a presentation at once?", ["Slide Master", "Slide Sorter", "Normal view", "Reading view"],
     "Slide Master controls the layout and theme of every slide based on it."),
    ("What is the difference between an Animation and a Transition in PowerPoint?", ["Animation moves objects on a slide; Transition is the effect between slides", "They are the same", "Transition moves text; Animation changes slides", "Animation only works in Slide Sorter"],
     "Animations apply to objects such as text and images. Transitions apply when you move from one slide to the next."),
    ("Which Excel feature limits the entries in a cell to a drop-down list?", ["Data Validation", "Conditional Formatting", "Freeze Panes", "Pivot Table"],
     "Data → Data Validation → List restricts input. Conditional Formatting only changes how cells look."),
]
OOPS = [
    ("Two methods in the same class have the same name but different parameter lists. This is called:", ["Method overloading", "Method overriding", "Encapsulation", "Abstraction"],
     "Overloading is compile-time polymorphism within one class."),
    ("Run-time (dynamic) polymorphism is achieved through:", ["Method overriding", "Method overloading", "Constructors", "Static methods"],
     "The overridden method that runs is chosen at run time, based on the actual object."),
    ("Making fields private and giving access through getters and setters is an example of:", ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
     "Encapsulation means bundling data with its methods and hiding the internal state."),
    ("In Java, a class cannot extend two classes. Multiple inheritance of type is achieved using:", ["Interfaces", "Abstract classes", "Final classes", "Packages"],
     "A class can implement several interfaces."),
    ("What is printed?<pre>class A { void show() { print(\"A\") } }\nclass B extends A { void show() { print(\"B\") } }\nA obj = new B()\nobj.show()</pre>", ["B", "A", "AB", "Compile error"],
     "The object is really a B, so B's overriding show() runs. This is run-time polymorphism."),
    ("Which of these cannot be instantiated (you can't create an object of it directly)?", ["An abstract class", "A final class", "A class with a constructor", "A subclass"],
     "Abstract classes can only be extended. Their subclasses can be instantiated."),
    ("Which statement about constructors is TRUE?", ["It has the same name as the class and no return type", "It must return void", "It can be called only once per program", "It must be static"],
     "Constructors initialise objects. They have no return type, not even void."),
    ("Which access modifier makes a member visible ONLY inside its own class?", ["private", "protected", "public", "default (package)"],
     "The scope widens in this order: private < default < protected < public."),
]
NETWORK = [
    ("Which OSI layer is responsible for routing packets between networks?", ["Network (Layer 3)", "Data Link (Layer 2)", "Transport (Layer 4)", "Session (Layer 5)"], "Routers and IP work at Layer 3."),
    ("A switch mainly operates at which OSI layer?", ["Data Link (Layer 2)", "Physical (Layer 1)", "Network (Layer 3)", "Application (Layer 7)"], "Switches forward frames using MAC addresses (Layer 2). Hubs are Layer 1 and routers are Layer 3."),
    ("Default port number for HTTPS:", ["443", "80", "8080", "21"], "HTTP uses port 80 and HTTPS uses port 443."),
    ("Which protocol automatically assigns IP addresses to devices?", ["DHCP", "DNS", "ARP", "FTP"], "DHCP follows DORA: Discover, Offer, Request, Acknowledge."),
    ("Which is a PRIVATE IPv4 address?", ["192.168.1.10", "8.8.8.8", "172.32.0.5", "11.0.0.1"], "The private ranges are 10.0.0.0/8, 172.16.0.0–172.31.255.255 and 192.168.0.0/16. 172.32.x.x is outside the range."),
    ("How many usable host addresses are in a /26 subnet?", ["62", "64", "30", "126"], "That leaves 32 - 26 = 6 host bits, and 2⁶ - 2 = 62. Two addresses are reserved for the network and broadcast."),
    ("Which statement about TCP and UDP is correct?", ["TCP is connection-oriented and reliable; UDP is connectionless and faster", "UDP guarantees delivery; TCP does not", "Both are Network-layer protocols", "TCP is used for DNS queries by default; UDP for web pages"], "TCP sets up a connection with a 3-way handshake and guarantees delivery. UDP has no handshake and is used for streaming and DNS."),
    ("HTTP status code 404 means:", ["Not Found", "Internal Server Error", "Forbidden", "OK"], "2xx means success, 3xx redirect, 4xx client error (404 = not found, 403 = forbidden) and 5xx server error (500)."),
    ("Which is an example of SYMMETRIC encryption?", ["AES", "RSA", "SHA-256", "Diffie–Hellman"], "AES uses one shared key. RSA is asymmetric. SHA-256 is hashing, not encryption."),
    ("Malware that encrypts your files and demands payment is:", ["Ransomware", "Worm", "Spyware", "Adware"], "Ransomware holds data hostage. A worm self-replicates across networks without a host file."),
    ("An attacker inserts <code>' OR 1=1 --</code> into a login form. This attack is:", ["SQL Injection", "Phishing", "Cross-Site Scripting", "DDoS"], "Malicious SQL in the input changes the query. Prevent it with parameterised queries."),
    ("The 'CIA triad' in security stands for:", ["Confidentiality, Integrity, Availability", "Control, Identity, Access", "Confidentiality, Identity, Authentication", "Cyber, Internet, Access"], "These are the three core goals of information security."),
    ("Renting virtual machines from AWS EC2 is an example of:", ["IaaS", "PaaS", "SaaS", "FaaS"], "IaaS gives you infrastructure: VMs, storage and networks. You manage the OS and everything above it."),
    ("Using Gmail or Microsoft 365 in a browser is an example of:", ["SaaS", "IaaS", "PaaS", "On-premise"], "SaaS is ready-to-use software. The provider manages everything."),
    ("A company keeps sensitive data in its private cloud and uses a public cloud for extra capacity. This is:", ["Hybrid cloud", "Community cloud", "Public cloud", "Multi-tenant SaaS"], "Hybrid combines private and public clouds."),
    ("Which Git command creates a local copy of a remote repository?", ["git clone", "git init", "git pull", "git commit"], "git init creates a new empty repo. git pull updates an existing one."),
    ("In Docker, what is a container?", ["A running instance of an image", "A file that lists build steps", "A cloud provider", "A virtual machine with its own full OS kernel"], "Image = template, container = running instance, Dockerfile = build recipe. Containers share the host kernel."),
    ("Continuous Integration (CI) mainly means:", ["Merging code often, with automated build and tests on each change", "Deploying to production once a year", "Writing code without version control", "Manually testing at the end of the project"], "CD (Continuous Delivery/Deployment) then automates releasing the tested code."),
]
CSF = [
    ("Size of an <code>int</code> in Java:", ["4 bytes", "2 bytes", "8 bytes", "Depends on the OS"], "Java's sizes are fixed: byte 1, short 2, int 4, long 8, float 4, double 8, char 2."),
    ("Which data structure works on LIFO (Last In, First Out)?", ["Stack", "Queue", "Linked list", "Array"], "Stacks are used for undo, function calls and balancing brackets. Queues are FIFO."),
    ("Starting with an empty stack: push 1, push 2, pop, push 3, pop, pop. In what order are values popped?", ["2, 3, 1", "1, 2, 3", "3, 2, 1", "2, 1, 3"], "pop → 2, then 3 is pushed and popped → 3, then the last pop → 1."),
    ("Evaluate the postfix expression <code>2 3 4 * +</code>:", ["14", "20", "24", "9"], "Push 2, 3, 4. Then * gives 3 × 4 = 12, and + gives 2 + 12 = 14."),
    ("Binary search requires that the array is:", ["Sorted", "Unsorted", "Of even length", "Stored as a linked list"], "Binary search halves a sorted range each step, so it runs in O(log n)."),
    ("Time complexity of this code?<pre>for (i = 1; i < n; i = i * 2)\n    print(i)</pre>", ["O(log n)", "O(n)", "O(n log n)", "O(1)"], "i doubles each time, so the loop runs about log₂ n times."),
    ("Time complexity of two nested loops that each run n times:", ["O(n²)", "O(2n)", "O(n)", "O(log n)"], "n × n iterations."),
    ("Which sorting algorithm has a worst case of O(n log n)?", ["Merge sort", "Quick sort", "Bubble sort", "Insertion sort"], "Quick sort's worst case is O(n²). Merge sort is always O(n log n)."),
    ("Which sorting algorithm is NOT stable (in its standard form)?", ["Selection sort", "Merge sort", "Insertion sort", "Bubble sort"], "A stable sort keeps equal elements in their original order. Selection sort's long-distance swaps can break that order."),
    ("Inserting a new node at the HEAD of a singly linked list takes:", ["O(1)", "O(n)", "O(log n)", "O(n²)"], "Just point the new node at the old head. No traversal is needed."),
    ("A PRIMARY KEY column must be:", ["Unique and NOT NULL", "Unique but may be NULL", "Repeated in every row", "A foreign key"], "A table has one primary key, which identifies each row. A foreign key links to another table's primary key."),
    ("Which command is DDL (Data Definition Language)?", ["CREATE", "INSERT", "UPDATE", "SELECT"], "DDL: CREATE, ALTER, DROP, TRUNCATE. DML: INSERT, UPDATE, DELETE. DQL: SELECT."),
    ("Which statement about DELETE and TRUNCATE is correct?", ["DELETE can use WHERE; TRUNCATE removes all rows", "TRUNCATE can use WHERE", "DELETE removes the table structure", "They are both DDL"], "DELETE is DML and row-by-row, and it can be rolled back. TRUNCATE is DDL and removes all rows quickly. DROP removes the table itself."),
    ("A table in 2NF that still has a transitive dependency (non-key → non-key) violates:", ["3NF", "1NF", "2NF", "No normal form"], "1NF: atomic values. 2NF: no partial dependency. 3NF: no transitive dependency."),
    ("'A transaction happens completely or not at all' describes which ACID property?", ["Atomicity", "Consistency", "Isolation", "Durability"], "ACID: Atomicity, Consistency, Isolation, Durability."),
    ("Which data structure is used for Breadth-First Search (BFS)?", ["Queue", "Stack", "Heap", "Hash table"], "BFS explores level by level using a queue. DFS uses a stack, or recursion."),
]

# ---------------------------------------------------------------- rendering
LET = "ABCD"

def render_mcq(num, qhtml, opts_correct_first, code=None, shuffle=True):
    opts = list(opts_correct_first)
    order = list(range(len(opts)))
    if shuffle:
        rng.shuffle(order)
    shown = [opts[i] for i in order]
    ans = LET[order.index(0)]
    code_html = f"<pre>{esc(code)}</pre>" if code else ""
    li = "".join(f"<li><b>{LET[i]}</b> {o}</li>" for i, o in enumerate(shown))
    return (f'<div class="mcq"><div class="qn">Q{num}</div><div class="qb"><div class="qt">{qhtml}</div>{code_html}'
            f'<ol class="opts">{li}</ol></div></div>'), ans, shown[order.index(0)]

def bank_html(prefix, items, start=1):
    qs, keys = [], []
    for i, (q, opts, why) in enumerate(items, start):
        h, a, correct = render_mcq(f"{prefix}{i}", q, opts)
        qs.append(h); keys.append((f"{prefix}{i}", a, correct, why))
    return "".join(qs), keys

def pseudo_html(prefix):
    qs, keys = [], []
    for i, (title, code, fn, opts, why) in enumerate(PSEUDO, 1):
        val = str(fn())
        assert val in opts, (title, val, opts)
        assert opts.count(val) == 1
        others = [o for o in opts if o != val]
        h, a, correct = render_mcq(f"{prefix}{i}", f"<span class='tg'>{title}</span> What is the output?", [val] + others, code=code)
        qs.append(h); keys.append((f"{prefix}{i}", a, val, why))
    return "".join(qs), keys

def excel_sheet_html(prefix, start):
    qs, keys = [], []
    for i, (formula, val, wrong, why) in enumerate(EXCEL_SHEET_Q, start):
        v = str(val)
        assert v not in wrong
        h, a, correct = render_mcq(f"{prefix}{i}", f"Using the sample sheet above, what does <code>{esc(formula)}</code> return?", [v] + wrong)
        qs.append(h); keys.append((f"{prefix}{i}", a, v, why))
    return "".join(qs), keys

def key_html(keys):
    rows = "".join(f"<tr><td><b>{n}</b></td><td class='ans'>{a}</td><td>{c}</td><td>{w}</td></tr>" for n, a, c, w in keys)
    return f"<table class='keyt'><thead><tr><th>Q</th><th>Ans</th><th>Correct option</th><th>Why</th></tr></thead><tbody>{rows}</tbody></table>"

def main(base, out):
    style = open(base).read()
    d = __file__.rsplit("/", 1)[0]
    parts = [open(f"{d}/tech_{p}.html").read() for p in ("0", "A", "B", "C", "D", "Z")]
    doc = "".join(parts)
    # Part A: sheet questions + office bank
    sheet_q, sheet_k = excel_sheet_html("A", 1)
    off_q, off_k = bank_html("A", OFFICE, start=len(EXCEL_SHEET_Q) + 1)
    ps_q, ps_k = pseudo_html("B")
    oo_q, oo_k = bank_html("B", OOPS, start=len(PSEUDO) + 1)
    nw_q, nw_k = bank_html("C", NETWORK)
    cs_q, cs_k = bank_html("D", CSF)
    total = len(sheet_k) + len(off_k) + len(ps_k) + len(oo_k) + len(nw_k) + len(cs_k)
    doc = (doc.replace("<!--BASE_STYLE-->", style)
              .replace("<!--MCQ_A-->", sheet_q + off_q).replace("<!--KEY_A-->", key_html(sheet_k + off_k))
              .replace("<!--MCQ_B-->", ps_q + oo_q).replace("<!--KEY_B-->", key_html(ps_k + oo_k))
              .replace("<!--MCQ_C-->", nw_q).replace("<!--KEY_C-->", key_html(nw_k))
              .replace("<!--MCQ_D-->", cs_q).replace("<!--KEY_D-->", key_html(cs_k))
              .replace("<!--TOTAL_MCQ-->", str(total)))
    open(out, "w").write(doc)
    print("ok", out, "| MCQs:", total, "| pseudocode answers:", [str(p[2]()) for p in PSEUDO])

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
