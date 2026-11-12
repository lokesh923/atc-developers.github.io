"""Build MS Office & Common Applications mock tests in Graphy Word format (scenario-based MCQs).

Usage: python3 build_office_mock.py ../pseudocode/template8.docx <mock no> <out.docx>
Images (img/m<N>/qNN.png) are drawn by render_images.js. Formula answers were checked by
recalculating the same sheet in LibreOffice (see verify_formulas in this file).
"""
import os
import sys

import docx
from docx.shared import Inches

HERE = os.path.dirname(os.path.abspath(__file__))
SUBJECT = "Technical Assessment"
TOPIC = "MS Office & Common Applications"

# (app, question, image file or None, image width, options, right option, explanation, difficulty)
MOCK_1 = [
    ("Excel",
     "Neha manages the regional sales sheet shown below. She enters the formula displayed in the formula bar "
     "into cell E2. What value will cell E2 show?",
     "q1.png", 5.2, ["2150", "2", "1850", "4600"], 3,
     "SUMIFS adds the Sales values (C2:C7) only for rows where BOTH conditions are true: Region is \"North\" "
     "AND Sales is greater than 500. North rows are 1200, 650 and 300; only 1200 and 650 are above 500, so "
     "1200 + 650 = 1850. 2150 ignores the second condition (that is SUMIF), 2 is the count (COUNTIFS), and "
     "4600 is the total of all sales.", "Medium"),
    ("Excel",
     "Arjun is reviewing an Excel sheet with 2,000 rows of employee records. When he scrolls down, the column "
     "headings in row 1 disappear and he loses track of which column is which. Which option keeps row 1 visible "
     "while he scrolls?",
     None, 0, ["Click on the \"Data\" tab, then choose \"Filter\"",
               "Click on the \"View\" tab, then choose \"Freeze Panes\" > \"Freeze Top Row\"",
               "Click on the \"Page Layout\" tab, then choose \"Print Titles\"",
               "Click on the \"Home\" tab, then choose \"Format\" > \"Hide Rows\""], 2,
     "Freeze Panes (View tab) locks rows or columns on screen while the rest of the sheet scrolls; "
     "Freeze Top Row keeps row 1 visible. Print Titles repeats rows only on printed pages, and Filter adds "
     "drop-down arrows but does not lock the row.", "Easy"),
    ("Word",
     "The HR team has to send the same offer letter to 200 selected candidates. Each letter must show the "
     "candidate's own name, address and joining date, which are stored in an Excel sheet. What is the most "
     "efficient way to create these letters in MS Word?",
     None, 0, ["Click on the \"Review\" tab, then choose \"Track Changes\" and edit each letter",
               "Click on the \"Insert\" tab, then choose \"Quick Parts\" > \"Field\" for every candidate",
               "Click on the \"References\" tab, then choose \"Insert Citation\"",
               "Click on the \"Mailings\" tab, then use \"Start Mail Merge\" with the Excel sheet as the recipient list"], 4,
     "Mail Merge (Mailings tab) combines one main document with a data source such as an Excel sheet. You insert "
     "merge fields (Name, Address, Joining Date) once, and Word generates one personalised letter per row.",
     "Easy"),
    ("Word",
     "Kiran is writing a 60-page project report. All chapter titles use the built-in \"Heading 1\" style and "
     "sub-topics use \"Heading 2\". She wants a contents page that lists these headings with page numbers and "
     "can be refreshed when pages change. What should she do?",
     None, 0, ["Click on the \"References\" tab, then choose \"Table of Contents\" and pick an automatic style",
               "Click on the \"Insert\" tab, then choose \"Table\" and type the headings and page numbers",
               "Click on the \"Layout\" tab, then choose \"Breaks\" > \"Section Break\"",
               "Click on the \"Insert\" tab, then choose \"Bookmark\" for every heading"], 1,
     "An automatic Table of Contents (References tab) is built from Heading styles and shows page numbers. "
     "When the document changes, Update Table refreshes it. A manually typed table would not update.",
     "Medium"),
    ("PowerPoint",
     "Rohan has a 30-slide company presentation. He needs the company logo to appear in the same corner of every "
     "slide, including slides he adds later, without pasting it 30 times. What should he do?",
     None, 0, ["Click on the \"Insert\" tab, then choose \"Header & Footer\" and select \"Slide number\"",
               "Click on the \"View\" tab, choose \"Slide Master\", and insert the logo on the master slide",
               "Click on the \"Design\" tab, then choose \"Format Background\" > \"Apply to All\"",
               "Click on the \"Home\" tab, then choose \"Layout\" for each slide"], 2,
     "The Slide Master controls the shared look of all slides. Anything placed on the master (logo, fonts, "
     "colours) appears on every slide based on it, including new ones. Header & Footer only adds text such as "
     "slide numbers, dates and footers.", "Medium"),
    ("PowerPoint",
     "Priya wants a \"Fade\" effect to play every time the presentation moves from one slide to the next. "
     "Which option should she use?",
     None, 0, ["Click on the \"Animations\" tab, then choose \"Fade\" for each object",
               "Click on the \"Slide Show\" tab, then choose \"Rehearse Timings\"",
               "Click on the \"Design\" tab, then choose \"Variants\"",
               "Click on the \"Transitions\" tab, choose \"Fade\", then click \"Apply To All\""], 4,
     "Transitions control the effect between slides; Apply To All uses it for every slide. Animations apply "
     "to individual objects (text, images) on a slide, not to the change from one slide to the next.",
     "Easy"),
    ("Outlook",
     "Vikram has finished writing an important email to a client at 11 p.m. but wants it to be delivered at "
     "9 a.m. the next morning, without staying online. Which Outlook feature should he use?",
     None, 0, ["Click on \"Options\", then choose \"Request a Read Receipt\"",
               "Click on \"Insert\", then choose \"Signature\"",
               "Click on \"Options\", then choose \"Delay Delivery\" and set the time",
               "Click on \"Message\", then choose \"Follow Up\" > \"Tomorrow\""], 3,
     "Delay Delivery (Options > More Options > Delay Delivery, or Schedule Send in new Outlook) keeps the "
     "email in the Outbox until the chosen date and time. A Follow Up flag only reminds you; it does not "
     "send anything.", "Medium"),
]

