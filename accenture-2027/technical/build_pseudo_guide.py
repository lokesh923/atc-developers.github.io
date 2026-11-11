"""Build the detailed Pseudocode + OOPs guide (Technical Assessment, Part B).

Answers are produced by EXECUTION, not by hand:
* every pseudocode MCQ carries an equivalent C program -> compiled with gcc and run
  (C semantics match the exam's C/Java style: integer division, %, ++, switch fall-through)
* every OOPs output MCQ is a real Java program -> run with the JDK (java Main.java)
The program output must equal the option marked correct, or the build fails.
Usage: python3 build_pseudo_guide.py <base_style.html> <out.html> <workdir>
"""
import html
import os
import random
import subprocess
import sys

rng = random.Random(10)
LET = "ABCD"

# (tag, pseudocode, C globals/functions, C main body, [correct, w, w, w], why)
PSEUDO = [
 ("Precedence", "Integer a = 10, b = 4, c = 3\nPrint a - b * c / 2 + a mod c", "", 'int a=10,b=4,c=3; printf("%d", a - b*c/2 + a%c);',
  ["5", "7", "4", "-1"], "* / % are evaluated first, left to right: b*c = 12, 12/2 = 6, a mod c = 1. Then 10 − 6 + 1 = 5."),
 ("Shift vs +", "Integer x = 3\nPrint x << 1 + 2", "", 'int x=3; printf("%d", x << 1 + 2);',
  ["24", "8", "9", "12"], "+ binds tighter than <<, so this is x << 3 = 3 × 8 = 24, not (x << 1) + 2."),
 ("& vs ==", "Integer x = 6\nif (x & 1 == 0) Print \"Even\"\nelse Print \"Odd\"", "", 'int x=6; if (x & 1 == 0) printf("Even"); else printf("Odd");',
  ["Odd", "Even", "Error", "EvenOdd"], "== binds tighter than &, so this is x & (1 == 0) = 6 & 0 = 0, which is false, so the else branch prints Odd even though 6 is even. Write (x & 1) == 0."),
 ("Pre / post increment", "Integer a = 5, b, c\nb = a++\nc = ++a\nPrint a, b, c", "", 'int a=5,b,c; b=a++; c=++a; printf("%d %d %d",a,b,c);',
  ["7 5 7", "7 6 7", "6 5 6", "7 5 6"], "b = a++ uses 5, then a becomes 6. c = ++a makes a 7 first, then uses 7."),
 ("Compound assignment", "Integer x = 10\nx -= 3\nx *= 2\nx %= 5\nPrint x", "", 'int x=10; x-=3; x*=2; x%=5; printf("%d",x);',
  ["4", "2", "14", "0"], "10 → 7 → 14 → 14 mod 5 = 4."),
 ("Negative / and mod", "Integer a = -7, b = 2\nPrint a / b, a mod b", "", 'int a=-7,b=2; printf("%d %d", a/b, a%b);',
  ["-3 -1", "-4 1", "-3 1", "-4 -1"], "In C and Java, integer division truncates toward zero (−3.5 → −3), and the remainder takes the sign of the dividend: −7 = 2 × (−3) − 1."),
 ("Ternary", "Integer a = 4, b = 9\nInteger m = (a > b) ? a : ((b > 8) ? b - 8 : b)\nPrint m", "", 'int a=4,b=9; int m=(a>b)?a:((b>8)?b-8:b); printf("%d",m);',
  ["1", "4", "9", "8"], "a > b is false, so the inner ternary runs: b > 8 is true, so b − 8 = 1."),
 ("Short-circuit", "Integer i = 0, j = 0\nif (i > 0 && ++j > 0) i = 5\nif (i == 0 || ++j > 0) i = 7\nPrint i, j", "", 'int i=0,j=0; if (i>0 && ++j>0) i=5; if (i==0 || ++j>0) i=7; printf("%d %d",i,j);',
  ["7 0", "7 2", "5 1", "7 1"], "In &&, a false left side skips the right side. In ||, a true left side skips the right side. So ++j never runs, and j stays 0."),
 ("AND / OR / XOR", "Integer a = 21, b = 13\nPrint a & b, a | b, a ^ b", "", 'int a=21,b=13; printf("%d %d %d", a&b, a|b, a^b);',
  ["5 29 24", "5 29 8", "13 21 8", "4 30 26"], "10101 & 01101 = 00101 = 5. | = 11101 = 29. ^ = 11000 = 24."),
 ("NOT and shifts", "Integer n = 12\nPrint (~n) + (n >> 2) + (n << 1)", "", 'int n=12; printf("%d", (~n) + (n>>2) + (n<<1));',
  ["14", "15", "38", "-14"], "~12 = −13, 12 >> 2 = 3 and 12 << 1 = 24. −13 + 3 + 24 = 14."),
 ("Kernighan's bit count", "Integer x = 58, c = 0\nwhile (x != 0)\n    x = x & (x - 1)\n    c = c + 1\nend while\nPrint c", "", 'int x=58,c=0; while(x!=0){x=x&(x-1);c++;} printf("%d",c);',
  ["4", "3", "6", "5"], "x & (x − 1) clears the lowest 1-bit each pass. 58 = 111010 has four 1s."),
 ("Power-of-two test", "Integer cnt = 0\nfor (i = 1 to 20)\n    if ((i & (i - 1)) == 0) cnt = cnt + 1\nend for\nPrint cnt", "", 'int cnt=0; for(int i=1;i<=20;i++) if((i&(i-1))==0) cnt++; printf("%d",cnt);',
  ["5", "4", "20", "10"], "Powers of two have exactly one 1-bit, so i & (i − 1) = 0. Up to 20 they are 1, 2, 4, 8 and 16."),
 ("XOR of a range", "Integer r = 0\nfor (i = 1 to 6)\n    r = r ^ i\nend for\nPrint r", "", 'int r=0; for(int i=1;i<=6;i++) r^=i; printf("%d",r);',
  ["7", "21", "0", "6"], "1^2 = 3, 3^3 = 0, 0^4 = 4, 4^5 = 1, 1^6 = 7. (XOR from 1 to n repeats with a period of 4.)"),
 ("Decimal → binary digits", "Integer n = 25, r = 0, p = 1\nwhile (n > 0)\n    r = r + (n mod 2) * p\n    p = p * 10\n    n = n / 2\nend while\nPrint r", "", 'int n=25,r=0,p=1; while(n>0){r+=(n%2)*p;p*=10;n/=2;} printf("%d",r);',
  ["11001", "10011", "25", "11000"], "It builds the binary digits as a decimal-looking number: 25 = 11001₂."),
 ("Switch fall-through", "Integer k = 2, s = 0\nswitch (k)\n    case 1: s = s + 1\n    case 2: s = s + 2\n    case 3: s = s + 3\n            break\n    case 4: s = s + 4\nend switch\nPrint s", "",
  'int k=2,s=0; switch(k){case 1: s+=1; case 2: s+=2; case 3: s+=3; break; case 4: s+=4;} printf("%d",s);',
  ["5", "2", "9", "6"], "It jumps to case 2, and with no break it falls into case 3: 2 + 3 = 5. Then break stops it."),
 ("Dangling else", "Integer a = 5, b = 10\nif (a > 3)\n    if (b < 5) Print \"X\"\nelse Print \"Y\"", "", 'int a=5,b=10; if (a>3) if (b<5) printf("X"); else printf("Y");',
  ["Y", "X", "Nothing", "XY"], "else always pairs with the NEAREST unmatched if, which is the inner one, whatever the indentation. a > 3 is true and b < 5 is false, so Y prints."),
 ("Triple nested loop", "Integer c = 0\nfor (i = 1 to 5)\n  for (j = 1 to i)\n    for (k = 1 to j)\n      c = c + 1\nPrint c", "", 'int c=0; for(int i=1;i<=5;i++) for(int j=1;j<=i;j++) for(int k=1;k<=j;k++) c++; printf("%d",c);',
  ["35", "15", "125", "55"], "For each i, the inner loops run 1 + 2 + … + i = i(i + 1)/2 times. 1 + 3 + 6 + 10 + 15 = 35."),
 ("Multiplicative loop", "Integer c = 0\nfor (i = 1; i < 100; i = i * 3)\n    c = c + 1\nPrint c", "", 'int c=0; for(int i=1;i<100;i*=3) c++; printf("%d",c);',
  ["5", "4", "33", "6"], "i takes the values 1, 3, 9, 27, 81 (243 stops the loop), so 5 iterations."),
 ("continue", "Integer s = 0\nfor (i = 1 to 10)\n    if (i mod 3 == 0) continue\n    s = s + i\nend for\nPrint s", "", 'int s=0; for(int i=1;i<=10;i++){ if(i%3==0) continue; s+=i;} printf("%d",s);',
  ["37", "55", "18", "36"], "It adds 1 to 10 but skips the multiples of 3: 55 − (3 + 6 + 9) = 37."),
 ("Fibonacci-style loop", "Integer a = 1, b = 1, t\nfor (i = 1 to 6)\n    t = a + b\n    a = b\n    b = t\nend for\nPrint b", "", 'int a=1,b=1,t; for(int i=1;i<=6;i++){t=a+b;a=b;b=t;} printf("%d",b);',
  ["21", "13", "34", "8"], "b goes 2, 3, 5, 8, 13, 21."),
 ("do-while", "Integer n = 0\ndo\n    n = n + 5\nwhile (n < 0)\nPrint n", "", 'int n=0; do { n+=5; } while (n<0); printf("%d",n);',
  ["5", "0", "Infinite loop", "-5"], "A do-while loop body always runs at least once, and the condition is checked afterwards."),
 ("Recursion print order", "Function f(Integer n)\n    if (n == 0) return\n    Print n\n    f(n - 1)\n    Print n\nEnd Function\nf(3)",
  'void f(int n){ if(n==0) return; printf("%d ",n); f(n-1); printf("%d ",n); }', 'f(3);',
  ["3 2 1 1 2 3", "3 2 1", "1 2 3 3 2 1", "3 2 1 0 1 2 3"], "Prints before the call appear on the way down (3 2 1). Prints after the call appear on the way back up (1 2 3)."),
 ("Counting recursive calls", "Integer calls = 0\nFunction fib(Integer n)\n    calls = calls + 1\n    if (n <= 1) return n\n    return fib(n-1) + fib(n-2)\nEnd Function\nfib(5)\nPrint calls",
  'int calls=0; int fib(int n){ calls++; if(n<=1) return n; return fib(n-1)+fib(n-2); }', 'fib(5); printf("%d",calls);',
  ["15", "5", "8", "9"], "The number of calls is C(n) = C(n−1) + C(n−2) + 1, with C(0) = C(1) = 1. C(5) = 15. That's why naive Fibonacci is O(2ⁿ)."),
 ("Recursion as multiplication", "Function g(Integer a, Integer b)\n    if (b == 0) return 0\n    return a + g(a, b - 1)\nEnd Function\nPrint g(7, 4)",
  'int g(int a,int b){ if(b==0) return 0; return a+g(a,b-1); }', 'printf("%d", g(7,4));',
  ["28", "11", "74", "7"], "It adds a to itself b times: 7 + 7 + 7 + 7 = 28."),
 ("Accumulator recursion", "Function rev(Integer n, Integer r)\n    if (n == 0) return r\n    return rev(n / 10, r * 10 + n mod 10)\nEnd Function\nPrint rev(1203, 0)",
  'int rev(int n,int r){ if(n==0) return r; return rev(n/10, r*10 + n%10); }', 'printf("%d", rev(1203,0));',
  ["3021", "321", "1203", "30210"], "Each call moves the last digit of n onto r, so the digits come out reversed: 3021."),
 ("Two-branch recursion", "Function f(Integer n)\n    if (n <= 0) return 1\n    return f(n - 1) + f(n - 2)\nEnd Function\nPrint f(4)",
  'int f(int n){ if(n<=0) return 1; return f(n-1)+f(n-2); }', 'printf("%d", f(4));',
  ["8", "5", "13", "3"], "f(−1) = f(0) = 1, f(1) = 2, f(2) = 3, f(3) = 5, f(4) = 8."),
 ("Array reversal", "Integer a[6] = {1, 2, 3, 4, 5, 6}\nfor (i = 0 to 2)\n    swap(a[i], a[5 - i])\nend for\nPrint a[1] + a[4]", "",
  'int a[6]={1,2,3,4,5,6}; for(int i=0;i<=2;i++){int t=a[i];a[i]=a[5-i];a[5-i]=t;} printf("%d", a[1]+a[4]);',
  ["7", "7.0", "9", "5"], "The array becomes {6, 5, 4, 3, 2, 1}, so a[1] = 5 and a[4] = 2, giving 7."),
 ("Prefix sums", "Integer a[5] = {2, 4, 1, 3, 5}\nfor (i = 1 to 4)\n    a[i] = a[i] + a[i - 1]\nend for\nPrint a[2] + a[4]", "",
  'int a[5]={2,4,1,3,5}; for(int i=1;i<=4;i++) a[i]+=a[i-1]; printf("%d", a[2]+a[4]);',
  ["22", "6", "15", "21"], "The running totals are 2, 6, 7, 10, 15. a[2] + a[4] = 7 + 15 = 22."),
 ("Characters are numbers", "Char c = 'A'\nc = c + 5\nPrint c", "", "char c='A'; c=c+5; printf(\"%c\",c);",
  ["F", "E", "70", "A5"], "'A' is ASCII 65, and 65 + 5 = 70, which is 'F'."),
 ("Vowel counting", "String s = \"PSEUDOCODE\"\nInteger v = 0\nfor (i = 0 to length(s) - 1)\n    if (s[i] is one of A, E, I, O, U) v = v + 1\nend for\nPrint v", "",
  'const char*s="PSEUDOCODE"; int v=0; for(int i=0;s[i];i++){char c=s[i]; if(c==\'A\'||c==\'E\'||c==\'I\'||c==\'O\'||c==\'U\') v++;} printf("%d",v);',
  ["5", "4", "6", "10"], "E, U, O, O, E gives 5."),
 ("Call by value", "Function change(Integer x)\n    x = x * 2\nEnd Function\nInteger a = 5\nchange(a)\nPrint a",
  'void change(int x){ x = x*2; }', 'int a=5; change(a); printf("%d",a);',
  ["5", "10", "0", "Error"], "A copy of a is doubled inside the function. The caller's a is unchanged."),
 ("2D array diagonals", "Integer m[3][3] = {{1,2,3},{4,5,6},{7,8,9}}\nInteger s = 0\nfor (i = 0 to 2)\n    s = s + m[i][i] + m[i][2 - i]\nend for\nPrint s", "",
  'int m[3][3]={{1,2,3},{4,5,6},{7,8,9}}; int s=0; for(int i=0;i<=2;i++) s+=m[i][i]+m[i][2-i]; printf("%d",s);',
  ["30", "25", "15", "45"], "Main diagonal 1 + 5 + 9 plus anti-diagonal 3 + 5 + 7 = 30. The centre 5 is counted twice."),
 ("Prime counting", "Integer cnt = 0\nfor (n = 2 to 20)\n    Integer p = 1\n    for (d = 2; d * d <= n; d = d + 1)\n        if (n mod d == 0) p = 0\n    cnt = cnt + p\nend for\nPrint cnt", "",
  'int cnt=0; for(int n=2;n<=20;n++){int p=1; for(int d=2;d*d<=n;d++) if(n%d==0) p=0; cnt+=p;} printf("%d",cnt);',
  ["8", "9", "7", "10"], "It counts the primes from 2 to 20: 2, 3, 5, 7, 11, 13, 17, 19."),
]

