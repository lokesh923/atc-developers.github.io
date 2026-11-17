"""Official Accenture coding questions for the Backend (DSA) part of the full exam simulation.

Each problem is function-based, as in the real Accenture test: the candidate fills in a method of
class UserMainCode (Python 3, Java, C++) or a plain function (C). The exam page adds a hidden driver
that reads the test data and calls the function, and runs the program on a real compiler.

Python's reference solution checks every expected answer when this file runs:
    python3 official_coding.py
"""
import json
import random

# ---------------------------------------------------------------- Question 1
Q1_HTML = """
<p>A high-speed test track is hosting an experiment with <b>N</b> prototype cars, each with a unique acceleration system, where</p>
<ul>
<li>All N cars start at position 0 with an initial speed of 0.</li>
<li>Every second, the i<sup>th</sup> car increases its speed by <b>A[i]</b>.</li>
<li>The car moves forward exactly by its current speed every second.</li>
</ul>
<p>Your task is to find and return an integer value representing the exact distance covered by the <b>X<sup>th</sup></b> car after <b>S</b> minutes.</p>
<p><b>Note:</b> <i>Time S is given in minutes with exactly one decimal place (e.g., 1.5, 0.3).</i></p>
<div class="sec">Input Specification:</div>
<div class="spec"><b>input1 :</b> An integer value N representing the number of cars.<br>
<b>input2 :</b> An integer array A representing the different acceleration of the N cars.<br>
<b>input3 :</b> An integer value X representing the car index.<br>
<b>input4 :</b> A double value S representing the minutes with exactly one decimal place.</div>
<div class="sec">Output Specification:</div>
<div class="spec">Return an integer value representing the total distance covered by the X<sup>th</sup> car after S minutes.</div>
"""

Q1_EXAMPLES = [
    ("S = 1.5 minutes = 90 seconds. For the 3<sup>rd</sup> car, A[3] = 1.<br>Distance after t seconds = A[3] &times; t &times; (t + 1) / 2<br>"
     "= 1 &times; 90 &times; 91 / 2 = 4095.<br><span class=\"misprint\">The original paper prints <b>Output : 3</b> here, which is a misprint; "
     "the explanation's answer, 4095, is what the judge expects.</span>"),
    ("S = 2.0 minutes = 120 seconds. For the 2<sup>nd</sup> car, A[2] = 2.<br>Distance after t seconds = A[2] &times; t &times; (t + 1) / 2<br>"
     "= 2 &times; 120 &times; 121 / 2 = 14520.<br><span class=\"misprint\">The original paper prints <b>14640</b> here, but "
     "2 &times; 120 &times; 121 / 2 = 14520 (the same formula as Example 1); the judge expects 14520.</span>"),
]


def q1_ref(n, a, x, s):
    t = round(float(s) * 60)          # minutes -> whole seconds; round, never truncate (4.1 * 60 = 245.99999...)
    return a[x - 1] * t * (t + 1) // 2


def q1_tests():
    T = [((4, [2, 4, 1, 3], 3, "1.5"), None, False),
         ((3, [1, 2, 3], 2, "2.0"), None, False),
         # hidden
         ((5, [7, 1, 9, 3, 5], 4, "0.3"), None, False),
         ((2, [10, 20], 1, "4.1"), None, False),          # truncating 4.1*60 gives 245 instead of 246
         ((1, [1], 1, "0.1"), None, False),
         ((6, [3, 8, 2, 6, 4, 9], 6, "8.2"), None, False),   # another floating-point trap
         ((4, [5, 7, 9, 11], 2, "0.0"), None, False),     # zero time
         ((3, [9999, 10000, 5000], 2, "99.9"), None, False),  # needs 64-bit (about 1.8e11)
         ((7, [12, 40, 3, 25, 18, 7, 31], 5, "16.4"), None, False)]
    return [(args, q1_ref(*args), big) for args, _, big in T]


