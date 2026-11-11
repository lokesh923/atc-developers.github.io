"""Build the detailed MS Office & Common Applications guide (Technical Assessment, Part A).

Every Excel-output MCQ is computed here from the sample sheet with Python equivalents of the
Excel functions, then checked against the options, so the answer key cannot drift.
Usage: python3 build_office_guide.py <base_style.html> <out.html>
"""
import bisect
import datetime as dt
import html
import random
import sys
from decimal import Decimal, ROUND_HALF_UP

rng = random.Random(7)
LET = "ABCD"

# ------------------------------------------------------------------ sample sheet
SHEET = [  # row, Name, Dept, Salary, Exp
    (2, "Asha", "HR", 40000, 2), (3, "Ravi", "IT", 55000, 5), (4, "Meena", "IT", 62000, 7),
    (5, "John", "Sales", 38000, 1), (6, "Priya", "HR", 45000, 4), (7, "Arjun", "Sales", 51000, 6)]
NAME = {r: n for r, n, *_ in SHEET}; DEPT = {r: d for r, _, d, *_ in SHEET}
SAL = {r: s for r, *_, s, _ in SHEET}; EXP = {r: e for r, *_, e in SHEET}
GRADE = [(0, "F"), (40, "D"), (60, "C"), (75, "B"), (90, "A")]  # F2:G6 (sorted thresholds)

def xl_round(x, n):  # Excel rounds half away from zero
    q = Decimal(1).scaleb(-n)
    d = Decimal(str(x)).quantize(q, rounding=ROUND_HALF_UP)
    return d
def xl_mod(a, b):  # result takes the sign of the divisor (same as Python)
    return a % b
def vlookup_approx(v):
    keys = [k for k, _ in GRADE]
    return GRADE[bisect.bisect_right(keys, v) - 1][1]
def datedif_y(a, b):
    y = b.year - a.year - ((b.month, b.day) < (a.month, a.day)); return y
