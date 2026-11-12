"""Solved DSA problems for the Coding Assessment guide.

Every problem has a full Java program and a full Python program that read from standard input,
and test cases (stdin -> expected stdout). build_coding_guide.py runs every program on every test.
"""

P = []


def prob(**kw):
    P.append(kw)


# =========================================================================== ARRAYS
prob(id="arr1", topic="Arrays", level="Easy", title="Second Largest Distinct Element",
     statement="Given an array of N integers, print the second largest <b>distinct</b> value. If it does not exist "
               "(all values equal, or N = 1), print -1.",
     fmt="Line 1: N. Line 2: N integers.",
     approach=["Keep two variables: <b>first</b> (largest) and <b>second</b>, both starting at the smallest possible value.",
               "For each x: if x &gt; first, the old first becomes second and x becomes first.",
               "Else if x &lt; first and x &gt; second, x becomes second (x == first is skipped, so duplicates of the max do not count).",
               "One pass, no sorting needed."],
     time="O(N)", space="O(1)",
     trap="Sorting and taking arr[n-2] is wrong when the maximum repeats: [5, 5, 3] must give 3, not 5.",
     java=r'''import java.util.*;

public class Main {
    static long secondLargest(long[] a) {
        long first = Long.MIN_VALUE, second = Long.MIN_VALUE;
        for (long x : a) {
            if (x > first) {
                second = first;
                first = x;
            } else if (x < first && x > second) {
                second = x;
            }
        }
        return second == Long.MIN_VALUE ? -1 : second;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextLong();
        System.out.println(secondLargest(a));
    }
}''',
     py=r'''def second_largest(a):
    first = second = None
    for x in a:
        if first is None or x > first:
            second, first = first, x
        elif x < first and (second is None or x > second):
            second = x
    return -1 if second is None else second

n = int(input())
a = list(map(int, input().split()))
print(second_largest(a))''',
     tests=[("6\n12 35 1 10 34 1\n", "34"), ("3\n5 5 3\n", "3"), ("4\n7 7 7 7\n", "-1"), ("1\n9\n", "-1"),
            ("5\n-3 -1 -7 -1 -2\n", "-2")])

prob(id="arr2", topic="Arrays", level="Medium", title="Maximum Subarray Sum (Kadane's Algorithm)",
     statement="Given N integers (some may be negative), print the largest sum of a <b>contiguous</b> subarray "
               "with at least one element.",
     fmt="Line 1: N. Line 2: N integers.",
     approach=["<b>cur</b> = best sum of a subarray that ends at the current index; <b>best</b> = best seen so far.",
               "For each x: cur = max(x, cur + x) — either start fresh at x or extend the previous subarray.",
               "best = max(best, cur). Start both with the first element so an all-negative array works."],
     time="O(N)", space="O(1)",
     trap="Starting best at 0 prints 0 for an all-negative array; the answer must be the largest single element.",
     java=r'''import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long cur = sc.nextLong(), best = cur;
        for (int i = 1; i < n; i++) {
            long x = sc.nextLong();
            cur = Math.max(x, cur + x);
            best = Math.max(best, cur);
        }
        System.out.println(best);
    }
}''',
     py=r'''n = int(input())
a = list(map(int, input().split()))
cur = best = a[0]
for x in a[1:]:
    cur = max(x, cur + x)
    best = max(best, cur)
print(best)''',
     tests=[("9\n-2 1 -3 4 -1 2 1 -5 4\n", "6"), ("3\n-5 -2 -8\n", "-2"), ("5\n1 2 3 4 5\n", "15"), ("1\n-7\n", "-7")])