# (tag, classes, Main static members, main body, [correct, w, w, w], why)
JAVA = [
 ("Constructor chaining", 'class A { A() { System.out.print("A "); } }\nclass B extends A { B() { System.out.print("B "); } }\nclass C extends B { C() { System.out.print("C"); } }', "",
  "new C();", ["A B C", "C B A", "C", "A C"], "Every constructor first calls its parent's constructor (an implicit super()), so the order runs from the top down: A, then B, then C."),
 ("Fields vs methods", 'class P { int x = 10; void show() { System.out.print("P" + x); } }\nclass Q extends P { int x = 20; void show() { System.out.print("Q" + x); } }', "",
  'P obj = new Q();\nSystem.out.print(obj.x + " ");\nobj.show();', ["10 Q20", "20 Q20", "10 P10", "20 P20"],
  "Fields are NOT polymorphic: obj.x uses the reference type P, giving 10. Methods ARE polymorphic: show() runs Q's version, which sees Q's x = 20."),
 ("Static method hiding", 'class P { static void hi() { System.out.print("P"); } }\nclass Q extends P { static void hi() { System.out.print("Q"); } }', "",
  "P o = new Q();\no.hi();", ["P", "Q", "PQ", "Compile error"], "Static methods are hidden, not overridden. They're chosen by the reference type (P), not by the object."),
 ("Overload resolution", "", 'static void f(int a) { System.out.print("int "); }\nstatic void f(long a) { System.out.print("long "); }\nstatic void f(double a) { System.out.print("double"); }',
  "f(5); f(5L); f(5.0f);", ["int long double", "int int double", "long long double", "Compile error"],
  "Java picks the most specific match. A float has no exact match here, so it widens to double."),
 ("super.method()", 'class A { void m() { System.out.print("A"); } }\nclass B extends A { void m() { super.m(); System.out.print("B"); } }', "",
  "new B().m();", ["AB", "B", "BA", "A"], "super.m() runs the parent's version first, then B prints."),
 ("static counter", "class Counter {\n    static int count = 0; int id;\n    Counter() { count++; id = count; }\n}", "",
  'Counter c1 = new Counter(), c2 = new Counter(), c3 = new Counter();\nSystem.out.print(c1.id + " " + Counter.count);', ["1 3", "3 3", "1 1", "0 3"],
  "A static field is shared by all objects (count = 3). id is per object: c1 got 1."),
 ("this vs local", "class Box {\n    int w = 5;\n    void set(int w)  { w = w * 2; }\n    void set2(int w) { this.w = w * 2; }\n}", "",
  'Box b = new Box();\nb.set(10);  System.out.print(b.w + " ");\nb.set2(10); System.out.print(b.w);', ["5 20", "20 20", "10 20", "5 10"],
  "In set(), w is the parameter, which shadows the field, so the field stays 5. this.w refers to the field."),
 ("Abstract + polymorphism", "abstract class Shape { abstract int area(); }\nclass Sq extends Shape { int s; Sq(int s) { this.s = s; } int area() { return s * s; } }\nclass Rect extends Shape { int l, b; Rect(int l, int b) { this.l = l; this.b = b; } int area() { return l * b; } }", "",
  "Shape[] arr = { new Sq(3), new Rect(2, 5), new Sq(2) };\nint t = 0;\nfor (Shape s : arr) t += s.area();\nSystem.out.print(t);", ["23", "19", "13", "Compile error"],
  "Each object runs its own area(): 9 + 10 + 4 = 23. An abstract class can't be instantiated, but its references can point to subclass objects."),
 ("super(arg)", 'class A { A(int x) { System.out.print("A" + x + " "); } }\nclass B extends A { B() { super(5); System.out.print("B"); } }', "",
  "new B();", ["A5 B", "B A5", "B", "Compile error"], "super(5) must be the first statement, so the parent constructor runs first."),
 ("Interface default method", 'interface I { default String hi() { return "I"; } }\nclass X implements I { }\nclass Y implements I { public String hi() { return "Y"; } }', "",
  "System.out.print(new X().hi() + new Y().hi());", ["IY", "II", "YY", "Compile error"],
  "X inherits the default method. Y overrides it (it must be public)."),
 ("Passing references", "class N { int v; }", "static void inc(N n) { n.v++; }\nstatic void reset(N n) { n = new N(); n.v = 100; }",
  "N n = new N(); n.v = 1;\ninc(n); reset(n);\nSystem.out.print(n.v);", ["2", "100", "1", "101"],
  "Java passes a COPY of the reference. inc changes the shared object, giving 2. reset only re-points its local copy, so the caller's object is untouched."),
 ("== vs equals", "", "", 'String a = new String("hi"), b = new String("hi");\nSystem.out.print((a == b) + " " + a.equals(b));', ["false true", "true true", "true false", "false false"],
  "== compares references, and these are two different objects. equals() compares content."),
 ("Initialisation order", 'class T {\n    static { System.out.print("S "); }\n    { System.out.print("I "); }\n    T() { System.out.print("C "); }\n}', "",
  "new T(); new T();", ["S I C I C", "S I C S I C", "I C I C", "S C I C I"],
  "The static block runs once, when the class loads. Then, for every object, the instance block runs before the constructor."),
 ("Upcast and downcast", 'class A { String n() { return "A"; } }\nclass B extends A { String n() { return "B"; } String only() { return "only"; } }', "",
  'A a = new B();\nSystem.out.print(a.n() + " " + ((B) a).only());', ["B only", "A only", "B", "Compile error"],
  "Upcasting is implicit and keeps the overriding behaviour. To call a B-only method, you must explicitly downcast."),
]

