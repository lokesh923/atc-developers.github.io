"""Build the Coding Assessment (DSA + SQL + Front-end) zero-to-hero guide.

Everything shown as output is produced by execution:
  * 21 DSA problems: Java + Python programs run on every test case (verify_programs.py)
  * stdin templates and C++ versions: compiled and run with javac / python3 / g++
  * SQL patterns: executed on an in-memory SQLite database; the result tables are the real output
  * front-end snippets: taken from the reference solutions of the Front-end practice platform (tested there)
Usage: python3 build_coding_guide.py <base_style.html> <out.html> <workdir>
"""
import html
import os
import re
import sqlite3
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from coding_problems import P  # noqa: E402
from verify_programs import verify  # noqa: E402

# ------------------------------------------------------------------ syntax highlighting
KW = {
    "java": set("""abstract boolean break case catch char class continue default do double else extends final for if
        implements import int long new private public return static String void while true false null var this throws
        throw try Scanner StringBuilder List ArrayList Map HashMap Arrays Math Integer Long Character System
        Collections HashSet Set""".split()),
    "py": set("""def return if elif else for while in not and or import from as print True False None lambda class
        break continue with yield is pass input int str list map sorted len range enumerate sum max min set dict""".split()),
    "cpp": set("""int long auto for while if else return using namespace std vector string cout cin endl bool true false
        const void main unordered_map sort include ios sync_with_stdio nullptr""".split()),
    "cs": set("""using class static void int long string var for foreach while if else return new Console ReadLine
        WriteLine Split Select Parse public true false List Dictionary""".split()),
    "sql": set("""SELECT FROM WHERE JOIN LEFT RIGHT INNER FULL OUTER ON GROUP BY HAVING ORDER DESC ASC AS COUNT SUM AVG
        MAX MIN DISTINCT LIMIT OFFSET AND OR NOT IN IS NULL LIKE BETWEEN CASE WHEN THEN ELSE END EXISTS""".split()),
    "js": set("""const let var function return if else for of in new true false null class import export default from
        document addEventListener querySelector querySelectorAll getElementById classList useState createApp""".split()),
}
TOK = re.compile(r'(?P<c>/\*.*?\*/|//[^\n]*|--[^\n]*|#[^\n]*|<!--.*?-->)|(?P<s>"(?:\\.|[^"\\\n])*"|\'(?:\\.|[^\'\\\n])*\'|`[^`]*`)'
                 r'|(?P<n>\b\d+(?:\.\d+)?\b)|(?P<w>[A-Za-z_][A-Za-z_0-9]*)|(?P<o>.)', re.S)


def hl(code, lang):
    out = []
    for m in TOK.finditer(code):
        kind, text = m.lastgroup, m.group()
        if kind == "c":
            ok = (text.startswith("/*") and lang in ("java", "cpp", "cs", "js", "css")) or \
                 (text.startswith("//") and lang in ("java", "cpp", "cs", "js")) or \
                 (text.startswith("--") and lang == "sql") or (text.startswith("<!--") and lang == "html") or \
                 (text.startswith("#") and lang == "py")
            if text.startswith("#") and lang == "cpp":
                out.append('<span class="k">' + html.escape(text) + "</span>")
                continue
            if not ok:  # not a comment in this language: tokenise again without the comment rule
                out.append(hl_plain(text, lang))
                continue
            out.append('<span class="c">' + html.escape(text) + "</span>")
        elif kind == "s":
            out.append('<span class="s">' + html.escape(text) + "</span>")
        elif kind == "n":
            out.append('<span class="n">' + text + "</span>")
        elif kind == "w":
            out.append('<span class="k">' + text + "</span>" if text in KW.get(lang, ()) else html.escape(text))
        else:
            out.append(html.escape(text))
    return "".join(out)


def hl_plain(text, lang):
    head, rest = text[0], text[1:]
    return html.escape(head) + (hl(rest, lang) if rest else "")


def pre(code, lang, cls=""):
    return f'<pre class="{cls}"><code>{hl(code.strip(chr(10)), lang)}</code></pre>'