prob(id="arr3", topic="Arrays", level="Medium", title="Rotate an Array to the Right by K",
     statement="Rotate an array of N integers to the right by K steps (K can be larger than N) and print it.",
     fmt="Line 1: N and K. Line 2: N integers.",
     approach=["Rotating N times gives the same array, so first do <b>k = k % n</b>.",
               "Reversal trick: reverse the whole array, then reverse the first k elements, then reverse the rest.",
               "Example [1 2 3 4 5], k=2: reverse all → 5 4 3 2 1 → reverse first 2 → 4 5 3 2 1 → reverse rest → 4 5 1 2 3."],
     time="O(N)", space="O(1) extra",
     trap="Forgetting k % n gives an index error (or many wasted rotations) when K &gt; N.",
     java=r'''import java.util.*;

public class Main {
    static void reverse(int[] a, int i, int j) {
        while (i < j) {
            int t = a[i]; a[i] = a[j]; a[j] = t;
            i++; j--;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        k %= n;
        reverse(a, 0, n - 1);
        reverse(a, 0, k - 1);
        reverse(a, k, n - 1);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(a[i]).append(i < n - 1 ? " " : "");
        System.out.println(sb);
    }
}''',
     py=r'''n, k = map(int, input().split())
a = list(map(int, input().split()))
k %= n
a = a[-k:] + a[:-k] if k else a      # slicing does the rotation
print(*a)''',
     tests=[("5 2\n1 2 3 4 5\n", "4 5 1 2 3"), ("3 7\n10 20 30\n", "30 10 20"), ("4 4\n1 2 3 4\n", "1 2 3 4"),
            ("1 3\n9\n", "9")])

prob(id="arr4", topic="Two Pointers", level="Easy", title="Move Zeros to the End",
     statement="Move all 0s to the end of the array while keeping the order of the non-zero elements. Print the array.",
     fmt="Line 1: N. Line 2: N integers.",
     approach=["Pointer <b>w</b> (write position) starts at 0.",
               "Scan with i: whenever a[i] != 0, copy it to a[w] and move w forward.",
               "Finally fill positions w..n-1 with 0. Non-zero order is preserved because we copy left to right."],
     time="O(N)", space="O(1)",
     trap="Swapping zeros with the last element breaks the order of the non-zero values.",
     java=r'''import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int w = 0;
        for (int i = 0; i < n; i++)
            if (a[i] != 0) a[w++] = a[i];
        while (w < n) a[w++] = 0;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(a[i]).append(i < n - 1 ? " " : "");
        System.out.println(sb);
    }
}''',
     py=r'''n = int(input())
a = list(map(int, input().split()))
w = 0
for x in a:
    if x != 0:
        a[w] = x
        w += 1
for i in range(w, n):
    a[i] = 0
print(*a)''',
     tests=[("5\n0 1 0 3 12\n", "1 3 12 0 0"), ("3\n0 0 0\n", "0 0 0"), ("4\n4 -2 0 5\n", "4 -2 5 0")])

# =========================================================================== STRINGS
prob(id="str1", topic="Strings", level="Easy", title="Valid Palindrome (Ignore Case and Symbols)",
     statement="A sentence is a palindrome if, after keeping only letters and digits and ignoring case, it reads the "
               "same forwards and backwards. Print <b>YES</b> or <b>NO</b>.",
     fmt="One line of text (may contain spaces and punctuation).",
     approach=["Two pointers: i from the left, j from the right.",
               "Skip characters that are not letters or digits.",
               "Compare lower-case characters; if they differ print NO. If the pointers meet, print YES."],
     time="O(N)", space="O(1)",
     trap="Comparing without skipping spaces/punctuation, or without ignoring case, fails \"A man, a plan, a canal: Panama\".",
     java=r'''import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        int i = 0, j = s.length() - 1;
        boolean ok = true;
        while (i < j) {
            char a = s.charAt(i), b = s.charAt(j);
            if (!Character.isLetterOrDigit(a)) { i++; continue; }
            if (!Character.isLetterOrDigit(b)) { j--; continue; }
            if (Character.toLowerCase(a) != Character.toLowerCase(b)) { ok = false; break; }
            i++; j--;
        }
        System.out.println(ok ? "YES" : "NO");
    }
}''',
     py=r'''s = input()
clean = [c.lower() for c in s if c.isalnum()]
print("YES" if clean == clean[::-1] else "NO")''',
     tests=[("A man, a plan, a canal: Panama\n", "YES"), ("race a car\n", "NO"), ("No 'x' in Nixon\n", "YES"),
            ("ab\n", "NO")])

