IV.addModule({ id: 'dsa', group: 'tech', title: 'Data structures and algorithms', blurb: 'Arrays, strings, linked lists, stacks, queues, trees, hashing, graphs, sorting, searching, recursion and complexity, from basic to medium level.', qa: [
{ lvl: 'basic', hot: true, tags: ['basics'], q: 'What is a data structure? Why do we need one?', a: `A data structure is a way of **organising and storing data in memory** so that it can be accessed and changed efficiently. The right structure makes an operation fast. For example, searching in a sorted array takes O(log n), while the same search in an unsorted linked list takes O(n).

We need them because every program stores data and every program has operations it repeats many times (search, insert, delete, sort). Choosing the structure decides the speed and memory use of the whole program.

- **Linear:** array, linked list, stack, queue.
- **Non-linear:** tree, graph.
- **Hash based:** hash table / hash map.` },
{ lvl: 'basic', hot: true, tags: ['complexity'], q: 'What is time complexity and what is Big-O notation?', a: `Time complexity tells **how the running time grows as the input size n grows**. It counts basic steps, not seconds, so it does not depend on the machine.

Big-O gives an **upper bound** (usually the worst case) and ignores constants and lower-order terms. So 3n² + 5n + 2 is O(n²).

| Notation | Name | Example |
| --- | --- | --- |
| O(1) | Constant | Array access by index, HashMap get (average) |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Linear search, one loop |
| O(n log n) | Linearithmic | Merge sort, heap sort |
| O(n²) | Quadratic | Two nested loops, bubble sort |
| O(2ⁿ) | Exponential | Naive recursive Fibonacci |

> Interview tip: when you explain a solution, always finish with its time and space complexity.` },
{ lvl: 'basic', tags: ['complexity'], q: 'What is the difference between best, average and worst case? Give an example.', a: `For the same algorithm, the time can change with the input.

For **linear search** in an array of n elements:
- **Best case:** the element is the first one, O(1).
- **Average case:** the element is somewhere in the middle, about n/2 steps, O(n).
- **Worst case:** the element is last or missing, n steps, O(n).

We usually quote the worst case because it is a guarantee. Quick sort is a famous case where average is O(n log n) but worst is O(n²).` },
{ lvl: 'basic', tags: ['complexity'], q: 'What is space complexity? What is the space complexity of recursion?', a: `Space complexity is the **extra memory** an algorithm needs, apart from the input.

- Swapping two variables: O(1).
- Creating a copy of an array of size n: O(n).
- **Recursion uses the call stack.** A recursive function that goes n levels deep uses O(n) stack space, even if it creates no other data. Recursive binary search uses O(log n) stack, an iterative one uses O(1).` },
{ lvl: 'basic', hot: true, tags: ['array'], q: 'Array vs linked list: differences and when would you use each?', a: `| Point | Array | Linked list |
| --- | --- | --- |
| Memory | Contiguous block | Nodes spread in memory, each holds a pointer |
| Access by index | O(1) | O(n) |
| Insert/delete at start | O(n) (shift elements) | O(1) |
| Insert/delete in middle | O(n) | O(1) once you have the node, O(n) to find it |
| Size | Fixed (for a plain array) | Grows and shrinks easily |
| Extra memory | None | One or two pointers per node |
| Cache friendliness | Very good | Poor |

Use an **array** when you need fast random access and the size is known. Use a **linked list** when you do many insertions and deletions and do not need index access.` },
{ lvl: 'basic', hot: true, tags: ['array'], q: 'How do you find the largest and second largest element in an array in one pass?', a: `Keep two variables, \`first\` and \`second\`, and update them while scanning once. Time O(n), space O(1).

\`\`\`java
int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
for (int x : a) {
    if (x > first) { second = first; first = x; }
    else if (x > second && x != first) { second = x; }
}
\`\`\`

The condition \`x != first\` avoids counting a duplicate of the maximum as the second largest. Sorting would also work but costs O(n log n).` },
{ lvl: 'basic', tags: ['array'], q: 'How do you reverse an array in place?', a: `Use two pointers, one at the start and one at the end, and swap while they have not crossed. Time O(n), space O(1).

\`\`\`java
int i = 0, j = a.length - 1;
while (i < j) {
    int t = a[i]; a[i] = a[j]; a[j] = t;
    i++; j--;
}
\`\`\`

The same two-pointer idea is used to check a palindrome, to find a pair with a given sum in a sorted array and to remove duplicates from a sorted array.` },
{ lvl: 'medium', hot: true, tags: ['array', 'hashing'], q: 'Two Sum: given an array and a target, find two numbers that add up to the target.', a: `**Brute force:** two nested loops, O(n²).

**Better:** use a hash map from value to index. For each number \`x\`, check whether \`target - x\` is already in the map. One pass, O(n) time and O(n) space.

\`\`\`java
Map<Integer, Integer> seen = new HashMap<>();
for (int i = 0; i < a.length; i++) {
    int need = target - a[i];
    if (seen.containsKey(need)) return new int[]{seen.get(need), i};
    seen.put(a[i], i);
}
return new int[]{-1, -1};
\`\`\`

If the array is **sorted**, two pointers (one at each end) solve it in O(n) time and O(1) space.` },
{ lvl: 'medium', tags: ['array'], q: 'What is Kadane\'s algorithm? Find the maximum subarray sum.', a: `Kadane's algorithm finds the **largest sum of a contiguous subarray** in one pass. At each element decide: extend the previous subarray or start a new one here.

\`\`\`java
int best = a[0], cur = a[0];
for (int i = 1; i < a.length; i++) {
    cur = Math.max(a[i], cur + a[i]);
    best = Math.max(best, cur);
}
\`\`\`

Example: [-2, 1, -3, 4, -1, 2, 1, -5, 4] gives 6 (subarray 4, -1, 2, 1). Time O(n), space O(1).` },
{ lvl: 'basic', hot: true, tags: ['string'], q: 'How do you check if a string is a palindrome? What if case and spaces should be ignored?', a: `Compare characters from both ends moving inward.

\`\`\`java
int i = 0, j = s.length() - 1;
while (i < j) {
    if (s.charAt(i) != s.charAt(j)) return false;
    i++; j--;
}
return true;
\`\`\`

To ignore case and non-letters, skip characters that are not letters or digits and compare with \`Character.toLowerCase\`. Time O(n), space O(1). Reversing the string and comparing also works but uses O(n) extra space.` },
{ lvl: 'basic', hot: true, tags: ['string'], q: 'How do you check whether two strings are anagrams?', a: `Two strings are anagrams if they contain the same characters with the same counts.

**Method 1: sort both** and compare. O(n log n).

**Method 2: count array** (best for lowercase letters). O(n) time, O(1) space (26 slots).

\`\`\`java
if (a.length() != b.length()) return false;
int[] cnt = new int[26];
for (int i = 0; i < a.length(); i++) {
    cnt[a.charAt(i) - 'a']++;
    cnt[b.charAt(i) - 'a']--;
}
for (int c : cnt) if (c != 0) return false;
return true;
\`\`\`` },
{ lvl: 'basic', tags: ['string'], q: 'How do you find the first non-repeating character in a string?', a: `Count each character in a first pass, then scan again and return the first character whose count is 1.

\`\`\`java
int[] cnt = new int[256];
for (char c : s.toCharArray()) cnt[c]++;
for (char c : s.toCharArray()) if (cnt[c] == 1) return c;
\`\`\`

Two passes, O(n) time, O(1) space (fixed alphabet). In Java, a \`LinkedHashMap\` also keeps insertion order and gives the same result.` },
{ lvl: 'basic', hot: true, tags: ['linked list'], q: 'How do you reverse a singly linked list?', a: `Walk through the list and flip each \`next\` pointer using three references: \`prev\`, \`curr\` and \`next\`.

\`\`\`java
Node prev = null, curr = head;
while (curr != null) {
    Node next = curr.next;   // remember the rest
    curr.next = prev;        // flip the link
    prev = curr;             // move prev forward
    curr = next;             // move curr forward
}
return prev;                 // new head
\`\`\`

Time O(n), space O(1). A recursive version works too but uses O(n) stack.` },
{ lvl: 'medium', hot: true, tags: ['linked list'], q: 'How do you detect a cycle in a linked list? (Floyd\'s algorithm)', a: `Use two pointers: **slow** moves one step, **fast** moves two steps. If there is a cycle, fast will eventually catch slow inside it. If fast reaches \`null\`, there is no cycle.

\`\`\`java
Node slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true;
}
return false;
\`\`\`

Time O(n), space O(1). A \`HashSet\` of visited nodes also works but costs O(n) space. To find where the cycle starts, reset one pointer to head and move both one step at a time; they meet at the start of the cycle.` },
{ lvl: 'basic', tags: ['linked list'], q: 'How do you find the middle of a linked list in one pass?', a: `Use slow and fast pointers. When fast reaches the end, slow is at the middle.

\`\`\`java
Node slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
return slow;   // second middle if the length is even
\`\`\`` },
{ lvl: 'medium', tags: ['linked list'], q: 'How do you merge two sorted linked lists?', a: `Use a dummy head node and a tail pointer. Repeatedly attach the smaller of the two current nodes.

\`\`\`java
Node dummy = new Node(0), tail = dummy;
while (a != null && b != null) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else                { tail.next = b; b = b.next; }
    tail = tail.next;
}
tail.next = (a != null) ? a : b;
return dummy.next;
\`\`\`

Time O(m + n), space O(1) because the existing nodes are reused. This is the merge step of merge sort.` },
{ lvl: 'basic', tags: ['linked list'], q: 'Singly, doubly and circular linked lists: what is the difference?', a: `- **Singly linked list:** each node has data and a \`next\` pointer. Traversal only in one direction.
- **Doubly linked list:** each node has \`prev\` and \`next\`. You can move both ways and delete a node in O(1) when you have the node, but each node needs more memory. Java's \`LinkedList\` is doubly linked.
- **Circular linked list:** the last node points back to the first. Useful for round-robin scheduling and repeated cycles.` },
{ lvl: 'basic', hot: true, tags: ['stack'], q: 'What is a stack? Name real uses.', a: `A stack is a **LIFO** (last in, first out) structure. Operations: \`push\`, \`pop\`, \`peek\`, \`isEmpty\`, all O(1).

Uses:
- Function call stack and recursion.
- Undo/redo in editors, browser back button.
- Checking balanced brackets, converting infix to postfix, evaluating postfix expressions.
- Depth-first search (iterative).` },
{ lvl: 'medium', hot: true, tags: ['stack'], q: 'How do you check for balanced parentheses in an expression?', a: `Scan the string. Push every opening bracket on a stack. For a closing bracket, the stack top must be the matching opening bracket; pop it. At the end the stack must be empty.

\`\`\`java
Deque<Character> st = new ArrayDeque<>();
for (char c : s.toCharArray()) {
    if ("([{".indexOf(c) >= 0) st.push(c);
    else if (")]}".indexOf(c) >= 0) {
        if (st.isEmpty()) return false;
        char o = st.pop();
        if ((c == ')' && o != '(') || (c == ']' && o != '[') || (c == '}' && o != '{')) return false;
    }
}
return st.isEmpty();
\`\`\`

Time O(n), space O(n).` },
{ lvl: 'basic', tags: ['queue'], q: 'What is a queue? What are a circular queue, a deque and a priority queue?', a: `A queue is **FIFO** (first in, first out). Operations: \`enqueue\` at the rear, \`dequeue\` from the front.

- **Circular queue:** the rear wraps around to the start of the array, so freed space at the front is reused.
- **Deque (double ended queue):** insert and delete at both ends.
- **Priority queue:** the element with the highest priority comes out first, not the oldest. It is usually built with a **heap**, so insert and remove are O(log n).

Uses: CPU scheduling, printer queues, BFS, request buffers.` },
{ lvl: 'medium', tags: ['stack', 'queue'], q: 'How can you implement a queue using two stacks?', a: `Use \`in\` for pushing and \`out\` for popping.

- **enqueue(x):** push x on \`in\`.
- **dequeue():** if \`out\` is empty, move everything from \`in\` to \`out\` (this reverses the order). Then pop from \`out\`.

Each element moves at most twice, so the **amortised** cost of each operation is O(1). The same trick shows why LIFO twice gives FIFO.` },
{ lvl: 'basic', hot: true, tags: ['tree'], q: 'What is a binary tree and a binary search tree (BST)?', a: `A **binary tree** is a tree where every node has at most two children (left and right).

A **BST** adds an ordering rule: for every node, all values in the left subtree are smaller and all values in the right subtree are larger (no duplicates in the basic version).

That rule makes search, insert and delete O(h), where h is the height. For a balanced tree that is O(log n), but a BST built from sorted input degenerates into a linked list with h = n, and operations become O(n).` },
{ lvl: 'basic', hot: true, tags: ['tree'], q: 'Explain inorder, preorder, postorder and level-order traversal.', a: `For the tree with root 1, left child 2 and right child 3:

| Traversal | Order | Output |
| --- | --- | --- |
| Inorder | Left, Root, Right | 2 1 3 |
| Preorder | Root, Left, Right | 1 2 3 |
| Postorder | Left, Right, Root | 2 3 1 |
| Level order | Level by level using a queue | 1 2 3 |

**Inorder traversal of a BST gives the values in sorted order.**

\`\`\`java
void inorder(Node n) {
    if (n == null) return;
    inorder(n.left);
    System.out.print(n.val + " ");
    inorder(n.right);
}
\`\`\`

Preorder is used to copy a tree, postorder to delete a tree.` },
{ lvl: 'medium', tags: ['tree'], q: 'How do you find the height of a binary tree? How do you check if it is balanced?', a: `**Height** (number of nodes on the longest root-to-leaf path):

\`\`\`java
int height(Node n) {
    if (n == null) return 0;
    return 1 + Math.max(height(n.left), height(n.right));
}
\`\`\`

A tree is **height balanced** if for every node the heights of the left and right subtrees differ by at most 1. Checking this naively calls \`height\` at every node (O(n²)). Better: compute the height bottom-up and return -1 as soon as an unbalanced subtree is found, which gives O(n).` },
{ lvl: 'medium', tags: ['tree'], q: 'What is an AVL tree? Why do we balance trees?', a: `An **AVL tree** is a self-balancing BST. After every insert or delete it checks the balance factor (height of left subtree minus height of right subtree) of each node, and if it becomes less than -1 or greater than 1 it restores balance with **rotations** (left, right, left-right, right-left).

Balancing keeps the height at O(log n), so search, insert and delete stay O(log n) in the worst case. A red-black tree is another self-balancing tree, used inside Java's \`TreeMap\` and \`TreeSet\`.` },
{ lvl: 'medium', tags: ['heap'], q: 'What is a heap? What is the difference between a min-heap and a max-heap?', a: `A heap is a **complete binary tree** stored in an array that satisfies the heap property.

- **Max-heap:** every parent is greater than or equal to its children, so the root is the maximum.
- **Min-heap:** every parent is less than or equal to its children, so the root is the minimum.

For a node at index i (0-based): left child = 2i + 1, right child = 2i + 2, parent = (i - 1) / 2.

| Operation | Time |
| --- | --- |
| Get min/max | O(1) |
| Insert | O(log n) |
| Remove min/max | O(log n) |
| Build heap from n items | O(n) |

Heaps power priority queues, heap sort and "top K" problems. Java's \`PriorityQueue\` is a min-heap by default.` },
{ lvl: 'basic', hot: true, tags: ['hashing'], q: 'What is hashing? How does a hash table work?', a: `A hash table stores key-value pairs. A **hash function** converts the key into an integer, and that integer (mod table size) picks the **bucket** where the pair is stored. If the function spreads keys evenly, insert, search and delete are **O(1) on average**.

A good hash function is fast, deterministic and distributes keys uniformly. In the worst case, when many keys land in one bucket, operations degrade to O(n) (or O(log n) with balanced trees in Java 8+).` },
{ lvl: 'medium', hot: true, tags: ['hashing'], q: 'What is a collision and how is it handled?', a: `A collision happens when two different keys map to the same bucket.

1. **Chaining (separate chaining):** each bucket holds a linked list (or tree) of all entries with that index. Java's \`HashMap\` uses this.
2. **Open addressing:** if the slot is taken, probe for another slot in the same array: linear probing (next slot), quadratic probing, double hashing.

The **load factor** (entries / buckets) decides when to resize. Java's \`HashMap\` has a default load factor of 0.75: when it is crossed, the table doubles and entries are rehashed.` },
{ lvl: 'medium', tags: ['hashing'], q: 'Find duplicates in an array. How many ways can you do it?', a: `1. **Brute force:** compare every pair. O(n²), O(1) space.
2. **Sort** and compare neighbours. O(n log n).
3. **HashSet:** add each element; if \`add\` returns false it is a duplicate. O(n) time, O(n) space.
4. **Index marking** (when values are in 1..n): use the array itself by making \`a[|x|-1]\` negative; seeing it already negative means a duplicate. O(n) time, O(1) extra space.

In an interview start with the HashSet solution and then mention the trade-off.` },
{ lvl: 'basic', hot: true, tags: ['graph'], q: 'What is a graph? What are the ways to represent it?', a: `A graph is a set of **vertices** (nodes) connected by **edges**. Edges can be directed or undirected and may have weights.

- **Adjacency matrix:** an n x n table where \`m[i][j] = 1\` if an edge exists. O(1) edge check, O(n²) space. Good for dense graphs.
- **Adjacency list:** each vertex keeps a list of its neighbours. O(V + E) space. Good for sparse graphs and most real problems.

Real examples: road maps, social networks, web pages and links, network topology.` },
{ lvl: 'medium', hot: true, tags: ['graph'], q: 'Explain BFS and DFS. When do you use each?', a: `**BFS (breadth-first search)** visits nodes level by level using a **queue**. It finds the shortest path in an unweighted graph.

**DFS (depth-first search)** goes as deep as possible along a path before backtracking, using recursion or a **stack**. It is used for cycle detection, topological sort, connected components and maze/backtracking problems.

\`\`\`java
// BFS
Queue<Integer> q = new LinkedList<>();
boolean[] vis = new boolean[n];
q.add(src); vis[src] = true;
while (!q.isEmpty()) {
    int u = q.poll();
    for (int v : adj.get(u))
        if (!vis[v]) { vis[v] = true; q.add(v); }
}
\`\`\`

Both take O(V + E) time with an adjacency list.` },
{ lvl: 'medium', tags: ['graph'], q: 'What is Dijkstra\'s algorithm and what are minimum spanning trees?', a: `**Dijkstra** finds the shortest path from one source to all other vertices in a graph with **non-negative** edge weights. It keeps a min-heap of (distance, vertex) and repeatedly takes the closest unvisited vertex and relaxes its edges. With a heap the time is O((V + E) log V). It fails with negative edges (use Bellman-Ford).

A **minimum spanning tree (MST)** connects all vertices of a weighted undirected graph with the least total edge weight and no cycles. **Kruskal** sorts edges and adds the cheapest edge that does not form a cycle (using union-find). **Prim** grows the tree from one vertex, always adding the cheapest edge leaving the tree.` },
{ lvl: 'basic', hot: true, tags: ['sorting'], q: 'Compare the common sorting algorithms.', a: `| Algorithm | Best | Average | Worst | Space | Stable |
| --- | --- | --- | --- | --- | --- |
| Bubble sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Heap sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |

A sort is **stable** if equal elements keep their original relative order. Insertion sort is very good for small or nearly sorted data. Java's \`Arrays.sort\` for objects uses TimSort (a merge/insertion hybrid) and for primitives a dual-pivot quick sort.` },
{ lvl: 'medium', hot: true, tags: ['sorting'], q: 'Explain quick sort and merge sort. Why can quick sort be O(n²)?', a: `**Merge sort** (divide and conquer): split the array in half, sort each half recursively, then merge the two sorted halves. Always O(n log n), needs O(n) extra space, stable.

**Quick sort:** choose a **pivot**, partition so that smaller elements go left and larger go right, then sort both sides recursively. In place, average O(n log n).

Quick sort becomes **O(n²)** when the pivot is repeatedly the smallest or largest element, for example always taking the first element as pivot on an already sorted array. Choosing a random pivot or the median of three avoids this in practice.` },
{ lvl: 'basic', hot: true, tags: ['searching'], q: 'Linear search vs binary search. What are the conditions for binary search?', a: `**Linear search** checks elements one by one: O(n), works on any array.

**Binary search** works only on a **sorted** array. Compare the target with the middle element and discard half of the array each time: O(log n).

\`\`\`java
int lo = 0, hi = a.length - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;   // avoids overflow of (lo + hi)
    if (a[mid] == key) return mid;
    if (a[mid] < key) lo = mid + 1;
    else hi = mid - 1;
}
return -1;
\`\`\`

Searching 1,000,000 sorted items needs at most about 20 comparisons.` },
{ lvl: 'basic', hot: true, tags: ['recursion'], q: 'What is recursion? What are the base case and the recursive case?', a: `Recursion means a function **calls itself** on a smaller version of the same problem. Every recursive function needs:

- A **base case** that stops the recursion (for factorial, \`n == 0\` returns 1).
- A **recursive case** that moves toward the base case (\`n * fact(n - 1)\`).

Without a correct base case you get infinite recursion and a **StackOverflowError**. Recursion is natural for trees and divide and conquer, but iteration is usually cheaper in memory.` },
{ lvl: 'medium', tags: ['recursion', 'dp'], q: 'Why is naive recursive Fibonacci slow and how do you fix it?', a: `\`fib(n) = fib(n-1) + fib(n-2)\` recomputes the same values again and again, so the number of calls grows exponentially, O(2ⁿ).

**Fix 1: memoization** (top-down): store each result the first time it is computed.

**Fix 2: tabulation** (bottom-up): fill a table from the smallest values.

\`\`\`java
long a = 0, b = 1;
for (int i = 2; i <= n; i++) { long c = a + b; a = b; b = c; }
return b;   // O(n) time, O(1) space
\`\`\`

This is the basic idea of **dynamic programming**: break a problem into overlapping subproblems and solve each one once.` },
{ lvl: 'medium', tags: ['dp'], q: 'What is dynamic programming? How is it different from greedy and divide and conquer?', a: `**Dynamic programming (DP)** solves problems that have **overlapping subproblems** and **optimal substructure** by storing sub-results (memoization or a table).

- **Divide and conquer** (merge sort, quick sort): subproblems are independent, nothing to reuse.
- **Greedy:** make the locally best choice at each step and never reconsider. Fast, but correct only for some problems (activity selection, Huffman coding, coin change with standard coins).
- **DP:** tries all choices but avoids repeated work. Examples: 0/1 knapsack, longest common subsequence, coin change for any coins.` },
{ lvl: 'medium', tags: ['technique'], q: 'What is the sliding window technique? Give an example.', a: `A sliding window keeps a **range [left, right]** over an array or string and moves its ends instead of recomputing from scratch. It turns many O(n²) loops into O(n).

Example: **maximum sum of a subarray of size k.** Compute the first window sum, then slide: add the new element and subtract the one that left.

\`\`\`java
int sum = 0;
for (int i = 0; i < k; i++) sum += a[i];
int best = sum;
for (int i = k; i < a.length; i++) {
    sum += a[i] - a[i - k];
    best = Math.max(best, sum);
}
\`\`\`

A variable-size window is used for "longest substring without repeating characters".` },
{ lvl: 'basic', tags: ['array'], q: 'How do you rotate an array by k positions?', a: `Use the **three reversals** trick, O(n) time and O(1) space. To rotate right by k:

1. Reverse the whole array.
2. Reverse the first k elements.
3. Reverse the remaining n - k elements.

Example: [1,2,3,4,5,6,7], k = 3: whole reverse gives [7,6,5,4,3,2,1], reversing the first 3 gives [5,6,7,4,3,2,1], reversing the rest gives [5,6,7,1,2,3,4]. Do \`k = k % n\` first.` },
{ lvl: 'basic', tags: ['array'], q: 'How do you find the missing number in an array of 1 to n?', a: `The expected sum of 1..n is \`n(n+1)/2\`. Subtract the actual sum of the array to get the missing number. O(n) time, O(1) space.

\`\`\`java
int n = a.length + 1;
int expected = n * (n + 1) / 2;
int actual = 0;
for (int x : a) actual += x;
return expected - actual;
\`\`\`

For large n use \`long\` to avoid overflow, or use XOR of all numbers 1..n with all array elements (the XOR of equal numbers cancels).` },
{ lvl: 'medium', tags: ['array'], q: 'How do you move all zeros of an array to the end keeping the order of other elements?', a: `Use a write pointer. Copy every non-zero value to \`a[w++]\`, then fill the rest with zeros. O(n) time, O(1) space.

\`\`\`java
int w = 0;
for (int x : a) if (x != 0) a[w++] = x;
while (w < a.length) a[w++] = 0;
\`\`\`

Example: [0, 1, 0, 3, 12] becomes [1, 3, 12, 0, 0].` },
{ lvl: 'medium', tags: ['trie', 'tree'], q: 'What is a trie and where is it used?', a: `A trie (prefix tree) stores strings character by character. Each node has up to 26 children (for lowercase letters) and a flag that marks the end of a word. Insert and search take **O(L)** where L is the word length, independent of how many words are stored.

Uses: autocomplete, spell checkers, dictionary prefix search, IP routing tables.` },
{ lvl: 'medium', tags: ['complexity'], q: 'What is the time complexity of common operations on array, ArrayList, linked list, HashMap and TreeMap?', a: `| Structure | Access | Search | Insert | Delete |
| --- | --- | --- | --- | --- |
| Array | O(1) | O(n) | O(n) | O(n) |
| ArrayList | O(1) | O(n) | O(1) amortised at end, O(n) in middle | O(n) |
| LinkedList | O(n) | O(n) | O(1) at ends | O(1) at known node |
| HashMap | not by index | O(1) avg | O(1) avg | O(1) avg |
| TreeMap | not by index | O(log n) | O(log n) | O(log n) |
| Stack / Queue | peek O(1) | O(n) | O(1) | O(1) |

HashMap gives no ordering, TreeMap keeps keys sorted, LinkedHashMap keeps insertion order.` },
{ lvl: 'medium', tags: ['sorting'], q: 'What is the difference between in-place and stable sorting? Which sorts are both?', a: `- **In-place:** uses only O(1) extra memory (apart from the recursion stack). Bubble, selection, insertion and heap sort are in place. Merge sort is not.
- **Stable:** equal keys keep their original order. Bubble, insertion and merge sort are stable. Selection, quick and heap sort are not (in their usual form).

**Insertion sort and bubble sort are both stable and in place.** Stability matters when you sort by one field after another (for example sort students by marks and keep the earlier name order for ties).` },
{ lvl: 'medium', hot: true, tags: ['array', 'string'], q: 'Find the longest substring without repeating characters.', a: `Use a sliding window and a map of last seen positions. Move \`left\` past the previous occurrence whenever a repeat appears.

\`\`\`java
int[] last = new int[256];
Arrays.fill(last, -1);
int best = 0, left = 0;
for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    if (last[c] >= left) left = last[c] + 1;
    last[c] = right;
    best = Math.max(best, right - left + 1);
}
\`\`\`

"abcabcbb" gives 3 ("abc"). Time O(n), space O(1).` },
{ lvl: 'basic', tags: ['basics'], q: 'What is the difference between a stack overflow and a memory leak? What is the difference between stack and heap memory?', a: `**Stack memory** holds method calls, local variables and references. It is small, fast and cleaned automatically when a method returns. Too-deep recursion fills it and causes a **stack overflow**.

**Heap memory** holds objects created with \`new\`. It is large and managed by the garbage collector in Java (by the programmer with malloc/free in C). Objects that are no longer needed but still referenced are never freed: that is a **memory leak**.` },
{ lvl: 'medium', tags: ['graph'], q: 'How do you detect a cycle in a directed graph and what is topological sorting?', a: `**Cycle in a directed graph:** run DFS and track the vertices on the current recursion path. If DFS reaches a vertex that is already on the current path, there is a cycle.

**Topological sort** gives a linear order of vertices such that for every edge u -> v, u comes before v. It exists only for a **DAG** (directed acyclic graph). Two ways: DFS (push a vertex after all its neighbours are done, then reverse), or Kahn's algorithm using in-degrees and a queue. Use: build order of tasks, course prerequisites.` },
{ lvl: 'basic', tags: ['basics'], q: 'What is an algorithm? What are the properties of a good algorithm?', a: `An algorithm is a **finite, ordered set of well-defined steps** that solves a problem.

A good algorithm is: **correct** (right output for every valid input), **finite** (it terminates), **unambiguous** (each step is clear), **efficient** (low time and space), and **general** (works for the whole class of inputs, not one example).` },
{ lvl: 'medium', tags: ['technique'], q: 'What is the two-pointer technique? When does it work?', a: `Two indexes move over an array or string, often from opposite ends or at different speeds. It works well on **sorted** data or when you compare pairs.

- Pair with a given sum in a sorted array.
- Remove duplicates from a sorted array in place.
- Reverse an array, check a palindrome.
- Fast/slow pointers on a linked list (middle, cycle).

It cuts O(n²) pair checks to O(n).` },
{ lvl: 'basic', tags: ['basics'], q: 'What is the difference between linear and non-linear data structures?', a: `In a **linear** structure the elements form a sequence and each element has one previous and one next element (array, linked list, stack, queue). In a **non-linear** structure an element can be connected to many others (tree, graph), so traversal is not a single straight line. Linear ones are simpler to implement, non-linear ones model hierarchies and networks.` },
] });