# ---------------------------------------------------------------- Question 2
Q2_HTML = """
<p>You are given two integer arrays <b>A</b> and <b>B</b>, both of length <b>N</b>. You have to find the index <i>i</i> in array <b>A</b> such that the sum of absolute differences between <b>A[<i>i</i>]</b> and every element in array <b>B</b> is maximized. Formally, for each index <i>i</i>, calculate:</p>
<div class="formula">sum = |A[<i>i</i>] &minus; B[0]| + |A[<i>i</i>] &minus; B[1]| + &middot;&middot;&middot; + |A[<i>i</i>] &minus; B[N&minus;1]|</div>
<p>Your task is to find and return an integer value representing the smallest index <i>i</i> that gives the maximum sum.</p>
<div class="sec">Input Specification:</div>
<div class="spec"><b>input1 :</b> An integer value <b>N</b> representing the size of the array.<br>
<b>input2 :</b> An integer array A.<br>
<b>input3 :</b> An integer array B.</div>
<div class="sec">Output Specification:</div>
<div class="spec">Return an integer value representing the smallest index <i>i</i> that gives the maximum sum.</div>
<div class="sec">Constraints:</div>
<ul><li>1 &le; N &le; 10<sup>5</sup></li><li>&minus;10<sup>9</sup> &le; A[i], B[i] &le; 10<sup>9</sup></li></ul>
"""

NOTE2 = ('<br><span class="misprint">The original paper lists different sums for this example ({0}), which do not follow the '
         'formula above; the sums here are recalculated with the formula{1}.</span>')
Q2_EXAMPLES = [
    "Sums: <i>i</i> = 0 &rarr; |1&minus;2| + |1&minus;3| + |1&minus;1| = 3, <i>i</i> = 1 &rarr; 2, <i>i</i> = 2 &rarr; 3.<br>Maximum sum = 3 at indices 0 and 2, so return the smallest index = 0."
    + NOTE2.format("3, 4, 3 with output 1", ", so the expected output is 0"),
    "Sums: <i>i</i> = 0 &rarr; 8, <i>i</i> = 1 &rarr; 10, <i>i</i> = 2 &rarr; 6, <i>i</i> = 3 &rarr; 8.<br>Maximum sum = 10 at index 1."
    + NOTE2.format("8, 12, 8, 10", "; the output, 1, is the same"),
    "Sums: <i>i</i> = 0 &rarr; 21, <i>i</i> = 1 &rarr; 13, <i>i</i> = 2 &rarr; 12, <i>i</i> = 3 &rarr; 16, <i>i</i> = 4 &rarr; 12.<br>Maximum sum = 21 at index 0."
    + NOTE2.format("22, 15, 16, 24, 17 with output 3", ", so the expected output is 0"),
    "Sums: <i>i</i> = 0 &rarr; |10+4| + |10&minus;6| = 18, <i>i</i> = 1 &rarr; |&minus;5+4| + |&minus;5&minus;6| = 12.<br>Maximum sum = 18 at index 0."
    + NOTE2.format("24, 12", "; the output, 0, is the same"),
    "Sums: <i>i</i> = 0 &rarr; 10, <i>i</i> = 1 &rarr; 10, <i>i</i> = 2 &rarr; 10.<br>Maximum sum = 10 for all indices, so return the smallest index = 0."
    + NOTE2.format("12 for every index", "; the output, 0, is the same"),
]


def q2_brute(n, a, b):
    best, idx = None, 0
    for i in range(n):
        s = sum(abs(a[i] - y) for y in b)
        if best is None or s > best:
            best, idx = s, i
    return idx


def q2_ref(n, a, b):
    import bisect
    sb = sorted(b)
    pre = [0]
    for v in sb:
        pre.append(pre[-1] + v)
    best, idx = None, 0
    for i in range(n):
        k = bisect.bisect_left(sb, a[i])
        s = a[i] * k - pre[k] + (pre[n] - pre[k]) - a[i] * (n - k)
        if best is None or s > best:
            best, idx = s, i
    return idx


def q2_tests():
    rnd = random.Random(2027)
    T = [((3, [1, 2, 3], [2, 3, 1]), False),
         ((4, [1, 5, 2, 4], [3, 1, 2, 6]), False),
         ((5, [-2, 0, 3, 5, 1], [4, -1, 2, 6, 0]), False),
         ((2, [10, -5], [-4, 6]), False),
         ((3, [7, 7, 7], [1, 5, 9]), False),
         # hidden
         ((1, [42], [-7]), False),
         ((6, [-9, -3, -12, -1, -7, -12], [-5, -8, -2, -10, -4, -6]), False),
         ((5, [3, 9, 5, 1, 9], [5, 5, 5, 5, 5]), False),                       # tie between index 1 and 4... and 3
         ((6, [1000000000, -1000000000, 5, 0, -1000000000, 999999999],
           [-1000000000, 1000000000, -999999999, 999999998, 7, -3]), False),   # sums overflow 32-bit
         ((50, [rnd.randint(-1000, 1000) for _ in range(50)], [rnd.randint(-1000, 1000) for _ in range(50)]), False)]
    big_n = 20000
    T.append(((big_n, [rnd.randint(-10 ** 9, 10 ** 9) for _ in range(big_n)],
               [rnd.randint(-10 ** 9, 10 ** 9) for _ in range(big_n)]), True))     # needs O(N log N)
    out = []
    for args, big in T:
        exp = q2_ref(*args)
        if args[0] <= 50:
            assert exp == q2_brute(*args), args
        out.append((args, exp, big))
    return out