prob(id="str2", topic="Strings", level="Easy", title="Check if Two Strings are Anagrams",
     statement="Two words are anagrams if they contain the same letters the same number of times (case-insensitive). "
               "Print <b>YES</b> or <b>NO</b>.",
     fmt="Two lines, one word on each.",
     approach=["If the lengths differ, the answer is NO.",
               "Count letters with an int[26] array (or a HashMap/Counter): +1 for each letter of the first word, -1 for the second.",
               "They are anagrams only if every count ends at 0."],
     time="O(N)", space="O(1) (26 counters)",
     trap="Sorting both strings also works (O(N log N)), but remember to lower-case them first.",
     java=r'''import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a = sc.next().toLowerCase(), b = sc.next().toLowerCase();
        if (a.length() != b.length()) { System.out.println("NO"); return; }
        int[] cnt = new int[26];
        for (int i = 0; i < a.length(); i++) {
            cnt[a.charAt(i) - 'a']++;
            cnt[b.charAt(i) - 'a']--;
        }
        for (int c : cnt) if (c != 0) { System.out.println("NO"); return; }
        System.out.println("YES");
    }
}''',
     py=r'''from collections import Counter

a = input().strip().lower()
b = input().strip().lower()
print("YES" if Counter(a) == Counter(b) else "NO")''',
     tests=[("Listen\nSilent\n", "YES"), ("rat\ncar\n", "NO"), ("aab\nabb\n", "NO"), ("Dusty\nstudy\n", "YES")])

prob(id="str3", topic="Hashing", level="Easy", title="First Non-Repeating Character",
     statement="Print the first character of the string that appears exactly once. If there is none, print -1.",
     fmt="One line: a string of lowercase letters.",
     approach=["Pass 1: count every character (int[26] or HashMap).",
               "Pass 2: walk the string again in order and print the first character whose count is 1.",
               "Two passes over the string keep the original order."],
     time="O(N)", space="O(1)",
     trap="Iterating over a HashMap instead of the string loses the original order (HashMap is unordered).",
     java=r'''import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int[] cnt = new int[26];
        for (char c : s.toCharArray()) cnt[c - 'a']++;
        for (char c : s.toCharArray()) {
            if (cnt[c - 'a'] == 1) { System.out.println(c); return; }
        }
        System.out.println(-1);
    }
}''',
     py=r'''from collections import Counter

s = input().strip()
cnt = Counter(s)
print(next((c for c in s if cnt[c] == 1), -1))''',
     tests=[("leetcode\n", "l"), ("loveleetcode\n", "v"), ("aabb\n", "-1"), ("z\n", "z")])

prob(id="str4", topic="Strings", level="Easy", title="Reverse the Words of a Sentence",
     statement="Reverse the order of the words in a sentence. Words are separated by one or more spaces; print them "
               "separated by a single space with no leading or trailing spaces.",
     fmt="One line of text.",
     approach=["Split on whitespace: Java <code>trim().split(\"\\\\s+\")</code>, Python <code>split()</code> (no argument) — both drop empty pieces.",
               "Join the words in reverse order with a single space."],
     time="O(N)", space="O(N)",
     trap="split(\" \") keeps empty strings when there are double spaces, giving extra spaces in the output.",
     java=r'''import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.hasNextLine() ? sc.nextLine().trim() : "";
        if (line.isEmpty()) { System.out.println(); return; }
        String[] w = line.split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = w.length - 1; i >= 0; i--) {
            sb.append(w[i]);
            if (i > 0) sb.append(' ');
        }
        System.out.println(sb);
    }
}''',
     py=r'''words = input().split()
print(" ".join(reversed(words)))''',
     tests=[("the sky is blue\n", "blue is sky the"), ("  hello   world  \n", "world hello"), ("single\n", "single")])

