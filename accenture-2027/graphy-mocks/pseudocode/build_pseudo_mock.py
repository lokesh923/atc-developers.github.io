"""Build Pseudocode Mock Tests in Graphy Word format.

Each question shows the original pseudocode as an image (img/m<N>/qNN.jpg, cropped from
real exam photos). The question line, notes, options, answer and explanation are text.
Output-type answers were checked by running the same logic in C or Python.
New questions (not from photos) are drawn by render_code.js from new_m<N>.json.
No question appears in more than one mock.

Usage: python3 build_pseudo_mock.py template8.docx <mock no> <out.docx>
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
QUESTIONS_1 = [
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


N_STRLEN = ("[Note - stringLength(): the stringLength() function counts the number of characters in a "
            "given string and returns the integer value.]")

QUESTIONS_2 = [
    ("What would be the output of the given pseudocode?", "", 5.5, ["8", "7", "2", "9"], 4,
     "Both loops run from 1 to 1, so the inner body runs exactly once. It prints k + 1 = 8 + 1 = 9. "
     "(k itself is not changed.)", "Easy"),
    (OUT_Q, "", 5.5, ["46", "23", "43", "45"], 4,
     "Each pass adds 2*a[j] + 6. j=0: 1+2+6 = 9. j=1: 9+4+6 = 19. j=2: 19+6+6 = 31. j=3: 31+8+6 = 45. "
     "Output: 45.", "Medium"),
    (OUT_Q, N_STRLEN, 5.5, ["8", "6", "7", "4"], 1,
     "The loop runs twice (a = 1, 2), adding \"mm\" each time: \"momo\" -> \"momomm\" -> \"momommmm\". "
     "Its length is 4 + 2 + 2 = 8.", "Easy"),
    ("Choose the correct output for the given pseudocode. What does the given code output when N is 4?", "",
     5.0, ["2, 1, 3, 4", "2, 1, 3, 4, 7", "2, 1, 3, 4, 7, 11", "2, 1, 3, 4, 7, 11, 18"], 2,
     "It prints A, B = 2, 1 first. COUNT=2: S=3, then A,B=1,3. COUNT=3: S=4, then A,B=3,4. COUNT=4: S=7. "
     "COUNT becomes 5 > N, so the loop stops. Output: 2, 1, 3, 4, 7 (the Lucas series).", "Medium"),
    ("What will be the output printed by the given pseudocode? Analyze the pseudocode and select the correct "
     "option.", "", 4.5,
     ["The result is: 6", "The result is: 12", "The result is: 48", "The result is: 24"], 3,
     "total starts at 1. i=1: total = 1 * 2 = 2. i=2: total = 2 * 4 = 8. i=3: total = 8 * 6 = 48. "
     "The function returns 48, so it prints The result is: 48.", "Easy"),
    ("Consider the below code. What will be printed?", "", 4.5, ["3", "6", "9", "12"], 3,
     "value = 3 is greater than 0, so square returns 3 * 3 = 9. It prints Square: 9.", "Easy"),
    ("Determine the output of the following pseudocode?", "", 5.5, ["2 3", "7 11", "5 8", "Compilation Error"],
     4,
     "The program calls calculateSum(), but no function with that name is defined (only fun() is). It also "
     "stores an array (pointer) result in an integer k. So the code does not compile: Compilation Error.",
     "Hard"),
    ("What is the purpose of the below pseudocode?", "", 5.5,
     ["Recursive implementation of Binary Sort", "Recursive implementation of Insertion Sort",
      "Recursive implementation of Bubble Sort", "Recursive implementation of Selection Sort"], 4,
     "mI() finds the index of the smallest element between s and e. newF() swaps that minimum into "
     "position si, then calls itself for si+1. Picking the minimum and placing it at the front each round "
     "is selection sort, done recursively.", "Medium"),
    ("Consider the following pseudocode. What will be printed when the above pseudocode is executed?", "", 5.5,
     ["10, 20, 10", "20, 10, 20", "20, 20, 20", "10, 10, 20"], 3,
     "p1 holds the address of num1. p2 gets the value of p1, which is the same address, so p2 also points "
     "to num1. Setting the value pointed to by p2 to 20 changes num1 to 20. num1, *p1 and *p2 all read "
     "the same memory: 20, 20, 20.", "Medium"),
    ("Consider the following code implementing the Union-Find data structure. What does the Union procedure "
     "do in the Union-Find data structure?", "", 5.5,
     ["Initializes the array arr with values from 0 to n-1",
      "Merges the two sets represented by elements A and B",
      "Finds the root of a given element in the Union-Find structure",
      "Checks if two elements A and B are connected"], 2,
     "Union finds the root of A and makes it point to the root of B (arr[root(A)] = root(B)). That joins "
     "the two trees into one, so it merges the sets of A and B. MakeSet initializes, FindRoot finds roots, "
     "and checking connectivity would compare the two roots.", "Medium"),
]

N_BIT = ("[Note - ^: bitwise XOR sets a result bit to 1 only when the two bits are different. >>: right shift moves "
         "the bits right (x >> 1 is integer division by 2). <<: left shift moves the bits left (x << 1 multiplies "
         "by 2). &: bitwise AND.]")
N_MOD = "[Note - mod finds the remainder after division. For example, 17 mod 5 = 2.]"
N_DIV = "[Note - / between two integers gives integer division, which drops the remainder: 123 / 10 = 12.]"

QUESTIONS_3 = [
    ("Consider the following pseudocode snippet. What will be the output of the code?", "", 5.5,
     ["TRUE", "FALSE", "TRUE and FALSE", "ERROR"], 1,
     "a OR b is true when at least one of them is true. a is TRUE, so the IF condition holds and result is "
     "set to TRUE. PRINT result prints TRUE.", "Easy"),
    (OUT_Q, N_BIT, 4.5, ["17", "46", "34", "23"], 3,
     "13 = 1101, 6 = 0110, so 13 ^ 6 = 1011 = 11. 13 >> 1 = 6. c = 11 + 6 = 17. 17 is odd, so c & 1 = 1 and "
     "the if runs: c = 17 << 1 = 34.", "Hard"),
    ("Consider the below pseudocode. Which output is produced when calling the getRateOfInterest() method?",
     "", 5.5, ["1", "9", "5", "None of the above"], 3,
     "B1 inherits Bank and overrides getRateOfInterest(). The object is created as B1, so at run time the "
     "B1 version runs (method overriding / runtime polymorphism) and outputs 5. The Bank version is not called.",
     "Easy"),
    (OUT_Q, N_MOD, 4.5, ["4", "8", "10", "6"], 4,
     "count increases when i + j is even. i=1: j=1, 3 (2 pairs). i=2: j=2, 4 (2). i=3: j=3 (1). i=4: j=4 (1). "
     "Total = 2 + 2 + 1 + 1 = 6.", "Medium"),
    ("Consider the following pseudocode snippet. What is the data type of the result variable?", "", 5.5,
     ["Integer", "Float", "String", "Boolean"], 2,
     "parseInt turns \"42\" into the integer 42. 3.14 is a decimal. An integer multiplied by a decimal is "
     "promoted to a decimal, so result = 131.88, which is a Float.", "Easy"),
    (OUT_Q, N_MOD, 4.5, ["12", "17", "6", "13"], 4,
     "funn is Euclid's GCD algorithm. funn(84,36) -> funn(36,12) -> funn(12,0) = 12. funn(17,5) -> funn(5,2) "
     "-> funn(2,1) -> funn(1,0) = 1. Print 12 + 1 = 13.", "Medium"),
    ("In the provided pseudocode, what does the \"Vowels\" function do?", "", 5.5,
     ["Reverses the input text", "Counts the number of vowels in the input text",
      "Concatenates vowels from the input text", "Checks if the input text is a palindrome"], 2,
     "Vowel1 starts at 0 and goes up by 1 for every character that is in the list [a, e, i, o, u]. The "
     "function returns this number, so it counts the vowels in the text.", "Easy"),
    (OUT_Q, N_DIV, 4.5, ["3211", "0322", "322", "1231"], 3,
     "Each pass takes the last digit and appends it to rev. n=1230: d=0, rev=0, n=123. d=3, rev=3, n=12. "
     "d=2, rev=32, n=1. d=1, rev=321, n=0. The leading 0 disappears, so rev = 321 and it prints 321 + 1 = 322.",
     "Medium"),
    ("What does the pseudocode do?", "", 4.0,
     ["It prints only P, N or Z depending on the sign of N",
      "It prints the numbers from 1 to N and then prints P, N or Z depending on whether N is positive, "
      "negative or zero",
      "It prints the numbers from 1 to N only when N is negative",
      "It prints the numbers from N down to 1 and then the sign of N"], 2,
     "The IF block stores \"P\" (N > 0), \"N\" (N < 0) or \"Z\" (N = 0) in M. The FOR loop then prints 1 "
     "to N (nothing when N is 0 or negative), and finally PRINT M prints the letter.", "Medium"),
    ("Analyse the given algorithm. Which of the following statements is correct?", "", 5.0,
     ["The worst case time complexity of this algorithm is O(n log n)",
      "The worst case space complexity of this algorithm is O(n)",
      "The algorithm extends bubble sort by operating in two directions",
      "It is a divide-and-conquer algorithm like merge sort"], 3,
     "Each pass bubbles the largest item forward (left to right), then the smallest item backward (right to "
     "left), and stops when no swap happens. That is cocktail shaker sort, a two-way bubble sort. It is still "
     "O(n^2) in the worst case and sorts in place with O(1) extra space.", "Hard"),
]

N_OR = ("[Note - |: bitwise OR sets a result bit to 1 if either bit is 1. &: bitwise AND sets it to 1 only if both "
        "bits are 1. <<: left shift, 1 << i equals 2 to the power i.]")
N_STR = ("[Note - stringLength() returns the number of characters in a string. s[i] is the character at index i; "
         "indexing starts at 0. + joins two strings.]")
N_STATIC = ("[Note - a static variable is initialised only once and keeps its value between function calls.]")
N_DOWHILE = ("[Note - in a do-while loop the body runs first and the condition is checked afterwards.]")
N_BC = ("[Note - continue skips the rest of the current iteration; break exits the loop completely.]")
N_XOR = "[Note - ^ is bitwise XOR: a result bit is 1 only when the two bits are different.]"
N_SHIFT = "[Note - >> is right shift: n >> 1 moves the bits one place right, i.e. integer division by 2.]"

QUESTIONS_4 = [
    (OUT_Q, N_OR, 4.5, ["21", "12", "4", "5"], 3,
     "i = 0, 2, 4 are even, so x = 1 | 4 | 16 = 21 (binary 10101). 12 is 01100. 10101 & 01100 = 00100 = 4.",
     "Hard"),
    ("What will be the output of the following pseudocode for fun(13)?", N_MOD + " " + N_DIV, 4.5,
     ["1011", "1101", "13", "111"], 2,
     "fun(13) = 1 + 10*fun(6); fun(6) = 0 + 10*fun(3); fun(3) = 1 + 10*fun(1); fun(1) = 1 + 10*fun(0) = 1. "
     "So fun(3) = 11, fun(6) = 110, fun(13) = 1101. The function builds the binary form of n.", "Medium"),
    (OUT_Q, N_STR, 5.0, ["ACNUE", "CENTR", "ACEUE", "CCTR"], 1,
     "\"ACCENTURE\" has indexes 0-8. Even indexes are 0:A, 2:C, 4:N, 6:U, 8:E, so result = ACNUE.", "Easy"),
    ("What happens when the following pseudocode is executed?", "", 5.5,
     ["It prints 600", "It prints 700",
      "Compilation error at line 12, because balance is private",
      "Runtime error at line 11, because deposit() changes balance"], 3,
     "balance is private (encapsulation), so it can be used only inside the class. Line 11 is fine because "
     "deposit() is a public method. Line 12 accesses acc.balance from outside the class, which the compiler "
     "rejects. The correct way is to change balance only through public methods.", "Medium"),
    (OUT_Q, "", 4.5, ["1 2 3 4 6 9", "1 2 4 3 6 9", "1 2 3 2 4 6 3 6 9", "1 4 9"], 2,
     "The inner loop runs j = 1 to i. i=1: 1. i=2: 2, 4. i=3: 3, 6, 9. Output in order: 1 2 4 3 6 9.",
     "Easy"),
    (OUT_Q, N_DIV, 5.0, ["38", "49", "94", "83"], 2,
     "n / 2 - 1 = 1, so i = 0 and 1. i=0 swaps a[0] and a[4]: {4, 8, 1, 9, 3}. i=1 swaps a[1] and a[3]: "
     "{4, 9, 1, 8, 3}. The array is reversed. Print 4 * 10 + 9 = 49.", "Medium"),
    (OUT_Q, N_STATIC, 4.5, ["6", "2", "12", "18"], 3,
     "c is static, so it is set to 0 only once and keeps its value. 1st call: c = 2. 2nd: c = 4. 3rd: c = 6. "
     "p + q + r = 2 + 4 + 6 = 12. (With a normal local variable each call would return 2, giving 6.)",
     "Medium"),
    (OUT_Q, N_DOWHILE, 4.5, ["10", "15", "16", "11"], 3,
     "The body runs once before the check: x = 15, y = 1. Then 15 < 10 is false, so the loop stops. "
     "Print 15 + 1 = 16.", "Easy"),
    (OUT_Q, "", 5.5, ["11", "5", "6", "Compilation error: add is defined twice"], 1,
     "add is overloaded (compile-time polymorphism): the version is chosen by the number of arguments. "
     "add(2, 3) uses the 2-parameter version: 2 + 3 = 5. add(1, 2, 3) uses the 3-parameter version: "
     "1 * 2 * 3 = 6. 5 + 6 = 11.", "Medium"),
    (OUT_Q, "[Note - &: bitwise AND.]", 4.5, ["5", "3", "4", "29"], 3,
     "n & (n - 1) removes the lowest 1-bit each time, so the loop counts the 1-bits. 29 = 11101 -> 11100 (28) "
     "-> 11000 (24) -> 10000 (16) -> 0. That is 4 passes, so it prints 4.", "Hard"),
]

QUESTIONS_5 = [
    (OUT_Q, N_XOR, 4.0, ["-5", "0", "19", "5"], 4,
     "Three XORs swap the two values without a temp variable: after them a = 12 and b = 7. "
     "Print 12 - 7 = 5.", "Medium"),
    ("What will be printed when show(3) is called?", "", 4.5,
     ["3 2 1", "1 2 3", "1 2 1 3 1 2 1", "3 2 1 1 2 1"], 3,
     "show(n) prints show(n-1), then n, then show(n-1) again. show(1) prints 1. show(2) prints 1 2 1. "
     "show(3) prints (1 2 1) 3 (1 2 1) = 1 2 1 3 1 2 1.", "Hard"),
    (OUT_Q, N_STR, 5.0, ["6", "2", "3", "0"], 2,
     "Compare s[i] with s[5 - i] for \"madman\": m/n no, a/a yes, d/m no, m/d no, a/a yes, n/m no. "
     "count = 2 (the word is not a palindrome).", "Medium"),
    ("Which statement about the following pseudocode is correct?", "", 5.0,
     ["It prints 16. Shape cannot be created directly, but a Shape variable can refer to a Square object",
      "Compilation error, because area() has no body in Shape",
      "It prints 0, because Shape's area() is called",
      "Runtime error, because s1 is declared as Shape"], 1,
     "Shape is abstract (abstraction): it declares area() without a body and cannot be instantiated. Square "
     "gives area() a body. s1 is a Shape reference to a Square object, so s1.area() runs Square's version: "
     "4 * 4 = 16.", "Medium"),
    (OUT_Q, N_BC, 4.5, ["19", "27", "22", "40"], 1,
     "i = 3 and 6 are skipped by continue. At i = 8 (not a multiple of 3, and > 7) break ends the loop. "
     "sum = 1 + 2 + 4 + 5 + 7 = 19.", "Medium"),
    (OUT_Q, "", 5.5, ["25", "15", "30", "45"], 3,
     "Each row adds its main-diagonal and anti-diagonal element: row 0: 1 + 3, row 1: 5 + 5, row 2: 9 + 7. "
     "The centre 5 is counted twice. d = 4 + 10 + 16 = 30.", "Medium"),
    ("What will be the output when the object of class C is created?", "", 4.0, ["CBA", "C", "ABC", "AC"], 3,
     "Creating a child object first runs the parent constructors, from the top of the inheritance chain "
     "down: A(), then B(), then C(). Output: ABC.", "Easy"),
    (OUT_Q, N_SHIFT, 4.5, ["6", "7", "50", "100"], 2,
     "100 -> 50 -> 25 -> 12 -> 6 -> 3 -> 1 -> 0: seven shifts. c = 7, which is the number of bits needed to "
     "write 100 in binary (1100100).", "Medium"),
    ("What will be the output of the following pseudocode?", "", 4.5, ["45", "25", "24", "16"], 2,
     "fun(9) = 9 + fun(7) = 9 + 7 + fun(5) = ... = 9 + 7 + 5 + 3 + 1 + fun(-1). fun(-1) returns 0. "
     "Sum = 25.", "Easy"),
    (OUT_Q, "", 5.0, ["10", "4", "16", "12"], 4,
     "i=1: 3 < 5, a[1] = 5 - 3 = 2. i=2: 8 > 2, a[2] = 8 + 2 = 10. i=3: 6 < 10, a[3] = 10 - 6 = 4. "
     "i=4: 2 < 4, a[4] = 4 - 2 = 2. Print a[4] + a[2] = 2 + 10 = 12.", "Hard"),
]

MOCKS = {1: QUESTIONS_1, 2: QUESTIONS_2, 3: QUESTIONS_3, 4: QUESTIONS_4, 5: QUESTIONS_5}


def build(template, mock_no, out):
    d = docx.Document(template)
    body = d.element.body
    sect = body.find(docx.oxml.ns.qn("w:sectPr"))
    for el in list(body):
        if el is not sect:
            body.remove(el)
    tags = f"accenture, technical assessment, pseudocode, mock test {mock_no}"
    qs = MOCKS[mock_no]
    for n, (text, note, width, opts, right, expl, diff) in enumerate(qs, 1):
        for line in ["{QUESTION BEGINS}", f"{{QUESTION NUMBER}} {n}", f"{{SUBJECT}} {SUBJECT}",
                     f"{{TOPIC}} {TOPIC}", f"{{TAGS}} {tags}, {diff.lower()}", "{QUESTION TYPE} SINGLECORRECT"]:
            d.add_paragraph(line)
        p = d.add_paragraph(f"{{QUESTION TEXT}} {text}")
        r = p.add_run()
        r.add_break()
        r.add_picture(os.path.join(HERE, "img", f"m{mock_no}", f"q{n:02d}.jpg"), width=Inches(width))
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
    return len(qs)


if __name__ == "__main__":
    print("wrote", build(sys.argv[1], int(sys.argv[2]), sys.argv[3]), "questions to", sys.argv[3])
