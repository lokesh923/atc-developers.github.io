IV.addModule({ id: 'java', group: 'lang', title: 'Java programming', blurb: 'Core Java as asked in Infosys interviews: language basics, strings, collections, generics, lambdas and streams, exceptions, multithreading, memory and output-based questions. Code samples were compiled and run.', qa: [
{ lvl: 'basic', hot: true, tags: ['basics'], q: 'What is the difference between JDK, JRE and JVM?', a: `- **JVM (Java Virtual Machine):** runs bytecode and makes Java platform independent. It includes the class loader, bytecode verifier, interpreter and JIT compiler, and the garbage collector.
- **JRE (Java Runtime Environment):** JVM plus the core libraries needed to **run** programs.
- **JDK (Java Development Kit):** JRE plus development tools (\`javac\`, \`jar\`, debugger) to **write and compile** programs.

JDK contains JRE, and JRE contains JVM. Source (\`.java\`) is compiled by \`javac\` into bytecode (\`.class\`), which any JVM can run: "write once, run anywhere".` },
{ lvl: 'basic', hot: true, tags: ['basics'], q: 'Why is the main method public static void main(String[] args)?', a: `- **public:** the JVM must be able to call it from outside the class.
- **static:** the JVM calls it without creating an object of the class.
- **void:** it returns nothing to the JVM.
- **main:** the fixed name the JVM looks for.
- **String[] args:** command-line arguments.

Missing any of these gives a runtime error such as "main method not found" (newer Java versions relax this with preview features, but the classic form is what you should know).` },
{ lvl: 'basic', hot: true, tags: ['basics'], q: 'List the primitive data types in Java with size and default values.', a: `| Type | Size | Default |
| --- | --- | --- |
| byte | 1 byte | 0 |
| short | 2 bytes | 0 |
| int | 4 bytes | 0 |
| long | 8 bytes | 0L |
| float | 4 bytes | 0.0f |
| double | 8 bytes | 0.0d |
| char | 2 bytes (Unicode) | '\\u0000' |
| boolean | JVM dependent (1 bit of information) | false |

Everything else (String, arrays, classes) is a **reference type** whose default is \`null\`. Local variables have no default and must be initialised before use.` },
{ lvl: 'basic', hot: true, tags: ['strings'], q: '== vs equals() in Java, and the String pool. What is the output?', a: `\`==\` compares **references** (are both variables pointing to the same object?). \`equals()\` compares **content** (for String, it is overridden to compare characters).

String literals are stored in the **string pool** and reused; \`new String(...)\` always creates a new object in the heap.

\`\`\`java
// runnable
public class Main {
    public static void main(String[] args) {
        String a = "hello";
        String b = "hello";
        String c = new String("hello");
        System.out.println(a == b);
        System.out.println(a == c);
        System.out.println(a.equals(c));
        System.out.println(a == c.intern());
    }
}
// expect: true
// expect: false
// expect: true
// expect: true
\`\`\`
\`intern()\` returns the pooled version of the string.` },
{ lvl: 'basic', hot: true, tags: ['strings'], q: 'Why is String immutable in Java? String vs StringBuilder vs StringBuffer.', a: `Once created, a String's content cannot change; operations return a **new** String. Reasons: **security** (class names, file paths, passwords used as keys), **thread safety**, **string pool** sharing (safe only if immutable), and a cached **hashCode** that makes Strings fast HashMap keys.

| | String | StringBuilder | StringBuffer |
| --- | --- | --- | --- |
| Mutable | No | Yes | Yes |
| Thread-safe | Yes (immutable) | No | Yes (synchronized) |
| Speed | Slow when concatenating in loops | Fastest | Slower than StringBuilder |

Use StringBuilder for concatenation in loops, StringBuffer only when shared between threads.` },
{ lvl: 'basic', hot: true, tags: ['basics'], q: 'What are wrapper classes, autoboxing and the Integer cache?', a: `Each primitive has a wrapper class (\`int\` -> \`Integer\`, \`char\` -> \`Character\`). **Autoboxing** converts a primitive to its wrapper automatically; **unboxing** does the reverse. Wrappers are needed for collections (\`List<Integer>\`) and to hold \`null\`.

\`Integer\` caches objects for values **-128 to 127**, so \`==\` behaves surprisingly:

\`\`\`java
// runnable
public class Main {
    public static void main(String[] args) {
        Integer a = 100, b = 100;
        Integer c = 1000, d = 1000;
        System.out.println(a == b);
        System.out.println(c == d);
        System.out.println(c.equals(d));
    }
}
// expect: true
// expect: false
// expect: true
\`\`\`
Always compare wrapper objects with \`equals()\`.` },
{ lvl: 'basic', hot: true, tags: ['basics'], q: 'What is the use of the static and final keywords?', a: `**static:** belongs to the class, not to an object. A static variable is shared by all objects; a static method is called without an object and cannot use \`this\` or instance members directly; a static block runs once when the class loads.

**final:**
- final **variable:** cannot be reassigned (a constant).
- final **method:** cannot be overridden.
- final **class:** cannot be extended (\`String\`, \`Integer\`).

Note: a \`final\` reference cannot point to another object, but the object's contents can still change (for example, adding to a final list). Compare: **finally** is a block that runs after try/catch, and **finalize()** is a deprecated method called before garbage collection.` },
{ lvl: 'basic', tags: ['basics'], q: 'What is the difference between pass by value and pass by reference in Java?', a: `Java is **always pass by value**. For primitives the value is copied. For objects, the **reference** is copied, so the method can modify the object but cannot make the caller's variable point to a different object.

\`\`\`java
// runnable
public class Main {
    static void change(int[] arr, int x) {
        arr[0] = 99;
        x = 99;
        arr = new int[]{7};
    }
    public static void main(String[] args) {
        int[] a = {1};
        int n = 1;
        change(a, n);
        System.out.println(a[0] + " " + n);
    }
}
// expect: 99 1
\`\`\`
\`arr[0] = 99\` changed the shared object; reassigning \`arr\` only changed the local copy of the reference.` },
{ lvl: 'medium', hot: true, tags: ['basics'], q: 'What is the output? Tricky initialisation order of static block, instance block and constructor.', a: `Order: **static blocks (once, at class load) -> instance initialiser blocks -> constructor**. With inheritance, the parent's static, then the child's static, then parent instance block and constructor, then child instance block and constructor.

\`\`\`java
// runnable
class A {
    static { System.out.println("A static"); }
    { System.out.println("A instance"); }
    A() { System.out.println("A constructor"); }
}
class B extends A {
    static { System.out.println("B static"); }
    { System.out.println("B instance"); }
    B() { System.out.println("B constructor"); }
}
public class Main {
    public static void main(String[] args) {
        new B();
        System.out.println("--");
        new B();
    }
}
// expect: A static
// expect: B static
// expect: A instance
// expect: A constructor
// expect: B instance
// expect: B constructor
// expect: --
// expect: A instance
// expect: A constructor
// expect: B instance
// expect: B constructor
\`\`\`` },
{ lvl: 'medium', hot: true, tags: ['oop'], q: 'Method overloading vs overriding with a tricky output question.', a: `**Overloading** is resolved at **compile time** by the reference type and arguments. **Overriding** is resolved at **run time** by the actual object type.

\`\`\`java
// runnable
class Animal {
    void speak() { System.out.println("animal"); }
    void show(Animal a) { System.out.println("show animal"); }
}
class Dog extends Animal {
    @Override void speak() { System.out.println("dog"); }
    void show(Dog d) { System.out.println("show dog"); }
}
public class Main {
    public static void main(String[] args) {
        Animal x = new Dog();
        x.speak();
        x.show(new Dog());
        Dog y = new Dog();
        y.show(new Dog());
    }
}
// expect: dog
// expect: show animal
// expect: show dog
\`\`\`
\`x.speak()\` is overridden, so Dog's version runs. \`x.show(new Dog())\`: the reference type is Animal, which only knows \`show(Animal)\`, so that overload is chosen (Dog's \`show(Dog)\` is an overload, not an override).` },
{ lvl: 'basic', hot: true, tags: ['collections'], q: 'Explain the Java Collections Framework hierarchy.', a: `\`\`\`
Iterable
  Collection
    List   -> ArrayList, LinkedList, Vector, Stack
    Set    -> HashSet, LinkedHashSet, TreeSet
    Queue  -> PriorityQueue, ArrayDeque (Deque)
Map (separate) -> HashMap, LinkedHashMap, TreeMap, Hashtable, ConcurrentHashMap
\`\`\`
| Class | Ordering | Duplicates | Null | Notes |
| --- | --- | --- | --- | --- |
| ArrayList | Insertion | Yes | Yes | Dynamic array, fast random access |
| LinkedList | Insertion | Yes | Yes | Fast insert/delete at ends |
| HashSet | None | No | One null | Backed by HashMap |
| LinkedHashSet | Insertion | No | One null | Keeps order |
| TreeSet | Sorted | No | No | Red-black tree, O(log n) |
| HashMap | None | Unique keys | One null key | O(1) average |
| TreeMap | Sorted by key | Unique keys | No null key | O(log n) |
| Hashtable | None | Unique keys | No nulls | Legacy, synchronized |` },
{ lvl: 'basic', hot: true, tags: ['collections'], q: 'ArrayList vs LinkedList. When do you use which?', a: `| | ArrayList | LinkedList |
| --- | --- | --- |
| Structure | Resizable array | Doubly linked list |
| get(i) | **O(1)** | O(n) |
| add at end | O(1) amortised | O(1) |
| add or remove in middle | O(n) (shifting) | O(1) once the node is found (finding is O(n)) |
| Memory | Less | More (two pointers per node) |

Use **ArrayList** by default (most workloads read more than they insert). Use LinkedList mainly as a queue/deque. When an ArrayList is full it grows by about 50% (new array of 1.5x size, elements copied).` },
{ lvl: 'medium', hot: true, tags: ['collections'], q: 'How does HashMap work internally? What happens on collision?', a: `HashMap stores entries in an array of **buckets**. For \`put(key, value)\`:
1. Compute \`hashCode()\` of the key and spread the bits.
2. Index = hash & (capacity - 1).
3. If the bucket is empty, store the entry. Otherwise there is a **collision**: the entries chain in a linked list. The key's \`equals()\` is used to find the same key (replace) or append a new node.
4. Since Java 8, when a bucket holds **8 or more** nodes (and the table has at least 64 buckets) the list becomes a **red-black tree**, giving O(log n) worst-case lookup.
5. When size exceeds **capacity x load factor** (default 16 x 0.75 = 12), the table **doubles** and entries are rehashed.

**Contract:** if two objects are \`equals()\`, they must have the same \`hashCode()\`. Break it and \`get()\` will not find your key.` },
{ lvl: 'medium', hot: true, tags: ['collections'], q: 'HashMap vs Hashtable vs ConcurrentHashMap. HashSet vs TreeSet.', a: `| | HashMap | Hashtable | ConcurrentHashMap |
| --- | --- | --- | --- |
| Thread-safe | No | Yes (whole-method lock) | Yes (fine-grained locking / CAS) |
| Null key / values | 1 null key, many null values | None allowed | None allowed |
| Speed | Fastest single-thread | Slow | Fast under concurrency |

**HashSet** is unordered with O(1) operations; **TreeSet** is sorted with O(log n) operations and needs elements to be Comparable (or a Comparator).` },
{ lvl: 'medium', tags: ['collections'], q: 'Comparable vs Comparator. Sort a list of employees by salary and then name.', a: `**Comparable** defines the **natural order** inside the class (\`compareTo\`). **Comparator** defines **external, custom** orders (\`compare\`), so you can have many.

\`\`\`java
// runnable
import java.util.*;
public class Main {
    record Emp(String name, int salary) {}
    public static void main(String[] args) {
        List<Emp> l = new ArrayList<>(List.of(new Emp("Ravi", 50), new Emp("Anu", 70), new Emp("Zoya", 50)));
        l.sort(Comparator.comparingInt(Emp::salary).reversed().thenComparing(Emp::name));
        for (Emp e : l) System.out.println(e.name() + " " + e.salary());
    }
}
// expect: Anu 70
// expect: Ravi 50
// expect: Zoya 50
\`\`\`` },
{ lvl: 'medium', tags: ['collections'], q: 'What is fail-fast vs fail-safe? Why do we get ConcurrentModificationException?', a: `Modifying a collection while iterating with a for-each loop makes the **fail-fast** iterator of ArrayList or HashMap throw \`ConcurrentModificationException\`. **Fail-safe** collections (\`CopyOnWriteArrayList\`, \`ConcurrentHashMap\`) iterate over a snapshot or tolerate changes.

\`\`\`java
// runnable
import java.util.*;
public class Main {
    public static void main(String[] args) {
        List<Integer> l = new ArrayList<>(List.of(1, 2, 3, 4));
        Iterator<Integer> it = l.iterator();
        while (it.hasNext()) if (it.next() % 2 == 0) it.remove();
        System.out.println(l);
        try {
            for (Integer x : l) l.add(9);
        } catch (ConcurrentModificationException e) {
            System.out.println("CME");
        }
    }
}
// expect: [1, 3]
// expect: CME
\`\`\`
Remove safely with \`Iterator.remove()\` or \`removeIf()\`.` },
{ lvl: 'medium', tags: ['generics'], q: 'What are generics? What is type erasure and the wildcard?', a: `Generics give **compile-time type safety** and remove casts: \`List<String>\` can only hold Strings.

- **Type erasure:** generic type information exists only at compile time; at runtime \`List<String>\` and \`List<Integer>\` are both just \`List\`. So you cannot do \`new T()\` or \`instanceof List<String>\`, and primitives cannot be type arguments.
- **Wildcards:** \`List<?>\` any type (read-only use); \`List<? extends Number>\` Number or its subclasses (read, "producer"); \`List<? super Integer>\` Integer or its superclasses (write, "consumer"). Rule of thumb: **PECS** (Producer Extends, Consumer Super).` },
{ lvl: 'medium', hot: true, tags: ['java8'], q: 'What are lambda expressions and functional interfaces?', a: `A **functional interface** has exactly one abstract method (\`Runnable\`, \`Comparator\`, \`Function<T,R>\`, \`Predicate<T>\`, \`Consumer<T>\`, \`Supplier<T>\`). A **lambda** is a short way to implement it: \`(params) -> expression\`. It replaces anonymous classes.

\`\`\`java
// runnable
import java.util.function.*;
public class Main {
    public static void main(String[] args) {
        Function<Integer, Integer> sq = x -> x * x;
        Predicate<String> empty = String::isEmpty;
        BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
        System.out.println(sq.apply(7) + " " + empty.test("") + " " + add.apply(3, 4));
    }
}
// expect: 49 true 7
\`\`\`
\`@FunctionalInterface\` makes the compiler check the rule. \`Class::method\` is a method reference.` },
{ lvl: 'medium', hot: true, tags: ['java8'], q: 'Explain the Stream API with examples (filter, map, reduce, collect, groupingBy).', a: `A **stream** is a pipeline of operations over data: a source, zero or more **intermediate** operations (lazy: filter, map, sorted, distinct) and one **terminal** operation (collect, forEach, reduce, count). Streams do not modify the source.

\`\`\`java
// runnable
import java.util.*;
import java.util.stream.*;
public class Main {
    public static void main(String[] args) {
        List<Integer> n = List.of(1, 2, 3, 4, 5, 6);
        System.out.println(n.stream().filter(x -> x % 2 == 0).map(x -> x * x).collect(Collectors.toList()));
        System.out.println(n.stream().mapToInt(Integer::intValue).sum());
        System.out.println(n.stream().reduce(1, (a, b) -> a * b));
        List<String> w = List.of("apple", "avocado", "banana", "blueberry", "cherry");
        System.out.println(w.stream().collect(Collectors.groupingBy(s -> s.charAt(0), Collectors.counting())));
        System.out.println(w.stream().anyMatch(s -> s.startsWith("c")));
    }
}
// expect: [4, 16, 36]
// expect: 21
// expect: 720
// expect: {a=2, b=2, c=1}
// expect: true
\`\`\`` },
{ lvl: 'medium', tags: ['java8'], q: 'What is Optional? What are default and static methods in interfaces?', a: `**Optional<T>** is a container that may or may not hold a non-null value; it forces callers to handle absence instead of risking \`NullPointerException\`. Use \`Optional.ofNullable(x).map(...).orElse("default")\`. Do not use it for fields or method parameters.

Java 8 allows interfaces to have **default** methods (with a body, so interfaces can evolve without breaking implementers) and **static** methods (utility methods on the interface). Java 9 added private methods. If two interfaces give the same default method, the class must override it to resolve the conflict.` },
{ lvl: 'basic', hot: true, tags: ['exceptions'], q: 'Checked vs unchecked exceptions. Explain try, catch, finally, throw and throws.', a: `\`Throwable\` -> **Error** (OutOfMemoryError, StackOverflowError; do not catch) and **Exception**.
- **Checked** (subclasses of Exception except RuntimeException): the compiler forces you to handle or declare them: \`IOException\`, \`SQLException\`.
- **Unchecked** (RuntimeException): programming bugs: \`NullPointerException\`, \`ArrayIndexOutOfBoundsException\`, \`ArithmeticException\`, \`ClassCastException\`.

**try** holds risky code, **catch** handles it, **finally** always runs (cleanup), **throw** raises an exception, **throws** declares one in a method signature. Use **try-with-resources** for anything \`AutoCloseable\`.` },
{ lvl: 'medium', hot: true, tags: ['exceptions'], q: 'What is the output? try, catch, finally with return.', a: `\`\`\`java
// runnable
public class Main {
    static int f() {
        try {
            return 1;
        } finally {
            System.out.println("finally");
        }
    }
    @SuppressWarnings("finally")
    static int g() {
        try {
            throw new RuntimeException();
        } catch (Exception e) {
            return 2;
        } finally {
            return 3;
        }
    }
    public static void main(String[] args) {
        System.out.println(f());
        System.out.println(g());
    }
}
// expect: finally
// expect: 1
// expect: 3
\`\`\`
\`finally\` runs even after a return. A \`return\` inside finally **overrides** the earlier return value. The only cases where finally does not run are \`System.exit()\` and a JVM crash.` },
{ lvl: 'medium', tags: ['exceptions'], q: 'How do you create a custom exception? When to use one?', a: `Extend \`Exception\` (checked) or \`RuntimeException\` (unchecked) and pass a message to \`super\`.

\`\`\`java
// runnable
public class Main {
    static class InsufficientFundsException extends Exception {
        InsufficientFundsException(String msg) { super(msg); }
    }
    static void withdraw(int bal, int amt) throws InsufficientFundsException {
        if (amt > bal) throw new InsufficientFundsException("Balance too low");
        System.out.println("ok");
    }
    public static void main(String[] args) {
        try {
            withdraw(100, 500);
        } catch (InsufficientFundsException e) {
            System.out.println(e.getMessage());
        }
    }
}
// expect: Balance too low
\`\`\`
Use custom exceptions for **business rule violations** so callers can handle them specifically.` },
{ lvl: 'basic', hot: true, tags: ['threads'], q: 'How do you create a thread in Java? Runnable vs Thread.', a: `Two ways: extend \`Thread\` and override \`run()\`, or implement \`Runnable\` and pass it to a \`Thread\`. **Runnable is preferred** because Java has single inheritance, and it separates the task from the thread.

\`\`\`java
// runnable
public class Main {
    public static void main(String[] args) throws Exception {
        Thread t = new Thread(() -> System.out.println("in thread"));
        t.start();
        t.join();
        System.out.println("main done");
    }
}
// expect: in thread
// expect: main done
\`\`\`
\`start()\` creates a new thread that calls \`run()\`. Calling \`run()\` directly just executes it on the current thread. \`join()\` waits for a thread to finish.` },
{ lvl: 'medium', hot: true, tags: ['threads'], q: 'What is a race condition? How does synchronized fix it?', a: `A **race condition** occurs when threads access shared data at the same time and the result depends on timing. \`count++\` is three steps (read, add, write), so updates get lost.

\`\`\`java
// runnable
public class Main {
    static int count = 0;
    static synchronized void inc() { count++; }
    public static void main(String[] args) throws Exception {
        Runnable r = () -> { for (int i = 0; i < 10000; i++) inc(); };
        Thread a = new Thread(r), b = new Thread(r);
        a.start(); b.start(); a.join(); b.join();
        System.out.println(count);
    }
}
// expect: 20000
\`\`\`
\`synchronized\` lets only one thread at a time hold an object's lock. Alternatives: \`AtomicInteger\`, \`ReentrantLock\`. \`volatile\` guarantees **visibility** of a variable across threads but not atomicity.` },
{ lvl: 'medium', tags: ['threads'], q: 'Explain the thread life cycle and wait vs sleep, and what is a deadlock.', a: `**States:** New -> Runnable -> Running -> (Blocked / Waiting / Timed waiting) -> Terminated.

| | sleep() | wait() |
| --- | --- | --- |
| Class | Thread (static) | Object |
| Releases the lock | **No** | **Yes** |
| Wakes up | After the time | On notify() / notifyAll() or timeout |
| Must be in synchronized | No | **Yes** |

**Deadlock:** two or more threads each hold a lock the other needs and wait forever. Four conditions: mutual exclusion, hold and wait, no pre-emption, circular wait. Prevent it by always acquiring locks in the **same order**, using timeouts (\`tryLock\`), or avoiding nested locks.` },
{ lvl: 'medium', tags: ['threads'], q: 'What is an ExecutorService / thread pool? Why use it?', a: `Creating a thread per task is expensive. A **thread pool** reuses a fixed set of worker threads that take tasks from a queue.

\`\`\`java
// runnable
import java.util.concurrent.*;
public class Main {
    public static void main(String[] args) throws Exception {
        ExecutorService ex = Executors.newFixedThreadPool(2);
        Future<Integer> f = ex.submit(() -> 6 * 7);
        System.out.println(f.get());
        ex.shutdown();
    }
}
// expect: 42
\`\`\`
\`Runnable\` returns nothing; \`Callable<T>\` returns a value and can throw; \`Future\` holds the pending result. Always call \`shutdown()\`.` },
{ lvl: 'medium', hot: true, tags: ['jvm'], q: 'Explain Java memory: stack, heap, metaspace. How does garbage collection work?', a: `- **Stack:** one per thread; holds method frames, local variables and references. Freed automatically when the method returns. Too deep recursion causes \`StackOverflowError\`.
- **Heap:** shared; all objects live here. Divided into **Young generation** (Eden + two Survivor spaces) and **Old (Tenured) generation**.
- **Metaspace:** class metadata (replaced PermGen in Java 8).

**Garbage collection** reclaims objects that are no longer **reachable** from GC roots (stack variables, static fields). New objects start in Eden; surviving a **minor GC** moves them to Survivor and eventually to Old; a **major / full GC** cleans the Old generation. Collectors: Serial, Parallel, **G1** (default in modern Java), ZGC. \`System.gc()\` is only a request. \`OutOfMemoryError\` appears when the heap is full of reachable objects, often a **memory leak** (for example a static collection that keeps growing).` },
{ lvl: 'medium', tags: ['basics'], q: 'What are the differences between an abstract class and an interface in Java 8+? What is a record?', a: `| | Abstract class | Interface |
| --- | --- | --- |
| Inheritance | extends (one) | implements (many) |
| State (instance fields) | Yes | No (only constants) |
| Constructors | Yes | No |
| Methods | Abstract and concrete | Abstract, default, static, private |
| Use | Shared base with common state ("is-a") | A capability or contract ("can-do") |

A **record** (Java 16+) is a compact immutable data carrier: \`record Point(int x, int y) {}\` generates the constructor, getters (\`x()\`), \`equals\`, \`hashCode\` and \`toString\`.` },
{ lvl: 'medium', tags: ['basics'], q: 'What is the output? Integer division, char arithmetic and ternary traps.', a: `\`\`\`java
// runnable
public class Main {
    public static void main(String[] args) {
        System.out.println(7 / 2);
        System.out.println(7 / 2.0);
        System.out.println('a' + 1);
        System.out.println((char) ('a' + 1));
        System.out.println("x" + 1 + 2);
        System.out.println(1 + 2 + "x");
        int i = 5;
        System.out.println(i++ + ++i);
        System.out.println(10 % 3 + " " + (-10) % 3);
        System.out.println(0.1 + 0.2 == 0.3);
    }
}
// expect: 3
// expect: 3.5
// expect: 98
// expect: b
// expect: x12
// expect: 3x
// expect: 12
// expect: 1 -1
// expect: false
\`\`\`
\`i++ + ++i\` is 5 + 7 = 12 (i becomes 6 after the first, 7 after the second). Floating-point numbers are binary approximations, so use \`BigDecimal\` for money.` },
{ lvl: 'adv', tags: ['basics'], q: 'How do you make a class immutable? How do you implement a thread-safe Singleton?', a: `**Immutable class:** declare the class \`final\`, make all fields \`private final\`, set them only in the constructor, provide no setters, and **defensively copy** mutable fields (arrays, Date, collections) in and out.

**Thread-safe Singleton (double-checked locking):**

\`\`\`java
public class Singleton {
    private static volatile Singleton instance;
    private Singleton() {}
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) instance = new Singleton();
            }
        }
        return instance;
    }
}
\`\`\`
\`volatile\` prevents another thread from seeing a half-built object. The simplest safe alternative is an **enum** singleton, or a static holder class.` },
{ lvl: 'adv', tags: ['collections'], q: 'What happens if you use a mutable object as a HashMap key? What is the equals and hashCode contract?', a: `If the fields used in \`hashCode()\` change after the key is inserted, the key now hashes to a different bucket and \`get()\` will not find it: the entry is effectively lost (a leak). That is why keys should be **immutable** (String, Integer).

**Contract:** equal objects must have equal hash codes; hash codes must be consistent between calls; unequal objects may share a hash code (a collision). Always override both methods together.` },
] });