# ------------------------------------------------------------------ DSA problems
def problem_html(no, p):
    ex = p["tests"][:2]
    ex_rows = "".join(f'<tr><td><pre class="io">{html.escape(i.rstrip())}</pre></td><td><pre class="io">{html.escape(o)}</pre></td></tr>'
                      for i, o in ex)
    steps = "".join(f"<li>{s}</li>" for s in p["approach"])
    lvl = p["level"]
    return f'''
<div class="prob">
  <div class="phead"><span class="pno">P{no}</span><h3>{p["title"]}</h3><span class="chip {lvl.lower()}">{lvl}</span><span class="chip t">{p["topic"]}</span></div>
  <div class="pgrid">
    <div>
      <p class="pst">{p["statement"]}</p>
      <p class="pfmt"><b>Input:</b> {p["fmt"]}</p>
      <table class="iot"><thead><tr><th>Sample input</th><th>Output</th></tr></thead><tbody>{ex_rows}</tbody></table>
    </div>
    <div>
      <div class="apr"><b class="t">Approach</b><ol>{steps}</ol></div>
      <div class="cx"><span>Time <b>{p["time"]}</b></span><span>Space <b>{p["space"]}</b></span><span class="vf">&#10003; {len(p["tests"])} tests passed (Java + Python)</span></div>
    </div>
  </div>
  <div class="trap2"><b>Trap:</b> {p["trap"]}</div>
  <div class="code2"><div><div class="lang">Java</div>{pre(p["java"], "java")}</div><div><div class="lang">Python</div>{pre(p["py"], "py")}</div></div>
</div>'''


def problems_by_topic(topics, start):
    blocks, n = [], start
    for p in P:
        if p["topic"] in topics:
            blocks.append(problem_html(n, p))
            n += 1
    return "".join(blocks), n


# ------------------------------------------------------------------ stdin templates (verified)
IO = {
    "java": ('''import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(br.readLine().trim());           // line 1: N
        StringTokenizer st = new StringTokenizer(br.readLine());   // line 2: N numbers
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = Integer.parseInt(st.nextToken());
        String word = br.readLine().trim();                        // line 3: a string
        long sum = 0;
        for (int x : a) sum += x;
        System.out.println(sum + " " + word.length());
    }
}''', ["javac Main.java", "java -cp . Main"]),
    "py": ('''import sys
data = sys.stdin.read().split()      # all tokens at once (fast)
n = int(data[0])                     # line 1: N
a = list(map(int, data[1:1 + n]))    # line 2: N numbers
word = data[1 + n]                   # line 3: a string
print(sum(a), len(word))''', None),
    "cpp": ('''#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;                          // line 1: N
    vector<long long> a(n);
    for (auto &x : a) cin >> x;        // line 2: N numbers
    string word;
    cin >> word;                       // line 3: a string
    long long sum = 0;
    for (auto x : a) sum += x;
    cout << sum << " " << word.size() << endl;
    return 0;
}''', None),
    "cs": ('''using System;
using System.Linq;

class Program {
    static void Main() {
        int n = int.Parse(Console.ReadLine().Trim());               // line 1: N
        long[] a = Console.ReadLine().Split(' ', StringSplitOptions.RemoveEmptyEntries)
                          .Select(long.Parse).ToArray();           // line 2: N numbers
        string word = Console.ReadLine().Trim();                    // line 3: a string
        Console.WriteLine(a.Sum() + " " + word.Length);
    }
}''', None),
}
IO_INPUT, IO_EXPECT = "5\n3 1 4 1 5\nhello\n", "14 5"

CPP_EXTRA = {
    "Two Sum (P9) in C++": ('''#include <bits/stdc++.h>
using namespace std;

int main() {
    int n; long long t;
    cin >> n >> t;
    unordered_map<long long, int> seen;          // value -> index
    for (int j = 0; j < n; j++) {
        long long x; cin >> x;
        auto it = seen.find(t - x);
        if (it != seen.end()) { cout << it->second << " " << j << endl; return 0; }
        seen[x] = j;
    }
    return 0;
}''', "4 9\n2 7 11 15\n", "0 1"),
    "Kadane (P2) in C++": ('''#include <bits/stdc++.h>
using namespace std;

int main() {
    int n; cin >> n;
    long long cur, best;
    cin >> cur; best = cur;
    for (int i = 1; i < n; i++) {
        long long x; cin >> x;
        cur = max(x, cur + x);
        best = max(best, cur);
    }
    cout << best << endl;
    return 0;
}''', "9\n-2 1 -3 4 -1 2 1 -5 4\n", "6"),
}


