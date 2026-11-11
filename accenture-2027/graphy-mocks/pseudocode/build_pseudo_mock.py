"""Build Pseudocode Mock Test 1 in Graphy Word format.

Each question shows the original pseudocode as an image (img/qNN.jpg, cropped from
real exam photos). The question line, notes, options, answer and explanation are text.
Every answer was checked by running the same logic in C.

Usage: python3 build_pseudo_mock.py template8.docx Pseudocode-Mock-Test-1-Graphy.docx
"""
import os
import sys

import docx
from docx.shared import Inches

HERE = os.path.dirname(os.path.abspath(__file__))
SUBJECT = "Technical Assessment"
TOPIC = "Pseudocode"
OUT_Q = "What will be the output of the following pseudocode?"
N_CONT = ("[Note - Continue: when a continue statement is encountered inside a loop, control jumps to the "
          "beginning of the loop for the next iteration, skipping the remaining statements of the current iteration.]")
N_AND = ("[Note - &&: Logical AND returns true (1) if both operands are true (non-zero), otherwise false (0). "
         "&: Bitwise AND compares each bit of both operands; a result bit is 1 only if both bits are 1.]")
N_IF = "[Note - if(x) gets executed if the value inside if(), i.e. x, is not zero.]"

# (question text, note, image width in inches, options, right option number, explanation, difficulty)
QUESTIONS = [
    (OUT_Q, N_CONT, 3.2, ["10", "1", "8", "5"], 1,
     "m starts at 4. j=0: j>1 false, m=m+1=5. j=1: m=6. j=2: m=6+a[2]=8, then m=9. "
     "j=3: m=9+a[3]=10, then j>2 so Continue skips m=m+1. Output: 10.", "Medium"),
    ("Which of the following options is correct for the given pseudocode?", N_CONT, 5.5,
     ["It will print all the numbers from 0 to 8 except the number 4",
      "It will print all the numbers from 0 to 8 except the number 5",
      "It will print the numbers from 0 to 8",
      "It will print the numbers from 0 to 4"], 1,
     "Only when j = 4 are both conditions true (j EQUALS 4 and j+1 EQUALS 5), so continue skips print j "
     "for 4 only. The loop goes on to 8. Output: 0 1 2 3 5 6 7 8.", "Easy"),
    (OUT_Q, N_AND, 5.5, ["5", "7", "9", "4"], 3,
     "12 = 1100 and 5 = 0101 in binary, so 12 & 5 = 0100 = 4 (non-zero = true). a && 4 is true, so the if "
     "runs: a = 12 & 5 = 4. Print a + b = 4 + 5 = 9.", "Medium"),
    (OUT_Q, N_IF, 5.5, ["2", "8", "1", "7"], 2,
     "a = {2, 4, 2, 2}. a[1] = 4 > 3, so a[1] = a[2] = 2. if(1) is always true, so a[2] = a[1] + 2 = 4. "
     "m = 2 + a[3] + a[2] = 2 + 2 + 4 = 8.", "Medium"),
    ("What will be the output of the following pseudocode for a = 2, b = 3?", N_AND + " " + N_IF, 5.5,
     ["4", "5", "7", "1"], 2,
     "funn(2,3): both > 0, so return funn(-7,10) + funn(1,1). funn(-7,10): a is not > 0, return -7+10 = 3. "
     "funn(1,1) = funn(-7,10) + funn(-1,0) = 3 + (-1) = 2. Total = 3 + 2 = 5.", "Hard"),
    (OUT_Q, "", 5.5, ["0", "2", "6", "1"], 1,
     "a = {0, 1, 0, 2}. a[0] = 0 - 0 + 2 = 2. a[1] = a[0] - a[3] = 2 - 2 = 0. a[2] = a[1] - a[2] = 0 - 0 = 0. "
     "a[3] = a[2] = 0. m = a[3] = 0.", "Easy"),
    (OUT_Q, "", 5.5, ["1 4", "It will print nothing", "1 3", "1 2"], 1,
     "k=0, j=0: a[0][0] equals a[0][0], so jump out of the inner loop with j=0 and print a[0][0] = 1. "
     "k=1, j=0: a[1][0]=3 vs a[0][1]=2, not equal; j=1: a[1][1] equals a[1][1], jump out and print a[1][1] = 4. "
     "Output: 1 4.", "Hard"),
    (OUT_Q, "", 5.5, ["1 0", "1 10", "0 1", "10 10"], 2,
     "The loop runs once (k = 1 < 2). h / p = 10 / 9 = 1 with integer division, so it prints 1. "
     "k becomes 2 and the loop stops. Then print h prints 10. Output: 1 10.", "Easy"),
    ("What will be the output of the following pseudocode for a = 8, b = 7?", "", 5.5, ["-1", "-2", "1", "0"], 2,
     "funn(8,7): 8 > 7, so return 8 - 7 - funn(3,7). funn(3,7): 3 is not > 7, b = 21 (local only), return a = 3. "
     "Result = 1 - 3 = -2.", "Medium"),
    (OUT_Q, "", 5.5, ["5", "3", "6", "4"], 3,
     "even = {2, 6, 8, 12}. k=0: 8 > 6 true but k+1 = 1, not 2. k=1: even[3]=12 > even[2]=8 true and "
     "k+1 = 2, so print even[1] = 6. For k = 2 and 3, k+1 is never 2, so nothing else prints. Output: 6.",
     "Medium"),
]


def build(template, out):
    d = docx.Document(template)
    body = d.element.body
    sect = body.find(docx.oxml.ns.qn("w:sectPr"))
    for el in list(body):
        if el is not sect:
            body.remove(el)
    tags = "accenture, technical assessment, pseudocode, mock test 1"
    for n, (text, note, width, opts, right, expl, diff) in enumerate(QUESTIONS, 1):
        for line in ["{QUESTION BEGINS}", f"{{QUESTION NUMBER}} {n}", f"{{SUBJECT}} {SUBJECT}",
                     f"{{TOPIC}} {TOPIC}", f"{{TAGS}} {tags}, {diff.lower()}", "{QUESTION TYPE} SINGLECORRECT"]:
            d.add_paragraph(line)
        p = d.add_paragraph(f"{{QUESTION TEXT}} {text}")
        r = p.add_run()
        r.add_break()
        r.add_picture(os.path.join(HERE, "img", f"q{n:02d}.jpg"), width=Inches(width))
        if note:
            p.add_run().add_break()
            p.add_run(note)
        d.add_paragraph("")
        for i in range(10):
            d.add_paragraph(f"{{OPTION {i + 1}}} {opts[i] if i < len(opts) else ''}".rstrip())
        for line in [f"{{RIGHT ANSWER}} {right}", f"{{EXPLANATION}} {expl}", "{CORRECT MARKS} 1",
                     "{NEGATIVE MARKS} 0", f"{{DIFFICULTY}} {diff}", "{QUESTION ENDS}", "", ""]:
            d.add_paragraph(line)
    d.save(out)
    return len(QUESTIONS)


if __name__ == "__main__":
    print("wrote", build(sys.argv[1], sys.argv[2]), "questions to", sys.argv[2])
