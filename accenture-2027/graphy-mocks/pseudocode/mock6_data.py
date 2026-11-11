"""Pseudocode Mock Test 6: 50 new questions, one pattern each, none repeated from Mocks 1-5.

Each entry: topic, difficulty, question text, note, code lines (drawn as an image),
options (correct answer FIRST; options are shuffled by the builder unless keep=True,
and "fixed_last" keeps the last option in place), explanation, and `py`: equivalent
Python that sets `out` to the exact correct-option text. verify() runs every `py`
and checks it against the correct option.
"""

OUT_Q = "What will be the output of the following pseudocode?"
N_AND = "[Note - &: bitwise AND. A result bit is 1 only if both bits are 1.]"
N_XOR = "[Note - ^: bitwise XOR. A result bit is 1 only when the two bits are different.]"
N_BITS = ("[Note - ^: XOR, |: OR, &: AND, <<: left shift (multiply by 2 per place), >>: right shift "
          "(integer divide by 2 per place).]")
N_NOT = ("[Note - ~: bitwise NOT flips every bit. For integers stored in two's complement, ~x = -x - 1.]")
N_MOD = "[Note - mod gives the remainder after division. / between integers is integer division.]"
N_BREAK = "[Note - break exits the innermost loop immediately.]"
N_STR = ("[Note - s[i] is the character at index i (starting at 0). stringLength(s) gives the number of "
         "characters. + joins strings.]")
N_ASCII = ("[Note - Characters are stored as ASCII codes: 'A' = 65 ... 'Z' = 90, 'a' = 97 ... 'z' = 122. "
           "Adding 1 to a character gives the next character.]")
N_SUB = ("[Note - substring(s, i) returns the part of s from index i to the end. substring(s, i, k) returns k "
         "characters starting at index i.]")
N_SWITCH = ("[Note - In a switch, execution starts at the matching case and falls through into the following "
            "cases until a break is reached.]")
N_TERN = "[Note - (condition) ? x : y gives x if the condition is true, otherwise y.]"
N_SC = ("[Note - && and || use short-circuit evaluation: the right side is not evaluated if the left side "
        "already decides the result. ++i increases i by 1 before it is used.]")
N_STATIC_CLS = "[Note - A static class variable is shared by all objects of the class.]"

