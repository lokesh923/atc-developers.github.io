"""OOPs pseudocode Mock Test 1: 10 code-tracing questions on inheritance, polymorphism, encapsulation, abstraction.

Each entry: concept, difficulty, question, note, pseudocode lines (drawn as an image), options (correct FIRST),
explanation, and an equivalent Java program whose output must equal the correct option.
"""

OUT_Q = "What will be the output of the following pseudocode?"

Q = [
    dict(c="Inheritance", d="Hard", q=OUT_Q,
         note="[Note - Objects are created as in Java: the parent constructor runs first, and the child's fields get "
              "their initial values only after the parent constructor finishes.]",
         lines=["Class Parent", "        Constructor Parent()", "                show()", "        End Constructor",
                "        Function show()", "                print \"P\"", "        End Function", "End Class",
                "Class Child Inherits Parent", "        Integer x = 5", "        Constructor Child()",
                "                show()", "        End Constructor", "        Function show()", "                print x",
                "        End Function", "End Class", "Child c = Create Child()"],
         opts=["0 5", "P 5", "5 5", "P 0"],
         expl="Create Child() first runs Parent(). Parent() calls show(), and because the object is a Child, the "
              "overridden Child.show() runs. At that moment x is not yet initialised, so it prints 0. Then x is set "
              "to 5 and Child() calls show() again, printing 5. Output: 0 5.",
         java='''class Parent { Parent() { show(); } void show() { System.out.print("P "); } }
class Child extends Parent { int x = 5; Child() { show(); } void show() { System.out.print(x + " "); } }
public class Main { public static void main(String[] a) { new Child(); } }'''),

    dict(c="Polymorphism", d="Medium", q=OUT_Q, note="",
         lines=["Class Shape", "        Function area()", "                return 0", "        End Function", "End Class",
                "Class Square Inherits Shape", "        Integer s", "        Constructor Square(Integer a)",
                "                s = a", "        End Constructor", "        Function area()",
                "                return s * s", "        End Function", "End Class", "Class Rect Inherits Shape",
                "        Integer l, b", "        Constructor Rect(Integer x, Integer y)", "                l = x",
                "                b = y", "        End Constructor", "        Function area()",
                "                return l * b", "        End Function", "End Class",
                "Shape list[4] = {Create Square(3), Create Rect(2, 5),",
                "                 Create Shape(), Create Square(1)}",
                "Integer total = 0", "for (each sh in list)", "        total = total + sh.area()", "End for",
                "print total"],
         opts=["20", "0", "9", "21"],
         expl="The array holds Shape references, but each call sh.area() runs the version of the actual object "
              "(runtime polymorphism): Square(3) → 9, Rect(2,5) → 10, Shape → 0, Square(1) → 1. Total = 20.",
         java='''class Shape { int area() { return 0; } }
class Square extends Shape { int s; Square(int a) { s = a; } int area() { return s * s; } }
class Rect extends Shape { int l, b; Rect(int x, int y) { l = x; b = y; } int area() { return l * b; } }
public class Main { public static void main(String[] a) {
  Shape[] list = { new Square(3), new Rect(2, 5), new Shape(), new Square(1) };
  int total = 0; for (Shape sh : list) total += sh.area(); System.out.print(total); } }'''),

    dict(c="Encapsulation", d="Medium", q=OUT_Q, note="",
         lines=["Class Account", "        private Integer balance = 1000", "        private Integer failed = 0",
                "        Function withdraw(Integer amt)", "                if (amt > 0 AND amt <= balance)",
                "                        balance = balance - amt", "                else",
                "                        failed = failed + 1", "                End if", "        End Function",
                "        Function report()", "                print balance, failed", "        End Function",
                "End Class", "Account a = Create Account()", "a.withdraw(300)", "a.withdraw(800)",
                "a.withdraw(-50)", "a.withdraw(700)", "a.report()"],
         opts=["0 2", "700 2", "-100 1", "0 1"],
         expl="balance is private and changes only through withdraw(), which validates every request. 300 → "
              "balance 700. 800 > 700 → rejected (failed 1). -50 is not > 0 → rejected (failed 2). 700 ≤ 700 → "
              "balance 0. Output: 0 2.",
         java='''class Account { private int balance = 1000, failed = 0;
  void withdraw(int amt) { if (amt > 0 && amt <= balance) balance -= amt; else failed++; }
  void report() { System.out.print(balance + " " + failed); } }
public class Main { public static void main(String[] x) { Account a = new Account();
  a.withdraw(300); a.withdraw(800); a.withdraw(-50); a.withdraw(700); a.report(); } }'''),

    dict(c="Static vs instance", d="Hard", q=OUT_Q,
         note="[Note - A static variable has one copy shared by all objects; an instance variable has a separate "
              "copy in each object.]",
         lines=["Class Counter", "        static Integer total = 0", "        Integer mine = 0",
                "        Function hit()", "                mine = mine + 1", "                total = total + mine",
                "        End Function", "End Class", "Counter a = Create Counter()", "Counter b = Create Counter()",
                "a.hit()", "a.hit()", "b.hit()", "a.hit()", "print a.mine, b.mine, Counter.total"],
         opts=["3 1 7", "3 1 4", "3 1 3", "1 1 7"],
         expl="mine is separate per object, total is shared. a.hit(): a.mine 1, total 1. a.hit(): a.mine 2, "
              "total 3. b.hit(): b.mine 1, total 4. a.hit(): a.mine 3, total 7. Output: 3 1 7.",
         java='''class Counter { static int total = 0; int mine = 0; void hit() { mine++; total += mine; } }
public class Main { public static void main(String[] x) { Counter a = new Counter(), b = new Counter();
  a.hit(); a.hit(); b.hit(); a.hit(); System.out.print(a.mine + " " + b.mine + " " + Counter.total); } }'''),

    dict(c="Polymorphism (overloading)", d="Hard", q=OUT_Q,
         note="[Note - / between two integers is integer division; % gives the remainder. The method that runs is "
              "chosen by the number and type of the arguments.]",
         lines=["Class Calc", "        Function f(Integer x)", "                return \"I\" + x", "        End Function",
                "        Function f(Double x)", "                return \"D\" + x", "        End Function",
                "        Function f(Integer x, Integer y)", "                return \"II\" + (x + y)",
                "        End Function", "End Class", "Calc c = Create Calc()",
                "print c.f(7 / 2), c.f(7 / 2.0), c.f(7 % 3, 2)"],
         opts=["I3 D3.5 II3", "D3.5 D3.5 II3", "I3 I3 II12", "I3.5 D3.5 II3"],
         expl="Overloading is resolved at compile time from the argument types. 7 / 2 = 3 (integer) → f(Integer) "
              "→ I3. 7 / 2.0 = 3.5 (decimal) → f(Double) → D3.5. 7 % 3 = 1 and 2 → f(Integer, Integer) → "
              "II + (1 + 2) = II3.",
         java='''class Calc { String f(int x) { return "I" + x; } String f(double x) { return "D" + x; }
  String f(int x, int y) { return "II" + (x + y); } }
public class Main { public static void main(String[] a) { Calc c = new Calc();
  System.out.print(c.f(7 / 2) + " " + c.f(7 / 2.0) + " " + c.f(7 % 3, 2)); } }'''),

    dict(c="Inheritance (multilevel + super)", d="Medium", q=OUT_Q,
         note="[Note - super.value() calls the parent class's version of the method.]",
         lines=["Class A", "        Function value()", "                return 1", "        End Function", "End Class",
                "Class B Inherits A", "        Function value()", "                return super.value() + 10",
                "        End Function", "End Class", "Class C Inherits B", "        Function value()",
                "                return super.value() * 2", "        End Function", "End Class",
                "A obj1 = Create C()", "B obj2 = Create B()", "print obj1.value() + obj2.value()"],
         opts=["33", "3", "24", "22"],
         expl="obj1 is a C object: C.value() = B.value() × 2 = (A.value() + 10) × 2 = (1 + 10) × 2 = 22. obj2 is "
              "a B object: 1 + 10 = 11. 22 + 11 = 33. The reference type (A) does not matter for overridden methods.",
         java='''class A { int value() { return 1; } }
class B extends A { int value() { return super.value() + 10; } }
class C extends B { int value() { return super.value() * 2; } }
public class Main { public static void main(String[] x) { A o1 = new C(); B o2 = new B();
  System.out.print(o1.value() + o2.value()); } }'''),

    dict(c="Abstraction", d="Medium", q=OUT_Q, note="",
         lines=["Abstract Class Employee", "        Abstract Function pay()", "        Function bonus()",
                "                return pay() / 10", "        End Function", "End Class",
                "Class Manager Inherits Employee", "        Function pay()", "                return 50000",
                "        End Function", "End Class", "Class Intern Inherits Employee", "        Function pay()",
                "                return 12000", "        End Function", "End Class",
                "Employee staff[3] = {Create Manager(),",
                "                     Create Intern(), Create Intern()}", "Integer sum = 0",
                "for (each e in staff)", "        sum = sum + e.bonus()", "End for", "print sum"],
         opts=["7400", "6200", "74000", "Error: pay() has no body in Employee"],
         expl="The abstract class can still have a normal method (bonus) that calls the abstract one (pay). At run "
              "time pay() uses each object's own version: Manager 50000 / 10 = 5000, Intern 12000 / 10 = 1200 "
              "twice. 5000 + 1200 + 1200 = 7400. Only objects of concrete classes are created, so there is no error.",
         java='''abstract class Employee { abstract int pay(); int bonus() { return pay() / 10; } }
class Manager extends Employee { int pay() { return 50000; } }
class Intern extends Employee { int pay() { return 12000; } }
public class Main { public static void main(String[] x) {
  Employee[] staff = { new Manager(), new Intern(), new Intern() };
  int sum = 0; for (Employee e : staff) sum += e.bonus(); System.out.print(sum); } }'''),

    dict(c="Abstraction (interface)", d="Medium", q=OUT_Q,
         note="[Note - / between two integers is integer division.]",
         lines=["Interface Discount", "        Function apply(Integer price)", "End Interface",
                "Class Flat Implements Discount", "        Function apply(Integer price)",
                "                return price - 100", "        End Function", "End Class",
                "Class Festive Implements Discount", "        Function apply(Integer price)",
                "                return price * 80 / 100", "        End Function", "End Class",
                "Discount d[2] = {Create Flat(), Create Festive()}", "Integer p = 1000", "for (each x in d)",
                "        p = x.apply(p)", "End for", "print p"],
         opts=["720", "700", "800", "900"],
         expl="Each class implements the same interface method differently. The discounts are applied in array "
              "order: Flat: 1000 - 100 = 900, then Festive: 900 × 80 / 100 = 720. (In the other order the result "
              "would be 700.)",
         java='''interface Discount { int apply(int price); }
class Flat implements Discount { public int apply(int p) { return p - 100; } }
class Festive implements Discount { public int apply(int p) { return p * 80 / 100; } }
public class Main { public static void main(String[] a) { Discount[] d = { new Flat(), new Festive() };
  int p = 1000; for (Discount x : d) p = x.apply(p); System.out.print(p); } }'''),

    dict(c="Polymorphism (static hiding)", d="Hard", q=OUT_Q,
         note="[Note - static methods belong to the class, instance methods belong to the object.]",
         lines=["Class Parent", "        static Function hello()", "                print \"P-static\"",
                "        End Function", "        Function greet()", "                print \"P-inst\"",
                "        End Function", "End Class", "Class Child Inherits Parent", "        static Function hello()",
                "                print \"C-static\"", "        End Function", "        Function greet()",
                "                print \"C-inst\"", "        End Function", "End Class", "Parent p = Create Child()",
                "p.hello()", "p.greet()"],
         opts=["P-static C-inst", "C-static C-inst", "P-static P-inst", "C-static P-inst"],
         expl="Instance methods are overridden: greet() runs the object's version (Child) → C-inst. Static methods "
              "are not overridden but hidden: they are chosen by the reference type (Parent), so hello() → "
              "P-static. Output: P-static C-inst.",
         java='''class Parent { static void hello() { System.out.print("P-static "); } void greet() { System.out.print("P-inst"); } }
class Child extends Parent { static void hello() { System.out.print("C-static "); } void greet() { System.out.print("C-inst"); } }
public class Main { @SuppressWarnings("static-access") public static void main(String[] a) {
  Parent p = new Child(); p.hello(); p.greet(); } }'''),

    dict(c="Encapsulation (object identity)", d="Medium", q=OUT_Q,
         note="[Note - == compares whether two references point to the same object.]",
         lines=["Class Point", "        Integer x, y", "        Constructor Point(Integer a, Integer b)",
                "                x = a", "                y = b", "        End Constructor",
                "        Function equals(Point o)", "                return x EQUALS o.x AND y EQUALS o.y",
                "        End Function", "End Class", "Point p1 = Create Point(2, 3)",
                "Point p2 = Create Point(2, 3)", "Point p3 = p1", "print p1 == p2, p1.equals(p2), p1 == p3"],
         opts=["false true true", "true true true", "false false true", "true true false"],
         expl="p1 and p2 are two different objects with the same values: p1 == p2 is false (different references), "
              "but equals() compares the fields, so it is true. p3 = p1 copies the reference, so p1 == p3 is true.",
         java='''class Point { int x, y; Point(int a, int b) { x = a; y = b; }
  boolean equals(Point o) { return x == o.x && y == o.y; } }
public class Main { public static void main(String[] a) { Point p1 = new Point(2, 3), p2 = new Point(2, 3), p3 = p1;
  System.out.print((p1 == p2) + " " + p1.equals(p2) + " " + (p1 == p3)); } }'''),
]