prob(id="str5", topic="Strings", level="Medium", title="String Compression (Run-Length Encoding)",
     statement="Compress a string by replacing each run of the same character with the character followed by the run "
               "length, e.g. <b>aaabbc → a3b2c1</b>.",
     fmt="One line: a non-empty string of letters.",
     approach=["Walk the string with index i; count how far the same character continues (index j).",
               "Append the character and the count (j - i), then jump i to j.",
               "Use a StringBuilder in Java (string + in a loop is slow, O(N²))."],
     time="O(N)", space="O(N)",
     trap="Forgetting to output the last run after the loop ends (when using a single loop with a counter).",
     java=r'''import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        StringBuilder sb = new StringBuilder();
        int i = 0;
        while (i < s.length()) {
            int j = i;
            while (j < s.length() && s.charAt(j) == s.charAt(i)) j++;
            sb.append(s.charAt(i)).append(j - i);
            i = j;
        }
        System.out.println(sb);
    }
}''',
     py=r'''from itertools import groupby

s = input().strip()
print("".join(ch + str(len(list(run))) for ch, run in groupby(s)))''',
     tests=[("aaabbc\n", "a3b2c1"), ("abc\n", "a1b1c1"), ("zzzzzzzzzzzz\n", "z12"), ("aabaa\n", "a2b1a2")])

# =========================================================================== HASHING
prob(id="hash1", topic="Hashing", level="Easy", title="Two Sum (Return the Indices)",
     statement="Given N integers and a target T, print the 0-based indices <b>i &lt; j</b> of the two numbers that add "
               "up to T (exactly one answer exists).",
     fmt="Line 1: N and T. Line 2: N integers.",
     approach=["Brute force checks every pair: O(N²).",
               "Better: a HashMap from value → index of the numbers seen so far.",
               "For each a[j], if (T - a[j]) is already in the map, the answer is (map[T - a[j]], j). Otherwise store a[j]."],
     time="O(N)", space="O(N)",
     trap="Storing all numbers first and then searching can pair an element with itself (e.g. T = 6 and a 3).",
     java=r'''import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long t = sc.nextLong();
        Map<Long, Integer> seen = new HashMap<>();
        for (int j = 0; j < n; j++) {
            long x = sc.nextLong();
            if (seen.containsKey(t - x)) {
                System.out.println(seen.get(t - x) + " " + j);
                return;
            }
            seen.put(x, j);
        }
    }
}''',
     py=r'''n, t = map(int, input().split())
a = list(map(int, input().split()))
seen = {}
for j, x in enumerate(a):
    if t - x in seen:
        print(seen[t - x], j)
        break
    seen[x] = j''',
     tests=[("4 9\n2 7 11 15\n", "0 1"), ("3 6\n3 2 4\n", "1 2"), ("2 6\n3 3\n", "0 1"), ("5 -1\n-3 4 1 2 9\n", "0 3")])

prob(id="hash2", topic="Hashing", level="Medium", title="Most Frequent Element (Smallest on a Tie)",
     statement="Print the value that appears most often. If several values share the highest frequency, print the "
               "smallest of them, followed by its frequency.",
     fmt="Line 1: N. Line 2: N integers.",
     approach=["Count frequencies in a HashMap (Python: Counter).",
               "Pick the entry with the highest count; on equal counts prefer the smaller value.",
               "Compare with a clear rule: (count bigger) OR (count equal AND value smaller)."],
     time="O(N)", space="O(N)",
     trap="Returning the first value reached in the map on a tie — HashMap order is not sorted or insertion order.",
     java=r'''import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Map<Integer, Integer> freq = new HashMap<>();
        for (int i = 0; i < n; i++) freq.merge(sc.nextInt(), 1, Integer::sum);
        int bestVal = 0, bestCnt = 0;
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            int v = e.getKey(), c = e.getValue();
            if (c > bestCnt || (c == bestCnt && v < bestVal)) {
                bestVal = v;
                bestCnt = c;
            }
        }
        System.out.println(bestVal + " " + bestCnt);
    }
}''',
     py=r'''from collections import Counter

n = int(input())
cnt = Counter(map(int, input().split()))
val, c = min(cnt.items(), key=lambda kv: (-kv[1], kv[0]))
print(val, c)''',
     tests=[("7\n4 1 2 2 4 4 1\n", "4 3"), ("6\n5 3 5 3 9 9\n", "3 2"), ("1\n-4\n", "-4 1"), ("5\n-1 -1 2 2 0\n", "-1 2")])