IV.addModule({ id: 'python', group: 'lang', title: 'Python programming', blurb: 'Python interview questions: data types, mutability, list/dict/set, comprehensions, functions, decorators, generators, OOP, exceptions, memory and tricky output questions. Code samples were run.', qa: [
{ lvl: 'basic', hot: true, tags: ['basics'], q: 'What are the key features of Python? Is it compiled or interpreted?', a: `Python is a **high-level, interpreted, dynamically typed, object-oriented** language with simple, readable syntax and a huge standard library. It supports multiple paradigms (procedural, OOP, functional) and has automatic memory management.

The standard implementation (**CPython**) first compiles source to **bytecode** (\`.pyc\`) and then the Python Virtual Machine interprets it. Dynamic typing means a variable has no fixed type: \`x = 5\` then \`x = "five"\` is fine.` },
{ lvl: 'basic', hot: true, tags: ['types'], q: 'What are the built-in data types? Which are mutable and which are immutable?', a: `| Type | Example | Mutable? |
| --- | --- | --- |
| int, float, bool, complex | \`5\`, \`3.14\` | No |
| str | \`"hi"\` | No |
| tuple | \`(1, 2)\` | No |
| frozenset | \`frozenset({1})\` | No |
| bytes | \`b"ab"\` | No |
| list | \`[1, 2]\` | **Yes** |
| dict | \`{"a": 1}\` | **Yes** |
| set | \`{1, 2}\` | **Yes** |

Only immutable (hashable) objects can be dictionary keys or set members.` },
{ lvl: 'basic', hot: true, tags: ['types'], q: 'List vs tuple vs set vs dictionary.', a: `| | List | Tuple | Set | Dict |
| --- | --- | --- | --- | --- |
| Syntax | \`[1,2]\` | \`(1,2)\` | \`{1,2}\` | \`{k: v}\` |
| Ordered | Yes | Yes | No | Yes (insertion order, 3.7+) |
| Duplicates | Yes | Yes | No | Unique keys |
| Mutable | Yes | No | Yes | Yes |
| Lookup | O(n) search, O(1) index | same | **O(1)** average | **O(1)** average |

Use a tuple for fixed records, a set for fast membership tests and removing duplicates, a dict for key-value mapping.` },
{ lvl: 'basic', hot: true, tags: ['basics'], q: 'What is the output? Common slicing, indexing and string operations.', a: `\`\`\`python
# runnable
s = "infosys"
print(s[::-1])
print(s[1:4])
print(s[-3:])
l = [1, 2, 3, 4, 5]
print(l[::2])
print(l[-1], l[1:-1])
print(len(set("mississippi")))
print("a,b,c".split(","))
print("-".join(["x", "y"]))
# expect: sysofni
# expect: nfo
# expect: sys
# expect: [1, 3, 5]
# expect: 5 [2, 3, 4]
# expect: 4
# expect: ['a', 'b', 'c']
# expect: x-y
\`\`\`
Slicing is \`[start:stop:step]\`, stop is **excluded**, and negative indexes count from the end.` },
{ lvl: 'basic', hot: true, tags: ['basics'], q: '== vs is, and mutable aliasing. What is the output?', a: `\`==\` compares **values**; \`is\` compares **identity** (same object in memory).

\`\`\`python
# runnable
a = [1, 2]
b = [1, 2]
c = a
print(a == b, a is b, a is c)
c.append(3)
print(a)
x = None
print(x is None)
# expect: True False True
# expect: [1, 2, 3]
# expect: True
\`\`\`
\`c = a\` does not copy; both names point to one list. Use \`a.copy()\` or \`a[:]\` for a shallow copy and \`copy.deepcopy(a)\` for nested objects.` },
{ lvl: 'medium', hot: true, tags: ['functions'], q: 'The mutable default argument trap. What is the output?', a: `Default values are evaluated **once**, when the function is defined, not on every call.

\`\`\`python
# runnable
def add(x, lst=[]):
    lst.append(x)
    return lst

print(add(1))
print(add(2))

def safe(x, lst=None):
    if lst is None:
        lst = []
    lst.append(x)
    return lst

print(safe(1))
print(safe(2))
# expect: [1]
# expect: [1, 2]
# expect: [1]
# expect: [2]
\`\`\`
Use \`None\` as the default and create the list inside the function.` },
{ lvl: 'medium', hot: true, tags: ['functions'], q: 'What are *args and **kwargs?', a: `\`*args\` collects extra **positional** arguments into a tuple; \`**kwargs\` collects extra **keyword** arguments into a dict.

\`\`\`python
# runnable
def show(a, *args, **kwargs):
    print(a, args, kwargs)

show(1, 2, 3, x=4, y=5)
nums = [10, 20]
show(*nums, z=1)
# expect: 1 (2, 3) {'x': 4, 'y': 5}
# expect: 10 (20,) {'z': 1}
\`\`\`
The \`*\` and \`**\` at a **call site** unpack a list/tuple or a dict into arguments.` },
{ lvl: 'medium', hot: true, tags: ['basics'], q: 'What are list comprehensions? Show list, dict, set comprehensions and a generator expression.', a: `A comprehension builds a collection in one readable line.

\`\`\`python
# runnable
sq = [x * x for x in range(6) if x % 2 == 0]
d = {c: len(c) for c in ["aa", "bbb"]}
s = {x % 3 for x in range(10)}
g = (x * 2 for x in range(3))
print(sq)
print(d)
print(sorted(s))
print(list(g))
# expect: [0, 4, 16]
# expect: {'aa': 2, 'bbb': 3}
# expect: [0, 1, 2]
# expect: [0, 2, 4]
\`\`\`
A **generator expression** (round brackets) produces values lazily and uses almost no memory.` },
{ lvl: 'medium', hot: true, tags: ['functions'], q: 'What is a decorator? Write one.', a: `A decorator is a function that takes a function and returns a **new function that wraps it**, adding behaviour (logging, timing, authentication, caching) without changing the original code. \`@name\` above a function is shorthand for \`f = name(f)\`.

\`\`\`python
# runnable
import functools

def log(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        print("calling", fn.__name__)
        result = fn(*args, **kwargs)
        print("result", result)
        return result
    return wrapper

@log
def add(a, b):
    return a + b

add(2, 3)
# expect: calling add
# expect: result 5
\`\`\`
\`functools.wraps\` keeps the original function's name and docstring.` },
{ lvl: 'medium', hot: true, tags: ['functions'], q: 'What are generators and the yield keyword? Iterator vs generator.', a: `A **generator function** uses \`yield\` to produce values one at a time and **pauses** between them, keeping its local state. This is **lazy evaluation**: memory use stays constant even for huge or infinite sequences.

\`\`\`python
# runnable
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

print(list(fib(8)))
g = fib(3)
print(next(g), next(g), next(g))
# expect: [0, 1, 1, 2, 3, 5, 8, 13]
# expect: 0 1 1
\`\`\`
An **iterator** is any object with \`__iter__()\` and \`__next__()\`. A generator is a simple way to write an iterator.` },
{ lvl: 'medium', tags: ['functions'], q: 'What are lambda, map, filter and reduce?', a: `\`lambda\` is a small anonymous one-expression function.

\`\`\`python
# runnable
from functools import reduce
n = [1, 2, 3, 4, 5]
print(list(map(lambda x: x * 2, n)))
print(list(filter(lambda x: x % 2, n)))
print(reduce(lambda a, b: a + b, n))
print(sorted(["bb", "a", "ccc"], key=len, reverse=True))
# expect: [2, 4, 6, 8, 10]
# expect: [1, 3, 5]
# expect: 15
# expect: ['ccc', 'bb', 'a']
\`\`\`` },
{ lvl: 'medium', hot: true, tags: ['oop'], q: 'Explain classes, __init__, self and inheritance in Python.', a: `\`__init__\` is the initialiser called when an object is created; \`self\` is the object itself (passed explicitly as the first parameter). Python supports **multiple inheritance**; \`super()\` calls the parent.

\`\`\`python
# runnable
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return f"{self.name} makes a sound"

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed
    def speak(self):
        return f"{self.name} barks"

d = Dog("Rex", "Lab")
print(d.speak())
print(isinstance(d, Animal))
# expect: Rex barks
# expect: True
\`\`\`
Python has no true private members; a leading underscore (\`_x\`) means "internal" by convention and a double underscore (\`__x\`) triggers name mangling.` },
{ lvl: 'medium', tags: ['oop'], q: 'Explain @staticmethod, @classmethod and @property, and dunder methods.', a: `\`\`\`python
# runnable
class Circle:
    count = 0
    def __init__(self, r):
        self._r = r
        Circle.count += 1
    @property
    def area(self):
        return round(3.14159 * self._r ** 2, 2)
    @classmethod
    def unit(cls):
        return cls(1)
    @staticmethod
    def is_valid(r):
        return r > 0
    def __repr__(self):
        return f"Circle({self._r})"
    def __eq__(self, o):
        return self._r == o._r

c = Circle.unit()
print(c, c.area, Circle.is_valid(-2), Circle.count, c == Circle(1))
# expect: Circle(1) 3.14 False 1 True
\`\`\`
- **instance method:** gets \`self\`. **classmethod:** gets the class (\`cls\`), often a factory. **staticmethod:** gets nothing, just a function in the class namespace. **property:** a method accessed like an attribute.
- **Dunder (magic) methods** such as \`__str__\`, \`__repr__\`, \`__len__\`, \`__eq__\`, \`__add__\` customise how objects behave with built-in operations.` },
{ lvl: 'basic', hot: true, tags: ['exceptions'], q: 'How does exception handling work in Python? What is the output?', a: `\`\`\`python
# runnable
def f(x):
    try:
        return 10 // x
    except ZeroDivisionError:
        return "div by zero"
    except (TypeError, ValueError):
        return "bad value"
    else:
        print("no error")
    finally:
        print("cleanup")

print(f(2))
print(f(0))
print(f("a"))
# expect: cleanup
# expect: 5
# expect: cleanup
# expect: div by zero
# expect: cleanup
# expect: bad value
\`\`\`
\`else\` runs only if no exception occurred (here the \`return\` inside \`try\` leaves first, so it is skipped). \`finally\` always runs. Raise your own with \`raise ValueError("msg")\`, and define custom errors by subclassing \`Exception\`.` },
{ lvl: 'basic', tags: ['basics'], q: 'How do you read and write files in Python? What is the with statement?', a: `\`\`\`python
# runnable
import os, tempfile
p = os.path.join(tempfile.gettempdir(), "iv_demo.txt")
with open(p, "w") as f:
    f.write("line1\\nline2\\n")
with open(p) as f:
    for line in f:
        print(line.strip())
os.remove(p)
# expect: line1
# expect: line2
\`\`\`
\`with\` is a **context manager**: it closes the file automatically even if an error happens. Modes: \`r\` read, \`w\` write (overwrites), \`a\` append, \`b\` binary.` },
{ lvl: 'medium', hot: true, tags: ['memory'], q: 'How does Python manage memory? What is the GIL?', a: `- **Reference counting:** every object tracks how many names point to it; at zero it is freed immediately.
- **Cyclic garbage collector:** finds and frees groups of objects that refer to each other (reference cycles).
- Memory comes from a private heap managed by the interpreter.

**GIL (Global Interpreter Lock):** in CPython only **one thread executes Python bytecode at a time**. So threads do not speed up **CPU-bound** work; use \`multiprocessing\` for that. Threads are still useful for **I/O-bound** work (network, files), because the lock is released while waiting.` },
{ lvl: 'medium', tags: ['basics'], q: 'Shallow copy vs deep copy. What is the output?', a: `\`\`\`python
# runnable
import copy
a = [[1, 2], [3]]
s = copy.copy(a)
d = copy.deepcopy(a)
a[0].append(99)
print(s)
print(d)
# expect: [[1, 2, 99], [3]]
# expect: [[1, 2], [3]]
\`\`\`
A shallow copy copies the outer list but shares the inner objects; a deep copy copies everything recursively.` },
{ lvl: 'medium', hot: true, tags: ['basics'], q: 'Solve with Python: count word frequency, remove duplicates keeping order, find the second largest.', a: `\`\`\`python
# runnable
from collections import Counter
text = "to be or not to be"
print(Counter(text.split()).most_common(2))
nums = [4, 1, 4, 2, 1, 9]
print(list(dict.fromkeys(nums)))
print(sorted(set(nums))[-2])
print(max(nums), min(nums), sum(nums))
# expect: [('to', 2), ('be', 2)]
# expect: [4, 1, 2, 9]
# expect: 4
# expect: 9 1 21
\`\`\`
\`dict.fromkeys\` removes duplicates and keeps first-seen order (dicts preserve insertion order).` },
{ lvl: 'medium', tags: ['basics'], q: 'What are Python scope rules (LEGB)? global and nonlocal?', a: `Names are looked up in this order: **L**ocal, **E**nclosing function, **G**lobal, **B**uilt-in.

\`\`\`python
# runnable
x = 10
def outer():
    y = 1
    def inner():
        nonlocal y
        y += 1
        return y
    return inner

def change():
    global x
    x += 5

f = outer()
print(f(), f())
change()
print(x)
# expect: 2 3
# expect: 15
\`\`\`
\`global\` lets a function assign to a module-level name; \`nonlocal\` assigns to a variable in the enclosing function (this is how closures keep state).` },
{ lvl: 'medium', tags: ['basics'], q: 'What is the difference between a module, a package and a library? What is __name__ == "__main__"?', a: `A **module** is a single \`.py\` file; a **package** is a folder of modules (with \`__init__.py\`); a **library** is a collection of packages. Install third-party packages with \`pip install\`; isolate dependencies per project with a **virtual environment** (\`python -m venv\`).

\`if __name__ == "__main__":\` runs its block only when the file is executed directly, not when it is imported by another file.` },
{ lvl: 'adv', tags: ['basics'], q: 'What is the output? Late binding in closures and a tricky list multiplication.', a: `\`\`\`python
# runnable
fs = [lambda: i for i in range(3)]
print([f() for f in fs])
gs = [lambda i=i: i for i in range(3)]
print([g() for g in gs])
m = [[0] * 2] * 2
m[0][0] = 1
print(m)
n = [[0] * 2 for _ in range(2)]
n[0][0] = 1
print(n)
# expect: [2, 2, 2]
# expect: [0, 1, 2]
# expect: [[1, 0], [1, 0]]
# expect: [[1, 0], [0, 0]]
\`\`\`
Lambdas look up \`i\` when **called** (after the loop ended with i = 2); a default argument captures the value at definition. \`[[0]*2]*2\` repeats a **reference** to the same inner list; use a comprehension to create separate rows.` },
] });