def check_io_and_cpp(work):
    d = os.path.join(work, "io")
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "Main.java"), "w").write(IO["java"][0])
    subprocess.run(["javac", "Main.java"], cwd=d, check=True, capture_output=True)
    outs = {"java": subprocess.run(["java", "-cp", ".", "Main"], input=IO_INPUT, capture_output=True, text=True, cwd=d).stdout.strip()}
    open(os.path.join(d, "t.py"), "w").write(IO["py"][0])
    outs["py"] = subprocess.run([sys.executable, "t.py"], input=IO_INPUT, capture_output=True, text=True, cwd=d).stdout.strip()

    def cpp(src, stdin, name):
        open(os.path.join(d, name + ".cpp"), "w").write(src)
        subprocess.run(["g++", "-O2", "-o", name, name + ".cpp"], cwd=d, check=True, capture_output=True)
        return subprocess.run(["./" + name], input=stdin, capture_output=True, text=True, cwd=d).stdout.strip()
    outs["cpp"] = cpp(IO["cpp"][0], IO_INPUT, "io")
    for lang in ("java", "py", "cpp"):
        assert outs[lang] == IO_EXPECT, (lang, outs[lang])
    for i, (title, (src, stdin, exp)) in enumerate(CPP_EXTRA.items()):
        got = cpp(src, stdin, f"x{i}")
        assert got == exp, (title, got)
    print("stdin templates (Java, Python, C++) and C++ examples verified")


def io_html():
    blk = lambda lang, label: f'<div><div class="lang">{label}</div>{pre(IO[lang][0], lang)}</div>'
    return (f'<div class="code2">{blk("java", "Java — BufferedReader (fast)")}{blk("py", "Python — read everything at once")}</div>'
            f'<div class="code2">{blk("cpp", "C++ — cin with fast I/O")}{blk("cs", "C# — Console.ReadLine + Split")}</div>'
            f'<p class="small">Sample input <code>5 / 3 1 4 1 5 / hello</code> → output <b>{IO_EXPECT}</b> (sum of the numbers and the length of the word). '
            'The Java, Python and C++ templates were compiled and run on this input; the C# template follows the same steps but was not executed for this guide.</p>')


def cpp_html():
    return '<div class="code2">' + "".join(
        f'<div><div class="lang">{t}</div>{pre(src, "cpp")}<p class="small">Input <code>{html.escape(stdin.strip().replace(chr(10), " / "))}</code> → <b>{exp}</b> (compiled with g++ and run)</p></div>'
        for t, (src, stdin, exp) in CPP_EXTRA.items()) + "</div>"


# ------------------------------------------------------------------ SQL
SQL_SCHEMA = """
CREATE TABLE departments (dept_id INTEGER PRIMARY KEY, dept_name TEXT);
CREATE TABLE employees (emp_id INTEGER PRIMARY KEY, name TEXT, dept_id INTEGER, salary INTEGER, manager_id INTEGER);
INSERT INTO departments VALUES (1,'Engineering'),(2,'Sales'),(3,'HR'),(4,'Finance');
INSERT INTO employees VALUES
 (101,'Asha',1,90000,NULL),(102,'Ravi',1,72000,101),(103,'Meena',1,72000,101),(104,'John',2,48000,101),
 (105,'Priya',2,56000,104),(106,'Kiran',3,39000,101),(107,'Arjun',NULL,61000,102),(108,'Sara',2,48000,104);
"""
SQL_PATTERNS = [
    ("Filter and sort", "Employees earning more than 50000, highest first; ties by name.",
     "SELECT name, salary\nFROM employees\nWHERE salary > 50000\nORDER BY salary DESC, name;"),
    ("INNER JOIN", "Each employee with their department name. Arjun has no department, so INNER JOIN drops him.",
     "SELECT e.name, d.dept_name\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.dept_id\nORDER BY e.name;"),
    ("LEFT JOIN + COUNT(column)", "Every department with its head-count, including departments with nobody (Finance shows 0).",
     "SELECT d.dept_name, COUNT(e.emp_id) AS total\nFROM departments d\nLEFT JOIN employees e ON e.dept_id = d.dept_id\n"
     "GROUP BY d.dept_id, d.dept_name\nORDER BY total DESC, d.dept_name;"),
    ("GROUP BY + HAVING", "Departments whose average salary is above 50000.",
     "SELECT d.dept_name, ROUND(AVG(e.salary), 2) AS avg_salary\nFROM employees e\nJOIN departments d ON e.dept_id = d.dept_id\n"
     "GROUP BY d.dept_name\nHAVING AVG(e.salary) > 50000\nORDER BY avg_salary DESC;"),
    ("SELF JOIN", "Each employee with their manager's name (LEFT JOIN keeps Asha, who has no manager).",
     "SELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.emp_id\nORDER BY e.emp_id;"),
    ("Second highest salary", "Use a subquery so ties at the top are handled (two people earn 72000).",
     "SELECT MAX(salary) AS second_highest\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);"),
    ("Top earner per department", "A correlated subquery keeps everyone who earns their department's maximum.",
     "SELECT d.dept_name, e.name, e.salary\nFROM employees e\nJOIN departments d ON e.dept_id = d.dept_id\n"
     "WHERE e.salary = (SELECT MAX(x.salary) FROM employees x WHERE x.dept_id = e.dept_id)\nORDER BY d.dept_name;"),
    ("RIGHT JOIN / anti-join", "Departments with no employees: RIGHT JOIN keeps every department, then keep the unmatched ones.",
     "SELECT d.dept_name\nFROM employees e\nRIGHT JOIN departments d ON e.dept_id = d.dept_id\nWHERE e.emp_id IS NULL;"),
    ("DISTINCT + LIMIT", "The three highest distinct salaries.",
     "SELECT DISTINCT salary\nFROM employees\nORDER BY salary DESC\nLIMIT 3;"),
    ("Duplicates", "Salaries shared by more than one employee.",
     "SELECT salary, COUNT(*) AS people\nFROM employees\nGROUP BY salary\nHAVING COUNT(*) > 1\nORDER BY salary;"),
]