# =========================================================================== TWO POINTERS / WINDOW
prob(id="tp1", topic="Sliding Window", level="Medium", title="Longest Substring Without Repeating Characters",
     statement="Print the length of the longest substring (contiguous) that has no repeated character.",
     fmt="One line: a string (may be empty).",
     approach=["Sliding window [left, right]. Map each character to the last index where it was seen.",
               "When s[right] was seen inside the window (last ≥ left), move left to last + 1.",
               "Update last[s[right]] = right and best = max(best, right - left + 1)."],
     time="O(N)", space="O(alphabet)",
     trap="Moving left backwards: always use left = max(left, last + 1) (or the check last ≥ left).",
     java=r'''import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        Map<Character, Integer> last = new HashMap<>();
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (last.containsKey(c) && last.get(c) >= left) left = last.get(c) + 1;
            last.put(c, right);
            best = Math.max(best, right - left + 1);
        }
        System.out.println(best);
    }
}''',
     py=r'''import sys

s = sys.stdin.readline().rstrip("\n")
last = {}
left = best = 0
for right, c in enumerate(s):
    if last.get(c, -1) >= left:
        left = last[c] + 1
    last[c] = right
    best = max(best, right - left + 1)
print(best)''',
     tests=[("abcabcbb\n", "3"), ("bbbbb\n", "1"), ("pwwkew\n", "3"), ("abba\n", "2"), ("\n", "0")])

prob(id="tp2", topic="Two Pointers", level="Easy", title="Pair with Target Sum in a Sorted Array",
     statement="The array is sorted in ascending order. Print the first pair (smallest left value) whose sum equals T, "
               "or <b>NONE</b> if no pair exists.",
     fmt="Line 1: N and T. Line 2: N sorted integers.",
     approach=["i at the start, j at the end.",
               "sum = a[i] + a[j]. If sum == T, print the pair. If sum &lt; T, move i right (need bigger). If sum &gt; T, move j left.",
               "Works because the array is sorted — no extra memory needed."],
     time="O(N)", space="O(1)",
     trap="Using i ≤ j allows a number to pair with itself; use i &lt; j.",
     java=r'''import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long t = sc.nextLong();
        long[] a = new long[n];
        for (int k = 0; k < n; k++) a[k] = sc.nextLong();
        int i = 0, j = n - 1;
        while (i < j) {
            long sum = a[i] + a[j];
            if (sum == t) { System.out.println(a[i] + " " + a[j]); return; }
            if (sum < t) i++; else j--;
        }
        System.out.println("NONE");
    }
}''',
     py=r'''n, t = map(int, input().split())
a = list(map(int, input().split()))
i, j = 0, n - 1
ans = "NONE"
while i < j:
    s = a[i] + a[j]
    if s == t:
        ans = f"{a[i]} {a[j]}"
        break
    if s < t:
        i += 1
    else:
        j -= 1
print(ans)''',
     tests=[("6 10\n1 2 4 6 8 9\n", "1 9"), ("4 100\n1 2 3 4\n", "NONE"), ("5 8\n-2 3 4 5 10\n", "-2 10"),
            ("2 4\n2 2\n", "2 2")])

# =========================================================================== SORTING
prob(id="sort1", topic="Sorting", level="Medium", title="Merge Overlapping Intervals",
     statement="Given N intervals [start, end], merge all overlapping intervals (touching ones such as [1,3] and [3,5] "
               "also merge) and print the result sorted by start, one interval per line.",
     fmt="Line 1: N. Next N lines: start end.",
     approach=["Sort the intervals by start.",
               "Keep a list of merged intervals. For each interval, if it starts at or before the end of the last merged one, extend that end to max(end, current end).",
               "Otherwise it starts a new merged interval."],
     time="O(N log N) for sorting", space="O(N)",
     trap="Not sorting first, or replacing the end instead of taking the max ([1,10] and [2,3] must stay [1,10]).",
     java=r'''import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] iv = new int[n][2];
        for (int i = 0; i < n; i++) { iv[i][0] = sc.nextInt(); iv[i][1] = sc.nextInt(); }
        Arrays.sort(iv, (x, y) -> Integer.compare(x[0], y[0]));
        List<int[]> out = new ArrayList<>();
        for (int[] cur : iv) {
            if (!out.isEmpty() && cur[0] <= out.get(out.size() - 1)[1]) {
                int[] last = out.get(out.size() - 1);
                last[1] = Math.max(last[1], cur[1]);
            } else {
                out.add(new int[]{cur[0], cur[1]});
            }
        }
        for (int[] x : out) System.out.println(x[0] + " " + x[1]);
    }
}''',
     py=r'''n = int(input())
iv = sorted(tuple(map(int, input().split())) for _ in range(n))
out = []
for s, e in iv:
    if out and s <= out[-1][1]:
        out[-1][1] = max(out[-1][1], e)
    else:
        out.append([s, e])
for s, e in out:
    print(s, e)''',
     tests=[("4\n1 3\n2 6\n8 10\n15 18\n", "1 6\n8 10\n15 18"), ("2\n1 4\n4 5\n", "1 5"), ("3\n5 7\n1 10\n2 3\n", "1 10"),
            ("1\n4 4\n", "4 4")])