def median(xs):
    s = sorted(xs); n = len(s); return s[n // 2] if n % 2 else (s[n // 2 - 1] + s[n // 2]) / 2
def fmt(v):
    if isinstance(v, float) and v.is_integer(): v = int(v)
    return str(v)

rank_desc = lambda v: sorted(SAL.values(), reverse=True).index(v) + 1

EXCEL = [  # (formula, computed value, wrong options, explanation)
    ('=COUNTIF(B2:B7,"Sales")', sum(d == "Sales" for d in DEPT.values()), ["1", "3", "89000"],
     "It counts the cells in B2:B7 equal to Sales: John and Arjun."),
    ('=SUMIFS(C2:C7,B2:B7,"IT",D2:D7,">5")', sum(SAL[r] for r in SAL if DEPT[r] == "IT" and EXP[r] > 5), ["117000", "55000", "0"],
     "Both conditions must be true. Ravi has exactly 5 years, which is not >5, so only Meena's 62000 is added."),
    ('=AVERAGEIF(B2:B7,"HR",C2:C7)', sum(SAL[r] for r in SAL if DEPT[r] == "HR") // 2, ["85000", "45000", "40000"],
     "(40000 + 45000) ÷ 2."),
    ('=COUNTIF(C2:C7,">=50000")', sum(v >= 50000 for v in SAL.values()), ["2", "4", "6"],
     "55000, 62000 and 51000 are ≥ 50000."),
    ('=VLOOKUP("John",A2:D7,4,FALSE)', EXP[5], ["38000", "Sales", "#N/A"],
     "It finds John in column A and returns column 4 of the range (Exp)."),
    ('=INDEX(A2:A7,MATCH(MAX(C2:C7),C2:C7,0))', NAME[max(SAL, key=SAL.get)], ["62000", "Arjun", "4"],
     "MAX finds 62000, MATCH gives its position (3) and INDEX returns the 3rd name. This is the classic \"who has the highest\" pattern."),
    ('=LARGE(C2:C7,2)', sorted(SAL.values())[-2], ["62000", "51000", "38000"],
     "LARGE(range, 2) returns the second-highest value."),
    ('=RANK(C6,C2:C7)', rank_desc(SAL[6]), ["3", "2", "5"],
     "RANK is descending by default: 62000 is 1st, 55000 2nd, 51000 3rd and 45000 4th."),
    ('=SUMPRODUCT(C2:C3,D2:D3)', SAL[2] * EXP[2] + SAL[3] * EXP[3], ["95000", "7", "665000"],
     "40000×2 + 55000×5 = 80000 + 275000."),
    ('=IF(AND(B3="IT",D3>=5),"Senior","Junior")', "Senior" if DEPT[3] == "IT" and EXP[3] >= 5 else "Junior", ["Junior", "TRUE", "#VALUE!"],
     "Ravi is in IT and has 5 years (≥ 5), so both conditions are TRUE."),
    ('=COUNTIF(A2:A7,"A*")', sum(n.startswith("A") for n in NAME.values()), ["1", "6", "0"],
     "* is a wildcard for any characters, so this counts names starting with A: Asha and Arjun."),
    ('=LEN(A4)&"-"&UPPER(B5)', f"{len(NAME[4])}-{DEPT[5].upper()}", ["5-Sales", "Meena-SALES", "10"],
     "LEN(\"Meena\") = 5, UPPER(\"Sales\") = SALES, and & joins them."),
    ('=MEDIAN(D2:D7)', median(list(EXP.values())), ["4", "5", "25"],
     "Sorted: 1, 2, 4, 5, 6, 7. With an even count, the median is the average of the middle two: (4 + 5) ÷ 2."),
    ('=VLOOKUP(78,F2:G6,2,TRUE)', vlookup_approx(78), ["C", "A", "#N/A"],
     "Approximate match finds the largest threshold ≤ 78, which is 75, so the grade is B."),
    ('=MOD(-7,3)', xl_mod(-7, 3), ["-1", "1", "-2"],
     "Excel's MOD takes the sign of the divisor: -7 = 3 × (-3) + 2."),
    ('=ROUND(-2.5,0)', fmt(int(xl_round(-2.5, 0))), ["-2", "2", "3"],
     "Excel rounds halves away from zero, so -2.5 becomes -3."),
    ('=TRUNC(-3.7)', -3, ["-4", "-3.7", "3"],
     "TRUNC just chops off the decimals. INT(-3.7) would give -4, because INT rounds down."),
    ('=FIND("e","Excel")', "Excel".find("e") + 1, ["1", "2", "#VALUE!"],
     "FIND is case-sensitive, so it skips the capital E and finds the lowercase e at position 4. SEARCH would return 1."),
    ('=SUBSTITUTE("2024-25","-","/")', "2024-25".replace("-", "/"), ["2024-25", "2024/-25", "#NAME?"],
     "SUBSTITUTE swaps the old text for the new text."),
    ('=TEXT(0.256,"0.0%")', "25.6%", ["0.3%", "26%", "0.256"],
     "The format code 0.0% multiplies by 100 and shows one decimal place."),
    ('=DATEDIF("01-Jan-2020","15-Mar-2024","Y")', datedif_y(dt.date(2020, 1, 1), dt.date(2024, 3, 15)), ["5", "3", "50"],
     "\"Y\" counts the complete years between the two dates."),
    ('=TRUE+TRUE+FALSE', 2, ["TRUE", "#VALUE!", "1"],
     "In arithmetic, TRUE = 1 and FALSE = 0."),
    ('=-3^2', 9, ["-9", "6", "#NUM!"],
     "Excel applies negation before the power: (-3)² = 9. Write =-(3^2) to get -9."),
    ('=COUNT(A1:D7)', len(SAL) + len(EXP), ["28", "6", "24"],
     "COUNT counts only numeric cells: 6 salaries + 6 experience values. Headers and names are text."),
    ('=COUNTA(A1:A7)', 7, ["6", "1", "0"],
     "COUNTA counts every non-empty cell, including the header."),
    ('=PROPER("mS oFFICE")', "Ms Office", ["MS OFFICE", "ms office", "mS Office"],
     "PROPER capitalises the first letter of each word and lowercases the rest."),
    ('=CONCAT(LEFT(A3,3),RIGHT(A6,2))', NAME[3][:3] + NAME[6][-2:], ["RaviPriya", "Rav-ya", "Raya"],
     "LEFT(\"Ravi\", 3) = Rav and RIGHT(\"Priya\", 2) = ya."),
    ('=IFERROR(VLOOKUP("Zara",A2:D7,2,FALSE),"Not found")', "Not found", ["#N/A", "0", "Zara"],
     "Zara isn't in the list, so VLOOKUP returns #N/A, and IFERROR replaces it with the fallback text."),
]

CONCEPT = [  # Excel features, references, interface
    ("You copy <code>=$A1+B$1</code> from cell C2 to cell D3. What does D3 contain?", ["=$A2+C$1", "=$A1+B$1", "=$B2+C$2", "=$A2+B$1"],
     "$A keeps the column fixed but the row moves (1 → 2). B$1 keeps the row fixed but the column moves (B → C)."),
    ("How many rows does an Excel 2007+ worksheet have?", ["1,048,576", "65,536", "16,384", "1,000,000"],
     "1,048,576 rows × 16,384 columns (A to XFD). 65,536 was the old .xls limit."),
    ("Which file extension saves an Excel workbook WITH macros?", [".xlsm", ".xlsx", ".csv", ".xltx"],
     ".xlsx can't store macros. .xltx is a template and .csv is plain text with only one sheet."),
    ("Which shortcut shows the formulas in cells instead of their results?", ["Ctrl + `", "Ctrl + F3", "F9", "Ctrl + Shift + F"],
     "Ctrl + ` (the grave accent) toggles formula view."),
    ("You want rows 1–3 to stay visible while you scroll down. Use:", ["Freeze Panes", "Split", "Wrap Text", "Group"],
     "View → Freeze Panes."),
    ("Which tool finds the INPUT value needed to reach a target result?", ["Goal Seek", "Pivot Table", "Flash Fill", "Data Validation"],
     "Data → What-If Analysis → Goal Seek."),
    ("Which feature restricts a cell to values from a drop-down list?", ["Data Validation", "Conditional Formatting", "AutoFilter", "Protect Sheet"],
     "Data Validation → Allow: List."),
    ("To summarise sales by region and month without writing formulas, use a:", ["Pivot Table", "Sparkline", "Macro", "Hyperlink"],
     "A pivot table drags fields into Rows, Columns, Values and Filters."),
    ("A cell displays ##### . The most likely reason is:", ["The column is too narrow", "Division by zero", "Invalid reference", "Misspelt function"],
     "Widen the column. It isn't a real error."),
    ("Which function is case-INSENSITIVE and supports wildcards?", ["SEARCH", "FIND", "EXACT", "MID"],
     "FIND is case-sensitive and doesn't support wildcards."),
    ("A formula refers to its own cell, directly or indirectly. Excel reports a:", ["Circular reference", "#REF! error", "#SPILL! error", "Volatile function"],
     "Formulas → Error Checking → Circular References."),
    ("Which chart best shows parts of a whole (100%)?", ["Pie chart", "Line chart", "Scatter chart", "Histogram"],
     "A line chart shows trends over time, and a scatter chart shows relationships."),
]
WORD = [
    ("Which break lets ONE page of a document be landscape while the rest stay portrait?", ["Section break (Next Page)", "Page break", "Column break", "Text wrapping break"],
     "Orientation, margins, headers and footers can differ by section."),
    ("An automatic Table of Contents is built from:", ["Heading styles (Heading 1, 2, 3…)", "Bold text", "Bookmarks only", "Footnotes"],
     "References → Table of Contents reads the heading styles."),
    ("Notes that appear at the bottom of the SAME page are:", ["Footnotes", "Endnotes", "Comments", "Captions"],
     "Endnotes appear at the end of the document or section."),
    ("Which shortcut cycles selected text between UPPER, lower and Title case?", ["Shift + F3", "Ctrl + F3", "Alt + F3", "Ctrl + Shift + A"],
     "Ctrl + Shift + A applies All Caps formatting, which is a different feature."),
    ("Copying only the FORMATTING of text to other text is done with:", ["Format Painter", "Paste Special → Text", "Styles Pane", "Clear Formatting"],
     "Single-click applies it once, and double-click keeps it on."),
    ("Which tab contains Mail Merge?", ["Mailings", "References", "Review", "Insert"],
     "Mailings → Start Mail Merge → Select Recipients → Insert Merge Field → Finish & Merge."),
    ("Which feature records every edit so a reviewer can accept or reject it?", ["Track Changes", "Compare", "Protect Document", "Version History"],
     "Review → Track Changes."),
    ("In a Word table, which formula adds the numbers in the cells above?", ["=SUM(ABOVE)", "=SUM(UP)", "=TOTAL(COLUMN)", "=ADD(ABOVE)"],
     "Layout → Formula. LEFT, RIGHT and BELOW also work."),
    ("Which shortcut sets double line spacing?", ["Ctrl + 2", "Ctrl + D", "Ctrl + Shift + 2", "Alt + 2"],
     "Ctrl + 1 = single, Ctrl + 5 = 1.5, Ctrl + 2 = double."),
]
PPT = [
    ("You need the same logo on every slide. The best place to add it is:", ["Slide Master", "Each slide individually", "Notes Master", "Handout Master"],
     "View → Slide Master. Every slide based on it inherits the logo."),
    ("During a slideshow, which key turns the screen black?", ["B", "W", "Esc", "K"],
     "Press it again to return. W gives a white screen."),
    ("An effect applied when moving FROM one slide TO the next is a:", ["Transition", "Animation", "Trigger", "Motion path"],
     "Animations apply to objects within a slide: entrance, emphasis, exit and motion paths."),
    ("Which file format opens a presentation directly in slideshow mode?", [".ppsx", ".pptx", ".potx", ".pptm"],
     ".potx is a template and .pptm contains macros."),
    ("Which view is best for re-ordering many slides at once?", ["Slide Sorter", "Reading View", "Notes Page", "Outline only"],
     "It shows thumbnails that you can drag."),
    ("Which feature practises the talk and saves how long each slide is shown?", ["Rehearse Timings", "Record Narration only", "Hide Slide", "Slide Master"],
     "Slide Show → Rehearse Timings."),
]
COMMON = [
    ("Recipients in which field are HIDDEN from all other recipients?", ["BCC", "CC", "To", "Reply-To"],
     "Use BCC for large mailing lists to protect everyone's addresses."),
    ("Which shortcut opens Task Manager directly in Windows?", ["Ctrl + Shift + Esc", "Ctrl + Alt + T", "Win + T", "Alt + F4"],
     "Ctrl + Alt + Del opens a menu that includes Task Manager."),
    ("Which shortcut locks a Windows PC immediately?", ["Win + L", "Win + D", "Ctrl + L", "Alt + L"],
     "Win + D shows the desktop."),
    ("A .csv file stores:", ["Plain-text values separated by commas (one sheet, no formatting)", "Formulas and charts", "Macros", "Images"],
     "CSV is universal but keeps only the data."),
    ("Which shortcut takes a screenshot of a selected area in Windows 10/11?", ["Win + Shift + S", "Ctrl + PrtSc", "Alt + S", "Win + P"],
     "It opens the snipping toolbar. Win + P is for projector or display settings."),
]

def esc(s):
    return html.escape(s, quote=False)

def render_mcq(num, qhtml, opts_correct_first):
    order = list(range(len(opts_correct_first))); rng.shuffle(order)
    shown = [opts_correct_first[i] for i in order]
    ans = LET[order.index(0)]
    li = "".join(f"<li><b>{LET[i]}</b> {o}</li>" for i, o in enumerate(shown))
    return (f'<div class="mcq"><div class="qn">{num}</div><div class="qb"><div class="qt">{qhtml}</div>'
            f'<ol class="opts">{li}</ol></div></div>'), ans, opts_correct_first[0]

def bank(prefix, items, tag):
    qs, keys = [], []
    for i, (q, opts, why) in enumerate(items, 1):
        h, a, c = render_mcq(f"{prefix}{i}", f"<span class='tg'>{tag}</span>{q}", opts)
        qs.append(h); keys.append((f"{prefix}{i}", a, c, why))
    return "".join(qs), keys

def excel_bank():
    qs, keys = [], []
    for i, (f, v, wrong, why) in enumerate(EXCEL, 1):
        v = fmt(v)
        assert v not in wrong and len(set(wrong)) == 3, (f, v, wrong)
        h, a, c = render_mcq(f"E{i}", f"<span class='tg'>Output</span>What does <code>{esc(f)}</code> return?", [v] + wrong)
        qs.append(h); keys.append((f"E{i}", a, c, why))
    return "".join(qs), keys

def key_html(keys):
    rows = "".join(f"<tr><td><b>{n}</b></td><td class='ans'>{a}</td><td>{esc(c) if '<' not in c else c}</td><td>{w}</td></tr>" for n, a, c, w in keys)
    return f"<table class='keyt'><thead><tr><th>Q</th><th>Ans</th><th>Correct option</th><th>Why</th></tr></thead><tbody>{rows}</tbody></table>"

def main(base, out):
    style = open(base).read()
    d = __file__.rsplit("/", 1)[0]
    t0 = open(f"{d}/tech_0.html").read()
    tech_style = t0[t0.index("<style>"):t0.index("</style>") + 8]
    doc = open(f"{d}/office_template.html").read()
    eq, ek = excel_bank()
    cq, ck = bank("X", CONCEPT, "Excel")
    wq, wk = bank("W", WORD, "Word")
    pq, pk = bank("P", PPT, "PowerPoint")
    oq, ok = bank("O", COMMON, "Common apps")
    total = len(ek) + len(ck) + len(wk) + len(pk) + len(ok)
    doc = (doc.replace("<!--BASE_STYLE-->", style + tech_style)
              .replace("<!--MCQ_E-->", eq).replace("<!--MCQ_X-->", cq).replace("<!--MCQ_W-->", wq)
              .replace("<!--MCQ_P-->", pq).replace("<!--MCQ_O-->", oq)
              .replace("<!--KEY_E-->", key_html(ek)).replace("<!--KEY_REST-->", key_html(ck + wk + pk + ok))
              .replace("<!--TOTAL_MCQ-->", str(total)))
    open(out, "w").write(doc)
    print("ok", out, "| MCQs:", total, "| excel answers:", [fmt(e[1]) for e in EXCEL])

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
