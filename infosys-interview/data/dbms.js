IV.addModule({ id: 'dbms', group: 'tech', title: 'DBMS and SQL', blurb: 'Keys, ER model, normalization, ACID, transactions, indexes, joins, SQL commands and commonly asked database concepts. Practise queries in the SQL section.', qa: [
{ lvl: 'basic', hot: true, tags: ['basics'], q: 'What is a DBMS? What is the difference between DBMS and RDBMS?', a: `A **DBMS (Database Management System)** is software that stores, organises, retrieves and protects data, and lets many users share it safely (examples: MySQL, Oracle, MongoDB). The data itself is the **database**.

An **RDBMS** stores data in **tables (relations)** of rows and columns and links them with keys. It follows the relational model and supports SQL, constraints and ACID transactions.

| | DBMS | RDBMS |
| --- | --- | --- |
| Storage | Files, hierarchical, navigational | Tables with rows and columns |
| Relationships | Usually none | Foreign keys |
| Normalization | Not supported | Supported |
| Data integrity | Limited | Strong constraints |
| Examples | File-based systems, XML store | MySQL, Oracle, PostgreSQL, SQL Server |` },
{ lvl: 'basic', hot: true, tags: ['basics'], q: 'What are the advantages of a database over a file system?', a: `- **Less redundancy and inconsistency:** data is stored once.
- **Easy and fast querying** using SQL, with indexes.
- **Data integrity** through constraints.
- **Security:** users get different access rights.
- **Concurrent access** by many users with transactions.
- **Backup and recovery** after failures.
- **Data independence:** programs do not change when the storage layout changes.` },
{ lvl: 'basic', hot: true, tags: ['keys'], q: 'Explain the different keys in DBMS: primary, candidate, super, foreign, unique, composite.', a: `- **Super key:** any set of columns that uniquely identifies a row (can contain extra columns).
- **Candidate key:** a **minimal** super key (no column can be removed). A table can have several.
- **Primary key:** the candidate key chosen to identify rows. Unique and **NOT NULL**, only one per table.
- **Alternate key:** candidate keys that were not chosen as primary.
- **Unique key:** values must be unique, but **NULL is allowed** (the number of NULLs depends on the database), and a table can have many.
- **Foreign key:** a column that refers to the primary key of another table and enforces **referential integrity**.
- **Composite key:** a key made of two or more columns (for example \`(student_id, course_id)\`).` },
{ lvl: 'basic', hot: true, tags: ['keys'], q: 'Primary key vs unique key vs foreign key.', a: `| | Primary key | Unique key | Foreign key |
| --- | --- | --- | --- |
| Purpose | Identify each row | Prevent duplicates | Link two tables |
| NULL | Not allowed | Allowed | Allowed |
| Count per table | One | Many | Many |
| Duplicates | No | No | Yes (many rows can point to the same parent) |
| Index | Clustered by default in many databases | Non-clustered | Not automatic |` },
{ lvl: 'basic', tags: ['constraints'], q: 'What are constraints in SQL?', a: `Constraints are rules on columns that keep the data valid.

- \`NOT NULL\`: the column cannot be empty.
- \`UNIQUE\`: no duplicate values.
- \`PRIMARY KEY\`: NOT NULL + UNIQUE, identifies the row.
- \`FOREIGN KEY\`: value must exist in the referenced table.
- \`CHECK\`: value must satisfy a condition (\`CHECK (age >= 18)\`).
- \`DEFAULT\`: value used when none is given.

\`\`\`sql
CREATE TABLE employee (
  id     INT PRIMARY KEY,
  name   VARCHAR(50) NOT NULL,
  salary DECIMAL(10,2) CHECK (salary > 0),
  dept   INT REFERENCES department(id)
);
\`\`\`` },
{ lvl: 'basic', hot: true, tags: ['sql'], q: 'What are DDL, DML, DCL and TCL commands?', a: `| Type | Full form | Commands | Purpose |
| --- | --- | --- | --- |
| DDL | Data Definition Language | CREATE, ALTER, DROP, TRUNCATE, RENAME | Define or change structure |
| DML | Data Manipulation Language | INSERT, UPDATE, DELETE, (SELECT) | Change or read data |
| DCL | Data Control Language | GRANT, REVOKE | Permissions |
| TCL | Transaction Control Language | COMMIT, ROLLBACK, SAVEPOINT | Control transactions |

Many books put \`SELECT\` under DQL (Data Query Language).` },
{ lvl: 'basic', hot: true, tags: ['sql'], q: 'DELETE vs TRUNCATE vs DROP.', a: `| | DELETE | TRUNCATE | DROP |
| --- | --- | --- | --- |
| Type | DML | DDL | DDL |
| Removes | Selected rows (with WHERE) or all rows | All rows | The whole table (structure and data) |
| WHERE clause | Yes | No | No |
| Rollback | Yes (inside a transaction) | Usually no (database dependent) | No |
| Speed | Slower (logs every row) | Fast | Fast |
| Resets identity counter | No | Yes | Not applicable |
| Triggers | Fire | Do not fire | Do not fire |` },
{ lvl: 'basic', hot: true, tags: ['sql'], q: 'What is the difference between WHERE and HAVING?', a: `\`WHERE\` filters **rows before grouping** and cannot use aggregate functions. \`HAVING\` filters **groups after \`GROUP BY\``  + `** and can use aggregates.

\`\`\`sql
SELECT dept, AVG(salary) AS avg_sal
FROM employee
WHERE status = 'ACTIVE'      -- rows filtered first
GROUP BY dept
HAVING AVG(salary) > 50000;  -- then groups filtered
\`\`\`

Order of execution: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT.` },
{ lvl: 'basic', hot: true, tags: ['sql', 'joins'], q: 'Explain the types of SQL joins.', a: `A join combines rows from two tables on a related column.

- **INNER JOIN:** only rows that match in **both** tables.
- **LEFT (OUTER) JOIN:** all rows of the left table, plus matches from the right (NULL where none).
- **RIGHT (OUTER) JOIN:** all rows of the right table, plus matches from the left.
- **FULL (OUTER) JOIN:** all rows from both tables, NULL where there is no match.
- **CROSS JOIN:** every row of one table with every row of the other (Cartesian product, m x n rows).
- **SELF JOIN:** a table joined with itself (for example employee and their manager, both in the same table).

\`\`\`sql
SELECT e.name, d.dept_name
FROM employee e
LEFT JOIN department d ON e.dept_id = d.id;
\`\`\`` },
{ lvl: 'basic', tags: ['sql'], q: 'UNION vs UNION ALL. What is the difference between IN and EXISTS?', a: `**UNION** combines the results of two SELECTs and **removes duplicates** (so it sorts or hashes). **UNION ALL** keeps all rows including duplicates and is faster. Both queries need the same number of columns with compatible types.

**IN** compares a value with a list or subquery result. **EXISTS** only checks whether the subquery returns **any row** and stops at the first match, so it is usually faster for large subqueries and handles NULLs more safely than \`NOT IN\`.` },
{ lvl: 'basic', hot: true, tags: ['sql'], q: 'What is GROUP BY? Which aggregate functions do you know?', a: `\`GROUP BY\` groups rows that have the same value in the given columns so that aggregate functions can run on each group.

Aggregates: \`COUNT()\`, \`SUM()\`, \`AVG()\`, \`MIN()\`, \`MAX()\`. \`COUNT(*)\` counts all rows, \`COUNT(col)\` ignores NULLs, \`COUNT(DISTINCT col)\` counts distinct values.

\`\`\`sql
SELECT dept_id, COUNT(*) AS employees, MAX(salary) AS top_salary
FROM employee
GROUP BY dept_id;
\`\`\`

Every column in the SELECT list that is not inside an aggregate must appear in the GROUP BY.` },
{ lvl: 'basic', tags: ['sql'], q: 'How does NULL work in SQL? How do you check for NULL?', a: `NULL means **unknown or missing**, not zero and not an empty string. Any comparison with NULL (\`= NULL\`, \`> NULL\`) gives *unknown*, so the row is not returned. Use \`IS NULL\` and \`IS NOT NULL\`.

Aggregates such as SUM and AVG **ignore NULLs**. \`COALESCE(col, 0)\` or \`IFNULL\` replaces NULL with a default. \`NULL = NULL\` is not true.` },
{ lvl: 'basic', hot: true, tags: ['normalization'], q: 'What is normalization? Why do we do it?', a: `Normalization is the process of **organising tables to reduce redundancy and avoid anomalies** (insert, update and delete problems) by splitting large tables into smaller related ones and linking them with keys.

Example anomalies in one big table \`(student, course, teacher_phone)\`: if a teacher's phone changes you must update many rows (**update anomaly**); you cannot store a new teacher until a student enrols (**insert anomaly**); deleting the last student of a course also deletes the teacher's data (**delete anomaly**).` },
{ lvl: 'medium', hot: true, tags: ['normalization'], q: 'Explain 1NF, 2NF, 3NF and BCNF with an example.', a: `- **1NF:** every cell holds a single (atomic) value, no repeating groups. A column "phones = 98x, 99y" violates it.
- **2NF:** in 1NF and **no partial dependency**: a non-key column must depend on the **whole** composite key, not just part of it.
- **3NF:** in 2NF and **no transitive dependency**: a non-key column must not depend on another non-key column.
- **BCNF:** for every functional dependency X -> Y, X must be a super key. A stricter 3NF.

Example: \`Order(order_id, product_id, product_name, qty)\` with key \`(order_id, product_id)\`. \`product_name\` depends only on \`product_id\`, a partial dependency, so move it to a \`Product(product_id, product_name)\` table (2NF). \`Employee(emp_id, dept_id, dept_name)\`: \`dept_name\` depends on \`dept_id\`, not on \`emp_id\` directly (transitive), so move it to a Department table (3NF).` },
{ lvl: 'medium', tags: ['normalization'], q: 'What is denormalization? When is it useful?', a: `Denormalization deliberately **adds redundancy** (storing a value in more than one place, or pre-joining tables) to make **reads faster** by avoiding costly joins. It is common in reporting and data warehouses and in read-heavy systems. The cost is more storage and the risk of inconsistent copies that you must keep in sync.` },
{ lvl: 'basic', hot: true, tags: ['transactions'], q: 'What are ACID properties? Explain with a bank transfer.', a: `A transaction is a group of operations treated as one unit. ACID guarantees its reliability.

- **Atomicity:** all or nothing. If debiting A succeeds but crediting B fails, the whole transfer is rolled back.
- **Consistency:** the database moves from one valid state to another; rules and constraints hold (total money stays the same).
- **Isolation:** concurrent transactions do not interfere; each behaves as if it ran alone.
- **Durability:** once committed, the change survives crashes (it is written to disk/log).` },
{ lvl: 'medium', hot: true, tags: ['transactions'], q: 'What are the isolation levels and the concurrency problems they prevent?', a: `Problems when transactions run together:
- **Dirty read:** reading data another transaction has not committed.
- **Non-repeatable read:** reading the same row twice and getting different values because another transaction updated it.
- **Phantom read:** running the same query twice and getting different **rows** because another transaction inserted or deleted some.

| Isolation level | Dirty read | Non-repeatable | Phantom |
| --- | --- | --- | --- |
| Read Uncommitted | Possible | Possible | Possible |
| Read Committed | Prevented | Possible | Possible |
| Repeatable Read | Prevented | Prevented | Possible |
| Serializable | Prevented | Prevented | Prevented |

Higher isolation gives more correctness but lower concurrency.` },
{ lvl: 'medium', tags: ['transactions'], q: 'What is COMMIT, ROLLBACK and SAVEPOINT? What is a deadlock in a database?', a: `- **COMMIT** makes all changes of the transaction permanent.
- **ROLLBACK** undoes all changes since the last commit.
- **SAVEPOINT** marks a point inside a transaction so you can roll back to it without cancelling everything.

A **database deadlock** occurs when transaction T1 holds a lock on row A and waits for row B, while T2 holds B and waits for A. The DBMS detects the cycle and aborts one transaction (the victim) so the other can continue. Applications should retry the failed transaction.` },
{ lvl: 'basic', hot: true, tags: ['index'], q: 'What is an index? What are its advantages and disadvantages?', a: `An index is a **separate data structure (usually a B-tree)** on one or more columns that lets the database find rows without scanning the whole table, like the index of a book.

**Advantages:** much faster \`SELECT\` with \`WHERE\`, \`JOIN\` and \`ORDER BY\` on the indexed column.
**Disadvantages:** takes extra storage and **slows down INSERT, UPDATE and DELETE** because the index must be updated too. Do not index every column, index the ones you search, join and sort on.

\`\`\`sql
CREATE INDEX idx_emp_dept ON employee(dept_id);
\`\`\`` },
{ lvl: 'medium', tags: ['index'], q: 'Clustered vs non-clustered index.', a: `A **clustered index** decides the **physical order of the rows** in the table, so there can be only **one** per table (often the primary key). Range searches on it are very fast.

A **non-clustered index** is a separate structure that stores the key values with **pointers** to the rows. A table can have many. A lookup may need an extra step to fetch the row.` },
{ lvl: 'basic', hot: true, tags: ['er'], q: 'What is an ER diagram? Explain entity, attribute and relationship.', a: `An **Entity-Relationship (ER) diagram** is a picture of the data of a system before you create tables.

- **Entity:** a real-world thing with data (Student, Course). Drawn as a rectangle. A **weak entity** cannot be identified without another entity.
- **Attribute:** a property of an entity (name, roll no). Drawn as an oval. Types: simple, composite (full name), multivalued (phone numbers), derived (age from date of birth), key attribute.
- **Relationship:** how entities are associated (Student *enrols in* Course). Drawn as a diamond.

**Cardinality:** one-to-one, one-to-many, many-to-many. A many-to-many relationship becomes a **separate junction table** with foreign keys to both sides.` },
{ lvl: 'basic', tags: ['basics'], q: 'What is a view? What is a stored procedure, a function and a trigger?', a: `- **View:** a saved SELECT query shown as a virtual table. It hides complexity and restricts columns visible to users. It stores no data of its own (a materialised view does).
- **Stored procedure:** a named block of SQL code stored in the database that you call with parameters. It can perform actions (insert, update) and return nothing or several results.
- **Function:** like a procedure but must **return a value** and can be used inside a SELECT.
- **Trigger:** code that runs **automatically** when an INSERT, UPDATE or DELETE happens on a table (audit logging, validation).` },
{ lvl: 'medium', tags: ['sql'], q: 'What is a subquery? Correlated vs non-correlated subquery.', a: `A subquery is a query inside another query.

A **non-correlated** subquery runs once, independent of the outer query:
\`\`\`sql
SELECT name FROM employee
WHERE salary > (SELECT AVG(salary) FROM employee);
\`\`\`

A **correlated** subquery refers to a column of the outer query, so it runs **once for each outer row**:
\`\`\`sql
SELECT e.name FROM employee e
WHERE e.salary > (SELECT AVG(salary) FROM employee WHERE dept_id = e.dept_id);
\`\`\`
Correlated subqueries can be slow; a join or window function is often faster.` },
{ lvl: 'medium', hot: true, tags: ['sql'], q: 'How do you find the second highest salary?', a: `Several ways. Two common ones:

\`\`\`sql
-- 1. Subquery with MAX
SELECT MAX(salary) FROM employee
WHERE salary < (SELECT MAX(salary) FROM employee);

-- 2. LIMIT / OFFSET on distinct salaries
SELECT DISTINCT salary FROM employee
ORDER BY salary DESC LIMIT 1 OFFSET 1;
\`\`\`

For the Nth highest, use \`DENSE_RANK() OVER (ORDER BY salary DESC)\` and keep rank N. Use DISTINCT or DENSE_RANK so that ties are handled correctly. Try these on the SQL practice page.` },
{ lvl: 'medium', tags: ['sql'], q: 'What are window functions? RANK vs DENSE_RANK vs ROW_NUMBER.', a: `A window function calculates a value **across a set of related rows without collapsing them** into one row like GROUP BY does. Syntax: \`function() OVER (PARTITION BY col ORDER BY col)\`.

For salaries 90, 80, 80, 70:

| Function | Result |
| --- | --- |
| ROW_NUMBER | 1, 2, 3, 4 (always unique) |
| RANK | 1, 2, 2, 4 (ties get the same rank, then a gap) |
| DENSE_RANK | 1, 2, 2, 3 (ties share, no gap) |` },
{ lvl: 'basic', tags: ['sql'], q: 'CHAR vs VARCHAR. What is the difference between LIKE patterns % and _?', a: `**CHAR(n)** is fixed length (padded with spaces), good for values of constant length like country codes. **VARCHAR(n)** is variable length, saves space for names and addresses.

In \`LIKE\`, \`%\` matches **any number** of characters (including none) and \`_\` matches **exactly one** character. \`name LIKE 'A%'\` finds names starting with A, \`name LIKE '_a%'\` finds names whose second letter is a.` },
{ lvl: 'medium', tags: ['sql'], q: 'How do you remove duplicate rows from a table?', a: `First find duplicates:
\`\`\`sql
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;
\`\`\`

Delete duplicates but keep one row (keeping the smallest id):
\`\`\`sql
DELETE FROM users
WHERE id NOT IN (SELECT MIN(id) FROM users GROUP BY email);
\`\`\`
(In MySQL wrap the subquery in another derived table.) Or use \`ROW_NUMBER() OVER (PARTITION BY email ORDER BY id)\` and delete rows with number greater than 1. To prevent future duplicates add a UNIQUE constraint.` },
{ lvl: 'medium', tags: ['basics'], q: 'What is a functional dependency? What is a candidate key in terms of dependency?', a: `A functional dependency **X -> Y** means that if two rows have the same value of X, they must have the same value of Y (a student id determines the student name). A **candidate key** is a minimal set of attributes whose closure contains **all** attributes of the table. Functional dependencies are the basis of normalization.` },
{ lvl: 'basic', tags: ['sql'], q: 'What are the SQL aggregate vs scalar functions? Name some string and date functions.', a: `**Aggregate** functions work on a set of rows and return one value (SUM, AVG, COUNT, MIN, MAX). **Scalar** functions work on one value and return one value.

- String: \`UPPER, LOWER, LENGTH, SUBSTRING, CONCAT, TRIM, REPLACE\`.
- Number: \`ROUND, CEIL, FLOOR, ABS, MOD\`.
- Date: \`NOW(), CURRENT_DATE, DATEDIFF, DATE_ADD\` (names vary by database).` },
{ lvl: 'medium', hot: true, tags: ['nosql'], q: 'What is NoSQL? SQL vs NoSQL: when do you use each?', a: `NoSQL databases store data in forms other than relational tables: **document** (MongoDB), **key-value** (Redis), **column family** (Cassandra) and **graph** (Neo4j).

| | SQL (relational) | NoSQL |
| --- | --- | --- |
| Schema | Fixed | Flexible |
| Scaling | Mostly vertical | Mostly horizontal |
| Transactions | Strong ACID | Often eventual consistency (BASE) |
| Best for | Structured data, complex joins, banking | Huge volumes, changing structure, fast reads, caching |

The **CAP theorem** says a distributed system can fully provide only two of Consistency, Availability and Partition tolerance at the same time.` },
{ lvl: 'basic', tags: ['basics'], q: 'What is a schema? What is the difference between a database, schema and table?', a: `A **database** is the container of all data of an application. A **schema** is a logical grouping inside a database that holds tables, views and procedures (and defines the structure, the "blueprint"). A **table** is where rows of data are stored in columns. Rows are also called **tuples** or records, columns are **attributes** or fields.` },
{ lvl: 'medium', tags: ['sql'], q: 'What is referential integrity and what is ON DELETE CASCADE?', a: `Referential integrity means that **every foreign key value must match an existing primary key value** in the parent table (or be NULL). You cannot add an order for a customer that does not exist.

When a parent row is deleted, the foreign key option decides what happens to child rows: \`CASCADE\` deletes the child rows too, \`SET NULL\` sets the foreign key to NULL, \`RESTRICT\` / \`NO ACTION\` blocks the delete.` },
{ lvl: 'medium', tags: ['jdbc'], q: 'How does a Java program connect to a database? What is JDBC and PreparedStatement?', a: `**JDBC (Java Database Connectivity)** is the standard API to talk to a relational database. Steps: load the driver, get a \`Connection\`, create a \`Statement\` / \`PreparedStatement\`, execute the query, read the \`ResultSet\`, close the resources.

\`\`\`java
try (Connection con = DriverManager.getConnection(url, user, pwd);
     PreparedStatement ps = con.prepareStatement("SELECT name FROM employee WHERE id = ?")) {
    ps.setInt(1, 101);
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) System.out.println(rs.getString("name"));
    }
}
\`\`\`

A **PreparedStatement** is precompiled, faster for repeated queries and protects against **SQL injection** because parameters are never treated as SQL.` },
{ lvl: 'medium', hot: true, tags: ['security'], q: 'What is SQL injection and how do you prevent it?', a: `SQL injection is an attack where the user's input is concatenated into a query and changes its meaning. If you build \`"... WHERE name='" + input + "'"\` and the user types \`' OR '1'='1\`, the query returns every row.

Prevention: **use parameterised queries / PreparedStatement**, validate and whitelist input, give the database user the least privileges, never show raw database errors to users, and use an ORM correctly.` },
{ lvl: 'basic', tags: ['basics'], q: 'What is the difference between a table and a view? Between temporary table and CTE?', a: `A **table** stores data physically. A **view** is a stored query that shows data from tables when you use it. A **temporary table** is a real table that exists only for a session. A **CTE (Common Table Expression)** is a named result set defined with \`WITH\` that exists for **one query** and makes complex queries readable:

\`\`\`sql
WITH dept_avg AS (SELECT dept_id, AVG(salary) a FROM employee GROUP BY dept_id)
SELECT e.name FROM employee e JOIN dept_avg d ON e.dept_id = d.dept_id WHERE e.salary > d.a;
\`\`\`` },
{ lvl: 'medium', tags: ['basics'], q: 'What is the difference between a cursor and a set-based operation? What is ORM and Hibernate?', a: `A **cursor** processes the rows of a result set **one by one** (row-by-row), which is slow. SQL is designed for **set-based** operations that work on all rows at once, which is much faster. Use a cursor only when row-by-row logic is unavoidable.

**ORM (Object Relational Mapping)** maps tables to classes and rows to objects so that you work with objects instead of writing SQL. **Hibernate** is the popular ORM for Java and the base of JPA.` },
] });
