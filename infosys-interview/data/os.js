IV.addModule({ id: 'os', group: 'tech', title: 'Operating systems', blurb: 'Processes and threads, scheduling, deadlock, memory management, paging, synchronization and file systems: the OS questions Infosys interviewers ask freshers.', qa: [
{ lvl: 'basic', hot: true, tags: ['basics'], q: 'What is an operating system? What are its main functions?', a: `An operating system (OS) is the software that **manages the hardware and gives programs a safe, simple way to use it**. It sits between the user/applications and the hardware. Examples: Windows, Linux, macOS, Android.

Main functions:
- **Process management:** create, schedule and terminate processes.
- **Memory management:** allocate and free memory, virtual memory.
- **File management:** files, directories, permissions.
- **Device management:** drivers and I/O.
- **Security and protection:** users, permissions.
- **User interface:** command line or GUI.` },
{ lvl: 'basic', hot: true, tags: ['process'], q: 'What is the difference between a process and a thread?', a: `A **process** is a program in execution with its own memory space (code, data, heap, stack) and resources. A **thread** is the smallest unit of execution **inside** a process. Threads of the same process share the code, data and heap, but each has its own stack and registers.

| | Process | Thread |
| --- | --- | --- |
| Memory | Separate address space | Shared within the process |
| Creation / switching | Heavy, slow | Light, fast |
| Communication | Needs IPC (pipes, sockets, shared memory) | Direct through shared memory |
| Crash | One process crash does not affect others | A crashing thread can bring down the process |` },
{ lvl: 'basic', hot: true, tags: ['process'], q: 'What are the states of a process? Draw the process life cycle.', a: `A process moves through these states:

1. **New:** being created.
2. **Ready:** loaded in memory, waiting for the CPU.
3. **Running:** instructions are being executed.
4. **Waiting / Blocked:** waiting for I/O or an event.
5. **Terminated:** finished.

Transitions: New -> Ready (admitted), Ready -> Running (scheduler dispatch), Running -> Ready (time slice over / pre-empted), Running -> Waiting (I/O request), Waiting -> Ready (I/O done), Running -> Terminated (exit).` },
{ lvl: 'basic', tags: ['process'], q: 'What is a PCB (Process Control Block)? What is a context switch?', a: `The **PCB** is the data structure the OS keeps for every process: process id, state, program counter, CPU registers, scheduling information, memory limits, open files and accounting data.

A **context switch** happens when the CPU moves from one process to another: the OS saves the state of the running process in its PCB and loads the saved state of the next one from its PCB. It is pure overhead (no useful work is done during the switch), so too many switches slow the system.` },
{ lvl: 'basic', hot: true, tags: ['scheduling'], q: 'What is CPU scheduling? Explain FCFS, SJF, Priority and Round Robin.', a: `The **CPU scheduler** picks which ready process gets the CPU next.

- **FCFS (First Come First Served):** run in arrival order. Simple, but a long job at the front makes others wait (**convoy effect**).
- **SJF (Shortest Job First):** run the process with the shortest burst time. Gives the minimum average waiting time but needs the burst time in advance and can **starve** long jobs. Its pre-emptive form is SRTF.
- **Priority scheduling:** the highest priority runs first. Low-priority processes can starve; **aging** (slowly raising priority of waiting processes) fixes it.
- **Round Robin (RR):** each process gets a fixed **time quantum** in turn; if it is not finished it goes to the back of the queue. Good for time-sharing systems. A very large quantum behaves like FCFS, a very small one wastes time on context switches.` },
{ lvl: 'medium', hot: true, tags: ['scheduling'], q: 'Solve: processes P1, P2, P3 arrive at 0 with burst times 6, 8, 3. Find average waiting time for FCFS and SJF.', a: `**FCFS (order P1, P2, P3):**
- P1 waits 0, P2 waits 6, P3 waits 14.
- Average waiting time = (0 + 6 + 14) / 3 = **6.67**.

**SJF (order P3, P1, P2):**
- P3 waits 0, P1 waits 3, P2 waits 9.
- Average waiting time = (0 + 3 + 9) / 3 = **4**.

Formulas: **Turnaround time = completion time - arrival time**, **waiting time = turnaround time - burst time**. SJF gives the lower average waiting time.` },
{ lvl: 'basic', tags: ['scheduling'], q: 'Pre-emptive vs non-pre-emptive scheduling. Define throughput, turnaround, waiting and response time.', a: `In **non-pre-emptive** scheduling a process keeps the CPU until it finishes or blocks (FCFS, non-pre-emptive SJF). In **pre-emptive** scheduling the OS can take the CPU away (Round Robin, SRTF, pre-emptive priority).

- **Throughput:** number of processes completed per unit time.
- **Turnaround time:** from arrival to completion.
- **Waiting time:** total time spent in the ready queue.
- **Response time:** from arrival to the first time the process gets the CPU.` },
{ lvl: 'basic', hot: true, tags: ['deadlock'], q: 'What is a deadlock? What are the four necessary conditions?', a: `A deadlock is a situation where a set of processes are **all waiting for resources held by each other**, so none can continue.

All four conditions (Coffman conditions) must hold together:
1. **Mutual exclusion:** a resource can be used by only one process at a time.
2. **Hold and wait:** a process holds one resource while waiting for another.
3. **No pre-emption:** a resource cannot be forcibly taken away.
4. **Circular wait:** a cycle of processes, each waiting for a resource held by the next.

Remove any one condition and a deadlock cannot occur.` },
{ lvl: 'medium', hot: true, tags: ['deadlock'], q: 'How can deadlocks be handled? Explain prevention, avoidance, detection and the Banker\'s algorithm.', a: `- **Prevention:** break one of the four conditions (for example, request all resources at once to stop hold-and-wait, or order the resources to stop circular wait).
- **Avoidance:** the OS grants a request only if the system stays in a **safe state**. The **Banker's algorithm** checks, before every allocation, whether there is some order in which all processes can still finish with the available resources.
- **Detection and recovery:** let deadlocks happen, detect them with a resource allocation graph, then terminate a process or pre-empt resources.
- **Ignore (ostrich approach):** used by most general-purpose systems because deadlocks are rare.` },
{ lvl: 'basic', tags: ['deadlock'], q: 'What is starvation and how is it different from deadlock?', a: `**Starvation** means a process waits for a very long time (maybe forever) because other processes keep getting the resource first, for example a low-priority process in priority scheduling. Other processes are still running fine. In a **deadlock**, the involved processes are stuck permanently waiting for each other. Aging solves starvation.` },
{ lvl: 'basic', hot: true, tags: ['sync'], q: 'What is a critical section and the race condition? What is mutual exclusion?', a: `The **critical section** is the part of code that accesses a shared resource (a shared variable, a file). A **race condition** occurs when the result depends on the order in which processes or threads execute, because they update shared data at the same time. For example, two threads doing \`count++\` can lose an update.

**Mutual exclusion** means only one process may be in its critical section at a time. A correct solution also needs **progress** (a process outside the critical section cannot block others) and **bounded waiting** (no one waits forever).` },
{ lvl: 'medium', hot: true, tags: ['sync'], q: 'What is a semaphore? Binary vs counting semaphore. Mutex vs semaphore.', a: `A **semaphore** is an integer variable used for synchronization, changed only by two atomic operations: \`wait(S)\` (P, decrement, block if the value is negative or zero) and \`signal(S)\` (V, increment, wake a waiting process).

- **Binary semaphore:** value 0 or 1, works like a lock.
- **Counting semaphore:** value can be any number, used to control access to a pool of N identical resources.

| | Mutex | Semaphore |
| --- | --- | --- |
| Ownership | Only the thread that locked it can unlock it | Any process can signal |
| Purpose | Mutual exclusion (locking) | Signalling and counting resources |
| Value | Locked or unlocked | Integer |` },
{ lvl: 'medium', tags: ['sync'], q: 'Explain the producer-consumer problem and how a semaphore solves it.', a: `A producer puts items into a **bounded buffer** and a consumer takes them out. The producer must wait when the buffer is full and the consumer must wait when it is empty, and they must not access the buffer at the same time.

Solution with three semaphores: \`empty = N\` (free slots), \`full = 0\` (filled slots) and \`mutex = 1\` (buffer access).
- Producer: \`wait(empty); wait(mutex); add item; signal(mutex); signal(full)\`.
- Consumer: \`wait(full); wait(mutex); remove item; signal(mutex); signal(empty)\`.` },
{ lvl: 'basic', hot: true, tags: ['memory'], q: 'What is virtual memory? Why is it useful?', a: `Virtual memory is a technique that lets a process use **more memory than the physical RAM** by keeping only the needed parts (pages) in RAM and the rest on disk (swap area). Each process sees a large, continuous address space.

Benefits: bigger programs can run, more processes fit in memory, processes are isolated from each other, and memory is shared efficiently. The cost: if the system spends more time moving pages than running code, performance collapses (**thrashing**).` },
{ lvl: 'basic', hot: true, tags: ['memory'], q: 'What are paging and segmentation? What is a page fault?', a: `**Paging:** physical memory is divided into fixed-size **frames** and the process into same-size **pages**. A **page table** maps pages to frames. No external fragmentation, but some internal fragmentation in the last page.

**Segmentation:** memory is divided into variable-size logical parts (code, stack, heap, data). It matches how programmers think but suffers from external fragmentation.

A **page fault** occurs when a process accesses a page that is not currently in RAM. The OS finds the page on disk, loads it into a free frame, updates the page table and restarts the instruction.` },
{ lvl: 'medium', hot: true, tags: ['memory'], q: 'Explain page replacement algorithms: FIFO, LRU and Optimal. What is Belady\'s anomaly?', a: `When no free frame is available, the OS must choose a page to remove.

- **FIFO:** replace the oldest page. Simple, but can remove a heavily used page.
- **LRU (Least Recently Used):** replace the page not used for the longest time. Works well, costly to implement exactly.
- **Optimal:** replace the page that will not be used for the longest time in the future. Best possible, but impossible to know in practice, used as a benchmark.

**Belady's anomaly:** with FIFO, giving a process **more** frames can sometimes cause **more** page faults. LRU and Optimal do not have this problem.` },
{ lvl: 'medium', tags: ['memory'], q: 'Solve: reference string 7,0,1,2,0,3,0,4 with 3 frames. Count page faults for FIFO.', a: `Frames start empty (FIFO, oldest leaves first):

| Reference | Frames after | Fault? |
| --- | --- | --- |
| 7 | 7 | Yes |
| 0 | 7 0 | Yes |
| 1 | 7 0 1 | Yes |
| 2 | 0 1 2 (7 out) | Yes |
| 0 | 0 1 2 | No |
| 3 | 1 2 3 (0 out) | Yes |
| 0 | 2 3 0 (1 out) | Yes |
| 4 | 3 0 4 (2 out) | Yes |

**Total page faults = 7.**` },
{ lvl: 'basic', tags: ['memory'], q: 'What is fragmentation? Internal vs external. What is thrashing?', a: `- **Internal fragmentation:** memory is wasted **inside** an allocated block (a process needing 7 KB gets an 8 KB block). Occurs in fixed-size allocation like paging.
- **External fragmentation:** enough total free memory exists but it is split into small non-contiguous holes, so a large request fails. Occurs in variable-size allocation like segmentation. Fixed by **compaction** or paging.

**Thrashing:** a process does not have enough frames and keeps page-faulting, so the CPU spends most time swapping pages instead of executing. Fix: reduce the number of running processes or give more memory.` },
{ lvl: 'basic', tags: ['basics'], q: 'What is a kernel? User mode vs kernel mode. What is a system call?', a: `The **kernel** is the core of the OS that has full control of the hardware. **User mode** is a restricted mode where application code runs and cannot access hardware directly. **Kernel mode** is the privileged mode where the OS code runs.

A **system call** is the controlled way for a user program to ask the kernel for a service (read a file, create a process, allocate memory). The program switches to kernel mode, the kernel does the work and returns. Examples: \`open, read, write, fork, exec, exit\`.` },
{ lvl: 'medium', tags: ['process'], q: 'What does fork() do? What are zombie and orphan processes?', a: `\`fork()\` creates a **new child process** that is a copy of the calling (parent) process. It returns 0 in the child and the child's pid in the parent. \`exec()\` then replaces the process image with a new program.

- **Zombie:** a child that has finished but whose entry stays in the process table because the parent has not yet called \`wait()\` to read its exit status.
- **Orphan:** a child whose parent has terminated. It is adopted by the init/systemd process.` },
{ lvl: 'medium', tags: ['process'], q: 'What is inter-process communication (IPC)? Name its methods.', a: `IPC is how separate processes exchange data and coordinate. Common methods: **pipes** (one-way byte stream, named pipes/FIFOs), **message queues**, **shared memory** (fastest, needs synchronization), **sockets** (also across machines), **signals** and **semaphores** for synchronization.` },
{ lvl: 'basic', tags: ['files'], q: 'What is a file system? Explain file allocation methods and the Linux file permissions.', a: `A file system organises how data is stored and found on a disk (FAT32, NTFS, ext4).

Allocation methods: **contiguous** (fast access, external fragmentation), **linked** (no fragmentation, slow random access), **indexed** (an index block lists all blocks, good random access).

Linux permissions are shown as \`rwxr-xr--\`: three groups (owner, group, others), each with read (4), write (2) and execute (1). \`chmod 754 file\` gives owner 7 (rwx), group 5 (r-x), others 4 (r--).` },
{ lvl: 'medium', tags: ['memory'], q: 'What is a TLB? What is the cache and why is it fast?', a: `The **TLB (Translation Lookaside Buffer)** is a small, very fast cache inside the CPU that stores recent **page-table translations** (virtual page -> physical frame). Without it every memory access would need an extra memory access to read the page table. A **TLB hit** gives the address immediately, a **miss** needs a page table lookup.

A **cache** keeps recently or frequently used data in small, fast memory close to the CPU, based on the **principle of locality** (a program tends to reuse the same data and nearby data).` },
{ lvl: 'basic', tags: ['basics'], q: 'What is multiprogramming, multitasking, multiprocessing and multithreading?', a: `- **Multiprogramming:** several programs are kept in memory and the CPU switches when one waits for I/O, so the CPU is rarely idle.
- **Multitasking (time sharing):** the CPU switches between tasks so quickly that users feel they run at the same time.
- **Multiprocessing:** a system with **more than one CPU** that really runs tasks in parallel.
- **Multithreading:** several threads inside one process run concurrently.` },
{ lvl: 'medium', tags: ['basics'], q: 'What is the boot process of a computer?', a: `1. **Power on:** the CPU runs the firmware (BIOS or UEFI).
2. **POST** (power-on self test) checks the hardware.
3. The firmware finds the **boot device** and loads the **bootloader** (GRUB, Windows Boot Manager).
4. The bootloader loads the **kernel** into memory.
5. The kernel initialises drivers and starts the first process (init/systemd), which starts services and finally the login screen.` },
{ lvl: 'medium', tags: ['basics'], q: 'What is the difference between a monolithic kernel and a microkernel? What is a daemon?', a: `A **monolithic kernel** runs all OS services (file system, drivers, memory management) in kernel space: fast, but a bug in one part can crash everything (Linux). A **microkernel** keeps only the essentials in the kernel and runs other services in user space: more stable and secure, but message passing makes it slower.

A **daemon** is a background process that runs without a terminal and provides a service (a web server, a scheduler like cron).` },
{ lvl: 'basic', tags: ['linux'], q: 'List basic Linux commands an interviewer may ask.', a: `| Command | Use |
| --- | --- |
| \`ls -l\` | List files with details |
| \`pwd\`, \`cd\` | Show or change the directory |
| \`mkdir\`, \`rmdir\`, \`rm -r\` | Create or remove directories |
| \`cp\`, \`mv\` | Copy, move or rename |
| \`cat\`, \`less\`, \`head\`, \`tail -f\` | View files (tail -f follows a log) |
| \`grep "text" file\` | Search text |
| \`ps aux\`, \`top\`, \`kill -9 pid\` | Processes |
| \`chmod\`, \`chown\` | Permissions and owner |
| \`df -h\`, \`du -sh\` | Disk usage |
| \`find / -name x\` | Find files |
| \`ping\`, \`curl\`, \`netstat\` | Network checks |` },
{ lvl: 'medium', tags: ['sync'], q: 'What are the readers-writers and dining philosophers problems?', a: `**Readers-writers:** many readers may read shared data together, but a writer needs exclusive access. A solution must avoid starving either readers or writers.

**Dining philosophers:** five philosophers sit around a table with one fork between each pair; a philosopher needs both neighbouring forks to eat. If all pick up their left fork at once, nobody can continue: a **deadlock**. Solutions: allow at most four to sit, pick up both forks only together, or number the forks and always take the lower number first.` },
] });
