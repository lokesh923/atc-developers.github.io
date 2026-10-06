IV.addModule({ id: 'oops', group: 'tech', title: 'OOPs concepts', blurb: 'The four pillars, classes and objects, constructors, overloading and overriding, abstract class vs interface, SOLID, exceptions and design basics. Examples in Java.', qa: [
{ lvl: 'basic', hot: true, tags: ['basics'], q: 'What is Object Oriented Programming? Why is it used?', a: `OOP is a style of programming where a program is built from **objects**: bundles of data (fields) and the operations on that data (methods). The code is organised around real-world entities such as Student, Account or Order instead of a long list of functions.

Benefits: **reusability** (inheritance), **maintainability** (changes stay inside one class), **security** (encapsulation hides data), **flexibility** (polymorphism), and a design that maps naturally to the problem.

The four pillars are **encapsulation, abstraction, inheritance and polymorphism**.` },
{ lvl: 'basic', hot: true, tags: ['basics'], q: 'What is the difference between a class and an object?', a: `A **class** is a blueprint or template. It defines the fields and methods but occupies no memory for data by itself. An **object** is an instance of a class: a real thing in memory with its own values.

\`\`\`java
class Car {                 // class
    String color;
    void drive() { System.out.println("Driving"); }
}
Car c1 = new Car();         // object
c1.color = "Red";
Car c2 = new Car();         // another object, own copy of color
\`\`\`

Analogy: the architect's plan of a house is the class, each house built from it is an object.` },
{ lvl: 'basic', hot: true, tags: ['pillars'], q: 'Explain encapsulation with an example.', a: `Encapsulation means **wrapping data and the methods that work on it into one unit (a class) and restricting direct access** to the data. In Java you make fields \`private\` and expose them through public getters and setters, so the class can validate every change.

\`\`\`java
class Account {
    private double balance;                 // hidden
    public double getBalance() { return balance; }
    public void deposit(double amt) {
        if (amt <= 0) throw new IllegalArgumentException("Invalid amount");
        balance += amt;                     // controlled change
    }
}
\`\`\`

A bank account is a good real-life example: you cannot set your balance directly, you can only deposit or withdraw.` },
{ lvl: 'basic', hot: true, tags: ['pillars'], q: 'What is abstraction? How is it different from encapsulation?', a: `**Abstraction** means showing only **what** an object does and hiding **how** it does it. You use a car by pressing the accelerator without knowing the engine internals. In code it is achieved with abstract classes and interfaces.

**Encapsulation** is about **protecting data** by hiding the fields behind access control.

| | Abstraction | Encapsulation |
| --- | --- | --- |
| Focus | Hide complexity, show essentials | Hide data, control access |
| Level | Design level | Implementation level |
| Tools | Abstract class, interface | Private fields with getters/setters |` },
{ lvl: 'basic', hot: true, tags: ['pillars'], q: 'What is inheritance? What are its types?', a: `Inheritance lets a class (**child / subclass**) **acquire the fields and methods of another class (parent / superclass)** using \`extends\`. It gives code reuse and an "is-a" relationship (a Dog is an Animal).

Types:
- **Single:** B extends A.
- **Multilevel:** C extends B, B extends A.
- **Hierarchical:** B and C both extend A.
- **Multiple:** one class extends two classes. **Not supported with classes in Java** (to avoid the diamond problem) but a class can implement many interfaces.
- **Hybrid:** a mix of the above (possible in Java only through interfaces).` },
{ lvl: 'basic', hot: true, tags: ['pillars'], q: 'What is polymorphism? Explain compile-time and run-time polymorphism.', a: `Polymorphism means **one name, many forms**.

- **Compile-time (static) polymorphism:** method **overloading**. The compiler picks the method by its parameters.
- **Run-time (dynamic) polymorphism:** method **overriding**. The JVM decides at run time which version to call, based on the actual object type.

\`\`\`java
class Animal { void sound() { System.out.println("..."); } }
class Dog extends Animal { void sound() { System.out.println("Bark"); } }
Animal a = new Dog();
a.sound();    // prints Bark, decided at run time
\`\`\`` },
{ lvl: 'basic', hot: true, tags: ['polymorphism'], q: 'Difference between method overloading and method overriding.', a: `| Point | Overloading | Overriding |
| --- | --- | --- |
| Meaning | Same method name, different parameters | Child gives its own body to a parent method |
| Where | Same class (or subclass) | Parent and child classes |
| Parameters | Must differ (type, number or order) | Must be the same |
| Return type | Can differ | Same or covariant |
| Binding | Compile time | Run time |
| Access / exceptions | No restriction | Cannot reduce visibility, cannot throw broader checked exceptions |

\`static\`, \`final\` and \`private\` methods cannot be overridden. Changing only the return type is **not** valid overloading.` },
{ lvl: 'basic', hot: true, tags: ['abstract'], q: 'Abstract class vs interface: differences and when to use which.', a: `| Point | Abstract class | Interface |
| --- | --- | --- |
| Methods | Abstract and concrete | Abstract by default; \`default\` and \`static\` methods since Java 8 |
| Variables | Any kind | Only \`public static final\` constants |
| Constructor | Yes | No |
| Inheritance | A class extends only one | A class can implement many |
| Access modifiers | Any | Methods are public |
| Use for | Closely related classes sharing code and state | A capability or contract that unrelated classes can have |

Use an **abstract class** for an "is-a" base with shared code (Vehicle). Use an **interface** for a "can-do" contract (Comparable, Runnable, Serializable).` },
{ lvl: 'basic', hot: true, tags: ['constructor'], q: 'What is a constructor? What are its types and rules?', a: `A constructor is a special method that **initialises an object when it is created**. It has the same name as the class and **no return type**.

- **Default constructor:** no parameters. The compiler adds one only if you write no constructor at all.
- **Parameterised constructor:** takes values to set fields.
- **Copy constructor:** builds an object from another object (Java has no built-in one, you write it).

Rules: it cannot be \`static\`, \`final\` or \`abstract\`; it is not inherited; it can be overloaded; \`this(...)\` calls another constructor of the same class and \`super(...)\` calls the parent constructor, and it must be the first statement.` },
{ lvl: 'basic', tags: ['keywords'], q: 'What are the uses of the `this` and `super` keywords?', a: `**this** refers to the current object.
- Separate a field from a parameter with the same name (\`this.id = id\`).
- Call another constructor (\`this(0)\`).
- Pass the current object as an argument.

**super** refers to the parent class.
- Call the parent constructor (\`super(name)\`).
- Call an overridden parent method (\`super.display()\`).
- Access a parent field hidden by a child field.` },
{ lvl: 'basic', hot: true, tags: ['keywords'], q: 'What is the static keyword? Where can it be used?', a: `\`static\` makes a member belong to the **class**, not to any object. It is loaded once when the class is loaded.

- **Static variable:** one shared copy for all objects (a counter of objects created).
- **Static method:** can be called without an object (\`Math.max\`); it cannot use \`this\` or non-static members directly.
- **Static block:** runs once when the class loads, used for initialisation.
- **Static nested class.**

\`main\` is static so that the JVM can call it without creating an object.` },
{ lvl: 'basic', hot: true, tags: ['keywords'], q: 'What is the final keyword?', a: `\`final\` means "cannot be changed".

- **final variable:** value can be assigned only once (a constant).
- **final method:** cannot be overridden.
- **final class:** cannot be extended (\`String\`, \`Integer\`).

A \`final\` reference cannot point to another object, but the object's contents can still change (a \`final List\` can have elements added). Do not confuse it with \`finally\` (a block of exception handling) and \`finalize()\` (a method called by the garbage collector, deprecated).` },
{ lvl: 'basic', tags: ['access'], q: 'What are access modifiers in Java?', a: `| Modifier | Same class | Same package | Subclass (other package) | Everywhere |
| --- | --- | --- | --- | --- |
| private | Yes | No | No | No |
| default (no keyword) | Yes | Yes | No | No |
| protected | Yes | Yes | Yes | No |
| public | Yes | Yes | Yes | Yes |

Use the **most restrictive** modifier that works. This is part of encapsulation.` },
{ lvl: 'medium', hot: true, tags: ['abstract'], q: 'Can we create an object of an abstract class or an interface? Can an abstract class have a constructor?', a: `No, you cannot instantiate an abstract class or an interface directly. You can only create objects of a **concrete subclass** (or an anonymous class/lambda), and hold them in a reference of the abstract type.

An abstract class **can** have a constructor. It is called through \`super()\` when a subclass object is created, and is used to initialise the common fields. An interface has no constructor.` },
{ lvl: 'medium', hot: true, tags: ['inheritance'], q: 'Why does Java not support multiple inheritance with classes? What is the diamond problem?', a: `If class D extends both B and C, and B and C both extend A and both override a method \`show()\`, then D inherits two different versions of \`show()\` and the compiler cannot know which to use. This ambiguity is the **diamond problem**.

Java avoids it by allowing a class to extend only **one** class. A class can implement many interfaces because interfaces historically had no implementation. With default methods, if two interfaces give the same default method, the class **must override it** and can choose with \`InterfaceName.super.method()\`.` },
{ lvl: 'medium', tags: ['polymorphism'], q: 'Can we override a static method or a private method? What is method hiding?', a: `No. Overriding works with **instance** methods and run-time binding. A \`static\` method belongs to the class, so if a subclass declares a static method with the same signature it **hides** the parent's method (the call is decided by the reference type at compile time). A \`private\` method is not visible to the subclass at all, so a method with the same name in the child is simply a new method.` },
{ lvl: 'medium', tags: ['relationships'], q: 'What is the difference between association, aggregation and composition?', a: `All three describe how classes are related ("has-a").

- **Association:** a general relationship where objects know each other (a Teacher teaches Students). Both live independently.
- **Aggregation:** a weak "has-a". The part can exist without the whole (a Department has Professors; the professors exist even if the department closes).
- **Composition:** a strong "has-a". The part cannot exist without the whole (a House has Rooms; if the house is destroyed the rooms go too).

Inheritance is "is-a", composition and aggregation are "has-a". Prefer composition over inheritance when you only want to reuse behaviour.` },
{ lvl: 'medium', hot: true, tags: ['exceptions'], q: 'Explain exception handling in Java: try, catch, finally, throw and throws.', a: `An exception is an event that disrupts normal flow. Java handles it with:

- **try:** the code that may throw.
- **catch:** handles a specific exception type.
- **finally:** always runs (cleanup like closing a file), whether or not an exception occurred.
- **throw:** actually throws an exception object (\`throw new IllegalStateException()\`).
- **throws:** declares in the method signature which exceptions it may pass to the caller.

\`\`\`java
try {
    int r = 10 / divisor;
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
} finally {
    System.out.println("Always executed");
}
\`\`\`

Since Java 7, **try-with-resources** closes resources automatically.` },
{ lvl: 'medium', hot: true, tags: ['exceptions'], q: 'What is the difference between checked and unchecked exceptions? Error vs Exception?', a: `- **Checked exceptions** are checked by the compiler. You must catch them or declare them with \`throws\` (IOException, SQLException, FileNotFoundException).
- **Unchecked exceptions** extend \`RuntimeException\`. The compiler does not force you to handle them (NullPointerException, ArrayIndexOutOfBoundsException, ArithmeticException, IllegalArgumentException).
- **Error** (OutOfMemoryError, StackOverflowError) represents serious JVM problems. You should not normally catch them.

All of these extend \`Throwable\`. Custom exceptions extend \`Exception\` (checked) or \`RuntimeException\` (unchecked).` },
{ lvl: 'medium', tags: ['exceptions'], q: 'Does the finally block always execute? What if there is a return in try?', a: `Yes, almost always. If the \`try\` block has a \`return\`, the \`finally\` block still runs **before** the method actually returns. It will not run only if the JVM exits (\`System.exit()\`), the thread is killed or the machine crashes.

If \`finally\` itself has a \`return\`, it overrides the return of the \`try\` block, which is a bad practice.` },
{ lvl: 'medium', hot: true, tags: ['strings'], q: 'Why is String immutable in Java? String vs StringBuilder vs StringBuffer.', a: `A \`String\` object cannot be changed after creation. Reasons: **security** (strings hold passwords, file paths, URLs), **thread safety**, safe use as **HashMap keys** (the hash code never changes) and the **String pool** (many references can share one object).

| | String | StringBuilder | StringBuffer |
| --- | --- | --- | --- |
| Mutable | No | Yes | Yes |
| Thread safe | Yes (immutable) | No | Yes (synchronised) |
| Speed for repeated changes | Slow (new object each time) | Fastest | Slower than StringBuilder |

Use StringBuilder for building strings in loops.` },
{ lvl: 'medium', hot: true, tags: ['strings'], q: 'What is the String pool? What is the difference between == and equals()?', a: `Java keeps string literals in a special area called the **String constant pool**. Two literals with the same text share one object.

\`\`\`java
String a = "hello";
String b = "hello";
String c = new String("hello");
System.out.println(a == b);        // true  (same pooled object)
System.out.println(a == c);        // false (c is a new object on the heap)
System.out.println(a.equals(c));   // true  (same content)
\`\`\`

\`==\` compares **references** (addresses). \`equals()\` compares **content** (for String). Always use \`equals\` to compare strings.` },
{ lvl: 'medium', hot: true, tags: ['collections'], q: 'What is the Java Collections Framework? Explain List, Set and Map.', a: `The Collections Framework is a set of interfaces and classes for storing and manipulating groups of objects.

- **List:** ordered, allows duplicates, access by index. \`ArrayList\`, \`LinkedList\`, \`Vector\`.
- **Set:** no duplicates. \`HashSet\` (no order), \`LinkedHashSet\` (insertion order), \`TreeSet\` (sorted).
- **Map:** key-value pairs, unique keys. \`HashMap\`, \`LinkedHashMap\`, \`TreeMap\`, \`Hashtable\`.
- **Queue / Deque:** \`PriorityQueue\`, \`ArrayDeque\`, \`LinkedList\`.

\`Map\` is part of the framework but does **not** extend the \`Collection\` interface.` },
{ lvl: 'medium', hot: true, tags: ['collections'], q: 'ArrayList vs LinkedList, and HashMap vs Hashtable vs ConcurrentHashMap.', a: `**ArrayList vs LinkedList**
- ArrayList uses a dynamic array: fast random access O(1), slow insert/delete in the middle O(n).
- LinkedList is a doubly linked list: fast insert/delete at known positions, slow access O(n).

**HashMap vs Hashtable**
| | HashMap | Hashtable |
| --- | --- | --- |
| Thread safe | No | Yes (synchronised, slow) |
| Null key / values | One null key, many null values | Not allowed |
| Speed | Faster | Slower |
| Legacy | No | Yes |

**ConcurrentHashMap** is the modern thread-safe map: it locks small parts of the map, so many threads can work together.` },
{ lvl: 'medium', hot: true, tags: ['collections'], q: 'How does HashMap work internally? What are hashCode() and equals()?', a: `A HashMap is an array of buckets. On \`put(key, value)\`:
1. It calls \`key.hashCode()\` and spreads the bits to get an index.
2. If the bucket is empty, the entry is stored there.
3. If not, it walks the bucket and uses \`equals()\` to find an existing equal key. If found, the value is replaced, otherwise the new entry is added to the list (converted to a **balanced tree** when a bucket gets long, Java 8+).
4. When the number of entries crosses \`capacity x 0.75\`, the table doubles and entries are rehashed.

**Contract:** if two objects are equal by \`equals()\`, they **must** return the same \`hashCode()\`. If you override one, override the other, otherwise the key cannot be found again.` },
{ lvl: 'medium', tags: ['collections'], q: 'What is the difference between Comparable and Comparator?', a: `- **Comparable** (\`java.lang\`): the class itself defines its **natural order** by implementing \`compareTo(T other)\`. One ordering only.
- **Comparator** (\`java.util\`): a separate object that defines **any order** with \`compare(a, b)\`. You can have many (sort by name, by marks, by age).

\`\`\`java
list.sort(Comparator.comparing(Student::getMarks).reversed());
\`\`\`` },
{ lvl: 'medium', hot: true, tags: ['threads'], q: 'What is multithreading? How can you create a thread in Java?', a: `Multithreading means running **multiple threads (lightweight units of execution) inside one process** at the same time, sharing the same memory. It improves responsiveness and uses multiple CPU cores.

Ways to create a thread:
1. Extend \`Thread\` and override \`run()\`.
2. Implement \`Runnable\` (preferred: it keeps your class free to extend another class) and pass it to a \`Thread\`.
3. Implement \`Callable\` and submit it to an \`ExecutorService\` (returns a result).

\`\`\`java
Thread t = new Thread(() -> System.out.println("Hello from thread"));
t.start();    // start() creates a new thread; run() would just call the method
\`\`\`` },
{ lvl: 'medium', hot: true, tags: ['threads'], q: 'What is synchronization? What is a deadlock?', a: `When many threads change shared data at the same time you get a **race condition** and wrong results. **Synchronization** (the \`synchronized\` keyword or locks) allows only one thread at a time into a critical section.

A **deadlock** happens when threads wait for each other forever: Thread 1 holds lock A and waits for B, Thread 2 holds lock B and waits for A. Prevent it by always acquiring locks in the same order, holding locks for a short time and using timeouts (\`tryLock\`).` },
{ lvl: 'medium', tags: ['threads'], q: 'What is the difference between wait(), sleep() and join()?', a: `- **sleep(ms):** pauses the current thread for a time. It **keeps** the lock it holds. It is a static method of \`Thread\`.
- **wait():** releases the lock and waits until another thread calls \`notify()\` or \`notifyAll()\`. It must be called inside a synchronized block and belongs to \`Object\`.
- **join():** the calling thread waits until the other thread finishes.` },
{ lvl: 'medium', tags: ['jvm'], q: 'What are JDK, JRE and JVM? How does a Java program run?', a: `- **JVM (Java Virtual Machine):** runs bytecode and makes Java platform independent.
- **JRE (Java Runtime Environment):** JVM + the standard class libraries needed to **run** programs.
- **JDK (Java Development Kit):** JRE + the compiler (\`javac\`), debugger and tools needed to **develop** programs.

Flow: \`Hello.java\` -> compiled by \`javac\` -> \`Hello.class\` (bytecode) -> loaded by the class loader -> executed by the JVM (interpreter + JIT compiler). That is why the same bytecode runs on Windows, Linux and Mac ("write once, run anywhere").` },
{ lvl: 'medium', tags: ['jvm'], q: 'What is garbage collection in Java?', a: `The garbage collector (GC) automatically **frees memory of objects that can no longer be reached** from any live reference, so the programmer does not call \`free\`.

The heap is divided into a young generation (new objects, collected often) and an old generation (long-lived objects). You can request GC with \`System.gc()\`, but the JVM decides when to run it. You cannot rely on \`finalize()\`; use try-with-resources for cleanup instead.` },
{ lvl: 'basic', tags: ['basics'], q: 'What is the difference between a primitive type and a wrapper class? What are autoboxing and unboxing?', a: `Primitives (\`int, double, char, boolean...\`) hold a plain value, are fast and cannot be null. Wrapper classes (\`Integer, Double, Character, Boolean...\`) are objects that wrap a primitive, so they can be used in collections (\`List<Integer>\`), can be null and have helper methods (\`Integer.parseInt\`).

**Autoboxing** converts a primitive to its wrapper automatically (\`Integer x = 5\`), and **unboxing** does the reverse (\`int y = x\`). Be careful: unboxing a null wrapper throws \`NullPointerException\`, and \`==\` on two \`Integer\` objects outside the cached range -128..127 compares references.` },
{ lvl: 'medium', hot: true, tags: ['solid', 'design'], q: 'Explain the SOLID principles.', a: `SOLID is a set of five design principles for maintainable object-oriented code.

1. **S - Single Responsibility:** a class should have one reason to change (a \`Report\` class should not also send emails).
2. **O - Open/Closed:** open for extension, closed for modification. Add new behaviour by adding classes, not by editing old ones.
3. **L - Liskov Substitution:** a subclass object must be usable wherever the parent is expected without breaking behaviour.
4. **I - Interface Segregation:** many small, specific interfaces are better than one large one.
5. **D - Dependency Inversion:** depend on abstractions (interfaces), not on concrete classes.` },
{ lvl: 'medium', tags: ['design'], q: 'What is a singleton class? How do you create one?', a: `A singleton allows **only one instance** of a class in the whole application (for a logger, configuration, connection pool).

\`\`\`java
public class Config {
    private static Config instance;
    private Config() { }                       // private constructor
    public static synchronized Config getInstance() {
        if (instance == null) instance = new Config();
        return instance;
    }
}
\`\`\`

A simple thread-safe alternative is eager initialisation (\`private static final Config INSTANCE = new Config();\`) or an \`enum\` singleton.` },
{ lvl: 'medium', tags: ['design'], q: 'What is coupling and cohesion? What do we want?', a: `- **Cohesion:** how closely the things inside one class or module belong together. We want **high cohesion** (a class that does one job well).
- **Coupling:** how much one class depends on others. We want **low (loose) coupling** so that changing one class does not break many others. Interfaces and dependency injection reduce coupling.` },
{ lvl: 'basic', tags: ['basics'], q: 'What is method chaining, an anonymous class and a lambda expression?', a: `- **Method chaining:** calling methods one after another on the returned object (\`sb.append("a").append("b")\`).
- **Anonymous class:** a class without a name, defined and instantiated in one expression, often to implement an interface once.
- **Lambda expression (Java 8):** a short way to write an implementation of a functional interface (an interface with one abstract method): \`(a, b) -> a + b\`. Used heavily with streams: \`list.stream().filter(x -> x > 10).count()\`.` },
{ lvl: 'medium', tags: ['basics'], q: 'What is the difference between shallow copy and deep copy? What is cloning?', a: `A **shallow copy** copies the object's fields as they are. If a field is a reference, both the original and the copy point to the **same inner object**, so changing it through one changes it in the other. A **deep copy** also creates copies of the inner objects, so the two objects are completely independent.

In Java the default \`clone()\` is shallow. For deep copy, clone inner objects too, use a copy constructor, or serialise and deserialise the object.` },
{ lvl: 'basic', tags: ['pillars'], q: 'Give a real-life example for each of the four OOP pillars.', a: `- **Encapsulation:** an ATM. You can only use the buttons; the cash and the balance data are hidden inside.
- **Abstraction:** a TV remote. You use the buttons without knowing the circuits.
- **Inheritance:** a SportsCar inherits the features of Car (wheels, engine) and adds its own (turbo).
- **Polymorphism:** a person is a student in college, an employee at work and a son at home. In code, \`draw()\` behaves differently for Circle and Square.

Use one example you can explain clearly, interviewers prefer a short correct example over a long one.` },
{ lvl: 'medium', tags: ['basics'], q: 'What is the difference between C++ and Java in terms of OOP?', a: `| Point | C++ | Java |
| --- | --- | --- |
| Platform | Compiled to machine code, platform dependent | Compiled to bytecode, platform independent |
| Pointers | Yes | No explicit pointers |
| Multiple inheritance | Yes (classes) | Only through interfaces |
| Memory management | Manual (new/delete) | Automatic garbage collection |
| Operator overloading | Supported | Not supported (except + for strings) |
| Destructors | Yes | No (GC) |
| Procedural code | Allowed (functions outside classes) | Everything is inside a class |` },
] });
