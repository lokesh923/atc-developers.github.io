"""Build the detailed CS Fundamentals guide (Technical Assessment, Part D).

Every computable answer is produced by execution:
* C / Java output questions  -> gcc / JDK (helpers reused from build_pseudo_guide)
* data-structure questions   -> computed in Python (stack, queue, postfix, BST traversals, heap, sorting passes, binary search, hashing, addresses)
* SQL questions              -> run on an in-memory SQLite database with the guide's sample tables
Usage: python3 build_csf_guide.py <base_style.html> <out.html> <workdir>
"""
import heapq
import os
import random
import sqlite3
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_pseudo_guide import run_c, run_java, esc  # noqa: E402

rng = random.Random(21)
LET = "ABCD"

# ------------------------------------------------------------------ C / Java code questions
C_Q = [
 ("Pointer arithmetic", "int a[] = {10, 20, 30, 40};\nint *p = a;\np += 2;\nprintf(\"%d\", *p + 1);", "", 'int a[]={10,20,30,40}; int *p=a; p+=2; printf("%d",*p+1);',
  ["31", "21", "12", "41"], "p += 2 moves two elements ahead, to a[2] = 30. *p + 1 = 31."),
 ("Dereferencing", "int x = 5;\nint *p = &x;\n*p = *p * 2;\nprintf(\"%d\", x);", "", 'int x=5; int *p=&x; *p=*p*2; printf("%d",x);',
  ["10", "5", "Address of x", "25"], "*p IS x, so changing *p changes x."),
 ("Swap via pointers", "void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }\nint x = 3, y = 7;\nswap(&x, &y);\nprintf(\"%d %d\", x, y);",
  "void swap(int *a,int *b){int t=*a;*a=*b;*b=t;}", 'int x=3,y=7; swap(&x,&y); printf("%d %d",x,y);',
  ["7 3", "3 7", "7 7", "3 3"], "Passing addresses (by reference) lets the function change the caller's variables."),
 ("static local variable", "void counter() { static int c = 0; c++; printf(\"%d \", c); }\ncounter(); counter(); counter();",
  'void counter(){ static int c=0; c++; printf("%d ",c); }', "counter(); counter(); counter();",
  ["1 2 3", "1 1 1", "0 1 2", "3 3 3"], "A static local is initialised ONCE and keeps its value between calls."),
 ("strlen and \\0", "printf(\"%d\", (int) strlen(\"hello\\0world\"));", "#include <string.h>", 'printf("%d",(int)strlen("hello\\0world"));',
  ["5", "11", "10", "12"], "strlen stops at the first null character '\\0'."),
 ("sizeof a char array", "char s[] = \"abc\";\nprintf(\"%d\", (int) sizeof(s));", "", 'char s[]="abc"; printf("%d",(int)sizeof(s));',
  ["4", "3", "8", "1"], "3 characters plus the terminating '\\0' = 4 bytes. strlen(s) would be 3."),
 ("unsigned overflow", "unsigned char c = 255;\nc++;\nprintf(\"%d\", c);", "", 'unsigned char c=255; c++; printf("%d",c);',
  ["0", "256", "-1", "255"], "An unsigned char holds 0–255 (8 bits), so 255 + 1 wraps around to 0."),
 ("Casting truncates", "printf(\"%d\", (int) 7.9 + (int) -7.9);", "", 'printf("%d",(int)7.9 + (int)-7.9);',
  ["0", "-1", "1", "16"], "Casting to int truncates toward zero: 7 + (−7) = 0."),
 ("Block scope", "int i = 10;\n{\n    int i = 20;\n    i++;\n}\nprintf(\"%d\", i);", "", 'int i=10; { int i=20; i++; } printf("%d",i);',
  ["10", "21", "20", "11"], "The inner i is a different variable that only exists inside the braces (it shadows the outer one)."),
 ("Recursive array sum", "int sum(int a[], int n) { return n == 0 ? 0 : a[n-1] + sum(a, n-1); }\nint a[] = {4, 7, 1, 9};\nprintf(\"%d\", sum(a, 4));",
  "int sum(int a[],int n){ return n==0?0:a[n-1]+sum(a,n-1); }", 'int a[]={4,7,1,9}; printf("%d",sum(a,4));',
  ["21", "9", "13", "20"], "4 + 7 + 1 + 9 = 21, added from the last element back to the first."),
]
J_Q = [
 ("String concatenation order", "System.out.print(10 + 20 + \"x\" + 10 + 20);", ["30x1020", "1020x30", "30x30", "1020x1020"],
  "Evaluation goes left to right: 10 + 20 = 30 (numbers), then everything after the \"x\" is string joining."),
 ("Strings are immutable", "String s = \"abc\";\ns.concat(\"d\");\nSystem.out.print(s);", ["abc", "abcd", "d", "null"],
  "concat returns a NEW string, which is ignored here, and s itself never changes."),
 ("StringBuilder is mutable", "StringBuilder sb = new StringBuilder(\"abc\");\nsb.append(\"d\").reverse();\nSystem.out.print(sb);", ["dcba", "abcd", "abc", "cbad"],
  "StringBuilder changes in place: \"abcd\" is reversed to \"dcba\"."),
 ("char arithmetic", "char c = 'a';\nSystem.out.print((c + 1) + \" \" + (char)(c + 1));", ["98 b", "b b", "98 98", "a1 b"],
  "char + int gives an int (97 + 1 = 98). Casting it back to char gives 'b'."),
]