CONCEPT = [
 ("Two methods differ ONLY in return type, e.g. <code>int f()</code> and <code>double f()</code>. Result?", ["Compile error", "Valid overloading", "Valid overriding", "Runtime error"],
  "Overloading needs different parameter lists. A different return type alone isn't enough."),
 ("Can a constructor be overridden?", ["No", "Yes, always", "Only if it's public", "Only in abstract classes"], "Constructors aren't inherited, so they can't be overridden. They can be overloaded."),
 ("Can an abstract class have a constructor?", ["Yes", "No", "Only a private one", "Only if it has no abstract methods"], "Yes. It runs when a subclass object is created, through super()."),
 ("By default, variables declared in a Java interface are:", ["public static final", "private", "protected", "instance variables"], "Interface fields are constants."),
 ("The 'diamond problem' arises with:", ["Multiple inheritance of classes", "Single inheritance", "Encapsulation", "Method overloading"],
  "If two parents both define a method, which one does the child get? Java avoids this by forbidding multiple class inheritance."),
 ("A class declared <code>final</code>:", ["Cannot be extended", "Cannot have objects", "Cannot have methods", "Must be abstract"], "For example, String is final. A final method can't be overridden, and a final variable can't be reassigned."),
 ("A Car HAS an Engine, and the Engine is destroyed with the Car. This relationship is:", ["Composition", "Aggregation", "Inheritance", "Association only"],
  "Composition is a strong has-a. In aggregation (weak has-a), the part can exist independently, like a Team and its Players."),
 ("Which call must be the FIRST statement in a constructor if you use it?", ["super(...) or this(...)", "return", "System.out.print", "new"], "You can use only one of them, and it must come first."),
 ("Private methods of a parent class are:", ["Not inherited, so they can't be overridden", "Overridden automatically", "Public in the child", "Static by default"], "A method with the same name in the child is a new, unrelated method."),
 ("Wrapping data with methods and restricting direct access to the data is:", ["Encapsulation", "Abstraction", "Polymorphism", "Inheritance"], "Use private fields with public getters and setters."),
 ("Showing only essential features and hiding implementation details is:", ["Abstraction", "Encapsulation", "Inheritance", "Overloading"], "This is done with abstract classes and interfaces."),
 ("Which is decided at RUN time?", ["Which overridden method runs", "Which overloaded method runs", "Field access through a reference", "Static method calls"], "Dynamic dispatch. Overloading, field access and static calls are resolved at compile time."),
]