def table_html(cols, rows, cls="g"):
    head = "".join(f"<th>{html.escape(str(c))}</th>" for c in cols)
    body = "".join("<tr>" + "".join(f'<td{" class=nul" if v is None else ""}>{"NULL" if v is None else html.escape(str(v))}</td>' for v in r) + "</tr>" for r in rows)
    return f'<table class="{cls}"><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>'


def sql_html():
    con = sqlite3.connect(":memory:")
    con.executescript(SQL_SCHEMA)
    base = []
    for t in ("employees", "departments"):
        cur = con.execute(f"SELECT * FROM {t}")
        base.append(f'<div><div class="lang">{t}</div>{table_html([d[0] for d in cur.description], cur.fetchall())}</div>')
    sample = '<div class="code2 tables">' + "".join(base) + "</div>"
    out = []
    for i, (title, desc, q) in enumerate(SQL_PATTERNS, 1):
        cur = con.execute(q)
        res = table_html([d[0] for d in cur.description], cur.fetchall())
        out.append(f'<div class="sqlp"><div class="phead"><span class="pno">S{i}</span><h3>{title}</h3></div><p class="small">{desc}</p>'
                   f'<div class="sqlgrid"><div>{pre(q, "sql")}</div><div><div class="lang">Real output</div>{res}</div></div></div>')
    return sample, "".join(out)


