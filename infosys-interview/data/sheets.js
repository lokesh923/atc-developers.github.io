IV.sheets.push(
{ id: 'complexity', title: 'Complexity and data structures', blurb: 'Big-O of common structures, sorting and searching on one page.', body: `## Big-O growth (best to worst)
O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!)

## Data structures: average time
| Structure | Access | Search | Insert | Delete | Notes |
| --- | --- | --- | --- | --- | --- |
| Array | O(1) | O(n) | O(n) | O(n) | Fixed size, contiguous |
| Dynamic array / ArrayList | O(1) | O(n) | O(1) end, O(n) middle | O(n) | Doubles or grows 1.5x |
| Linked list | O(n) | O(n) | O(1) at known node | O(1) at known node | No random access |
| Stack / Queue | O(n) | O(n) | O(1) | O(1) | LIFO / FIFO |
| Hash table | n/a | O(1) | O(1) | O(1) | O(n) worst case |
| Binary search tree | O(log n) | O(log n) | O(log n) | O(log n) | O(n) if skewed |
| Balanced BST (AVL, red-black) | O(log n) | O(log n) | O(log n) | O(log n) | Always balanced |
| Heap | n/a | O(n) | O(log n) | O(log n) | Top element in O(1) |

## Sorting
| Algorithm | Best | Average | Worst | Space | Stable |
| --- | --- | --- | --- | --- | --- |
| Bubble | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Selection | O(n^2) | O(n^2) | O(n^2) | O(1) | No |
| Insertion | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n log n) | O(n^2) | O(log n) | No |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | No |

## Searching
Linear O(n) on any data. Binary O(log n) on **sorted** data. Hash lookup O(1) average.

## Graphs
BFS uses a **queue**, DFS uses a **stack** or recursion. Both O(V + E). Shortest path: BFS (unweighted), Dijkstra (non-negative weights).

## Patterns to recognise
Two pointers (sorted array, palindrome) | Sliding window (substring, subarray) | Hash map (pairs, frequency) | Stack (brackets, next greater) | Binary search (sorted, answer range) | DP (overlapping subproblems) | BFS/DFS (grid, graph, tree)` },
{ id: 'oops', title: 'OOP concepts at a glance', blurb: 'Four pillars, key differences and the most repeated OOP questions.', body: `## Four pillars
| Pillar | Meaning | How in Java |
| --- | --- | --- |
| Encapsulation | Bind data and methods, hide the data | private fields + getters/setters |
| Abstraction | Show what, hide how | abstract class, interface |
| Inheritance | Reuse a parent's features | \`extends\`, \`implements\` |
| Polymorphism | One interface, many forms | Overloading (compile time), overriding (run time) |

## Frequently asked differences
| | A | B |
| --- | --- | --- |
| Abstract class vs interface | State, constructors, single inheritance | Contract, multiple implementation |
| Overloading vs overriding | Same name, different parameters, same class | Same signature, subclass redefines |
| Class vs object | Blueprint | Instance of the blueprint |
| Constructor vs method | Initialises, no return type | Behaviour, has return type |
| == vs equals() | Reference comparison | Content comparison |
| String vs StringBuilder | Immutable | Mutable, faster for concatenation |
| ArrayList vs LinkedList | Array, fast get | Nodes, fast insert at ends |
| HashMap vs Hashtable | Not synchronized, one null key | Synchronized, no null |
| Checked vs unchecked | Compile-time handling needed | RuntimeException, optional |
| final / finally / finalize | Constant / always-run block / GC hook | |
| throw vs throws | Raise an exception | Declare an exception |

## Quick facts
- Java does **not** support multiple inheritance of classes (diamond problem) but allows multiple interfaces.
- A constructor cannot be inherited, static, abstract or final.
- \`this\` is the current object; \`super\` is the parent.
- Access: private < default < protected < public.
- Static methods cannot be overridden (they are hidden).
- SOLID: Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion.` },
{ id: 'sql', title: 'SQL and DBMS at a glance', blurb: 'Joins, commands, keys, normal forms and ACID on one sheet.', body: `## SQL command groups
| Group | Commands | Purpose |
| --- | --- | --- |
| DDL | CREATE, ALTER, DROP, TRUNCATE | Structure |
| DML | INSERT, UPDATE, DELETE | Data |
| DQL | SELECT | Query |
| DCL | GRANT, REVOKE | Permissions |
| TCL | COMMIT, ROLLBACK, SAVEPOINT | Transactions |

## Joins
| Join | Returns |
| --- | --- |
| INNER | Rows matching in both tables |
| LEFT | All left rows + matches from right (NULL if none) |
| RIGHT | All right rows + matches from left |
| FULL | All rows from both |
| CROSS | Every combination (m x n rows) |
| SELF | A table joined to itself (employee-manager) |

## Query order
Written: SELECT, FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.
**Executed:** FROM, JOIN, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. This is why a column alias cannot be used in WHERE.

## Must-know differences
- **WHERE** filters rows before grouping; **HAVING** filters groups.
- **DELETE** removes rows (can be rolled back, WHERE allowed); **TRUNCATE** empties the table fast; **DROP** removes the table itself.
- **UNION** removes duplicates, **UNION ALL** keeps them.
- **Primary key:** unique and not NULL, one per table. **Unique key:** unique, one NULL allowed, many per table. **Foreign key:** refers to a primary key in another table.
- **Clustered index:** decides the physical order of rows (one per table). **Non-clustered:** separate structure with pointers.
- **Stored procedure** can do many things and need not return a value; a **function** returns a value and can be used in SELECT.

## Normal forms
**1NF:** atomic values, no repeating groups. **2NF:** 1NF + no partial dependency on part of a composite key. **3NF:** 2NF + no transitive dependency (non-key depends on non-key). **BCNF:** every determinant is a candidate key.

## ACID
**A**tomicity (all or nothing), **C**onsistency (valid state to valid state), **I**solation (concurrent transactions do not interfere), **D**urability (committed data survives crashes).

## Isolation problems
Dirty read, non-repeatable read, phantom read. Levels from weakest: Read Uncommitted, Read Committed, Repeatable Read, Serializable.` },
{ id: 'os', title: 'Operating system at a glance', blurb: 'Processes, scheduling, deadlock, memory and paging on one sheet.', body: `## Process vs thread
| | Process | Thread |
| --- | --- | --- |
| Memory | Own address space | Shares the process memory |
| Creation cost | Heavy | Light |
| Communication | IPC (pipes, sockets, shared memory) | Direct (shared variables) |
| Crash | Isolated | Can bring the whole process down |

**Process states:** New, Ready, Running, Waiting (Blocked), Terminated.

## CPU scheduling
FCFS (simple, convoy effect) | SJF (best average waiting time, starvation possible) | Priority (starvation, fixed by aging) | Round Robin (time quantum, fair, good for time sharing) | Multilevel queue.

## Deadlock: four conditions (all needed)
Mutual exclusion, hold and wait, no pre-emption, circular wait. Handle with prevention, avoidance (**Banker's algorithm**), detection and recovery, or ignore (ostrich).

## Synchronisation
Race condition, critical section, **mutex** (one owner, lock/unlock), **semaphore** (counter: binary or counting), monitor.

## Memory
- **Paging:** fixed-size blocks (no external fragmentation). **Segmentation:** logical variable-size parts.
- **Virtual memory:** run programs larger than RAM; a **page fault** loads a page from disk.
- **Page replacement:** FIFO (can show Belady's anomaly), **LRU**, Optimal.
- **Thrashing:** too much paging, so little useful work.
- **Fragmentation:** internal (wasted inside a block) and external (free memory in small scattered pieces).

## Others
Kernel mode vs user mode | System call | Context switch (save and restore process state) | Interrupt | Booting | Zombie process (finished but not yet reaped) | Orphan (parent exited).` },
{ id: 'cn', title: 'Computer networks at a glance', blurb: 'OSI layers, TCP vs UDP, common ports and subnetting.', body: `## OSI layers
| # | Layer | Data unit | Examples |
| --- | --- | --- | --- |
| 7 | Application | Data | HTTP, FTP, SMTP, DNS |
| 6 | Presentation | Data | TLS, JPEG, encoding |
| 5 | Session | Data | Sessions, RPC |
| 4 | Transport | Segment | TCP, UDP |
| 3 | Network | Packet | IP, ICMP, routers |
| 2 | Data link | Frame | Ethernet, MAC, switches |
| 1 | Physical | Bits | Cables, hubs |

## TCP vs UDP
TCP: connection-oriented, reliable, ordered, flow and congestion control, slower (web, email, file transfer). UDP: connectionless, no guarantee, fast, low overhead (video calls, gaming, DNS).
TCP handshake: **SYN, SYN-ACK, ACK**. Connection close: FIN / ACK in both directions.

## Common ports
| Port | Service |
| --- | --- |
| 20, 21 | FTP |
| 22 | SSH |
| 23 | Telnet |
| 25 | SMTP |
| 53 | DNS |
| 67, 68 | DHCP |
| 80 | HTTP |
| 110 | POP3 |
| 143 | IMAP |
| 443 | HTTPS |
| 3306 | MySQL |

## IP and subnets
IPv4 is 32 bits (about 4.3 billion addresses); IPv6 is 128 bits. Usable hosts in a subnet = **2^(host bits) - 2**.
| Prefix | Mask | Usable hosts |
| --- | --- | --- |
| /24 | 255.255.255.0 | 254 |
| /25 | 255.255.255.128 | 126 |
| /26 | 255.255.255.192 | 62 |
| /27 | 255.255.255.224 | 30 |
| /30 | 255.255.255.252 | 2 |

Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. Loopback 127.0.0.1.

## Devices
Hub (physical, broadcasts) | Switch (data link, uses MAC) | Router (network layer, uses IP, connects networks) | Gateway (connects different protocols) | Firewall (filters traffic).

## Protocol one-liners
ARP: IP to MAC | DHCP: automatic IP | DNS: name to IP | ICMP: ping and errors | NAT: private to public address | HTTPS: HTTP over TLS | VPN: encrypted tunnel.` },
{ id: 'sdlc', title: 'SDLC, Agile and testing at a glance', blurb: 'Models, Scrum, testing types and bug life cycle.', body: `## SDLC phases
Requirements -> Design -> Development -> Testing -> Deployment -> Maintenance.

## Models
| Model | Key idea | Best when |
| --- | --- | --- |
| Waterfall | Linear phases | Fixed requirements |
| V-Model | A test phase for every build phase | Strict quality needs |
| Iterative / Incremental | Build in repeated cycles | Early partial delivery |
| Spiral | Risk analysis each loop | Large, risky projects |
| Agile / Scrum | Short sprints, feedback | Changing requirements |
| Kanban | Visual flow, WIP limits | Support and maintenance |

## Scrum
**Roles:** Product Owner, Scrum Master, Development Team. **Events:** sprint planning, daily stand-up, sprint review, retrospective. **Artifacts:** product backlog, sprint backlog, increment. Sprint = 1 to 4 weeks.

## Testing
- **Levels:** Unit -> Integration -> System -> Acceptance.
- **Types:** functional, regression, smoke, sanity, performance (load, stress), security, usability, compatibility.
- **Techniques:** black-box, white-box, grey-box; boundary value analysis, equivalence partitioning.
- **Severity** = impact on the system; **priority** = urgency to fix.
- **Bug life cycle:** New -> Assigned -> Open -> Fixed -> Retest -> Verified -> Closed (or Reopened, Rejected, Deferred).

## DevOps
CI = merge often + automatic build and test. CD = automatic delivery or deployment. Tools: Git, Jenkins, Docker, Kubernetes, Ansible, SonarQube.

## Git commands
\`clone, status, add, commit, push, pull, fetch, branch, checkout, merge, rebase, stash, log, reset, revert\`` },
{ id: 'java', title: 'Java quick revision', blurb: 'Keywords, collections, exceptions, threads and common output traps.', body: `## Core
- JDK > JRE > JVM. Bytecode runs on any JVM.
- Primitives: byte 1, short 2, int 4, long 8, float 4, double 8, char 2, boolean.
- **String** is immutable; use **StringBuilder** for loops. String literals live in the string pool.
- \`==\` compares references; \`equals()\` compares content. Integer cache: -128 to 127.
- Java is always pass by value (references are passed by value).

## Order of execution
Static block (once) -> instance block -> constructor. Parent before child.

## Collections
List: ArrayList, LinkedList | Set: HashSet, LinkedHashSet, TreeSet | Map: HashMap, LinkedHashMap, TreeMap, ConcurrentHashMap | Queue: PriorityQueue, ArrayDeque.
HashMap: array of buckets, hash and equals, resize at load factor 0.75, treeifies at 8 nodes in a bucket (Java 8+). Override **equals and hashCode together**.

## Exceptions
Throwable -> Error / Exception -> RuntimeException (unchecked). try, catch, finally, throw, throws. \`finally\` runs even after \`return\`; a return in finally overrides.

## Threads
Create with Runnable or Thread; **start()** not run(). \`synchronized\`, \`volatile\` (visibility), \`AtomicInteger\`, \`ExecutorService\`. Deadlock = circular wait for locks. **wait()** releases the lock; **sleep()** does not.

## Java 8+
Lambda, functional interfaces (Function, Predicate, Consumer, Supplier), Stream API (filter, map, reduce, collect), Optional, default and static methods in interfaces, records (16+).

## Traps
\`7 / 2 = 3\` | \`'a' + 1 = 98\` | \`"x" + 1 + 2 = "x12"\` but \`1 + 2 + "x" = "3x"\` | \`i++ + ++i\` | \`0.1 + 0.2 != 0.3\` | \`new String("a") == "a"\` is false.` },
{ id: 'hr', title: 'HR interview checklist', blurb: 'The questions you must prepare and how to answer in a structured way.', body: `## Prepare these 10 answers in your own words
1. Tell me about yourself (present, past, future; 60 to 90 seconds)
2. Why Infosys?
3. Why should we hire you?
4. Strengths (with proof) and weakness (with improvement)
5. Where do you see yourself in five years?
6. Relocation and shifts: willing and honest
7. A team conflict story (STAR)
8. A failure story and what you learned (STAR)
9. Your project explained in two minutes
10. Do you have any questions for us?

## STAR
**S**ituation, **T**ask, **A**ction (what *I* did), **R**esult (number + lesson).

## Body language and manners
Greet, smile, sit straight, eye contact, speak slowly, listen fully, do not interrupt, thank them at the end. Phone silent. Reach 30 minutes early.

## Documents
Photo ID, all marksheets and degree or provisional, resume copies, passport photos, interview or offer letter. Names, dates and marks must match everywhere.

## Do and do not
| Do | Do not |
| --- | --- |
| Be honest | Lie or exaggerate |
| Give examples | Give one-word answers |
| Show a learning attitude | Say "I know everything" |
| Admit what you do not know, then reason | Bluff |
| Speak positively about teachers and colleges | Criticise anyone |

## Questions to ask them
Training programme details | How freshers are allocated to projects | Skills to build before joining | The first-year learning path.` },
{ id: 'night-before', title: 'Night-before and interview-day checklist', blurb: 'Last-day revision order, what to carry and what to do in the room.', body: `## Night before
- Revise **your project** (architecture, tables, your role) and **your resume** line by line.
- Skim the cheat sheets: complexity, OOP, SQL, OS, CN.
- Re-solve three coding problems from memory: reverse a string, two sum, reverse a linked list.
- Rehearse "Tell me about yourself" aloud twice.
- Pack documents, pen, water. Set two alarms. **Sleep early.**

## Morning
- Eat breakfast. Formal, clean, ironed clothes.
- Check the route and timing, or test your internet, camera and microphone for an online interview.
- Reach or log in **30 minutes early**.

## In the interview
1. Greet, smile, introduce yourself clearly.
2. **Listen to the full question**, take a moment, then answer.
3. For coding: repeat the problem, clarify inputs, explain the **approach before** you code, handle edge cases, state complexity.
4. Think aloud so the interviewer follows your reasoning.
5. If stuck: say what you know, ask for a hint politely.
6. If you do not know: say so honestly and explain how you would find out.
7. Ask one or two good questions at the end. Thank them.

## After
Note the questions you could not answer and revise them. Share your experience with the next candidates; it helps everyone.` }
);