def esc(s): return html.escape(s, quote=False)

def run_c(work, i, pre, body):
    src = os.path.join(work, f"p{i}.c"); exe = os.path.join(work, f"p{i}")
    open(src, "w").write(f"#include <stdio.h>\n{pre}\nint main(void){{ {body} return 0; }}\n")
    subprocess.run(["gcc", "-w", "-O0", "-o", exe, src], check=True)
    return subprocess.run([exe], capture_output=True, text=True, check=True).stdout.strip()

def run_java(work, i, classes, members, body):
    d = os.path.join(work, f"j{i}"); os.makedirs(d, exist_ok=True)
    src = os.path.join(d, "Main.java")
    open(src, "w").write(f"public class Main {{\n{members}\npublic static void main(String[] args) {{\n{body}\n}}\n}}\n{classes}\n")
    out = subprocess.run(["java", src], capture_output=True, text=True, cwd=d)
    if out.returncode: raise RuntimeError(out.stderr)
    return out.stdout.strip()

def render(num, qhtml, opts):
    order = list(range(4)); rng.shuffle(order); shown = [opts[i] for i in order]
    li = "".join(f"<li><b>{LET[i]}</b> {esc(o) if '<' not in o else o}</li>" for i, o in enumerate(shown))
    return f'<div class="mcq"><div class="qn">{num}</div><div class="qb"><div class="qt">{qhtml}</div><ol class="opts">{li}</ol></div></div>', LET[order.index(0)]

