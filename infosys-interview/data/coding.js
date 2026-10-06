(function () {
const R = String.raw;
const add = o => IV.coding.push(o);

add({ id: 'reverse-string', title: 'Reverse a string', topic: 'Strings', lvl: 'basic', hot: true, time: 'O(n)', space: 'O(1)',
stmt: 'Reverse the given string without using a built-in reverse function.',
examples: [{ in: 'infosys', out: 'sysofni' }, { in: 'a', out: 'a' }],
approach: 'Use **two pointers**: one at the start, one at the end. Swap the characters and move the pointers towards each other until they meet. Only half the string is visited.',
expect: 'sysofni\na',
sol: {
java: R`public class Main {
    static String reverse(String s) {
        char[] c = s.toCharArray();
        int i = 0, j = c.length - 1;
        while (i < j) {
            char t = c[i]; c[i] = c[j]; c[j] = t;
            i++; j--;
        }
        return new String(c);
    }
    public static void main(String[] args) {
        System.out.println(reverse("infosys"));
        System.out.println(reverse("a"));
    }
}`,
python: R`def reverse(s):
    c = list(s)
    i, j = 0, len(c) - 1
    while i < j:
        c[i], c[j] = c[j], c[i]
        i += 1
        j -= 1
    return "".join(c)

print(reverse("infosys"))
print(reverse("a"))`,
c: R`#include <stdio.h>
#include <string.h>
void reverse(char *s) {
    int i = 0, j = (int)strlen(s) - 1;
    while (i < j) {
        char t = s[i]; s[i] = s[j]; s[j] = t;
        i++; j--;
    }
}
int main() {
    char a[] = "infosys", b[] = "a";
    reverse(a); reverse(b);
    printf("%s\n%s\n", a, b);
    return 0;
}` } });

add({ id: 'palindrome', title: 'Check if a string is a palindrome', topic: 'Strings', lvl: 'basic', hot: true, time: 'O(n)', space: 'O(1)',
stmt: 'Return true if the string reads the same forwards and backwards. Ignore case.',
examples: [{ in: 'Madam', out: 'true' }, { in: 'hello', out: 'false' }],
approach: 'Compare characters from both ends moving inwards (two pointers). The first mismatch means it is not a palindrome. Convert to lower case first.',
expect: 'true\nfalse',
sol: {
java: R`public class Main {
    static boolean isPal(String s) {
        s = s.toLowerCase();
        int i = 0, j = s.length() - 1;
        while (i < j) {
            if (s.charAt(i++) != s.charAt(j--)) return false;
        }
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isPal("Madam"));
        System.out.println(isPal("hello"));
    }
}`,
python: R`def is_pal(s):
    s = s.lower()
    i, j = 0, len(s) - 1
    while i < j:
        if s[i] != s[j]:
            return False
        i += 1
        j -= 1
    return True

print(str(is_pal("Madam")).lower())
print(str(is_pal("hello")).lower())`,
c: R`#include <stdio.h>
#include <string.h>
#include <ctype.h>
int isPal(const char *s) {
    int i = 0, j = (int)strlen(s) - 1;
    while (i < j) {
        if (tolower(s[i]) != tolower(s[j])) return 0;
        i++; j--;
    }
    return 1;
}
int main() {
    printf("%s\n", isPal("Madam") ? "true" : "false");
    printf("%s\n", isPal("hello") ? "true" : "false");
    return 0;
}` } });

add({ id: 'fibonacci', title: 'Fibonacci series', topic: 'Maths', lvl: 'basic', hot: true, time: 'O(n)', space: 'O(1)',
stmt: 'Print the first n numbers of the Fibonacci series (0, 1, 1, 2, 3, 5, ...).',
examples: [{ in: 'n = 8', out: '0 1 1 2 3 5 8 13' }],
approach: 'Keep the last two numbers and add them to get the next. The plain recursive version `fib(n-1)+fib(n-2)` is O(2^n); the loop is O(n). Dynamic programming and memoisation fix the recursion.',
expect: '0 1 1 2 3 5 8 13',
sol: {
java: R`public class Main {
    public static void main(String[] args) {
        int n = 8;
        long a = 0, b = 1;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append(a);
            if (i < n - 1) sb.append(" ");
            long next = a + b;
            a = b;
            b = next;
        }
        System.out.println(sb);
    }
}`,
python: R`n = 8
a, b = 0, 1
out = []
for _ in range(n):
    out.append(str(a))
    a, b = b, a + b
print(" ".join(out))`,
c: R`#include <stdio.h>
int main() {
    int n = 8;
    long a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        printf("%ld%s", a, i < n - 1 ? " " : "\n");
        long next = a + b;
        a = b;
        b = next;
    }
    return 0;
}` } });

add({ id: 'prime', title: 'Check prime and list primes up to n', topic: 'Maths', lvl: 'basic', hot: true, time: 'O(sqrt n) per check, O(n log log n) sieve', space: 'O(n)',
stmt: 'Check whether a number is prime, then print all primes up to n using the Sieve of Eratosthenes.',
examples: [{ in: '29', out: 'true' }, { in: 'n = 30', out: '2 3 5 7 11 13 17 19 23 29' }],
approach: 'A number is prime if no integer from 2 to its square root divides it. For all primes up to n, the **Sieve** marks multiples of each prime as composite, starting from p squared.',
expect: 'true\nfalse\n2 3 5 7 11 13 17 19 23 29',
sol: {
java: R`public class Main {
    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; (long) i * i <= n; i++) if (n % i == 0) return false;
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isPrime(29));
        System.out.println(isPrime(30));
        int n = 30;
        boolean[] comp = new boolean[n + 1];
        StringBuilder sb = new StringBuilder();
        for (int i = 2; i <= n; i++) {
            if (comp[i]) continue;
            if (sb.length() > 0) sb.append(" ");
            sb.append(i);
            for (long j = (long) i * i; j <= n; j += i) comp[(int) j] = true;
        }
        System.out.println(sb);
    }
}`,
python: R`def is_prime(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True

print(str(is_prime(29)).lower())
print(str(is_prime(30)).lower())
n = 30
comp = [False] * (n + 1)
primes = []
for i in range(2, n + 1):
    if comp[i]:
        continue
    primes.append(str(i))
    for j in range(i * i, n + 1, i):
        comp[j] = True
print(" ".join(primes))`,
c: R`#include <stdio.h>
#include <string.h>
int isPrime(int n) {
    if (n < 2) return 0;
    for (long i = 2; i * i <= n; i++) if (n % i == 0) return 0;
    return 1;
}
int main() {
    printf("%s\n", isPrime(29) ? "true" : "false");
    printf("%s\n", isPrime(30) ? "true" : "false");
    int n = 30, first = 1;
    char comp[31];
    memset(comp, 0, sizeof comp);
    for (int i = 2; i <= n; i++) {
        if (comp[i]) continue;
        printf(first ? "%d" : " %d", i);
        first = 0;
        for (long j = (long)i * i; j <= n; j += i) comp[j] = 1;
    }
    printf("\n");
    return 0;
}` } });

add({ id: 'armstrong', title: 'Armstrong number', topic: 'Maths', lvl: 'basic', hot: true, time: 'O(d)', space: 'O(1)',
stmt: 'A number is an Armstrong number if the sum of its digits each raised to the power of the number of digits equals the number. Check this for a given number.',
examples: [{ in: '153', out: 'true (1 + 125 + 27)' }, { in: '9474', out: 'true' }, { in: '123', out: 'false' }],
approach: 'Count the digits d, then repeatedly take `n % 10`, add its d-th power to a sum and divide n by 10. Compare the sum with the original number.',
expect: 'true\ntrue\nfalse',
sol: {
java: R`public class Main {
    static boolean armstrong(int n) {
        int d = String.valueOf(n).length(), sum = 0, t = n;
        while (t > 0) {
            sum += (int) Math.pow(t % 10, d);
            t /= 10;
        }
        return sum == n;
    }
    public static void main(String[] args) {
        System.out.println(armstrong(153));
        System.out.println(armstrong(9474));
        System.out.println(armstrong(123));
    }
}`,
python: R`def armstrong(n):
    d = len(str(n))
    return sum(int(c) ** d for c in str(n)) == n

for x in (153, 9474, 123):
    print(str(armstrong(x)).lower())`,
c: R`#include <stdio.h>
#include <math.h>
int armstrong(int n) {
    int d = 0, t = n, sum = 0;
    while (t) { d++; t /= 10; }
    t = n;
    while (t) { sum += (int)(pow(t % 10, d) + 0.5); t /= 10; }
    return sum == n;
}
int main() {
    int a[] = {153, 9474, 123};
    for (int i = 0; i < 3; i++) printf("%s\n", armstrong(a[i]) ? "true" : "false");
    return 0;
}` } });

add({ id: 'swap-no-temp', title: 'Swap two numbers without a third variable', topic: 'Maths', lvl: 'basic', hot: true, time: 'O(1)', space: 'O(1)',
stmt: 'Swap the values of two integers without using a temporary variable.',
examples: [{ in: 'a = 5, b = 9', out: 'a = 9, b = 5' }],
approach: 'Use **addition and subtraction** (`a = a + b; b = a - b; a = a - b`) or **XOR** (`a ^= b; b ^= a; a ^= b`). XOR avoids overflow. In Python, tuple assignment `a, b = b, a` does it directly.',
expect: 'a=9 b=5\na=3 b=7',
sol: {
java: R`public class Main {
    public static void main(String[] args) {
        int a = 5, b = 9;
        a = a + b; b = a - b; a = a - b;
        System.out.println("a=" + a + " b=" + b);
        int x = 7, y = 3;
        x ^= y; y ^= x; x ^= y;
        System.out.println("a=" + x + " b=" + y);
    }
}`,
python: R`a, b = 5, 9
a, b = b, a
print(f"a={a} b={b}")
x, y = 7, 3
x ^= y
y ^= x
x ^= y
print(f"a={x} b={y}")`,
c: R`#include <stdio.h>
int main() {
    int a = 5, b = 9;
    a = a + b; b = a - b; a = a - b;
    printf("a=%d b=%d\n", a, b);
    int x = 7, y = 3;
    x ^= y; y ^= x; x ^= y;
    printf("a=%d b=%d\n", x, y);
    return 0;
}` } });

add({ id: 'gcd-lcm', title: 'GCD and LCM', topic: 'Maths', lvl: 'basic', hot: true, time: 'O(log min(a,b))', space: 'O(1)',
stmt: 'Find the greatest common divisor (GCD) and least common multiple (LCM) of two numbers.',
examples: [{ in: '12, 18', out: 'GCD 6, LCM 36' }],
approach: '**Euclid\'s algorithm:** `gcd(a, b) = gcd(b, a % b)` until b is 0. Then `LCM = a / gcd * b` (divide first to avoid overflow).',
expect: '6 36\n1 77',
sol: {
java: R`public class Main {
    static long gcd(long a, long b) { return b == 0 ? a : gcd(b, a % b); }
    public static void main(String[] args) {
        long[][] t = {{12, 18}, {7, 11}};
        for (long[] p : t) {
            long g = gcd(p[0], p[1]);
            System.out.println(g + " " + (p[0] / g * p[1]));
        }
    }
}`,
python: R`def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

for a, b in [(12, 18), (7, 11)]:
    g = gcd(a, b)
    print(g, a // g * b)`,
c: R`#include <stdio.h>
long gcd(long a, long b) { return b == 0 ? a : gcd(b, a % b); }
int main() {
    long t[2][2] = {{12, 18}, {7, 11}};
    for (int i = 0; i < 2; i++) {
        long g = gcd(t[i][0], t[i][1]);
        printf("%ld %ld\n", g, t[i][0] / g * t[i][1]);
    }
    return 0;
}` } });

add({ id: 'fizzbuzz', title: 'FizzBuzz', topic: 'Maths', lvl: 'basic', time: 'O(n)', space: 'O(1)',
stmt: 'For numbers 1 to n print "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for multiples of both, otherwise the number.',
examples: [{ in: 'n = 15', out: '1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz' }],
approach: 'Check the **combined** condition (divisible by 15) **first**, otherwise the 3 and 5 cases would catch it earlier.',
expect: '1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz',
sol: {
java: R`public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 15; i++) {
            if (i > 1) sb.append(" ");
            if (i % 15 == 0) sb.append("FizzBuzz");
            else if (i % 3 == 0) sb.append("Fizz");
            else if (i % 5 == 0) sb.append("Buzz");
            else sb.append(i);
        }
        System.out.println(sb);
    }
}`,
python: R`out = []
for i in range(1, 16):
    if i % 15 == 0:
        out.append("FizzBuzz")
    elif i % 3 == 0:
        out.append("Fizz")
    elif i % 5 == 0:
        out.append("Buzz")
    else:
        out.append(str(i))
print(" ".join(out))`,
c: R`#include <stdio.h>
int main() {
    for (int i = 1; i <= 15; i++) {
        if (i > 1) printf(" ");
        if (i % 15 == 0) printf("FizzBuzz");
        else if (i % 3 == 0) printf("Fizz");
        else if (i % 5 == 0) printf("Buzz");
        else printf("%d", i);
    }
    printf("\n");
    return 0;
}` } });

add({ id: 'anagram', title: 'Check if two strings are anagrams', topic: 'Strings', lvl: 'basic', hot: true, time: 'O(n)', space: 'O(1)',
stmt: 'Two strings are anagrams if they contain the same characters with the same counts. Check this for lowercase strings.',
examples: [{ in: 'listen, silent', out: 'true' }, { in: 'hello, world', out: 'false' }],
approach: 'If lengths differ, return false. Otherwise keep a **frequency array of 26 counters**: add for the first string, subtract for the second, and all counters must end at zero. Sorting both strings and comparing also works in O(n log n).',
expect: 'true\nfalse',
sol: {
java: R`public class Main {
    static boolean anagram(String a, String b) {
        if (a.length() != b.length()) return false;
        int[] f = new int[26];
        for (int i = 0; i < a.length(); i++) { f[a.charAt(i) - 'a']++; f[b.charAt(i) - 'a']--; }
        for (int x : f) if (x != 0) return false;
        return true;
    }
    public static void main(String[] args) {
        System.out.println(anagram("listen", "silent"));
        System.out.println(anagram("hello", "world"));
    }
}`,
python: R`from collections import Counter

def anagram(a, b):
    return Counter(a) == Counter(b)

print(str(anagram("listen", "silent")).lower())
print(str(anagram("hello", "world")).lower())`,
c: R`#include <stdio.h>
#include <string.h>
int anagram(const char *a, const char *b) {
    if (strlen(a) != strlen(b)) return 0;
    int f[26] = {0};
    for (int i = 0; a[i]; i++) { f[a[i] - 'a']++; f[b[i] - 'a']--; }
    for (int i = 0; i < 26; i++) if (f[i]) return 0;
    return 1;
}
int main() {
    printf("%s\n", anagram("listen", "silent") ? "true" : "false");
    printf("%s\n", anagram("hello", "world") ? "true" : "false");
    return 0;
}` } });

add({ id: 'first-non-repeating', title: 'First non-repeating character', topic: 'Strings', lvl: 'medium', hot: true, time: 'O(n)', space: 'O(1)',
stmt: 'Return the first character of a string that appears only once, or "none" if there is none.',
examples: [{ in: 'swiss', out: 'w' }, { in: 'aabb', out: 'none' }],
approach: 'Two passes: first **count the frequency** of each character in a fixed-size array (or hash map), then scan the string again and return the first character whose count is 1.',
expect: 'w\nnone',
sol: {
java: R`public class Main {
    static String first(String s) {
        int[] f = new int[256];
        for (char c : s.toCharArray()) f[c]++;
        for (char c : s.toCharArray()) if (f[c] == 1) return String.valueOf(c);
        return "none";
    }
    public static void main(String[] args) {
        System.out.println(first("swiss"));
        System.out.println(first("aabb"));
    }
}`,
python: R`from collections import Counter

def first(s):
    f = Counter(s)
    for c in s:
        if f[c] == 1:
            return c
    return "none"

print(first("swiss"))
print(first("aabb"))`,
c: R`#include <stdio.h>
void first(const char *s) {
    int f[256] = {0};
    for (int i = 0; s[i]; i++) f[(unsigned char)s[i]]++;
    for (int i = 0; s[i]; i++) if (f[(unsigned char)s[i]] == 1) { printf("%c\n", s[i]); return; }
    printf("none\n");
}
int main() {
    first("swiss");
    first("aabb");
    return 0;
}` } });

add({ id: 'two-sum', title: 'Two Sum', topic: 'Arrays', lvl: 'basic', hot: true, time: 'O(n)', space: 'O(n)',
stmt: 'Given an array and a target, return the indices of two numbers that add up to the target. Exactly one solution exists.',
examples: [{ in: '[2, 7, 11, 15], target 9', out: '0 1' }, { in: '[3, 2, 4], target 6', out: '1 2' }],
approach: 'Brute force checks every pair in O(n^2). Better: keep a **hash map** of value -> index. For each element x, look for `target - x` in the map. If found you have the pair; else store x. One pass, O(n).',
expect: '0 1\n1 2',
sol: {
java: R`import java.util.*;
public class Main {
    static int[] twoSum(int[] a, int t) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < a.length; i++) {
            Integer j = seen.get(t - a[i]);
            if (j != null) return new int[]{j, i};
            seen.put(a[i], i);
        }
        return new int[]{-1, -1};
    }
    public static void main(String[] args) {
        int[] r = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(r[0] + " " + r[1]);
        r = twoSum(new int[]{3, 2, 4}, 6);
        System.out.println(r[0] + " " + r[1]);
    }
}`,
python: R`def two_sum(a, t):
    seen = {}
    for i, x in enumerate(a):
        if t - x in seen:
            return seen[t - x], i
        seen[x] = i
    return -1, -1

print(*two_sum([2, 7, 11, 15], 9))
print(*two_sum([3, 2, 4], 6))`,
c: R`#include <stdio.h>
/* simple O(n^2) version; in an interview mention the hash-map O(n) idea */
void twoSum(int *a, int n, int t) {
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (a[i] + a[j] == t) { printf("%d %d\n", i, j); return; }
    printf("-1 -1\n");
}
int main() {
    int a[] = {2, 7, 11, 15}, b[] = {3, 2, 4};
    twoSum(a, 4, 9);
    twoSum(b, 3, 6);
    return 0;
}` } });

add({ id: 'kadane', title: 'Maximum subarray sum (Kadane)', topic: 'Arrays', lvl: 'medium', hot: true, time: 'O(n)', space: 'O(1)',
stmt: 'Find the contiguous subarray with the largest sum and return that sum.',
examples: [{ in: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', out: '6 (subarray [4, -1, 2, 1])' }, { in: '[-3, -1, -2]', out: '-1' }],
approach: '**Kadane\'s algorithm:** walk once, keeping `cur` = best sum of a subarray ending here: `cur = max(x, cur + x)`. Track the best `cur` seen. If the running sum becomes worse than starting fresh, restart at the current element. Initialise with the first element so all-negative arrays work.',
expect: '6\n-1',
sol: {
java: R`public class Main {
    static int kadane(int[] a) {
        int cur = a[0], best = a[0];
        for (int i = 1; i < a.length; i++) {
            cur = Math.max(a[i], cur + a[i]);
            best = Math.max(best, cur);
        }
        return best;
    }
    public static void main(String[] args) {
        System.out.println(kadane(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4}));
        System.out.println(kadane(new int[]{-3, -1, -2}));
    }
}`,
python: R`def kadane(a):
    cur = best = a[0]
    for x in a[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best

print(kadane([-2, 1, -3, 4, -1, 2, 1, -5, 4]))
print(kadane([-3, -1, -2]))`,
c: R`#include <stdio.h>
int kadane(int *a, int n) {
    int cur = a[0], best = a[0];
    for (int i = 1; i < n; i++) {
        cur = a[i] > cur + a[i] ? a[i] : cur + a[i];
        if (cur > best) best = cur;
    }
    return best;
}
int main() {
    int a[] = {-2, 1, -3, 4, -1, 2, 1, -5, 4}, b[] = {-3, -1, -2};
    printf("%d\n%d\n", kadane(a, 9), kadane(b, 3));
    return 0;
}` } });

add({ id: 'second-largest', title: 'Second largest element', topic: 'Arrays', lvl: 'basic', hot: true, time: 'O(n)', space: 'O(1)',
stmt: 'Find the second largest distinct element of an array without sorting.',
examples: [{ in: '[12, 35, 1, 10, 34, 1]', out: '34' }, { in: '[5, 5, 5]', out: 'none' }],
approach: 'Track `first` and `second` in **one pass**. If a number is greater than `first`, shift `first` to `second` and update `first`. Else if it is greater than `second` and not equal to `first`, update `second`.',
expect: '34\nnone',
sol: {
java: R`public class Main {
    static String second(int[] a) {
        long first = Long.MIN_VALUE, second = Long.MIN_VALUE;
        for (int x : a) {
            if (x > first) { second = first; first = x; }
            else if (x > second && x != first) second = x;
        }
        return second == Long.MIN_VALUE ? "none" : String.valueOf(second);
    }
    public static void main(String[] args) {
        System.out.println(second(new int[]{12, 35, 1, 10, 34, 1}));
        System.out.println(second(new int[]{5, 5, 5}));
    }
}`,
python: R`def second(a):
    first = second_ = None
    for x in a:
        if first is None or x > first:
            second_, first = first, x
        elif x != first and (second_ is None or x > second_):
            second_ = x
    return "none" if second_ is None else second_

print(second([12, 35, 1, 10, 34, 1]))
print(second([5, 5, 5]))`,
c: R`#include <stdio.h>
#include <limits.h>
void second(int *a, int n) {
    long first = LONG_MIN, sec = LONG_MIN;
    for (int i = 0; i < n; i++) {
        if (a[i] > first) { sec = first; first = a[i]; }
        else if (a[i] > sec && a[i] != first) sec = a[i];
    }
    if (sec == LONG_MIN) printf("none\n"); else printf("%ld\n", sec);
}
int main() {
    int a[] = {12, 35, 1, 10, 34, 1}, b[] = {5, 5, 5};
    second(a, 6);
    second(b, 3);
    return 0;
}` } });

add({ id: 'rotate-array', title: 'Rotate an array by k positions', topic: 'Arrays', lvl: 'medium', hot: true, time: 'O(n)', space: 'O(1)',
stmt: 'Rotate an array to the right by k positions in place.',
examples: [{ in: '[1, 2, 3, 4, 5, 6, 7], k = 3', out: '5 6 7 1 2 3 4' }],
approach: '**Reversal trick:** reverse the whole array, then reverse the first k elements, then reverse the remaining n-k elements. Use `k = k % n` first. O(n) time and O(1) extra space.',
expect: '5 6 7 1 2 3 4',
sol: {
java: R`import java.util.*;
public class Main {
    static void rev(int[] a, int i, int j) {
        while (i < j) { int t = a[i]; a[i++] = a[j]; a[j--] = t; }
    }
    public static void main(String[] args) {
        int[] a = {1, 2, 3, 4, 5, 6, 7};
        int k = 3 % a.length, n = a.length;
        rev(a, 0, n - 1);
        rev(a, 0, k - 1);
        rev(a, k, n - 1);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append(i > 0 ? " " : "").append(a[i]);
        System.out.println(sb);
    }
}`,
python: R`def rev(a, i, j):
    while i < j:
        a[i], a[j] = a[j], a[i]
        i += 1
        j -= 1

a = [1, 2, 3, 4, 5, 6, 7]
n, k = len(a), 3 % 7
rev(a, 0, n - 1)
rev(a, 0, k - 1)
rev(a, k, n - 1)
print(*a)`,
c: R`#include <stdio.h>
void rev(int *a, int i, int j) {
    while (i < j) { int t = a[i]; a[i++] = a[j]; a[j--] = t; }
}
int main() {
    int a[] = {1, 2, 3, 4, 5, 6, 7}, n = 7, k = 3 % 7;
    rev(a, 0, n - 1);
    rev(a, 0, k - 1);
    rev(a, k, n - 1);
    for (int i = 0; i < n; i++) printf("%d%s", a[i], i < n - 1 ? " " : "\n");
    return 0;
}` } });

add({ id: 'missing-number', title: 'Find the missing number', topic: 'Arrays', lvl: 'basic', hot: true, time: 'O(n)', space: 'O(1)',
stmt: 'An array holds n-1 distinct numbers from 1 to n. Find the missing one.',
examples: [{ in: '[1, 2, 4, 5, 6], n = 6', out: '3' }],
approach: 'The sum of 1 to n is `n(n+1)/2`. Subtract the sum of the array; the difference is the missing number. (XOR of all numbers also works and cannot overflow.)',
expect: '3',
sol: {
java: R`public class Main {
    public static void main(String[] args) {
        int[] a = {1, 2, 4, 5, 6};
        int n = a.length + 1;
        long total = (long) n * (n + 1) / 2;
        for (int x : a) total -= x;
        System.out.println(total);
    }
}`,
python: R`a = [1, 2, 4, 5, 6]
n = len(a) + 1
print(n * (n + 1) // 2 - sum(a))`,
c: R`#include <stdio.h>
int main() {
    int a[] = {1, 2, 4, 5, 6}, n = 6;
    long total = (long)n * (n + 1) / 2;
    for (int i = 0; i < 5; i++) total -= a[i];
    printf("%ld\n", total);
    return 0;
}` } });

add({ id: 'find-duplicate', title: 'Find duplicates in an array', topic: 'Arrays', lvl: 'basic', time: 'O(n)', space: 'O(n)',
stmt: 'Print every value that appears more than once in an array (each once, in order of first repeat).',
examples: [{ in: '[4, 3, 2, 7, 3, 2, 1, 4]', out: '3 2 4' }],
approach: 'Use a **hash set** of seen values. When an element is already in the set it is a duplicate; record it the first time only. If values are in 1..n you can mark visited by negating `a[abs(x)-1]` for O(1) space.',
expect: '3 2 4',
sol: {
java: R`import java.util.*;
public class Main {
    public static void main(String[] args) {
        int[] a = {4, 3, 2, 7, 3, 2, 1, 4};
        Set<Integer> seen = new HashSet<>(), dup = new LinkedHashSet<>();
        for (int x : a) if (!seen.add(x)) dup.add(x);
        StringBuilder sb = new StringBuilder();
        for (int d : dup) sb.append(sb.length() > 0 ? " " : "").append(d);
        System.out.println(sb);
    }
}`,
python: R`a = [4, 3, 2, 7, 3, 2, 1, 4]
seen, dup = set(), []
for x in a:
    if x in seen and x not in dup:
        dup.append(x)
    seen.add(x)
print(*dup)`,
c: R`#include <stdio.h>
int main() {
    int a[] = {4, 3, 2, 7, 3, 2, 1, 4}, n = 8, seen[10] = {0}, first = 1;
    for (int i = 0; i < n; i++) {
        if (seen[a[i]] == 1) { printf(first ? "%d" : " %d", a[i]); first = 0; }
        seen[a[i]]++;
    }
    printf("\n");
    return 0;
}` } });

add({ id: 'remove-duplicates-sorted', title: 'Remove duplicates from a sorted array', topic: 'Arrays', lvl: 'basic', time: 'O(n)', space: 'O(1)',
stmt: 'Remove duplicates from a sorted array in place and return the new length together with the unique elements.',
examples: [{ in: '[1, 1, 2, 2, 3, 4, 4]', out: '4: 1 2 3 4' }],
approach: '**Two pointers:** `w` marks where the next unique element goes. Scan with `r`; whenever `a[r] != a[w-1]`, copy it to `a[w]` and advance `w`.',
expect: '4: 1 2 3 4',
sol: {
java: R`public class Main {
    public static void main(String[] args) {
        int[] a = {1, 1, 2, 2, 3, 4, 4};
        int w = 1;
        for (int r = 1; r < a.length; r++) if (a[r] != a[w - 1]) a[w++] = a[r];
        StringBuilder sb = new StringBuilder(w + ":");
        for (int i = 0; i < w; i++) sb.append(" ").append(a[i]);
        System.out.println(sb);
    }
}`,
python: R`a = [1, 1, 2, 2, 3, 4, 4]
w = 1
for r in range(1, len(a)):
    if a[r] != a[w - 1]:
        a[w] = a[r]
        w += 1
print(str(w) + ":", *a[:w])`,
c: R`#include <stdio.h>
int main() {
    int a[] = {1, 1, 2, 2, 3, 4, 4}, n = 7, w = 1;
    for (int r = 1; r < n; r++) if (a[r] != a[w - 1]) a[w++] = a[r];
    printf("%d:", w);
    for (int i = 0; i < w; i++) printf(" %d", a[i]);
    printf("\n");
    return 0;
}` } });

add({ id: 'merge-sorted', title: 'Merge two sorted arrays', topic: 'Arrays', lvl: 'basic', time: 'O(m+n)', space: 'O(m+n)',
stmt: 'Merge two sorted arrays into one sorted array.',
examples: [{ in: '[1, 3, 5], [2, 4, 6, 8]', out: '1 2 3 4 5 6 8' }],
approach: 'Keep one pointer in each array and always copy the **smaller** front element into the result. When one array is finished, copy the rest of the other. This is the merge step of **merge sort**.',
expect: '1 2 3 4 5 6 8',
sol: {
java: R`public class Main {
    public static void main(String[] args) {
        int[] a = {1, 3, 5}, b = {2, 4, 6, 8};
        int[] r = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) r[k++] = a[i] <= b[j] ? a[i++] : b[j++];
        while (i < a.length) r[k++] = a[i++];
        while (j < b.length) r[k++] = b[j++];
        StringBuilder sb = new StringBuilder();
        for (int x : r) sb.append(sb.length() > 0 ? " " : "").append(x);
        System.out.println(sb);
    }
}`,
python: R`a, b = [1, 3, 5], [2, 4, 6, 8]
r, i, j = [], 0, 0
while i < len(a) and j < len(b):
    if a[i] <= b[j]:
        r.append(a[i]); i += 1
    else:
        r.append(b[j]); j += 1
r += a[i:] + b[j:]
print(*r)`,
c: R`#include <stdio.h>
int main() {
    int a[] = {1, 3, 5}, b[] = {2, 4, 6, 8}, r[7], i = 0, j = 0, k = 0;
    while (i < 3 && j < 4) r[k++] = a[i] <= b[j] ? a[i++] : b[j++];
    while (i < 3) r[k++] = a[i++];
    while (j < 4) r[k++] = b[j++];
    for (int x = 0; x < 7; x++) printf("%d%s", r[x], x < 6 ? " " : "\n");
    return 0;
}` } });

add({ id: 'binary-search', title: 'Binary search', topic: 'Searching and sorting', lvl: 'basic', hot: true, time: 'O(log n)', space: 'O(1)',
stmt: 'Search a target in a sorted array and return its index, or -1.',
examples: [{ in: '[2, 5, 8, 12, 16, 23, 38], target 23', out: '5' }, { in: 'target 7', out: '-1' }],
approach: 'Keep `lo` and `hi`. Check the middle element: equal -> found; smaller than target -> search the right half; larger -> the left half. Use `mid = lo + (hi - lo) / 2` to avoid integer overflow. The array **must be sorted**.',
expect: '5\n-1',
sol: {
java: R`public class Main {
    static int search(int[] a, int t) {
        int lo = 0, hi = a.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == t) return mid;
            if (a[mid] < t) lo = mid + 1; else hi = mid - 1;
        }
        return -1;
    }
    public static void main(String[] args) {
        int[] a = {2, 5, 8, 12, 16, 23, 38};
        System.out.println(search(a, 23));
        System.out.println(search(a, 7));
    }
}`,
python: R`def search(a, t):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == t:
            return mid
        if a[mid] < t:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

a = [2, 5, 8, 12, 16, 23, 38]
print(search(a, 23))
print(search(a, 7))`,
c: R`#include <stdio.h>
int search(int *a, int n, int t) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == t) return mid;
        if (a[mid] < t) lo = mid + 1; else hi = mid - 1;
    }
    return -1;
}
int main() {
    int a[] = {2, 5, 8, 12, 16, 23, 38};
    printf("%d\n%d\n", search(a, 7, 23), search(a, 7, 7));
    return 0;
}` } });

add({ id: 'bubble-sort', title: 'Bubble sort', topic: 'Searching and sorting', lvl: 'basic', hot: true, time: 'O(n^2), best O(n)', space: 'O(1)',
stmt: 'Sort an array in ascending order using bubble sort.',
examples: [{ in: '[64, 34, 25, 12, 22, 11, 90]', out: '11 12 22 25 34 64 90' }],
approach: 'Repeatedly compare adjacent elements and swap if out of order. After each pass the largest remaining element "bubbles" to the end. A **swapped flag** stops early when the array is already sorted (best case O(n)). It is stable and in-place but slow; know **merge sort and quick sort** for O(n log n).',
expect: '11 12 22 25 34 64 90',
sol: {
java: R`public class Main {
    public static void main(String[] args) {
        int[] a = {64, 34, 25, 12, 22, 11, 90};
        for (int i = 0; i < a.length - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < a.length - 1 - i; j++) {
                if (a[j] > a[j + 1]) {
                    int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
        StringBuilder sb = new StringBuilder();
        for (int x : a) sb.append(sb.length() > 0 ? " " : "").append(x);
        System.out.println(sb);
    }
}`,
python: R`a = [64, 34, 25, 12, 22, 11, 90]
for i in range(len(a) - 1):
    swapped = False
    for j in range(len(a) - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
            swapped = True
    if not swapped:
        break
print(*a)`,
c: R`#include <stdio.h>
int main() {
    int a[] = {64, 34, 25, 12, 22, 11, 90}, n = 7;
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                swapped = 1;
            }
        }
        if (!swapped) break;
    }
    for (int i = 0; i < n; i++) printf("%d%s", a[i], i < n - 1 ? " " : "\n");
    return 0;
}` } });

add({ id: 'reverse-linked-list', title: 'Reverse a linked list', topic: 'Linked list', lvl: 'medium', hot: true, time: 'O(n)', space: 'O(1)',
stmt: 'Reverse a singly linked list and return the new head.',
examples: [{ in: '1 -> 2 -> 3 -> 4', out: '4 -> 3 -> 2 -> 1' }],
approach: 'Walk through the list with three pointers: `prev`, `cur`, `next`. For each node save `next`, point `cur.next` back to `prev`, then move `prev` and `cur` forward. The old head becomes the tail. A recursive version uses O(n) stack.',
expect: '4 3 2 1',
sol: {
java: R`public class Main {
    static class Node { int val; Node next; Node(int v) { val = v; } }
    static Node reverse(Node head) {
        Node prev = null, cur = head;
        while (cur != null) {
            Node nxt = cur.next;
            cur.next = prev;
            prev = cur;
            cur = nxt;
        }
        return prev;
    }
    public static void main(String[] args) {
        Node head = new Node(1);
        head.next = new Node(2);
        head.next.next = new Node(3);
        head.next.next.next = new Node(4);
        head = reverse(head);
        StringBuilder sb = new StringBuilder();
        for (Node p = head; p != null; p = p.next) sb.append(sb.length() > 0 ? " " : "").append(p.val);
        System.out.println(sb);
    }
}`,
python: R`class Node:
    def __init__(self, v):
        self.val, self.next = v, None

def reverse(head):
    prev, cur = None, head
    while cur:
        cur.next, prev, cur = prev, cur, cur.next
    return prev

head = Node(1)
head.next = Node(2)
head.next.next = Node(3)
head.next.next.next = Node(4)
head = reverse(head)
out, p = [], head
while p:
    out.append(p.val)
    p = p.next
print(*out)`,
c: R`#include <stdio.h>
#include <stdlib.h>
struct Node { int val; struct Node *next; };
struct Node *newNode(int v) {
    struct Node *n = malloc(sizeof *n);
    n->val = v; n->next = NULL;
    return n;
}
struct Node *reverse(struct Node *head) {
    struct Node *prev = NULL, *cur = head;
    while (cur) {
        struct Node *nxt = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nxt;
    }
    return prev;
}
int main() {
    struct Node *head = newNode(1);
    head->next = newNode(2);
    head->next->next = newNode(3);
    head->next->next->next = newNode(4);
    head = reverse(head);
    for (struct Node *p = head; p; p = p->next) printf("%d%s", p->val, p->next ? " " : "\n");
    return 0;
}` } });

add({ id: 'valid-parentheses', title: 'Valid parentheses', topic: 'Stack', lvl: 'medium', hot: true, time: 'O(n)', space: 'O(n)',
stmt: 'Given a string of brackets ()[]{}, check whether it is valid: every opening bracket is closed by the same type in the correct order.',
examples: [{ in: '{[()]}', out: 'true' }, { in: '([)]', out: 'false' }, { in: '((', out: 'false' }],
approach: 'Use a **stack**. Push every opening bracket. For a closing bracket, the stack must be non-empty and its top must be the matching opening bracket; pop it. At the end the stack must be empty.',
expect: 'true\nfalse\nfalse',
sol: {
java: R`import java.util.*;
public class Main {
    static boolean valid(String s) {
        Deque<Character> st = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') st.push(c);
            else {
                if (st.isEmpty()) return false;
                char o = st.pop();
                if ((c == ')' && o != '(') || (c == ']' && o != '[') || (c == '}' && o != '{')) return false;
            }
        }
        return st.isEmpty();
    }
    public static void main(String[] args) {
        System.out.println(valid("{[()]}"));
        System.out.println(valid("([)]"));
        System.out.println(valid("(("));
    }
}`,
python: R`def valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    st = []
    for c in s:
        if c in "([{":
            st.append(c)
        else:
            if not st or st.pop() != pairs[c]:
                return False
    return not st

for t in ("{[()]}", "([)]", "(("):
    print(str(valid(t)).lower())`,
c: R`#include <stdio.h>
#include <string.h>
int valid(const char *s) {
    char st[100]; int top = 0;
    for (int i = 0; s[i]; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') st[top++] = c;
        else {
            if (top == 0) return 0;
            char o = st[--top];
            if ((c == ')' && o != '(') || (c == ']' && o != '[') || (c == '}' && o != '{')) return 0;
        }
    }
    return top == 0;
}
int main() {
    const char *t[] = {"{[()]}", "([)]", "(("};
    for (int i = 0; i < 3; i++) printf("%s\n", valid(t[i]) ? "true" : "false");
    return 0;
}` } });

add({ id: 'longest-unique-substring', title: 'Longest substring without repeating characters', topic: 'Strings', lvl: 'adv', hot: true, time: 'O(n)', space: 'O(1)',
stmt: 'Find the length of the longest substring that has no repeating characters.',
examples: [{ in: 'abcabcbb', out: '3 (abc)' }, { in: 'bbbbb', out: '1' }, { in: 'pwwkew', out: '3 (wke)' }],
approach: '**Sliding window.** Keep a window `[left, right]` with no repeats and a map of each character\'s last index. When `s[right]` was last seen inside the window, move `left` to just after that index. The best window length is the answer. Each character is visited once.',
expect: '3\n1\n3',
sol: {
java: R`public class Main {
    static int longest(String s) {
        int[] last = new int[256];
        java.util.Arrays.fill(last, -1);
        int best = 0, left = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (last[c] >= left) left = last[c] + 1;
            last[c] = r;
            best = Math.max(best, r - left + 1);
        }
        return best;
    }
    public static void main(String[] args) {
        System.out.println(longest("abcabcbb"));
        System.out.println(longest("bbbbb"));
        System.out.println(longest("pwwkew"));
    }
}`,
python: R`def longest(s):
    last, left, best = {}, 0, 0
    for r, c in enumerate(s):
        if c in last and last[c] >= left:
            left = last[c] + 1
        last[c] = r
        best = max(best, r - left + 1)
    return best

for t in ("abcabcbb", "bbbbb", "pwwkew"):
    print(longest(t))`,
c: R`#include <stdio.h>
int longest(const char *s) {
    int last[256], best = 0, left = 0;
    for (int i = 0; i < 256; i++) last[i] = -1;
    for (int r = 0; s[r]; r++) {
        unsigned char c = s[r];
        if (last[c] >= left) left = last[c] + 1;
        last[c] = r;
        if (r - left + 1 > best) best = r - left + 1;
    }
    return best;
}
int main() {
    printf("%d\n%d\n%d\n", longest("abcabcbb"), longest("bbbbb"), longest("pwwkew"));
    return 0;
}` } });

add({ id: 'power-of-two-bits', title: 'Power of two and count set bits', topic: 'Bit manipulation', lvl: 'medium', hot: true, time: 'O(1) and O(set bits)', space: 'O(1)',
stmt: 'Check if a number is a power of two, and count the number of 1 bits in its binary form.',
examples: [{ in: '16', out: 'true' }, { in: '18', out: 'false' }, { in: '29 (11101)', out: '4 set bits' }],
approach: 'A power of two has exactly one set bit, so `n > 0 && (n & (n - 1)) == 0`. **Brian Kernighan\'s trick:** `n & (n - 1)` clears the lowest set bit, so loop and count until n is 0.',
expect: 'true\nfalse\n4',
sol: {
java: R`public class Main {
    static boolean pow2(int n) { return n > 0 && (n & (n - 1)) == 0; }
    static int bits(int n) {
        int c = 0;
        while (n != 0) { n &= n - 1; c++; }
        return c;
    }
    public static void main(String[] args) {
        System.out.println(pow2(16));
        System.out.println(pow2(18));
        System.out.println(bits(29));
    }
}`,
python: R`def pow2(n):
    return n > 0 and (n & (n - 1)) == 0

def bits(n):
    c = 0
    while n:
        n &= n - 1
        c += 1
    return c

print(str(pow2(16)).lower())
print(str(pow2(18)).lower())
print(bits(29))`,
c: R`#include <stdio.h>
int pow2(int n) { return n > 0 && (n & (n - 1)) == 0; }
int bits(int n) {
    int c = 0;
    while (n) { n &= n - 1; c++; }
    return c;
}
int main() {
    printf("%s\n%s\n%d\n", pow2(16) ? "true" : "false", pow2(18) ? "true" : "false", bits(29));
    return 0;
}` } });

add({ id: 'decimal-binary', title: 'Decimal to binary and back', topic: 'Maths', lvl: 'basic', time: 'O(log n)', space: 'O(log n)',
stmt: 'Convert a decimal number to binary, and a binary string to decimal, without library helpers.',
examples: [{ in: '13', out: '1101' }, { in: '1101', out: '13' }],
approach: 'To binary: repeatedly divide by 2 and collect the **remainders in reverse order**. From binary: scan left to right doing `value = value * 2 + digit`.',
expect: '1101\n13',
sol: {
java: R`public class Main {
    static String toBin(int n) {
        if (n == 0) return "0";
        StringBuilder sb = new StringBuilder();
        while (n > 0) { sb.append(n % 2); n /= 2; }
        return sb.reverse().toString();
    }
    static int toDec(String s) {
        int v = 0;
        for (char c : s.toCharArray()) v = v * 2 + (c - '0');
        return v;
    }
    public static void main(String[] args) {
        System.out.println(toBin(13));
        System.out.println(toDec("1101"));
    }
}`,
python: R`def to_bin(n):
    if n == 0:
        return "0"
    out = ""
    while n > 0:
        out = str(n % 2) + out
        n //= 2
    return out

def to_dec(s):
    v = 0
    for c in s:
        v = v * 2 + int(c)
    return v

print(to_bin(13))
print(to_dec("1101"))`,
c: R`#include <stdio.h>
#include <string.h>
int main() {
    int n = 13, i = 0;
    char b[40], r[40];
    while (n > 0) { b[i++] = '0' + n % 2; n /= 2; }
    for (int k = 0; k < i; k++) r[k] = b[i - 1 - k];
    r[i] = 0;
    printf("%s\n", r);
    const char *s = "1101";
    int v = 0;
    for (int k = 0; s[k]; k++) v = v * 2 + (s[k] - '0');
    printf("%d\n", v);
    return 0;
}` } });

add({ id: 'pattern-pyramid', title: 'Pattern printing: pyramid and Floyd triangle', topic: 'Patterns', lvl: 'basic', hot: true, time: 'O(n^2)', space: 'O(1)',
stmt: 'Print a pyramid of stars with 4 rows, then a right triangle of numbers (Floyd) with 3 rows.',
examples: [{ in: 'n = 4', out: 'pyramid of 1, 3, 5, 7 stars centred' }],
approach: 'Pattern problems are about the **relationship between row number i and the counts**: for a pyramid of n rows, row i has `n - i` spaces and `2i - 1` stars. For Floyd\'s triangle, row i has i numbers continuing a counter.',
expect: '   *\n  ***\n *****\n*******\n1\n2 3\n4 5 6',
sol: {
java: R`public class Main {
    public static void main(String[] args) {
        int n = 4;
        for (int i = 1; i <= n; i++) {
            System.out.println(" ".repeat(n - i) + "*".repeat(2 * i - 1));
        }
        int num = 1;
        for (int i = 1; i <= 3; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 1; j <= i; j++) sb.append(j > 1 ? " " : "").append(num++);
            System.out.println(sb);
        }
    }
}`,
python: R`n = 4
for i in range(1, n + 1):
    print(" " * (n - i) + "*" * (2 * i - 1))
num = 1
for i in range(1, 4):
    row = []
    for _ in range(i):
        row.append(str(num))
        num += 1
    print(" ".join(row))`,
c: R`#include <stdio.h>
int main() {
    int n = 4;
    for (int i = 1; i <= n; i++) {
        for (int s = 0; s < n - i; s++) printf(" ");
        for (int k = 0; k < 2 * i - 1; k++) printf("*");
        printf("\n");
    }
    int num = 1;
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= i; j++) printf("%s%d", j > 1 ? " " : "", num++);
        printf("\n");
    }
    return 0;
}` } });

add({ id: 'rotate-matrix', title: 'Transpose and rotate a matrix by 90 degrees', topic: 'Matrix', lvl: 'medium', time: 'O(n^2)', space: 'O(1)',
stmt: 'Rotate an n x n matrix 90 degrees clockwise in place.',
examples: [{ in: '[[1,2,3],[4,5,6],[7,8,9]]', out: '[[7,4,1],[8,5,2],[9,6,3]]' }],
approach: '**Transpose** the matrix (swap `m[i][j]` with `m[j][i]` for j > i), then **reverse each row**. Together they give a 90-degree clockwise rotation without extra space.',
expect: '7 4 1\n8 5 2\n9 6 3',
sol: {
java: R`public class Main {
    public static void main(String[] args) {
        int[][] m = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        int n = m.length;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) { int t = m[i][j]; m[i][j] = m[j][i]; m[j][i] = t; }
        for (int[] row : m)
            for (int i = 0, j = n - 1; i < j; i++, j--) { int t = row[i]; row[i] = row[j]; row[j] = t; }
        for (int[] row : m) {
            StringBuilder sb = new StringBuilder();
            for (int x : row) sb.append(sb.length() > 0 ? " " : "").append(x);
            System.out.println(sb);
        }
    }
}`,
python: R`m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
n = len(m)
for i in range(n):
    for j in range(i + 1, n):
        m[i][j], m[j][i] = m[j][i], m[i][j]
for row in m:
    row.reverse()
for row in m:
    print(*row)`,
c: R`#include <stdio.h>
int main() {
    int m[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}, n = 3;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++) { int t = m[i][j]; m[i][j] = m[j][i]; m[j][i] = t; }
    for (int i = 0; i < n; i++)
        for (int a = 0, b = n - 1; a < b; a++, b--) { int t = m[i][a]; m[i][a] = m[i][b]; m[i][b] = t; }
    for (int i = 0; i < n; i++) printf("%d %d %d\n", m[i][0], m[i][1], m[i][2]);
    return 0;
}` } });

add({ id: 'count-vowels', title: 'Count vowels, consonants and words', topic: 'Strings', lvl: 'basic', time: 'O(n)', space: 'O(1)',
stmt: 'For a sentence, count the vowels, consonants and words.',
examples: [{ in: 'Infosys is great', out: 'vowels 5, consonants 9, words 3' }],
approach: 'Scan once. Convert each letter to lower case; if it is in "aeiou" count a vowel, else if it is a letter count a consonant. Count words by splitting on spaces (or counting transitions from space to a letter).',
expect: 'vowels 5 consonants 9 words 3',
sol: {
java: R`public class Main {
    public static void main(String[] args) {
        String s = "Infosys is great";
        int v = 0, c = 0;
        for (char ch : s.toLowerCase().toCharArray()) {
            if ("aeiou".indexOf(ch) >= 0) v++;
            else if (ch >= 'a' && ch <= 'z') c++;
        }
        System.out.println("vowels " + v + " consonants " + c + " words " + s.trim().split("\\s+").length);
    }
}`,
python: R`s = "Infosys is great"
v = sum(1 for ch in s.lower() if ch in "aeiou")
c = sum(1 for ch in s.lower() if ch.isalpha() and ch not in "aeiou")
print("vowels", v, "consonants", c, "words", len(s.split()))`,
c: R`#include <stdio.h>
#include <ctype.h>
int main() {
    const char *s = "Infosys is great";
    int v = 0, c = 0, w = 0, inWord = 0;
    for (int i = 0; s[i]; i++) {
        char ch = tolower(s[i]);
        if (isalpha(ch)) {
            if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') v++; else c++;
        }
        if (isspace(s[i])) inWord = 0;
        else if (!inWord) { inWord = 1; w++; }
    }
    printf("vowels %d consonants %d words %d\n", v, c, w);
    return 0;
}` } });
})();