# ------------------------------------------------------------------ data-structure questions (computed)
def stack_seq():
    st, out = [], []
    for op in ["push 10", "push 20", "pop", "push 30", "push 40", "pop", "pop"]:
        if op == "pop": out.append(st.pop())
        else: st.append(int(op.split()[1]))
    return " ".join(map(str, out))

def postfix(expr):
    st = []
    for t in expr.split():
        if t in "+-*/":
            b, a = st.pop(), st.pop()
            st.append({"+": a + b, "-": a - b, "*": a * b, "/": a // b}[t])
        else: st.append(int(t))
    return st[0]

def to_postfix(expr):
    prec = {"+": 1, "-": 1, "*": 2, "/": 2}; out, ops = [], []
    for t in expr.split():
        if t in prec:
            while ops and ops[-1] in prec and prec[ops[-1]] >= prec[t]: out.append(ops.pop())
            ops.append(t)
        elif t == "(": ops.append(t)
        elif t == ")":
            while ops[-1] != "(": out.append(ops.pop())
            ops.pop()
        else: out.append(t)
    while ops: out.append(ops.pop())
    return " ".join(out)

class Node:
    def __init__(s, k): s.k, s.l, s.r = k, None, None
def bst(keys):
    root = None
    def ins(n, k):
        if not n: return Node(k)
        if k < n.k: n.l = ins(n.l, k)
        else: n.r = ins(n.r, k)
        return n
    for k in keys: root = ins(root, k)
    return root
def pre(n): return [] if not n else [n.k] + pre(n.l) + pre(n.r)
def post(n): return [] if not n else post(n.l) + post(n.r) + [n.k]
def levels(n): return 0 if not n else 1 + max(levels(n.l), levels(n.r))

def min_heap(xs):
    h = []
    for x in xs: heapq.heappush(h, x)
    return h

def bubble_pass(a):
    a = a[:]
    for j in range(len(a) - 1):
        if a[j] > a[j + 1]: a[j], a[j + 1] = a[j + 1], a[j]
    return a
def selection_pass(a):
    a = a[:]; m = a.index(min(a)); a[0], a[m] = a[m], a[0]; return a
def insertion_passes(a, k):
    a = a[:]
    for i in range(1, k + 1):
        key, j = a[i], i - 1
        while j >= 0 and a[j] > key: a[j + 1] = a[j]; j -= 1
        a[j + 1] = key
    return a
def bsearch_comparisons(a, x):
    lo, hi, c = 0, len(a) - 1, 0
    while lo <= hi:
        mid = (lo + hi) // 2; c += 1
        if a[mid] == x: return c
        if a[mid] < x: lo = mid + 1
        else: hi = mid - 1
    return c
def linear_probe(size, keys):
    t = [None] * size; pos = {}
    for k in keys:
        i = k % size
        while t[i] is not None: i = (i + 1) % size
        t[i] = k; pos[k] = i
    return pos

L = lambda xs: "[" + ", ".join(map(str, xs)) + "]"
DS_Q = [
 ("Stack", "Starting with an empty stack: push 10, push 20, pop, push 30, push 40, pop, pop. In what order are the values popped?", stack_seq(), ["20 30 40", "10 20 30", "40 30 20"],
  "LIFO: the first pop gives 20. Then 30 and 40 are pushed, so the next pops give 40 and then 30. 10 stays on the stack."),
 ("Postfix", "Evaluate the postfix expression <code>6 2 3 + - 3 8 2 / + *</code>", str(postfix("6 2 3 + - 3 8 2 / + *")), ["49", "1", "-7"],
  "2 + 3 = 5, then 6 − 5 = 1. 8 / 2 = 4, then 3 + 4 = 7. Finally 1 × 7 = 7."),
 ("Infix → postfix", "Convert <code>A + B * C - D</code> to postfix.", to_postfix("A + B * C - D"), ["A B + C * D -", "A B C + * D -", "+ A * B C - D"],
  "* binds tighter, so B * C is grouped first. Then +, then − (both left to right)."),
 ("BST traversal", "Insert 50, 30, 70, 20, 40, 60, 80 into an empty BST. What is the <b>post-order</b> traversal?", " ".join(map(str, post(bst([50, 30, 70, 20, 40, 60, 80])))),
  ["50 30 20 40 70 60 80", "20 30 40 50 60 70 80", "20 40 60 80 30 70 50"], "Post-order is Left, Right, Root: the root (50) comes last. In-order would give the sorted list."),
 ("BST pre-order", "For the same BST (50, 30, 70, 20, 40, 60, 80), what is the <b>pre-order</b> traversal?", " ".join(map(str, pre(bst([50, 30, 70, 20, 40, 60, 80])))),
  ["20 30 40 50 60 70 80", "50 70 80 60 30 40 20", "20 40 30 60 80 70 50"], "Pre-order is Root, Left, Right."),
 ("Skewed BST", "Inserting 10, 20, 30, 40 (already sorted) into an empty BST produces how many levels?", str(levels(bst([10, 20, 30, 40]))), ["2", "3", "1"],
  "Sorted input makes a right-skewed chain, one node per level. Search becomes O(n), which is why balanced trees (AVL, Red-Black) exist."),
 ("Min-heap", "Insert 5, 3, 8, 1 one by one into an empty array-based <b>min-heap</b>. What is the final array?", L(min_heap([5, 3, 8, 1])), [L([1, 3, 5, 8]), L([5, 3, 8, 1]), L([1, 5, 8, 3])],
  "Each insert goes at the end and sifts up while it's smaller than its parent. 1 rises to the root, and 5 moves down to index 3."),
 ("Bubble sort", "What is <code>[5, 1, 4, 2, 8]</code> after the FIRST pass of bubble sort (ascending)?", L(bubble_pass([5, 1, 4, 2, 8])), [L([1, 2, 4, 5, 8]), L([1, 5, 4, 2, 8]), L([5, 1, 4, 2, 8])],
  "Adjacent pairs are swapped when out of order, so the largest value (8) ends in its final place. 5 bubbles past 1, 4 and 2."),
 ("Selection sort", "What is <code>[64, 25, 12, 22, 11]</code> after the FIRST pass of selection sort?", L(selection_pass([64, 25, 12, 22, 11])), [L([11, 12, 22, 25, 64]), L([25, 12, 22, 11, 64]), L([11, 64, 25, 12, 22])],
  "The minimum (11) is found and swapped into index 0, and 64 moves to 11's old place."),
 ("Insertion sort", "What is <code>[5, 3, 4, 1, 2]</code> after TWO passes of insertion sort?", L(insertion_passes([5, 3, 4, 1, 2], 2)), [L([3, 5, 4, 1, 2]), L([1, 2, 3, 4, 5]), L([3, 4, 1, 5, 2])],
  "Pass 1 inserts 3, giving [3, 5, …]. Pass 2 inserts 4, giving [3, 4, 5, …]. The left part is always sorted."),
 ("Binary search", "How many comparisons does binary search need to find 23 in <code>[2, 5, 8, 12, 16, 23, 38, 56, 72, 91]</code>? (mid = (lo + hi) / 2)", str(bsearch_comparisons([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23)), ["1", "6", "4"],
  "mid = 4 (16 < 23), then mid = 7 (56 > 23), then mid = 5, which is 23: found in 3 comparisons."),
 ("Hashing", "Table size 7, h(k) = k mod 7, collisions resolved by linear probing. Insert 10, 17, 24. At which index does 24 end up?", str(linear_probe(7, [10, 17, 24])[24]), ["3", "4", "6"],
  "10 → 3. 17 → 3 is taken, so 4. 24 → 3 and 4 are taken, so 5."),
 ("1D address", "int A[50] has base address 1000, and an int is 4 bytes. What is the address of A[10]?", str(1000 + 10 * 4), ["1010", "1044", "1036"],
  "Address = base + index × size = 1000 + 10 × 4."),
 ("2D address", "int A[3][4] is stored row-major at base 2000, with 4-byte ints. What is the address of A[2][1]?", str(2000 + (2 * 4 + 1) * 4), ["2024", "2009", "2032"],
  "Row-major: base + (i × columns + j) × size = 2000 + (2 × 4 + 1) × 4."),
 ("Circular queue", "In a circular queue with indices 0–4 (size 5), rear = 4. After one enqueue, rear = ?", str((4 + 1) % 5), ["5", "4", "1"],
  "rear = (rear + 1) mod size. It wraps back to the start, which is the whole point of a circular queue."),
 ("Binary tree capacity", "What is the maximum number of nodes in a binary tree of height 3 (root at height 0)?", str(2 ** (3 + 1) - 1), ["8", "7", "16"],
  "2^(h+1) − 1 = 15. Level i holds at most 2^i nodes: 1 + 2 + 4 + 8."),
]

# ------------------------------------------------------------------ SQL questions (run on SQLite)
SCHEMA = """
CREATE TABLE Department(dept_id INTEGER PRIMARY KEY, dname TEXT);
INSERT INTO Department VALUES (10,'HR'),(20,'IT'),(30,'Sales'),(40,'Finance');
CREATE TABLE Employee(id INTEGER PRIMARY KEY, name TEXT, dept_id INTEGER REFERENCES Department(dept_id), salary INTEGER, manager_id INTEGER);
INSERT INTO Employee VALUES (1,'Asha',10,40000,NULL),(2,'Ravi',20,55000,1),(3,'Meena',20,62000,1),
(4,'John',30,38000,2),(5,'Priya',10,45000,2),(6,'Arjun',NULL,51000,3);
"""
SQL_Q = [
 ("SELECT COUNT(*) FROM Employee WHERE salary > 45000;", ["2", "4", "6"], "55000, 62000 and 51000. 45000 isn't strictly greater."),
 ("SELECT COUNT(dept_id) FROM Employee;", ["6", "4", "3"], "COUNT(column) skips NULLs. Arjun's dept_id is NULL. COUNT(*) would give 6."),
 ("SELECT COUNT(DISTINCT dept_id) FROM Employee;", ["4", "6", "5"], "The distinct non-NULL values are 10, 20 and 30."),
 ("SELECT COUNT(*) FROM (SELECT dept_id FROM Employee GROUP BY dept_id HAVING AVG(salary) > 50000);", ["1", "3", "0"],
  "GROUP BY puts all NULLs into ONE group of their own. The averages are 10 → 42500, 20 → 58500, 30 → 38000 and NULL (Arjun) → 51000, so two groups pass the HAVING filter."),
 ("SELECT COUNT(*) FROM Employee e JOIN Department d ON e.dept_id = d.dept_id;", ["6", "4", "24"], "An INNER JOIN keeps only matching rows: Arjun (NULL dept) and Finance (no employees) drop out."),
 ("SELECT COUNT(*) FROM Department d LEFT JOIN Employee e ON e.dept_id = d.dept_id;", ["5", "4", "10"], "Every department is kept. Finance has no match, so it appears once with NULLs: 2 + 2 + 1 + 1."),
 ("SELECT d.dname FROM Department d LEFT JOIN Employee e ON e.dept_id = d.dept_id WHERE e.id IS NULL;", ["HR", "Sales", "IT"], "LEFT JOIN + IS NULL is the classic pattern for finding rows with NO match."),
 ("SELECT e.name FROM Employee e JOIN Employee m ON e.manager_id = m.id WHERE m.name = 'Ravi' ORDER BY e.name;", ["Ravi", "Asha", "Meena, Arjun"], "A self join: the table joined with itself to find each employee's manager."),
 ("SELECT name FROM Employee WHERE salary > (SELECT AVG(salary) FROM Employee) ORDER BY name;", ["Meena", "Ravi, Meena", "Asha, John, Priya"], "The average salary is 291000 ÷ 6 = 48500. The subquery runs first."),
 ("SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);", ["62000", "51000", "45000"], "The classic second-highest salary query."),
 ("SELECT COUNT(*) FROM (SELECT dept_id FROM Employee UNION SELECT dept_id FROM Department);", ["10", "4", "6"], "UNION removes duplicates: 10, 20, 30, 40 and NULL. UNION ALL would keep all 10 rows."),
]

def run_sql():
    con = sqlite3.connect(":memory:"); con.executescript(SCHEMA)
    out = []
    for q, wrong, why in SQL_Q:
        rows = con.execute(q).fetchall()
        val = ", ".join("NULL" if r[0] is None else str(r[0]) for r in rows)
        out.append((q, val, wrong, why))
    return out

# ------------------------------------------------------------------ rendering
def render(num, qhtml, opts):
    order = list(range(4)); rng.shuffle(order); shown = [opts[i] for i in order]
    li = "".join(f"<li><b>{LET[i]}</b> {esc(o)}</li>" for i, o in enumerate(shown))
    return f'<div class="mcq"><div class="qn">{num}</div><div class="qb"><div class="qt">{qhtml}</div><ol class="opts">{li}</ol></div></div>', LET[order.index(0)]

def key_html(keys):
    rows = "".join(f"<tr><td><b>{n}</b></td><td class='ans'>{a}</td><td><code>{esc(c)}</code></td><td>{w}</td></tr>" for n, a, c, w in keys)
    return f"<table class='keyt'><thead><tr><th>Q</th><th>Ans</th><th>Correct</th><th>Why</th></tr></thead><tbody>{rows}</tbody></table>"

CONCEPT = [
 ("A program that translates the WHOLE source code into machine code before it runs is a:", ["Compiler", "Interpreter", "Assembler", "Loader"], "An interpreter translates and runs line by line. An assembler converts assembly language to machine code."),
 ("Java source code is compiled into:", ["Bytecode, run by the JVM", "Native machine code only", "Assembly language", "HTML"], "That's how Java is \"write once, run anywhere\". The JIT compiler then converts hot bytecode to native code."),
 ("The range of a signed 8-bit integer is:", ["−128 to 127", "0 to 255", "−127 to 127", "−256 to 255"], "−2⁷ to 2⁷ − 1. In general, n bits give −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1."),
 ("Where are local variables and function call frames stored?", ["Stack", "Heap", "Code segment", "Registers only"], "Dynamically allocated memory (malloc/new) lives on the heap."),
 ("Memory allocated with malloc/new that is never freed causes a:", ["Memory leak", "Dangling pointer", "Stack overflow", "Segmentation fault every time"], "A dangling pointer is one that points to memory that has already been freed."),
 ("Which structure is NON-linear?", ["Tree", "Stack", "Queue", "Linked list"], "Trees and graphs are non-linear. Arrays, linked lists, stacks and queues are linear."),
 ("Which traversal of a BST visits the keys in sorted (ascending) order?", ["In-order", "Pre-order", "Post-order", "Level-order"], "Left, Root, Right."),
 ("The time complexity of <code>for (i = n; i > 0; i = i / 2)</code> is:", ["O(log n)", "O(n)", "O(n log n)", "O(1)"], "i halves each time, so the loop runs about log₂n times."),
 ("The recurrence T(n) = 2T(n/2) + O(n) describes:", ["Merge sort, O(n log n)", "Binary search, O(log n)", "Bubble sort, O(n²)", "Linear search, O(n)"], "Binary search is T(n) = T(n/2) + O(1)."),
 ("Quick sort's WORST case, for example on already-sorted input with a bad pivot, is:", ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], "Its average case is O(n log n). Random or median pivots avoid the worst case."),
 ("Which sort works well when the data is <i>nearly sorted</i>?", ["Insertion sort", "Selection sort", "Heap sort", "Quick sort with the first element as pivot"], "Insertion sort's best case is O(n)."),
 ("A table is in 2NF but a non-key column depends on another non-key column. That violates:", ["3NF", "1NF", "2NF", "BCNF only"], "A transitive dependency breaks 3NF."),
 ("Which SQL clause filters GROUPS after aggregation?", ["HAVING", "WHERE", "ORDER BY", "GROUP BY"], "WHERE filters rows before grouping, and can't use aggregates."),
 ("'A committed transaction survives a power failure' is which ACID property?", ["Durability", "Atomicity", "Isolation", "Consistency"], "It's achieved through logs and writes to disk."),
 ("Reading data written by another transaction that later rolls back is a:", ["Dirty read", "Phantom read", "Non-repeatable read", "Deadlock"], "Isolation levels such as Read Committed prevent dirty reads."),
]

def main(base, out, work):
    os.makedirs(work, exist_ok=True)
    style = open(base).read()
    d = os.path.dirname(os.path.abspath(__file__))
    t0 = open(f"{d}/tech_0.html").read(); tech_style = t0[t0.index("<style>"):t0.index("</style>") + 8]
    doc = open(f"{d}/csf_template.html").read()
    code_q, code_k, ds_q, ds_k, sql_q, sql_k, c_q, c_k = [], [], [], [], [], [], [], []
    for i, (tag, shown, pre, body, opts, why) in enumerate(C_Q, 1):
        got = run_c(work, 100 + i, pre, body)
        assert got == opts[0], (tag, got, opts[0])
        h, a = render(f"P{i}", f"<span class='tg'>{tag}</span> What is the output? (C)<pre>{esc(shown)}</pre>", opts)
        code_q.append(h); code_k.append((f"P{i}", a, opts[0], why))
    for i, (tag, body, opts, why) in enumerate(J_Q, 1):
        got = run_java(work, 100 + i, "", "", body)
        assert got == opts[0], (tag, got, opts[0])
        n = len(C_Q) + i
        h, a = render(f"P{n}", f"<span class='tg'>{tag}</span> What is the output? (Java)<pre>{esc(body)}</pre>", opts)
        code_q.append(h); code_k.append((f"P{n}", a, opts[0], why))
    for i, (tag, q, ans, wrong, why) in enumerate(DS_Q, 1):
        assert ans not in wrong and len(set(wrong)) == 3, (tag, ans, wrong)
        h, a = render(f"D{i}", f"<span class='tg'>{tag}</span>{q}", [ans] + wrong)
        ds_q.append(h); ds_k.append((f"D{i}", a, ans, why))
    for i, (q, ans, wrong, why) in enumerate(run_sql(), 1):
        assert ans not in wrong and len(set(wrong)) == 3, (q, ans, wrong)
        h, a = render(f"Q{i}", f"<span class='tg'>SQL</span> Using the sample tables, what does this return?<pre>{esc(q)}</pre>", [ans] + wrong)
        sql_q.append(h); sql_k.append((f"Q{i}", a, ans, why))
    for i, (q, opts, why) in enumerate(CONCEPT, 1):
        h, a = render(f"T{i}", f"<span class='tg'>Concept</span>{q}", opts)
        c_q.append(h); c_k.append((f"T{i}", a, opts[0], why))
    total = len(code_k) + len(ds_k) + len(sql_k) + len(c_k)
    doc = (doc.replace("<!--BASE_STYLE-->", style + tech_style)
              .replace("<!--MCQ_CODE-->", "".join(code_q)).replace("<!--KEY_CODE-->", key_html(code_k))
              .replace("<!--MCQ_DS-->", "".join(ds_q)).replace("<!--KEY_DS-->", key_html(ds_k))
              .replace("<!--MCQ_SQL-->", "".join(sql_q)).replace("<!--MCQ_T-->", "".join(c_q))
              .replace("<!--KEY_SQLT-->", key_html(sql_k + c_k)).replace("<!--TOTAL_MCQ-->", str(total)))
    open(out, "w").write(doc)
    print(f"ok {out} | code {len(code_k)} (gcc/JDK) + DS {len(ds_k)} (computed) + SQL {len(sql_k)} (SQLite) + concept {len(c_k)} = {total}")
    print("SQL answers:", [a for _, a, _, _ in run_sql()])

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])