MOCKS = {1: MOCK_1}


def build(template, mock_no, out):
    d = docx.Document(template)
    body = d.element.body
    sect = body.find(docx.oxml.ns.qn("w:sectPr"))
    for el in list(body):
        if el is not sect:
            body.remove(el)
    qs = MOCKS[mock_no]
    for n, (app, text, img, width, opts, right, expl, diff) in enumerate(qs, 1):
        assert 1 <= right <= len(opts)
        tags = f"accenture, technical assessment, ms office, {app.lower()}, mock test {mock_no}, {diff.lower()}"
        for line in ["{QUESTION BEGINS}", f"{{QUESTION NUMBER}} {n}", f"{{SUBJECT}} {SUBJECT}",
                     f"{{TOPIC}} {TOPIC}", f"{{TAGS}} {tags}", "{QUESTION TYPE} SINGLECORRECT"]:
            d.add_paragraph(line)
        p = d.add_paragraph(f"{{QUESTION TEXT}} {text}")
        if img:
            r = p.add_run()
            r.add_break()
            r.add_picture(os.path.join(HERE, "img", f"m{mock_no}", img), width=Inches(width))
        d.add_paragraph("")
        for i in range(10):
            d.add_paragraph(f"{{OPTION {i + 1}}} {opts[i] if i < len(opts) else ''}".rstrip())
        for line in [f"{{RIGHT ANSWER}} {right}", f"{{EXPLANATION}} {expl}", "{CORRECT MARKS} 1",
                     "{NEGATIVE MARKS} 0", f"{{DIFFICULTY}} {diff}", "{QUESTION ENDS}", "", ""]:
            d.add_paragraph(line)
    d.save(out)
    return len(qs)


if __name__ == "__main__":
    print("wrote", build(sys.argv[1], int(sys.argv[2]), sys.argv[3]), "questions to", sys.argv[3])