prob(id="sort2", topic="Sorting", level="Medium", title="Sort Characters by Frequency",
     statement="Sort the characters of a string by frequency, highest first. Characters with the same frequency are "
               "ordered alphabetically. Print the resulting string.",
     fmt="One line: a string of lowercase letters.",
     approach=["Count each character.",
               "Sort the distinct characters with a <b>custom comparator</b>: higher count first, then alphabetical.",
               "Append each character count times."],
     time="O(N + K log K), K = distinct characters", space="O(N)",
     trap="A comparator must be consistent: compare counts first, and only when equal compare characters.",
     java=r'''import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int[] cnt = new int[26];
        for (char c : s.toCharArray()) cnt[c - 'a']++;
        List<Character> chars = new ArrayList<>();
        for (int i = 0; i < 26; i++) if (cnt[i] > 0) chars.add((char) ('a' + i));
        chars.sort((x, y) -> cnt[y - 'a'] != cnt[x - 'a']
                ? cnt[y - 'a'] - cnt[x - 'a']
                : x - y);
        StringBuilder sb = new StringBuilder();
        for (char c : chars) sb.append(String.valueOf(c).repeat(cnt[c - 'a']));
        System.out.println(sb);
    }
}''',
     py=r'''from collections import Counter

s = input().strip()
cnt = Counter(s)
order = sorted(cnt, key=lambda c: (-cnt[c], c))
print("".join(c * cnt[c] for c in order))''',
     tests=[("tree\n", "eert"), ("cccaaa\n", "aaaccc"), ("banana\n", "aaannb"), ("x\n", "x")])

# =========================================================================== RECURSION
prob(id="rec1", topic="Recursion", level="Easy", title="Climbing Stairs (Recursion + Memoization)",
     statement="You can climb 1 or 2 steps at a time. Print the number of distinct ways to reach the top of N stairs "
               "(1 ≤ N ≤ 80).",
     fmt="One integer N.",
     approach=["Recurrence: ways(n) = ways(n-1) + ways(n-2), with ways(1) = 1 and ways(2) = 2.",
               "Plain recursion recomputes the same values again and again: O(2<sup>N</sup>).",
               "<b>Memoization</b>: store each answer the first time it is computed, so every n is solved once: O(N).",
               "Use long (64-bit): the answer for N = 80 is above the int range."],
     time="O(N) with memo", space="O(N)",
     trap="Without memoization N = 45 already takes seconds; with int instead of long, large N overflows.",
     java=r'''import java.util.*;

public class Main {
    static long[] memo = new long[100];

    static long ways(int n) {
        if (n <= 2) return n;
        if (memo[n] != 0) return memo[n];
        return memo[n] = ways(n - 1) + ways(n - 2);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(ways(sc.nextInt()));
    }
}''',
     py=r'''from functools import lru_cache

@lru_cache(maxsize=None)
def ways(n):
    if n <= 2:
        return n
    return ways(n - 1) + ways(n - 2)

print(ways(int(input())))''',
     tests=[("2\n", "2"), ("5\n", "8"), ("1\n", "1"), ("45\n", "1836311903"), ("80\n", "37889062373143906")])