# ---------------------------------------------------------------- templates and reference solutions
REF = {
    "distanceCovered": {
        "python": """class UserMainCode(object):
    @classmethod
    def distanceCovered(cls, input1, input2, input3, input4):
        # S minutes -> seconds. Round: 4.1 * 60 is 245.99999... in floating point.
        t = round(input4 * 60)
        a = input2[input3 - 1]          # X is 1-based
        return a * t * (t + 1) // 2     # 1 + 2 + ... + t seconds of speed
""",
        "java": """import java.io.*;
import java.util.*;

class UserMainCode
{
    public long distanceCovered(int input1, int[] input2, int input3, double input4){
        long t = Math.round(input4 * 60);   // round, never cast: 4.1 * 60 = 245.99999...
        long a = input2[input3 - 1];        // X is 1-based
        return a * t * (t + 1) / 2;
    }
}
""",
        "cpp": """#include <bits/stdc++.h>
using namespace std;

class UserMainCode
{
public:
    static long long distanceCovered(int input1, int input2[], int input3, double input4)
    {
        long long t = llround(input4 * 60);   // round, never cast: 4.1 * 60 = 245.99999...
        long long a = input2[input3 - 1];     // X is 1-based
        return a * t * (t + 1) / 2;
    }
};
""",
        "c": """#include <stdio.h>
#include <string.h>
#include <stdlib.h>

long long distanceCovered(int input1, int input2[], int input3, double input4)
{
    long long t = (long long)(input4 * 60 + 0.5);   /* round, never truncate */
    long long a = input2[input3 - 1];               /* X is 1-based */
    return a * t * (t + 1) / 2;
}
""",
    },
    "maxSumIndex": {
        "python": """import bisect

class UserMainCode(object):
    @classmethod
    def maxSumIndex(cls, input1, input2, input3):
        n, a, b = input1, input2, input3
        sb = sorted(b)
        pre = [0]
        for v in sb:
            pre.append(pre[-1] + v)
        best, idx = None, 0
        for i in range(n):
            k = bisect.bisect_left(sb, a[i])          # k values of B are smaller than A[i]
            s = a[i] * k - pre[k] + (pre[n] - pre[k]) - a[i] * (n - k)
            if best is None or s > best:              # strict: keeps the smallest index
                best, idx = s, i
        return idx
""",
        "java": """import java.io.*;
import java.util.*;

class UserMainCode
{
    public int maxSumIndex(int input1, int[] input2, int[] input3){
        int n = input1;
        long[] b = new long[n];
        for (int i = 0; i < n; i++) b[i] = input3[i];
        Arrays.sort(b);
        long[] pre = new long[n + 1];
        for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + b[i];
        long best = Long.MIN_VALUE; int idx = 0;
        for (int i = 0; i < n; i++) {
            long x = input2[i];
            int lo = 0, hi = n;                      // first position with b[pos] >= x
            while (lo < hi) { int m = (lo + hi) / 2; if (b[m] < x) lo = m + 1; else hi = m; }
            long s = x * lo - pre[lo] + (pre[n] - pre[lo]) - x * (n - lo);
            if (s > best) { best = s; idx = i; }     // strict: keeps the smallest index
        }
        return idx;
    }
}
""",
        "cpp": """#include <bits/stdc++.h>
using namespace std;

class UserMainCode
{
public:
    static int maxSumIndex(int input1, int input2[], int input3[])
    {
        int n = input1;
        vector<long long> b(input3, input3 + n);
        sort(b.begin(), b.end());
        vector<long long> pre(n + 1, 0);
        for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + b[i];
        long long best = LLONG_MIN; int idx = 0;
        for (int i = 0; i < n; i++) {
            long long x = input2[i];
            int k = lower_bound(b.begin(), b.end(), x) - b.begin();
            long long s = x * k - pre[k] + (pre[n] - pre[k]) - x * (n - k);
            if (s > best) { best = s; idx = i; }   // strict: keeps the smallest index
        }
        return idx;
    }
};
""",
        "c": """#include <stdio.h>
#include <string.h>
#include <stdlib.h>

static int cmp(const void *p, const void *q)
{
    long long a = *(const long long *)p, b = *(const long long *)q;
    return (a > b) - (a < b);
}

int maxSumIndex(int input1, int input2[], int input3[])
{
    int n = input1, idx = 0, i;
    long long *b = malloc(sizeof(long long) * n), *pre = malloc(sizeof(long long) * (n + 1));
    long long best = 0;
    for (i = 0; i < n; i++) b[i] = input3[i];
    qsort(b, n, sizeof(long long), cmp);
    pre[0] = 0;
    for (i = 0; i < n; i++) pre[i + 1] = pre[i] + b[i];
    for (i = 0; i < n; i++) {
        long long x = input2[i], s;
        int lo = 0, hi = n;                  /* first position with b[pos] >= x */
        while (lo < hi) { int m = (lo + hi) / 2; if (b[m] < x) lo = m + 1; else hi = m; }
        s = x * lo - pre[lo] + (pre[n] - pre[lo]) - x * (n - lo);
        if (i == 0 || s > best) { best = s; idx = i; }   /* strict: keeps the smallest index */
    }
    free(b); free(pre);
    return idx;
}
""",
    },
}