IV.addModule({ id: 'c', group: 'lang', title: 'C and C++ programming', blurb: 'C and C++ questions: pointers, arrays, memory, structs, storage classes, preprocessor, plus C++ essentials (references, STL, constructors, virtual functions). Code samples were compiled and run.', qa: [
{ lvl: 'basic', hot: true, tags: ['basics'], q: 'What are the features of C? How does a C program execute?', a: `C is a **procedural, structured, middle-level** language: close to hardware yet portable. It is fast, has pointers and manual memory management, and is the base of C++, Java and many operating systems.

Execution flow: **preprocessing** (\`#include\`, \`#define\`) -> **compilation** (to assembly) -> **assembly** (object file) -> **linking** (with libraries) -> executable.` },
{ lvl: 'basic', hot: true, tags: ['pointers'], q: 'What is a pointer? Explain with an example, including pointer arithmetic.', a: `A pointer is a variable that **stores the address** of another variable. \`&x\` gives the address; \`*p\` dereferences (reads the value at the address).

\`\`\`c
// runnable
#include <stdio.h>
int main() {
    int a[] = {10, 20, 30};
    int x = 5;
    int *p = &x;
    *p = 8;
    printf("%d\\n", x);
    int *q = a;
    printf("%d %d\\n", *q, *(q + 2));
    q++;
    printf("%d\\n", *q);
    printf("%d\\n", (int)(sizeof(a) / sizeof(a[0])));
    return 0;
}
// expect: 8
// expect: 10 30
// expect: 20
// expect: 3
\`\`\`
\`q + 1\` moves by **one element** (sizeof the pointed type), not one byte. The array name decays to a pointer to its first element.` },
{ lvl: 'basic', hot: true, tags: ['pointers'], q: 'Call by value vs call by reference in C. Write a swap function.', a: `C always passes **by value**; you simulate call by reference by passing a **pointer**.

\`\`\`c
// runnable
#include <stdio.h>
void swapVal(int a, int b) { int t = a; a = b; b = t; }
void swapPtr(int *a, int *b) { int t = *a; *a = *b; *b = t; }
int main() {
    int x = 1, y = 2;
    swapVal(x, y);
    printf("%d %d\\n", x, y);
    swapPtr(&x, &y);
    printf("%d %d\\n", x, y);
    return 0;
}
// expect: 1 2
// expect: 2 1
\`\`\`` },
{ lvl: 'basic', hot: true, tags: ['memory'], q: 'malloc vs calloc vs realloc vs free. What is a memory leak and a dangling pointer?', a: `- **malloc(n):** allocate n bytes on the heap, content **uninitialised**.
- **calloc(count, size):** allocate and **zero-initialise**.
- **realloc(ptr, n):** resize a block.
- **free(ptr):** release heap memory.

A **memory leak** is heap memory that was never freed and is no longer reachable. A **dangling pointer** points to memory that was already freed (using it is undefined behaviour); set the pointer to \`NULL\` after \`free\`. A **wild pointer** was never initialised.

\`\`\`c
// runnable
#include <stdio.h>
#include <stdlib.h>
int main() {
    int n = 4;
    int *a = (int *)calloc(n, sizeof(int));
    for (int i = 0; i < n; i++) a[i] = i * i;
    a = (int *)realloc(a, 6 * sizeof(int));
    a[4] = 16; a[5] = 25;
    for (int i = 0; i < 6; i++) printf("%d ", a[i]);
    printf("\\n");
    free(a);
    a = NULL;
    return 0;
}
// expect: 0 1 4 9 16 25 
\`\`\`` },
{ lvl: 'basic', hot: true, tags: ['basics'], q: 'What are the storage classes in C (auto, static, extern, register)?', a: `| Class | Scope | Lifetime | Default value |
| --- | --- | --- | --- |
| auto | Block | Until the block ends | Garbage |
| register | Block | Until the block ends | Garbage (hint to use a CPU register) |
| static | Block (local) or file (global) | **Whole program** | 0 |
| extern | Global | Whole program | 0 (declared elsewhere) |

\`\`\`c
// runnable
#include <stdio.h>
void counter() {
    static int c = 0;
    c++;
    printf("%d ", c);
}
int main() {
    counter(); counter(); counter();
    printf("\\n");
    return 0;
}
// expect: 1 2 3 
\`\`\`
A static local variable keeps its value between calls.` },
{ lvl: 'medium', hot: true, tags: ['basics'], q: 'Structure vs union, and what is structure padding?', a: `A **struct** gives each member its own memory; size is at least the sum of the members. A **union** shares one memory block among all members; size is that of the **largest** member, and only one member holds a valid value at a time.

Compilers add **padding** so members are aligned to their natural boundary.

\`\`\`c
// runnable
#include <stdio.h>
struct S { char c; int i; };
union U { char c; int i; };
int main() {
    printf("%d %d\\n", (int)sizeof(struct S), (int)sizeof(union U));
    return 0;
}
// expect: 8 4
\`\`\`
The struct is 8, not 5: three padding bytes follow the char so the int sits on a 4-byte boundary (typical on common platforms).` },
{ lvl: 'medium', hot: true, tags: ['basics'], q: 'Output-based: operators, integer division, bitwise operations and strings in C.', a: `\`\`\`c
// runnable
#include <stdio.h>
#include <string.h>
int main() {
    int i = 5;
    printf("%d\\n", 7 / 2);
    printf("%.1f\\n", 7 / 2.0);
    printf("%d %d %d\\n", 5 & 3, 5 | 3, 5 ^ 3);
    printf("%d\\n", 1 << 4);
    printf("%d\\n", !0 + !5);
    char s[] = "hello";
    printf("%d %d\\n", (int)sizeof(s), (int)strlen(s));
    printf("%d\\n", i++ * 2);
    printf("%d\\n", i);
    return 0;
}
// expect: 3
// expect: 3.5
// expect: 1 7 6
// expect: 16
// expect: 1
// expect: 6 5
// expect: 10
// expect: 6
\`\`\`
\`sizeof\` of a string array includes the terminating \`'\\0'\`; \`strlen\` does not. Avoid expressions like \`i++ + ++i\`: they modify one variable twice without a sequence point, which is **undefined behaviour**.` },
{ lvl: 'medium', hot: true, tags: ['pointers'], q: 'Array vs pointer: what is the difference? Explain pointer to pointer and const pointers.', a: `- An array is a **fixed block** of memory; \`sizeof(arr)\` gives the whole size. A pointer is a variable holding an address; \`sizeof(p)\` is the pointer size. An array name cannot be reassigned; a pointer can.
- Passing an array to a function passes a **pointer** to its first element, so the function does not know the length: pass it separately.
- \`int **pp\` is a pointer to a pointer (used for 2D arrays and to modify a pointer inside a function).
- \`const int *p\`: the **value** is constant. \`int *const p\`: the **pointer** is constant. \`const int *const p\`: both.
- A **void pointer** can hold any address but must be cast before dereferencing. A **NULL pointer** points to nothing. A **function pointer** stores the address of a function.` },
{ lvl: 'medium', tags: ['basics'], q: 'How are strings handled in C? Write a function to reverse a string without using library functions.', a: `A C string is a **char array ending with '\\0'**. Useful functions in \`<string.h>\`: \`strlen\`, \`strcpy\`, \`strcat\`, \`strcmp\` (returns 0 when equal), \`strstr\`.

\`\`\`c
// runnable
#include <stdio.h>
void rev(char *s) {
    int n = 0;
    while (s[n]) n++;
    for (int i = 0, j = n - 1; i < j; i++, j--) {
        char t = s[i]; s[i] = s[j]; s[j] = t;
    }
}
int main() {
    char s[] = "infosys";
    rev(s);
    printf("%s\\n", s);
    return 0;
}
// expect: sysofni
\`\`\`
\`char s[] = "hi"\` creates a modifiable array; \`char *s = "hi"\` points to a string literal that must **not** be modified.` },
{ lvl: 'medium', tags: ['basics'], q: 'What is the difference between #define and const, and what are macros and header guards?', a: `\`#define\` is handled by the **preprocessor** as plain text replacement before compilation: no type, no scope, no memory. A \`const\` variable is typed, scoped and checked by the compiler.

Macros with arguments have a classic trap:

\`\`\`c
// runnable
#include <stdio.h>
#define SQ(x) x * x
#define SQ2(x) ((x) * (x))
int main() {
    printf("%d %d\\n", SQ(2 + 1), SQ2(2 + 1));
    return 0;
}
// expect: 5 9
\`\`\`
\`SQ(2+1)\` expands to \`2 + 1 * 2 + 1\` = 5. Always parenthesise macro arguments. **Header guards** (\`#ifndef X / #define X / #endif\`) stop a header from being included twice.` },
{ lvl: 'medium', tags: ['basics'], q: 'Explain the memory layout of a C program: text, data, bss, heap, stack.', a: `| Segment | Contents |
| --- | --- |
| **Text (code)** | Compiled instructions, read-only |
| **Data** | Initialised globals and statics |
| **BSS** | Uninitialised globals and statics (zeroed) |
| **Heap** | Dynamic memory (malloc), grows upward |
| **Stack** | Local variables, function calls, return addresses; grows downward |

Infinite recursion exhausts the stack (**stack overflow**); never freeing malloc memory exhausts the heap.` },
{ lvl: 'medium', tags: ['basics'], q: 'What is a segmentation fault? What causes it?', a: `A segmentation fault is the OS stopping a program that accessed memory it is not allowed to. Common causes: dereferencing a **NULL or uninitialised** pointer, using a pointer after **free**, writing past the end of an array (**buffer overflow**), modifying a string literal, and infinite recursion.` },
{ lvl: 'basic', hot: true, tags: ['cpp'], q: 'C vs C++: what are the main differences?', a: `| | C | C++ |
| --- | --- | --- |
| Paradigm | Procedural | Procedural + **object-oriented** + generic |
| Classes, inheritance, polymorphism | No | Yes |
| Memory | malloc / free | **new / delete** (also smart pointers) |
| I/O | printf / scanf | cin / cout |
| References | No | Yes |
| Function overloading, default arguments | No | Yes |
| Templates, STL, exceptions, namespaces | No | Yes |` },
{ lvl: 'basic', hot: true, tags: ['cpp'], q: 'What is a reference in C++? Reference vs pointer.', a: `A reference is an **alias** (another name) for an existing variable.

\`\`\`cpp
// runnable
#include <iostream>
using namespace std;
void inc(int &x) { x++; }
int main() {
    int a = 5;
    int &r = a;
    r = 10;
    inc(a);
    cout << a << endl;
    return 0;
}
// expect: 11
\`\`\`
| | Reference | Pointer |
| --- | --- | --- |
| Must be initialised | Yes | No |
| Can be null | No | Yes |
| Can be reseated | No | Yes |
| Syntax | Used like the variable | Needs \`*\` and \`&\` |` },
{ lvl: 'medium', hot: true, tags: ['cpp'], q: 'Constructors and destructors in C++: types, order, copy constructor.', a: `A **constructor** has the class name, no return type, and runs when an object is created. Types: default, parameterised, **copy constructor** (\`A(const A&)\`). A **destructor** (\`~A()\`) runs when the object is destroyed (frees resources). Objects are constructed in order of declaration (base first) and destroyed in the reverse order.

\`\`\`cpp
// runnable
#include <iostream>
using namespace std;
class A {
public:
    A() { cout << "A()" << endl; }
    A(const A&) { cout << "copy" << endl; }
    ~A() { cout << "~A()" << endl; }
};
int main() {
    A x;
    A y = x;
    return 0;
}
// expect: A()
// expect: copy
// expect: ~A()
// expect: ~A()
\`\`\`
**Rule of three:** if you write a destructor, copy constructor or copy assignment operator, you probably need all three (a deep copy is needed when the class owns a raw pointer).` },
{ lvl: 'medium', hot: true, tags: ['cpp'], q: 'What are virtual functions and virtual destructors? Explain with output.', a: `A **virtual** function enables **run-time polymorphism**: the call is resolved by the object's real type through the **vtable**. A **pure virtual function** (\`= 0\`) makes a class abstract.

\`\`\`cpp
// runnable
#include <iostream>
using namespace std;
class Base {
public:
    virtual void f() { cout << "Base f" << endl; }
    void g() { cout << "Base g" << endl; }
    virtual ~Base() { cout << "~Base" << endl; }
};
class Derived : public Base {
public:
    void f() override { cout << "Derived f" << endl; }
    void g() { cout << "Derived g" << endl; }
    ~Derived() { cout << "~Derived" << endl; }
};
int main() {
    Base *p = new Derived();
    p->f();
    p->g();
    delete p;
    return 0;
}
// expect: Derived f
// expect: Base g
// expect: ~Derived
// expect: ~Base
\`\`\`
\`g\` is not virtual so the pointer type decides. Without a **virtual destructor**, \`delete p\` would skip \`~Derived\` (a leak and undefined behaviour). Make base-class destructors virtual.` },
{ lvl: 'medium', hot: true, tags: ['cpp'], q: 'What is the STL? Show vector, map, set and sort.', a: `The **Standard Template Library** gives ready-made **containers** (vector, list, deque, set, map, unordered_map, stack, queue, priority_queue), **iterators** and **algorithms** (sort, find, reverse, binary_search).

\`\`\`cpp
// runnable
#include <iostream>
#include <vector>
#include <map>
#include <algorithm>
using namespace std;
int main() {
    vector<int> v = {5, 2, 9, 1};
    sort(v.begin(), v.end());
    for (int x : v) cout << x << " ";
    cout << endl;
    map<string, int> m;
    m["b"] = 2; m["a"] = 1; m["b"]++;
    for (auto &kv : m) cout << kv.first << "=" << kv.second << " ";
    cout << endl;
    cout << *max_element(v.begin(), v.end()) << endl;
    return 0;
}
// expect: 1 2 5 9 
// expect: a=1 b=3 
// expect: 9
\`\`\`
\`map\` is ordered (a balanced tree, O(log n)); \`unordered_map\` is a hash table (O(1) average).` },
{ lvl: 'medium', tags: ['cpp'], q: 'What are smart pointers and RAII in modern C++? What is new vs malloc?', a: `**RAII** (Resource Acquisition Is Initialisation): a resource is tied to an object's lifetime, so the destructor releases it automatically. **Smart pointers** do this for heap memory: \`unique_ptr\` (sole owner), \`shared_ptr\` (reference-counted shared ownership), \`weak_ptr\` (non-owning, breaks cycles).

**new vs malloc:** \`new\` calls the **constructor**, returns a typed pointer, throws \`bad_alloc\` on failure, and is an operator. \`malloc\` only gives raw bytes, returns \`void*\`, returns NULL on failure, and is a function. Pair \`new\` with \`delete\` (\`new[]\` with \`delete[]\`), \`malloc\` with \`free\`; never mix them.` },
{ lvl: 'medium', tags: ['cpp'], q: 'What is the difference between struct and class in C++? What is a friend function and inline function?', a: `In C++, **struct** members are **public** by default and **class** members are **private** by default; otherwise they are the same.

A **friend** function or class can access the private members of another class (use sparingly, it weakens encapsulation). An **inline** function is a request to the compiler to paste the function body at the call site to avoid call overhead (useful for tiny functions).` },
{ lvl: 'adv', tags: ['pointers'], q: 'Write a program to find the length of a linked list and reverse it in C.', a: `\`\`\`c
// runnable
#include <stdio.h>
#include <stdlib.h>
struct Node { int val; struct Node *next; };
struct Node *push(struct Node *head, int v) {
    struct Node *n = malloc(sizeof(struct Node));
    n->val = v; n->next = head;
    return n;
}
struct Node *reverse(struct Node *h) {
    struct Node *prev = NULL;
    while (h) {
        struct Node *nx = h->next;
        h->next = prev;
        prev = h;
        h = nx;
    }
    return prev;
}
int main() {
    struct Node *h = NULL;
    for (int i = 1; i <= 4; i++) h = push(h, i);
    int len = 0;
    for (struct Node *p = h; p; p = p->next) len++;
    printf("%d\\n", len);
    h = reverse(h);
    for (struct Node *p = h; p; p = p->next) printf("%d ", p->val);
    printf("\\n");
    while (h) { struct Node *t = h; h = h->next; free(t); }
    return 0;
}
// expect: 4
// expect: 1 2 3 4 
\`\`\`
Nodes were pushed at the head, so the list is 4 3 2 1; reversing gives 1 2 3 4.` },
] });