prob(id="rec2", topic="Recursion", level="Medium", title="Generate All Subsets (Backtracking)",
     statement="Print every subset of the given distinct letters, one per line, in lexicographic order. Print the "
               "empty subset as <b>{}</b>.",
     fmt="One line: distinct lowercase letters (1 to 10 of them).",
     approach=["Sort the letters. Recursive function go(start, current): print current, then for each i ≥ start, add letter i and recurse with start = i + 1.",
               "This visits subsets in lexicographic order: {}, a, ab, abc, ac, b, bc, c.",
               "There are 2<sup>N</sup> subsets, so the work is O(N · 2<sup>N</sup>)."],
     time="O(N · 2^N)", space="O(N) recursion depth",
     trap="Not removing the last letter after the recursive call (backtracking step) when using a shared StringBuilder/list.",
     java=r'''import java.util.*;

public class Main {
    static char[] s;
    static StringBuilder out = new StringBuilder();

    static void go(int start, StringBuilder cur) {
        out.append(cur.length() == 0 ? "{}" : cur.toString()).append('\n');
        for (int i = start; i < s.length; i++) {
            cur.append(s[i]);
            go(i + 1, cur);
            cur.deleteCharAt(cur.length() - 1);   // backtrack
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        s = sc.next().toCharArray();
        Arrays.sort(s);
        go(0, new StringBuilder());
        System.out.print(out);
    }
}''',
     py=r'''s = sorted(input().strip())
out = []

def go(start, cur):
    out.append("".join(cur) or "{}")
    for i in range(start, len(s)):
        cur.append(s[i])
        go(i + 1, cur)
        cur.pop()                      # backtrack

go(0, [])
print("\n".join(out))''',
     tests=[("abc\n", "{}\na\nab\nabc\nac\nb\nbc\nc"), ("ba\n", "{}\na\nab\nb"), ("z\n", "{}\nz")])

# =========================================================================== NUMBER LOGIC
prob(id="num1", topic="Number Logic", level="Medium", title="Count Primes up to N (Sieve of Eratosthenes)",
     statement="Print how many prime numbers are ≤ N (0 ≤ N ≤ 10<sup>7</sup>).",
     fmt="One integer N.",
     approach=["Checking every number by trial division is O(N√N) — too slow for N = 10<sup>7</sup>.",
               "Sieve: mark all numbers as prime, then for each prime p starting at 2, mark p·p, p·p + p, ... as not prime.",
               "Only p up to √N are needed. Count what stays marked."],
     time="O(N log log N)", space="O(N)",
     trap="0 and 1 are not prime; start crossing out at p·p (smaller multiples were already crossed out).",
     java=r'''import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n < 2) { System.out.println(0); return; }
        boolean[] composite = new boolean[n + 1];
        int count = 0;
        for (int p = 2; p <= n; p++) {
            if (composite[p]) continue;
            count++;
            for (long m = (long) p * p; m <= n; m += p) composite[(int) m] = true;
        }
        System.out.println(count);
    }
}''',
     py=r'''n = int(input())
if n < 2:
    print(0)
else:
    is_prime = bytearray([1]) * (n + 1)
    is_prime[0] = is_prime[1] = 0
    p = 2
    while p * p <= n:
        if is_prime[p]:
            is_prime[p * p::p] = bytearray(len(range(p * p, n + 1, p)))
        p += 1
    print(sum(is_prime))''',
     tests=[("10\n", "4"), ("1\n", "0"), ("2\n", "1"), ("100\n", "25"), ("10000000\n", "664579")])