APPROACH = {
    "distanceCovered": [
        "The speed after second k is A[X] &times; k, so the distance after t seconds is A[X] &times; (1 + 2 + &hellip; + t) = A[X] &times; t &times; (t + 1) / 2.",
        "Convert S minutes to seconds with <b>rounding</b>: in floating point 4.1 &times; 60 = 245.99999&hellip;, so a plain cast gives 245 instead of 246.",
        "Both examples of the original paper have misprinted outputs (3 and 14640); the formula in their explanations gives 4095 and 14520.",
        "X is 1-based (the 3<sup>rd</sup> car is A[3] in the examples), so use A[X &minus; 1] in code.",
        "The answer can pass 2<sup>31</sup>, so compute it in a 64-bit type (long / long long).",
    ],
    "maxSumIndex": [
        "Brute force (every A[i] against every B[j]) is O(N<sup>2</sup>), which is 10<sup>10</sup> steps for N = 10<sup>5</sup>: too slow.",
        "Sort B and build prefix sums. For A[i], binary-search k = how many values of B are below A[i]; then the sum is A[i]&middot;k &minus; (sum of those k) + (sum of the rest) &minus; A[i]&middot;(N &minus; k). Total O(N log N).",
        "Sums reach about 2&times;10<sup>14</sup>, so use 64-bit integers.",
        "The sums printed in the original paper's examples do not follow the formula; the examples here are recalculated (expected outputs 0, 1, 0, 0, 0).",
        "Update the answer only when a sum is strictly greater, so the smallest index wins ties.",
    ],
}


def problems():
    q1 = q1_tests()
    q2 = q2_tests()
    return [
        {"id": "acc_cars", "official": True, "title": "Distance Covered by the X<sup>th</sup> Car", "plain": "Distance covered by the Xth car",
         "html": Q1_HTML, "func": "distanceCovered", "params": ["int", "int[]", "int", "double"], "ret": "long",
         "examples": Q1_EXAMPLES, "tests": [{"args": list(a), "exp": str(e), "big": b} for a, e, b in q1],
         "ref": REF["distanceCovered"], "approach": APPROACH["distanceCovered"]},
        {"id": "acc_absdiff", "official": True, "title": "Index with the Maximum Sum of Absolute Differences", "plain": "Index with the maximum sum of absolute differences",
         "html": Q2_HTML, "func": "maxSumIndex", "params": ["int", "int[]", "int[]"], "ret": "int",
         "examples": Q2_EXAMPLES, "tests": [{"args": list(a), "exp": str(e), "big": b} for a, e, b in q2],
         "ref": REF["maxSumIndex"], "approach": APPROACH["maxSumIndex"]},
    ]


def verify():
    ps = problems()
    q1 = ps[0]["tests"]
    assert [t["exp"] for t in q1[:2]] == ["4095", "14520"]
    assert q1[3]["exp"] == str(10 * 246 * 247 // 2)
    assert int(q1[7]["exp"]) > 2 ** 31
    q2 = ps[1]["tests"]
    assert [t["exp"] for t in q2[:5]] == ["0", "1", "0", "0", "0"]
    for p in ps:
        assert len(p["examples"]) <= len(p["tests"])
    return ps


if __name__ == "__main__":
    ps = verify()
    for p in ps:
        print(p["id"], [t["exp"] for t in p["tests"] if not t["big"]], "big:", [t["exp"] for t in p["tests"] if t["big"]])
    print(len(json.dumps(ps)) // 1024, "KB")