# ------------------------------------------------------------------ front-end snippets (from tested practice solutions)
FE = {
    "dom": ('''// 1. select  2. listen  3. change the DOM
const btn = document.querySelector("#btn");
const p = document.getElementById("p");

btn.addEventListener("click", () => {
    p.className = "change";          // replace all classes
    // p.classList.add("change");    // add one class
    // p.classList.toggle("open");   // add if missing, remove if present
});''', "js"),
    "create": ('''function addTask() {
    const text = input.value.trim();
    if (!text) return;                       // ignore blank input
    const li = document.createElement("li");
    li.innerHTML = `<span></span><button class="delete">Delete</button>`;
    li.querySelector("span").textContent = text;   // textContent = safe text
    li.querySelector(".delete").addEventListener("click", () => {
        li.remove();                         // removes it from the page
        updateCount();
    });
    list.appendChild(li);
    input.value = "";
    updateCount();
}
input.addEventListener("keydown", e => { if (e.key === "Enter") addTask(); });''', "js"),
    "form": ('''const pattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

function validate() {
    const ok = pattern.test(email.value);
    emailError.textContent = email.value && !ok ? "Invalid email" : "";
    submitBtn.disabled = !(ok && password.value.length >= 8);
}
email.addEventListener("input", validate);
password.addEventListener("input", validate);

form.addEventListener("submit", e => {
    e.preventDefault();                      // stop the page reload
    success.textContent = "Registered!";
});''', "js"),
    "filter": ('''function filterProducts() {
    const term = search.value.toLowerCase();
    document.querySelectorAll(".product").forEach(item => {
        const name = item.dataset.name.toLowerCase();   // data-name attribute
        item.style.display = name.includes(term) ? "" : "none";
    });
}
search.value = "nana";
filterProducts();                            // run once on load
search.addEventListener("input", filterProducts);''', "js"),
    "react": ('''import React, { useState } from "react";

const products = ["Laptop", "Mouse", "Keyboard", "Monitor"];

function App() {
    const [query, setQuery] = useState("");                 // state
    const visible = products.filter(p =>
        p.toLowerCase().includes(query.toLowerCase()));      // derived value

    return (
        <div>
            <input id="search" value={query}
                   onChange={e => setQuery(e.target.value)} />   {/* controlled */}
            <p id="total">Showing {visible.length} of {products.length}</p>
            {visible.length === 0
                ? <p id="empty">No products found</p>           // conditional
                : <ul>{visible.map(p =>
                      <li className="item" key={p}>{p}</li>)}</ul>}  {/* list + key */}
        </div>
    );
}
export default App;''', "js"),
    "vue_html": ('''<div id="app">
    <input id="newTodo" v-model="newTodo">
    <button id="add" @click="addTodo">Add</button>
    <ul>
        <li v-for="todo in todos" :key="todo.id"
            class="todo" :class="{ done: todo.done }">
            <input type="checkbox" v-model="todo.done">
            <span>{{ todo.text }}</span>
        </li>
    </ul>
    <p id="remaining">{{ remaining }} left</p>
    <p v-if="todos.length === 0">Nothing to do!</p>
</div>''', "html"),
    "vue_js": ('''const { createApp } = Vue;

createApp({
    data() {
        return { newTodo: "", nextId: 2,
                 todos: [{ id: 1, text: "Learn Vue", done: false }] };
    },
    computed: {
        remaining() { return this.todos.filter(t => !t.done).length; }
    },
    methods: {
        addTodo() {
            const text = this.newTodo.trim();
            if (!text) return;
            this.todos.push({ id: this.nextId++, text, done: false });
            this.newTodo = "";
        }
    }
}).mount("#app");''', "js"),
    "css": ('''.container {
    display: flex;                    /* children in a row */
    justify-content: space-between;   /* main axis spacing */
    align-items: center;              /* cross axis alignment */
    gap: 20px;
}
.card { border-radius: 8px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,.1); }
.card h2 { color: #333333; font-size: 20px; }
.tab.active { background-color: #1d4ed8; color: white; }   /* two classes */
.hidden { display: none; }
@media (max-width: 600px) {
    .container { flex-direction: column; }                  /* stack on phones */
}''', "css"),
}


def fe_code(name):
    src, lang = FE[name]
    return pre(src, lang if lang != "css" else "css")


# ------------------------------------------------------------------ assemble
def main(base, out, work):
    bad = verify(os.path.join(work, "progs"))
    assert bad == 0, "a DSA program failed its tests"
    check_io_and_cpp(work)
    t = open(os.path.join(HERE, "coding_template.html"), encoding="utf-8").read()
    style = open(base, encoding="utf-8").read()
    t0 = open(os.path.join(HERE, "..", "technical", "tech_0.html"), encoding="utf-8").read()
    style += "\n<style>" + t0.split("<style>")[1].split("</style>")[0] + "</style>"
    sample, patterns = sql_html()
    parts = {"BASE_STYLE": style, "IO_TEMPLATES": io_html(), "CPP_EXTRA": cpp_html(), "SQL_SAMPLE": sample,
             "SQL_PATTERNS": patterns, "TOTAL_PROBLEMS": str(len(P))}
    n = 1
    for key, topics in (("P_ARRAYS", ["Arrays"]), ("P_STRINGS", ["Strings"]), ("P_HASHING", ["Hashing"]),
                        ("P_TWOPTR", ["Two Pointers", "Sliding Window"]), ("P_SORTING", ["Sorting"]),
                        ("P_RECURSION", ["Recursion"]), ("P_NUMBERS", ["Number Logic"])):
        parts[key], n = problems_by_topic(topics, n)
    assert n - 1 == len(P), "a problem has an unknown topic"
    for k in FE:
        parts["FE_" + k.upper()] = fe_code(k)
    for k, v in parts.items():
        token = f"<!--{k}-->"
        assert token in t, token
        t = t.replace(token, v)
    left = re.findall(r"<!--[A-Z_]+-->", t)
    assert not left, left
    open(out, "w", encoding="utf-8").write(t)
    print("wrote", out)


if __name__ == "__main__":
    main(*sys.argv[1:4])