prob(id="num2", topic="Number Logic", level="Easy", title="Armstrong Numbers in a Range",
     statement="An Armstrong number equals the sum of its digits each raised to the number of digits "
               "(153 = 1³ + 5³ + 3³). Print all Armstrong numbers between L and R (inclusive) separated by spaces, "
               "or -1 if there are none.",
     fmt="One line: L R.",
     approach=["For each number, count its digits d (convert to string, or divide by 10 repeatedly).",
               "Add digit<sup>d</sup> for every digit and compare with the number.",
               "Collect the matches; print -1 if the list is empty."],
     time="O((R - L) · digits)", space="O(1)",
     trap="Using the fixed power 3 for every number: 9474 has 4 digits, so it needs power 4.",
     java=r'''import java.util.*;

public class Main {
    static boolean isArmstrong(int x) {
        int d = String.valueOf(x).length();
        long sum = 0;
        for (int t = x; t > 0; t /= 10) sum += (long) Math.pow(t % 10, d);
        return sum == x;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int l = sc.nextInt(), r = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        for (int x = Math.max(l, 1); x <= r; x++) {
            if (isArmstrong(x)) sb.append(sb.length() > 0 ? " " : "").append(x);
        }
        System.out.println(sb.length() == 0 ? "-1" : sb.toString());
    }
}''',
     py=r'''l, r = map(int, input().split())
res = [x for x in range(max(l, 1), r + 1)
       if x == sum(int(c) ** len(str(x)) for c in str(x))]
print(*res if res else [-1])''',
     tests=[("100 500\n", "153 370 371 407"), ("1 9\n", "1 2 3 4 5 6 7 8 9"), ("10 99\n", "-1"), ("9000 10000\n", "9474")])

prob(id="num3", topic="Number Logic", level="Easy", title="GCD and LCM of an Array",
     statement="Print the GCD and the LCM of N positive integers. The LCM fits in a 64-bit integer.",
     fmt="Line 1: N. Line 2: N positive integers.",
     approach=["Euclid: gcd(a, b) = gcd(b, a % b), and gcd(a, 0) = a.",
               "gcd of many numbers: fold left — g = gcd(g, x).",
               "lcm(a, b) = a / gcd(a, b) * b. Divide <b>before</b> multiplying to avoid overflow."],
     time="O(N log(max))", space="O(1)",
     trap="a * b / gcd(a, b) can overflow even when the final LCM fits; compute a / gcd * b instead.",
     java=r'''import java.util.*;

public class Main {
    static long gcd(long a, long b) {
        return b == 0 ? a : gcd(b, a % b);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long g = 0, l = 1;
        for (int i = 0; i < n; i++) {
            long x = sc.nextLong();
            g = gcd(g, x);
            l = l / gcd(l, x) * x;
        }
        System.out.println(g + " " + l);
    }
}''',
     py=r'''from math import gcd
from functools import reduce

n = int(input())
a = list(map(int, input().split()))
g = reduce(gcd, a)
l = reduce(lambda x, y: x // gcd(x, y) * y, a)
print(g, l)''',
     tests=[("3\n12 18 24\n", "6 72"), ("2\n7 13\n", "1 91"), ("1\n10\n", "10 10"),
            ("3\n1000000007 998244353 2\n", "1 1996488719975420942")])

prob(id="num4", topic="Number Logic", level="Easy", title="Binary Form and Number of Set Bits",
     statement="For a non-negative integer N, print its binary representation and the number of 1-bits.",
     fmt="One integer N (0 ≤ N ≤ 10<sup>18</sup>).",
     approach=["Repeatedly take N % 2 (the last bit) and divide by 2; the bits come out in reverse order.",
               "Count the 1-bits along the way (or use n &amp; (n - 1), which removes the lowest 1-bit).",
               "Library shortcuts: Java Long.toBinaryString / Long.bitCount; Python bin(n)[2:] / bin(n).count(\"1\")."],
     time="O(log N)", space="O(log N)",
     trap="N = 0 must print 0 (a loop that runs while n &gt; 0 prints nothing).",
     java=r'''import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        if (n == 0) { System.out.println("0 0"); return; }
        StringBuilder bits = new StringBuilder();
        int ones = 0;
        while (n > 0) {
            long b = n % 2;
            bits.append(b);
            ones += (int) b;
            n /= 2;
        }
        System.out.println(bits.reverse() + " " + ones);
    }
}''',
     py=r'''n = int(input())
b = bin(n)[2:]
print(b, b.count("1"))''',
     tests=[("10\n", "1010 2"), ("0\n", "0 0"), ("255\n", "11111111 8"), ("1000000000000000000\n",
            "110111100000101101101011001110100111011001000000000000000000 24")])