def key_html(keys):
    rows = "".join(f"<tr><td><b>{n}</b></td><td class='ans'>{a}</td><td><code>{esc(c)}</code></td><td>{w}</td></tr>" for n, a, c, w in keys)
    return f"<table class='keyt'><thead><tr><th>Q</th><th>Ans</th><th>Correct</th><th>Why</th></tr></thead><tbody>{rows}</tbody></table>"

def main(base, out, work):
    os.makedirs(work, exist_ok=True)
    style = open(base).read()
    d = os.path.dirname(os.path.abspath(__file__))
    t0 = open(f"{d}/tech_0.html").read(); tech_style = t0[t0.index("<style>"):t0.index("</style>") + 8]
    doc = open(f"{d}/pseudo_template.html").read()
    pq, pk, jq, jk, cq, ck = [], [], [], [], [], []
    for i, (tag, code, pre, body, opts, why) in enumerate(PSEUDO, 1):
        got = run_c(work, i, pre, body)
        assert got == opts[0], f"P{i} {tag}: program printed {got!r}, key says {opts[0]!r}"
        assert len(set(opts)) == 4
        h, a = render(f"P{i}", f"<span class='tg'>{tag}</span> What is the output?<pre>{esc(code)}</pre>", opts)
        pq.append(h); pk.append((f"P{i}", a, opts[0], why))
    for i, (tag, classes, members, body, opts, why) in enumerate(JAVA, 1):
        got = run_java(work, i, classes, members, body)
        assert got == opts[0], f"J{i} {tag}: Java printed {got!r}, key says {opts[0]!r}"
        shown = "\n".join(x for x in [classes, members, "// inside main():\n" + body] if x)
        h, a = render(f"J{i}", f"<span class='tg'>{tag}</span> What is the output? (Java)<pre>{esc(shown)}</pre>", opts)
        jq.append(h); jk.append((f"J{i}", a, opts[0], why))
    for i, (q, opts, why) in enumerate(CONCEPT, 1):
        h, a = render(f"T{i}", f"<span class='tg'>Concept</span>{q}", opts)
        cq.append(h); ck.append((f"T{i}", a, opts[0], why))
    total = len(pk) + len(jk) + len(ck)
    doc = (doc.replace("<!--BASE_STYLE-->", style + tech_style)
              .replace("<!--MCQ_P-->", "".join(pq)).replace("<!--KEY_P-->", key_html(pk))
              .replace("<!--MCQ_J-->", "".join(jq)).replace("<!--MCQ_T-->", "".join(cq))
              .replace("<!--KEY_JT-->", key_html(jk + ck)).replace("<!--TOTAL_MCQ-->", str(total)))
    open(out, "w").write(doc)
    print(f"ok {out} | {len(pk)} pseudocode (gcc-verified) + {len(jk)} Java (JDK-verified) + {len(ck)} concept = {total}")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])