Q = [
    # ---------------- Bitwise (8) ----------------
    dict(t="Bitwise", d="Medium", q=OUT_Q, note=N_AND,
         lines=["Integer a[5] = {6, 8, 12, 16, 1}", "Integer i, count", "Set count = 0",
                "for (each i from 0 to 4)", "        if ((a[i] & (a[i] - 1)) EQUALS 0)",
                "                count = count + 1", "        End if", "End for", "Print count"],
         opts=["3", "2", "1", "4"],
         expl="x & (x - 1) is 0 only when x has a single 1-bit, i.e. x is a power of two. 8, 16 and 1 (2^0) "
              "pass; 6 and 12 do not. count = 3.",
         py="a=[6,8,12,16,1]; out=str(sum(1 for x in a if x&(x-1)==0))"),
    dict(t="Bitwise", d="Medium", q=OUT_Q, note=N_XOR,
         lines=["Integer a[5] = {4, 7, 2, 7, 4}", "Integer i, r", "Set r = 0", "for (each i from 0 to 4)",
                "        r = r ^ a[i]", "End for", "Print r"],
         opts=["2", "0", "24", "7"],
         expl="x ^ x = 0 and x ^ 0 = x, so every number that appears twice cancels out. Only 2 appears once, "
              "so r = 2.",
         py="r=0\nfor x in [4,7,2,7,4]: r^=x\nout=str(r)"),
    dict(t="Bitwise", d="Medium", q=OUT_Q, note=N_BITS,
         lines=["Integer x", "Set x = 10", "x = x ^ (1 << 2)", "x = x | 1", "Print x >> 1"],
         opts=["7", "15", "6", "3"],
         expl="10 = 1010. 1 << 2 = 0100, so x ^ 4 = 1110 = 14 (bit 2 toggled on). 14 | 1 = 1111 = 15. "
              "15 >> 1 = 7.",
         py="x=10; x^=1<<2; x|=1; out=str(x>>1)"),
    dict(t="Bitwise", d="Hard", q=OUT_Q, note=N_BITS,
         lines=["Integer a, b", "Set a = 6, b = 11", "Print ((a & b) + (a | b)) - (a ^ b)"],
         opts=["4", "17", "13", "2"],
         expl="6 = 0110, 11 = 1011. a & b = 0010 = 2, a | b = 1111 = 15, a ^ b = 1101 = 13. "
              "(2 + 15) - 13 = 4. (Shortcut: (a & b) + (a | b) is always a + b = 17.)",
         py="a,b=6,11; out=str(((a&b)+(a|b))-(a^b))"),
    dict(t="Bitwise", d="Medium", q=OUT_Q, note=N_BITS + " " + N_MOD,
         lines=["Integer x, i", "Set x = 3", "for (each i from 1 to 4)", "        x = (x << 1) mod 10",
                "End for", "Print x"],
         opts=["8", "48", "6", "4"],
         expl="Each step doubles x and keeps the last digit: 3 -> 6 -> 12 mod 10 = 2 -> 4 -> 8. Output: 8.",
         py="x=3\nfor i in range(4): x=(x<<1)%10\nout=str(x)"),
    dict(t="Bitwise", d="Hard", q=OUT_Q, note=N_NOT,
         lines=["Integer a, b", "Set a = 5", "b = ~a", "Print b + 10"],
         opts=["4", "15", "5", "-4"],
         expl="~5 = -5 - 1 = -6 (all bits of 0101 flipped in two's complement). -6 + 10 = 4.",
         py="out=str((~5)+10)"),
    dict(t="Bitwise", d="Hard", q=OUT_Q, note=N_BITS,
         lines=["Integer n", "Set n = 181", "Print (n >> 4) & 15, n & 15"],
         opts=["11 5", "5 11", "10 5", "11 4"],
         expl="181 = 1011 0101. n >> 4 = 1011, and & 15 keeps the low 4 bits: 11. n & 15 = 0101 = 5. "
              "These are the upper and lower halves (nibbles) of the byte: 11 5.",
         py="n=181; out=f'{(n>>4)&15} {n&15}'"),
    dict(t="Bitwise", d="Easy", q=OUT_Q, note=N_AND,
         lines=["Integer a[6] = {12, 7, 9, 4, 15, 22}", "Integer i, s", "Set s = 0", "for (each i from 0 to 5)",
                "        if (a[i] & 1)", "                s = s + a[i]", "        End if", "End for", "Print s"],
         opts=["31", "38", "69", "3"],
         expl="a[i] & 1 is 1 for odd numbers (last bit set). Odd values: 7, 9, 15. s = 7 + 9 + 15 = 31.",
         py="out=str(sum(x for x in [12,7,9,4,15,22] if x&1))"),

    # ---------------- Loops (8) ----------------
    dict(t="Loops", d="Medium", q=OUT_Q, note=N_MOD,
         lines=["Integer i, c", "Set i = 20, c = 0", "while (i > 0)", "        c = c + (i mod 4)",
                "        i = i - 3", "End while", "Print c"],
         opts=["9", "7", "11", "12"],
         expl="i takes 20, 17, 14, 11, 8, 5, 2 (then -1 stops). i mod 4 = 0, 1, 2, 3, 0, 1, 2. Sum = 9.",
         py="i,c=20,0\nwhile i>0:\n c+=i%4; i-=3\nout=str(c)"),
    dict(t="Loops", d="Hard", q=OUT_Q, note=N_BREAK + " " + N_MOD,
         lines=["Integer i, j, count", "Set count = 0", "for (each i from 1 to 5)",
                "        for (each j from 1 to 5)", "                if (j > i)", "                        break",
                "                End if", "                if ((i * j) mod 2 EQUALS 1)",
                "                        count = count + 1", "                End if", "        End for",
                "End for", "Print count"],
         opts=["6", "9", "4", "3"],
         expl="break limits j to 1..i. i * j is odd only when both are odd: i=1: (1,1); i=3: j=1,3; "
              "i=5: j=1,3,5. Even i give nothing. count = 1 + 2 + 3 = 6.",
         py="c=0\nfor i in range(1,6):\n for j in range(1,6):\n  if j>i: break\n  if (i*j)%2==1: c+=1\nout=str(c)"),
    dict(t="Loops", d="Medium", q=OUT_Q, note="",
         lines=["Integer i, s", "Set i = 1, s = 0", "while (i <= 20)", "        s = s + i", "        i = i * 2 + 1",
                "End while", "Print s"],
         opts=["26", "57", "11", "15"],
         expl="i takes 1, 3, 7, 15 (next would be 31 > 20). s = 1 + 3 + 7 + 15 = 26.",
         py="i,s=1,0\nwhile i<=20:\n s+=i; i=i*2+1\nout=str(s)"),
    dict(t="Loops", d="Hard", q=OUT_Q, note=N_MOD,
         lines=["Integer x, count", "Set x = 100, count = 0", "while (x NOT EQUALS 1)", "        if (x mod 2 EQUALS 0)",
                "                x = x / 2", "        else", "                x = 3 * x + 1", "        End if",
                "        count = count + 1", "End while", "Print count"],
         opts=["25", "24", "26", "100"],
         expl="This is the Collatz sequence: 100, 50, 25, 76, 38, 19, 58, 29, 88, 44, 22, 11, 34, 17, 52, 26, "
              "13, 40, 20, 10, 5, 16, 8, 4, 2, 1. Counting the steps to reach 1 gives 25.",
         py="x,c=100,0\nwhile x!=1:\n x = x//2 if x%2==0 else 3*x+1; c+=1\nout=str(c)"),
    dict(t="Loops", d="Medium", q=OUT_Q, note="",
         lines=["Integer i, j, k, count", "Set count = 0", "for (each i from 1 to 3)",
                "        for (each j from i to 3)", "                for (each k from j to 3)",
                "                        count = count + 1", "                End for", "        End for",
                "End for", "Print count"],
         opts=["10", "27", "6", "14"],
         expl="It counts triples with 1 <= i <= j <= k <= 3. i=1: 3 + 2 + 1 = 6. i=2: 2 + 1 = 3. i=3: 1. "
              "Total = 10.",
         py="c=0\nfor i in range(1,4):\n for j in range(i,4):\n  for k in range(j,4): c+=1\nout=str(c)"),
    dict(t="Loops", d="Hard", q=OUT_Q, note=N_BREAK + " " + N_MOD,
         lines=["Integer n, i, count, flag", "Set count = 0", "for (each n from 2 to 30)", "        Set flag = 1",
                "        for (each i from 2 to n - 1)", "                if (n mod i EQUALS 0)",
                "                        flag = 0", "                        break", "                End if",
                "        End for", "        count = count + flag", "End for", "Print count"],
         opts=["10", "11", "9", "15"],
         expl="flag stays 1 only when n has no divisor between 2 and n - 1, i.e. n is prime. Primes up to 30: "
              "2, 3, 5, 7, 11, 13, 17, 19, 23, 29. count = 10.",
         py="out=str(sum(1 for n in range(2,31) if all(n%i for i in range(2,n))))"),
    dict(t="Loops", d="Easy", q=OUT_Q, note="",
         lines=["Integer i, j", "Set i = 0, j = 10", "while (i < j)", "        i = i + 2", "        j = j - 1",
                "End while", "Print i * j"],
         opts=["48", "56", "40", "42"],
         expl="(i, j): (2, 9), (4, 8), (6, 7), (8, 6). Now 8 < 6 is false, so the loop stops. 8 * 6 = 48.",
         py="i,j=0,10\nwhile i<j:\n i+=2; j-=1\nout=str(i*j)"),
    dict(t="Loops", d="Medium", q=OUT_Q, note=N_MOD,
         lines=["Integer n, i, sum", "Set n = 28, sum = 0", "for (each i from 1 to n - 1)",
                "        if (n mod i EQUALS 0)", "                sum = sum + i", "        End if", "End for",
                "if (sum EQUALS n)", "        Print sum, \"Perfect\"", "else",
                "        Print sum, \"Not Perfect\"", "End if"],
         opts=["28 Perfect", "56 Not Perfect", "27 Not Perfect", "28 Not Perfect"],
         expl="Divisors of 28 below 28: 1, 2, 4, 7, 14. Their sum is 28, equal to n, so it prints 28 Perfect.",
         py="s=sum(i for i in range(1,28) if 28%i==0); out=f'{s} '+('Perfect' if s==28 else 'Not Perfect')"),

    # ---------------- Recursion (9) ----------------
    dict(t="Recursion", d="Medium", q=OUT_Q, note=N_MOD,
         lines=["Integer power(Integer b, Integer e)", "        if (e EQUALS 0)", "                return 1",
                "        End if", "        Integer half = power(b, e / 2)", "        if (e mod 2 EQUALS 0)",
                "                return half * half", "        End if", "        return b * half * half",
                "End function power()", "", "Print power(3, 5)"],
         opts=["243", "15", "81", "125"],
         expl="Fast exponentiation. power(3,0) = 1. power(3,1) = 3*1*1 = 3. power(3,2) = 3*3 = 9. "
              "power(3,5) = 3 * 9 * 9 = 243 = 3^5.",
         py="def p(b,e):\n if e==0: return 1\n h=p(b,e//2)\n return h*h if e%2==0 else b*h*h\nout=str(p(3,5))"),
    dict(t="Recursion", d="Medium", q=OUT_Q, note=N_STR + " " + N_SUB,
         lines=["String rev(String s)", "        if (stringLength(s) <= 1)", "                return s",
                "        End if", "        return rev(substring(s, 1)) + s[0]", "End function rev()", "",
                "Print rev(\"CODE\")"],
         opts=["EDOC", "CODE", "ODEC", "EDO"],
         expl="rev puts the first character after the reversed rest: rev(\"E\") = E, rev(\"DE\") = E + D, "
              "rev(\"ODE\") = ED + O, rev(\"CODE\") = EDO + C = EDOC.",
         py="def r(s): return s if len(s)<=1 else r(s[1:])+s[0]\nout=r('CODE')"),
    dict(t="Recursion", d="Hard", q="What will be the value of calls printed by the following pseudocode?",
         note="[Note - calls is a global variable shared by every call of fib().]",
         lines=["Integer calls = 0", "Integer fib(Integer n)", "        calls = calls + 1", "        if (n <= 1)",
                "                return n", "        End if", "        return fib(n - 1) + fib(n - 2)",
                "End function fib()", "", "fib(5)", "Print calls"],
         opts=["15", "8", "5", "9"],
         expl="Calls C(n) = 1 + C(n-1) + C(n-2), with C(0) = C(1) = 1. C(2) = 3, C(3) = 5, C(4) = 9, "
              "C(5) = 1 + 9 + 5 = 15. (fib(5) itself is 5, a trap option.)",
         py="c=0\ndef f(n):\n global c\n c+=1\n return n if n<=1 else f(n-1)+f(n-2)\nf(5); out=str(c)"),
    dict(t="Recursion", d="Medium", q=OUT_Q, note="",
         lines=["Integer isEven(Integer n)", "        if (n EQUALS 0)", "                return 1", "        End if",
                "        return isOdd(n - 1)", "End function isEven()", "Integer isOdd(Integer n)",
                "        if (n EQUALS 0)", "                return 0", "        End if", "        return isEven(n - 1)",
                "End function isOdd()", "Print isEven(7) + 2 * isOdd(7)"],
         opts=["2", "1", "0", "3"],
         expl="The two functions call each other (mutual recursion), flipping between them until n = 0. "
              "7 is odd, so isEven(7) = 0 and isOdd(7) = 1. 0 + 2 * 1 = 2.",
         py="def e(n): return 1 if n==0 else o(n-1)\ndef o(n): return 0 if n==0 else e(n-1)\nout=str(e(7)+2*o(7))"),
    dict(t="Recursion", d="Easy", q=OUT_Q, note=N_MOD,
         lines=["Integer f(Integer n)", "        if (n < 10)", "                return n", "        End if",
                "        return (n mod 10) * f(n / 10)", "End function f()", "", "Print f(2345)"],
         opts=["120", "14", "5432", "24"],
         expl="It multiplies the digits: 5 * f(234) = 5 * 4 * f(23) = 5 * 4 * 3 * f(2) = 5 * 4 * 3 * 2 = 120.",
         py="def f(n): return n if n<10 else (n%10)*f(n//10)\nout=str(f(2345))"),
    dict(t="Recursion", d="Hard", q=OUT_Q, note="",
         lines=["Integer f(Integer n, Integer acc)", "        if (n EQUALS 0)", "                return acc",
                "        End if", "        return f(n - 1, acc * 2 + n)", "End function f()", "", "Print f(3, 0)"],
         opts=["17", "6", "14", "11"],
         expl="The accumulator carries the result down (tail recursion). f(3,0) -> f(2, 0*2+3 = 3) -> "
              "f(1, 3*2+2 = 8) -> f(0, 8*2+1 = 17) -> returns 17.",
         py="def f(n,a): return a if n==0 else f(n-1,a*2+n)\nout=str(f(3,0))"),
    dict(t="Recursion", d="Medium", q="What will be printed when f(3) is called?", note="",
         lines=["Function f(Integer n)", "        if (n EQUALS 0)", "                return", "        End if",
                "        print n", "        f(n - 1)", "        print n", "End function f()", "", "f(3)"],
         opts=["3 2 1 1 2 3", "3 2 1", "1 2 3 3 2 1", "3 2 1 0 1 2 3"],
         expl="Each call prints n before going deeper and again after returning. Going down prints 3 2 1; "
              "f(0) prints nothing; coming back up prints 1 2 3.",
         py="o=[]\ndef f(n):\n if n==0: return\n o.append(n); f(n-1); o.append(n)\nf(3); out=' '.join(map(str,o))"),
    dict(t="Recursion", d="Medium", q=OUT_Q, note="",
         lines=["Integer moves(Integer n)", "        if (n EQUALS 0)", "                return 0", "        End if",
                "        return 2 * moves(n - 1) + 1", "End function moves()", "", "Print moves(5)"],
         opts=["31", "32", "25", "63"],
         expl="This is the Tower of Hanoi move count: 1, 3, 7, 15, 31 for n = 1..5, i.e. 2^n - 1. "
              "moves(5) = 31.",
         py="def m(n): return 0 if n==0 else 2*m(n-1)+1\nout=str(m(5))"),
    dict(t="Recursion", d="Hard", q="What will be printed when bs(a, 0, 6, 57) is called?", note=N_MOD,
         lines=["Integer a[7] = {3, 8, 15, 23, 42, 57, 69}", "Integer bs(Integer a[], Integer lo, Integer hi, Integer key)",
                "        if (lo > hi)", "                return -1", "        End if",
                "        Integer mid = (lo + hi) / 2", "        print mid", "        if (a[mid] EQUALS key)",
                "                return mid", "        End if", "        if (a[mid] < key)",
                "                return bs(a, mid + 1, hi, key)", "        End if",
                "        return bs(a, lo, mid - 1, key)", "End function bs()"],
         opts=["3 5", "3 4 5", "5", "3 5 6"],
         expl="Recursive binary search prints each mid. mid = (0+6)/2 = 3: a[3] = 23 < 57, search 4..6. "
              "mid = (4+6)/2 = 5: a[5] = 57, found. Printed: 3 5.",
         py="a=[3,8,15,23,42,57,69]; o=[]\ndef bs(lo,hi,k):\n if lo>hi: return -1\n m=(lo+hi)//2; o.append(m)\n"
            " if a[m]==k: return m\n return bs(m+1,hi,k) if a[m]<k else bs(lo,m-1,k)\nbs(0,6,57); out=' '.join(map(str,o))"),

    # ---------------- Strings (7) ----------------
    dict(t="Strings", d="Easy", q=OUT_Q, note=N_STR + " " + N_ASCII,
         lines=["String s", "Integer i, count", "Set s = \"AcCeNtUrE\", count = 0",
                "for (each i from 0 to stringLength(s) - 1)", "        if (s[i] >= 'A' AND s[i] <= 'Z')",
                "                count = count + 1", "        End if", "End for", "Print count"],
         opts=["5", "4", "9", "6"],
         expl="Characters between 'A' and 'Z' are uppercase: A, C, N, U, E. count = 5.",
         py="out=str(sum(1 for ch in 'AcCeNtUrE' if 'A'<=ch<='Z'))"),
    dict(t="Strings", d="Medium", q=OUT_Q, note=N_STR + " " + N_ASCII,
         lines=["String s", "Integer i", "Set s = \"ABZ\"", "for (each i from 0 to stringLength(s) - 1)",
                "        if (s[i] EQUALS 'Z')", "                s[i] = 'A'", "        else",
                "                s[i] = s[i] + 1", "        End if", "End for", "Print s"],
         opts=["BCA", "BC[", "ZAB", "BCZ"],
         expl="Each letter moves one step forward (a Caesar shift) and 'Z' wraps round to 'A': "
              "A -> B, B -> C, Z -> A. Output: BCA. ('[' comes after 'Z' in ASCII, which is why the wrap is needed.)",
         py="out=''.join('A' if c=='Z' else chr(ord(c)+1) for c in 'ABZ')"),
    dict(t="Strings", d="Medium", q=OUT_Q, note=N_STR,
         lines=["String s, r", "Integer i", "Set s = \"aabbbcdd\"", "Set r = s[0]",
                "for (each i from 1 to stringLength(s) - 1)", "        if (s[i] NOT EQUALS s[i - 1])",
                "                r = r + s[i]", "        End if", "End for", "Print r"],
         opts=["abcd", "abd", "aabbcd", "abcdd"],
         expl="A character is added only when it differs from the one just before it, so each run of equal "
              "letters keeps one copy: aa -> a, bbb -> b, c, dd -> d. Output: abcd.",
         py="s='aabbbcdd'; r=s[0]\nfor i in range(1,len(s)):\n if s[i]!=s[i-1]: r+=s[i]\nout=r"),
    dict(t="Strings", d="Medium", q=OUT_Q, note=N_STR + " " + N_ASCII + " " + N_MOD,
         lines=["String s", "Integer i, sum", "Set s = \"ABC\", sum = 0",
                "for (each i from 0 to stringLength(s) - 1)", "        sum = sum + s[i]", "End for",
                "Print sum mod 7"],
         opts=["2", "198", "6", "0"],
         expl="Adding characters adds their ASCII codes: 65 + 66 + 67 = 198. 198 = 7 * 28 + 2, so 198 mod 7 = 2.",
         py="out=str(sum(map(ord,'ABC'))%7)"),
    dict(t="Strings", d="Hard", q=OUT_Q, note=N_STR + " " + N_SUB,
         lines=["String s", "Integer i, count", "Set s = \"banana\", count = 0",
                "for (each i from 0 to stringLength(s) - 3)", "        if (substring(s, i, 3) EQUALS \"ana\")",
                "                count = count + 1", "        End if", "End for", "Print count"],
         opts=["2", "1", "3", "0"],
         expl="Windows of 3 characters: ban, ana, nan, ana. \"ana\" matches at index 1 and index 3 (the matches "
              "overlap). count = 2.",
         py="s='banana'; out=str(sum(1 for i in range(len(s)-2) if s[i:i+3]=='ana'))"),
    dict(t="Strings", d="Medium", q=OUT_Q, note=N_STR + " " + N_ASCII,
         lines=["String s", "Integer i", "Set s = \"HeLLo\"", "for (each i from 0 to stringLength(s) - 1)",
                "        if (s[i] >= 'a' AND s[i] <= 'z')", "                s[i] = s[i] - 32", "        else",
                "                s[i] = s[i] + 32", "        End if", "End for", "Print s"],
         opts=["hEllO", "HELLO", "hello", "HeLLo"],
         expl="Upper and lower case letters differ by 32 in ASCII ('a' = 97, 'A' = 65). Lowercase letters become "
              "uppercase (- 32) and uppercase become lowercase (+ 32): HeLLo -> hEllO.",
         py="out=''.join(chr(ord(c)-32) if 'a'<=c<='z' else chr(ord(c)+32) for c in 'HeLLo')"),
    dict(t="Strings", d="Medium", q=OUT_Q,
         note=N_STR + " [Note - There are two spaces between \"love\" and \"coding\".]",
         lines=["String s", "Integer i, count", "Set s = \"I love  coding\", count = 0",
                "for (each i from 0 to stringLength(s) - 1)", "        if (s[i] EQUALS ' ')",
                "                count = count + 1", "        End if", "End for", "Print count + 1"],
         opts=["4", "3", "5", "14"],
         expl="The code counts spaces, not words. There are 3 spaces (one after I, two after love), so it "
              "prints 3 + 1 = 4 even though the sentence has only 3 words.",
         py="out=str('I love  coding'.count(' ')+1)"),

    # ---------------- Arrays (7) ----------------
    dict(t="Arrays", d="Medium", q=OUT_Q, note="",
         lines=["Integer a[6] = {12, 35, 1, 10, 34, 1}", "Integer i, first, second", "Set first = -1, second = -1",
                "for (each i from 0 to 5)", "        if (a[i] > first)", "                second = first",
                "                first = a[i]", "        else if (a[i] > second AND a[i] NOT EQUALS first)",
                "                second = a[i]", "        End if", "End for", "Print second"],
         opts=["34", "35", "12", "10"],
         expl="first keeps the largest, second the runner-up. After 12 and 35: first 35, second 12. "
              "34 > 12, so second = 34. No other value beats it. Output: 34 (the second largest).",
         py="f=s=-1\nfor x in [12,35,1,10,34,1]:\n if x>f: s=f; f=x\n elif x>s and x!=f: s=x\nout=str(s)"),
    dict(t="Arrays", d="Medium", q=OUT_Q, note="",
         lines=["Integer a[5] = {1, 2, 3, 4, 5}", "Integer i, k, temp", "for (each k from 1 to 2)",
                "        temp = a[0]", "        for (each i from 0 to 3)", "                a[i] = a[i + 1]",
                "        End for", "        a[4] = temp", "End for", "Print a[0] + a[4]"],
         opts=["5", "6", "8", "4"],
         expl="Each outer pass rotates the array left by one. After 2 passes: {3, 4, 5, 1, 2}. a[0] + a[4] = 3 + 2 = 5.",
         py="a=[1,2,3,4,5]\nfor k in range(2): a=a[1:]+a[:1]\nout=str(a[0]+a[4])"),
    dict(t="Arrays", d="Hard", q=OUT_Q, note="",
         lines=["Integer a[5] = {1, 2, 5, 3, 4}", "Integer i, temp, passes, swapped", "Set passes = 0", "do",
                "        swapped = 0", "        passes = passes + 1", "        for (each i from 0 to 3)",
                "                if (a[i] > a[i + 1])", "                        temp = a[i]",
                "                        a[i] = a[i + 1]", "                        a[i + 1] = temp",
                "                        swapped = 1", "                End if", "        End for",
                "while (swapped EQUALS 1)", "Print passes"],
         opts=["2", "4", "1", "5"],
         expl="Bubble sort with an early exit. Pass 1 swaps 5/3 and 5/4, giving {1, 2, 3, 4, 5} (swapped = 1). "
              "Pass 2 makes no swap, so the loop stops. passes = 2.",
         py="a=[1,2,5,3,4]; p=0\nwhile True:\n sw=0; p+=1\n for i in range(4):\n  if a[i]>a[i+1]: a[i],a[i+1]=a[i+1],a[i]; sw=1\n"
            " if not sw: break\nout=str(p)"),
    dict(t="Arrays", d="Medium", q=OUT_Q, note=N_MOD,
         lines=["Integer freq[10] = {0}", "Integer n, d, best", "Set n = 1223334", "while (n > 0)",
                "        freq[n mod 10] = freq[n mod 10] + 1", "        n = n / 10", "End while", "Set best = 0",
                "for (each d from 1 to 9)", "        if (freq[d] > freq[best])", "                best = d",
                "        End if", "End for", "Print best"],
         opts=["3", "2", "7", "1"],
         expl="freq counts each digit of 1223334: 1 -> 1, 2 -> 2, 3 -> 3, 4 -> 1. best ends as the digit "
              "with the highest count, which is 3.",
         py="from collections import Counter\nc=Counter('1223334'); out=max(c,key=c.get)"),
    dict(t="Arrays", d="Medium", q=OUT_Q, note="",
         lines=["Integer a[6] = {3, 1, 4, 1, 5, 9}", "Integer pre[6]", "Integer i", "pre[0] = a[0]",
                "for (each i from 1 to 5)", "        pre[i] = pre[i - 1] + a[i]", "End for", "Print pre[4] - pre[1]"],
         opts=["10", "9", "14", "6"],
         expl="pre[i] is the running total: {3, 4, 8, 9, 14, 23}. pre[4] - pre[1] = 14 - 4 = 10, which is the "
              "sum of a[2..4] = 4 + 1 + 5.",
         py="a=[3,1,4,1,5,9]; p=[a[0]]\nfor x in a[1:]: p.append(p[-1]+x)\nout=str(p[4]-p[1])"),
    dict(t="Arrays", d="Hard", q=OUT_Q, note="",
         lines=["Integer a[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}", "Integer i, j, temp", "for (each i from 0 to 2)",
                "        for (each j from i + 1 to 2)", "                temp = a[i][j]",
                "                a[i][j] = a[j][i]", "                a[j][i] = temp", "        End for", "End for",
                "Print a[0][2] - a[2][0]"],
         opts=["4", "-4", "0", "6"],
         expl="Swapping a[i][j] with a[j][i] above the diagonal transposes the matrix: rows become columns. "
              "After it a[0][2] = 7 and a[2][0] = 3, so 7 - 3 = 4.",
         py="a=[[1,2,3],[4,5,6],[7,8,9]]\nfor i in range(3):\n for j in range(i+1,3): a[i][j],a[j][i]=a[j][i],a[i][j]\n"
            "out=str(a[0][2]-a[2][0])"),
    dict(t="Arrays", d="Medium", q=OUT_Q, note="",
         lines=["Integer a[6] = {10, 20, 30, 40, 50, 0}", "Integer i, pos", "Set pos = 2",
                "for (each i from 5 down to pos + 1)", "        a[i] = a[i - 1]", "End for", "a[pos] = 25",
                "Print a[3] + a[5]"],
         opts=["80", "90", "70", "75"],
         expl="Elements from pos onwards shift one place right (from the end, so nothing is overwritten): "
              "{10, 20, 30, 30, 40, 50}. Then a[2] = 25: {10, 20, 25, 30, 40, 50}. a[3] + a[5] = 30 + 50 = 80.",
         py="a=[10,20,30,40,50,0]\nfor i in range(5,2,-1): a[i]=a[i-1]\na[2]=25; out=str(a[3]+a[5])"),

    # ---------------- OOPs (8) ----------------
    dict(t="OOPs", d="Hard", q=OUT_Q, note="", fixed_last=True,
         lines=["Class Animal", "        Function sound()", "                print \"Generic\"", "        End Function",
                "        Function walk()", "                print \"Walk\"", "        End Function", "End Class",
                "Class Dog Inherits Animal", "        Function sound()", "                print \"Bark\"",
                "        End Function", "End Class", "Animal a = Create Dog()", "a.sound()", "a.walk()"],
         opts=["Bark Walk", "Generic Walk", "Bark", "Compilation error"],
         expl="Runtime polymorphism: a is an Animal reference to a Dog object. sound() is overridden, so Dog's "
              "version runs (Bark). walk() is not overridden, so the inherited Animal version runs (Walk).",
         py="class A:\n def s(self): return 'Generic'\n def w(self): return 'Walk'\nclass D(A):\n def s(self): return 'Bark'\n"
            "a=D(); out=a.s()+' '+a.w()"),
    dict(t="OOPs", d="Medium", q=OUT_Q, note="[Note - super refers to the parent class.]",
         lines=["Class Parent", "        Function show()", "                print \"Parent\"", "        End Function",
                "End Class", "Class Child Inherits Parent", "        Function show()", "                super.show()",
                "                print \"Child\"", "        End Function", "End Class", "Child c = Create Child()",
                "c.show()"],
         opts=["Parent Child", "Child Parent", "Child", "Parent"],
         expl="Child overrides show() but first calls super.show(), which runs the Parent version. So Parent is "
              "printed, then Child.",
         py="class P:\n def s(self): return ['Parent']\nclass C(P):\n def s(self): return super().s()+['Child']\n"
            "out=' '.join(C().s())"),
    dict(t="OOPs", d="Medium", q=OUT_Q, note=N_STATIC_CLS, fixed_last=True,
         lines=["Class Student", "        static Integer count = 0", "        Constructor Student()",
                "                count = count + 1", "        End Constructor", "End Class",
                "Student s1 = Create Student()", "Student s2 = Create Student()", "Student s3 = Create Student()",
                "Print Student.count"],
         opts=["3", "1", "0", "Compilation error"],
         expl="count is static, so all objects share one copy. Each constructor call adds 1: three objects "
              "give count = 3. (A normal instance variable would be 1 in each object.)",
         py="class S:\n count=0\n def __init__(self): S.count+=1\nS();S();S(); out=str(S.count)"),
    dict(t="OOPs", d="Medium", q="Which statement about the following pseudocode is correct?", note="",
         lines=["Interface Printable", "        Function print()", "End Interface", "Interface Scannable",
                "        Function scan()", "End Interface", "Class Device Implements Printable, Scannable",
                "        Function print()", "                print \"Printing\"", "        End Function",
                "        Function scan()", "                print \"Scanning\"", "        End Function",
                "End Class"],
         opts=["Device gets multiple inheritance through interfaces and must define both print() and scan()",
               "Compilation error: a class cannot implement two interfaces",
               "Device may skip scan(), because Printable is implemented first",
               "Interfaces can be created directly like classes, e.g. Create Printable()"],
         expl="A class can implement several interfaces, which is how languages like Java get multiple "
              "inheritance. An interface only declares methods (abstraction), so the class must define every "
              "one of them. Interfaces cannot be instantiated.",
         py=None),
    dict(t="OOPs", d="Medium", q=OUT_Q, note="",
         lines=["Class Person", "        private Integer age = 18", "        Function setAge(Integer a)",
                "                if (a > 0)", "                        age = a", "                End if",
                "        End Function", "        Function getAge()", "                return age",
                "        End Function", "End Class", "Person p = Create Person()", "p.setAge(-5)",
                "print p.getAge()", "p.setAge(30)", "print p.getAge()"],
         opts=["18 30", "-5 30", "18 18", "0 30"],
         expl="age is private and can change only through setAge(), which rejects values <= 0. setAge(-5) is "
              "ignored, so age stays 18. setAge(30) is valid. Output: 18 30.",
         py="class P:\n def __init__(s): s.a=18\n def set(s,x):\n  if x>0: s.a=x\np=P(); o=[]\np.set(-5); o.append(p.a); p.set(30); o.append(p.a)\n"
            "out=' '.join(map(str,o))"),
    dict(t="OOPs", d="Hard", q=OUT_Q, note="[Note - Assigning one object variable to another copies the reference, "
                                           "not the object.]",
         lines=["Class Point", "        Integer x = 10", "End Class", "Point p1 = Create Point()", "Point p2 = p1",
                "p2.x = 50", "Point p3 = Create Point()", "Print p1.x + p3.x"],
         opts=["60", "20", "100", "110"],
         expl="p2 = p1 makes both names refer to the same object, so p2.x = 50 also changes p1.x. p3 is a new "
              "object with x = 10. 50 + 10 = 60.",
         py="class P:\n def __init__(s): s.x=10\np1=P(); p2=p1; p2.x=50; p3=P(); out=str(p1.x+p3.x)"),
    dict(t="OOPs", d="Medium", q=OUT_Q, note="[Note - this(...) inside a constructor calls another constructor of "
                                             "the same class.]",
         lines=["Class Box", "        Integer side", "        Constructor Box()", "                this(5)",
                "        End Constructor", "        Constructor Box(Integer s)", "                side = s",
                "        End Constructor", "End Class", "Box b1 = Create Box()", "Box b2 = Create Box(3)",
                "Print b1.side * b2.side"],
         opts=["15", "0", "25", "9"],
         expl="Constructor overloading: Box() has no parameter and passes 5 to Box(Integer s) using this(5), so "
              "b1.side = 5. b2 calls Box(3) directly, so b2.side = 3. 5 * 3 = 15.",
         py="class B:\n def __init__(s,x=5): s.side=x\nout=str(B().side*B(3).side)"),
    dict(t="OOPs", d="Easy", q="Which type of inheritance is shown in the following pseudocode?", note="",
         lines=["Class Vehicle", "        Function start()", "                print \"Starting\"",
                "        End Function", "End Class", "Class Car Inherits Vehicle", "End Class",
                "Class Bike Inherits Vehicle", "End Class"],
         opts=["Hierarchical inheritance", "Multilevel inheritance", "Multiple inheritance", "Hybrid inheritance"],
         expl="Two or more classes (Car, Bike) inherit from the same parent (Vehicle): that is hierarchical "
              "inheritance. Multilevel would be a chain (A -> B -> C); multiple would be one class with two parents.",
         py=None),

    # ---------------- Control flow (3) ----------------
    dict(t="Control flow", d="Hard", q=OUT_Q, note=N_SWITCH,
         lines=["Integer x, y", "Set x = 2, y = 0", "switch (x)", "        case 1:", "                y = y + 1",
                "        case 2:", "                y = y + 2", "        case 3:", "                y = y + 3",
                "                break", "        default:", "                y = y + 10", "End switch", "Print y"],
         opts=["5", "2", "15", "6"],
         expl="Execution starts at case 2 (y = 2). There is no break, so it falls through into case 3 (y = 5), "
              "where break stops it before default. Output: 5.",
         py="out=str(2+3)"),
    dict(t="Control flow", d="Medium", q=OUT_Q, note=N_TERN,
         lines=["Integer a, b, c, mx, mn", "Set a = 5, b = 9, c = 7", "mx = (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c)",
                "mn = (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c)", "Print mx * 10 + mn"],
         opts=["95", "97", "59", "75"],
         expl="mx: a > b is false, so take (b > c) ? b : c = 9. mn: a < b is true, so take (a < c) ? a : c = 5. "
              "9 * 10 + 5 = 95.",
         py="a,b,c=5,9,7; mx=max(a,b,c); mn=min(a,b,c); out=str(mx*10+mn)"),
    dict(t="Control flow", d="Hard", q=OUT_Q, note=N_SC,
         lines=["Integer i, j", "Set i = 5, j = 0", "if ((i > 10) && (++i > 5))", "        j = 1", "End if",
                "if ((i < 10) || (++i > 5))", "        j = j + 2", "End if", "Print i + j"],
         opts=["7", "9", "8", "6"],
         expl="First if: i > 10 is false, so && skips ++i. Second if: i < 10 is true, so || skips ++i and "
              "j = 2. i never changes from 5, so 5 + 2 = 7.",
         py="i,j=5,0\nif i>10:\n i+=1\n if i>5: j=1\nif i<10: j+=2\nelse:\n i+=1\n if i>5: j+=2\nout=str(i+j)"),
]


def verify():
    bad = 0
    for n, q in enumerate(Q, 1):
        if q["py"] is None:
            continue
        env = {}
        exec(q["py"], env)
        if env["out"] != q["opts"][0]:
            bad += 1
            print("MISMATCH", n, repr(env["out"]), "!=", repr(q["opts"][0]))
    assert len({tuple(q["lines"]) for q in Q}) == len(Q), "duplicate code"
    for q in Q:
        assert len(set(q["opts"])) == 4, q["opts"]
    return bad


if __name__ == "__main__":
    from collections import Counter
    print(len(Q), "questions", Counter(q["t"] for q in Q), Counter(q["d"] for q in Q))
    print("mismatches:", verify())
