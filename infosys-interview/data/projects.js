IV.addModule({ id: 'projects', group: 'hr', title: 'Project-based questions', blurb: 'How to explain your project, the questions interviewers ask about it, model answers for common student projects, and what to say about internships and certifications.', qa: [
{ lvl: 'basic', hot: true, tags: ['explain'], q: 'Explain your project. How do you present it in two minutes?', a: `Interviewers use your project to test whether the work is **really yours**. Use this order:

1. **Name and problem:** what problem does it solve, and for whom?
2. **Your solution:** one or two sentences.
3. **Tech stack:** language, framework, database, tools.
4. **Architecture / flow:** how the pieces connect.
5. **Your role:** exactly what **you** built (modules, APIs, tables).
6. **Challenge and result:** one hard problem you solved, and the outcome.

**Template:** "My project is an *Online Bus Ticket Booking System*. Many small operators still book by phone, causing double bookings. I built a web app where users search routes, pick seats and pay, and admins manage buses. It is a Spring Boot REST backend with MySQL and a React frontend. I was responsible for the database design, the booking and seat-locking APIs, and JWT login. The hardest part was preventing two users from booking the same seat at the same time, which I solved using a database transaction with a row lock. It handled our test load of 100 concurrent users without a double booking."` },
{ lvl: 'basic', hot: true, tags: ['explain'], q: 'What is your role in the project? What did you personally do?', a: `Be **specific**. Say "I" for your parts and "we" for team parts. List modules, APIs, tables, screens, tests, deployment, and documentation you owned. Prepare to open that code in your head: the interviewer may pick **any** class or query you mention and ask you to explain it line by line. If it is a team project, also know the **overall flow** and how your part connects.` },
{ lvl: 'basic', hot: true, tags: ['depth'], q: 'Why did you choose this technology stack? What are the alternatives?', a: `Give a **reason tied to the project**, and name at least one alternative with a trade-off.

"I used MySQL because the data is relational (users, buses, bookings) and needs ACID transactions for payments and seats. MongoDB was an option, but joins and transactions fit a relational model better. I used Spring Boot because it is the standard for Java REST services and gives security and data modules out of the box; Node.js would also have worked, but I was more comfortable with Java."

"Because my friend suggested it" is a weak answer.` },
{ lvl: 'medium', hot: true, tags: ['depth'], q: 'What challenges did you face in the project and how did you solve them?', a: `Prepare **two real stories** in STAR form. Good examples: a bug that took days (explain how you debugged: logs, breakpoints, reproducing), slow queries fixed with an **index**, a **CORS** error between frontend and backend, concurrency problems, a merge conflict, integrating a third-party API, deployment failures, unclear requirements.

Show the **method**: reproduce -> isolate -> hypothesise -> fix -> verify -> prevent.` },
{ lvl: 'medium', hot: true, tags: ['depth'], q: 'Explain the architecture and data flow of your project. Draw the ER diagram.', a: `Be ready to sketch on paper:
- **Architecture:** Browser / mobile -> (HTTPS) -> API layer -> service layer -> repository -> database. Mention external services (payment, email, maps).
- **Flow of one request**, for example "book a ticket": validate input -> check seat availability -> lock seat -> create booking -> call payment -> confirm -> send email.
- **ER diagram:** entities (User, Bus, Route, Booking, Payment), attributes, primary and foreign keys, relationships (one user has many bookings; one bus has many seats). Mention **normalisation** and why you chose the keys.` },
{ lvl: 'medium', hot: true, tags: ['depth'], q: 'How did you test your project? How did you handle errors and security?', a: `- **Testing:** unit tests (JUnit or PyTest) for business logic, API tests with Postman, manual test cases with edge values (boundary values, empty input, invalid input), and a short UAT with friends.
- **Error handling:** input validation, a global exception handler returning proper status codes (400, 404, 500) and friendly messages, logging.
- **Security:** hashed passwords (bcrypt), **prepared statements** against SQL injection, authentication with JWT or sessions, role-based access (admin vs user), HTTPS, no secrets in code (environment variables).

If you did not do something, say what you would add next. That is honest and shows awareness.` },
{ lvl: 'medium', tags: ['depth'], q: 'How would you improve or scale your project? What would you do differently?', a: `Good answers: add **caching** (Redis), database **indexes**, pagination, a **message queue** for emails and notifications, containerise with **Docker**, set up a **CI/CD** pipeline, add monitoring and logging, write more automated tests, split heavy modules into **microservices**, add **rate limiting**, and improve the UI for mobile. Then mention one thing you would do differently in the first version (for example designing the database schema more carefully before coding).` },
{ lvl: 'medium', tags: ['depth'], q: 'Did you use Git/GitHub? How did your team work together?', a: `Describe your real workflow: a shared repository, **branches per feature**, commits with clear messages, **pull requests** and code review, resolving a merge conflict, and tracking work on a simple board (Trello, Jira) with weekly or daily syncs. Even in a college project, this shows you know industry practice. Keep your GitHub profile tidy, with a README (what it is, setup, screenshots) because interviewers may open it.` },
{ lvl: 'medium', tags: ['depth'], q: 'The interviewer says: "This looks like a common project from the internet. How is it yours?"', a: `Stay calm and confident; this is a **depth check**. Do not get defensive. Explain what was **your own** contribution or customisation (the features you added, problems you solved, design decisions), then **demonstrate understanding** by walking through a flow and the code you wrote. Be honest about any tutorial or template you used as a base: "I started from a tutorial for the login part, then built the booking logic myself." Honesty plus depth wins; bluffing does not.` },
{ lvl: 'basic', hot: true, tags: ['sample'], q: 'Sample project: Library / Student / Employee Management System. What questions will come?', a: `**Summary:** CRUD application for books/students/employees with login, search and reports (Java + JDBC or Spring Boot + MySQL).

**Likely questions and short answers**
- **Which tables?** \`Book(book_id PK, title, author, available)\`, \`Member(member_id PK, name, email)\`, \`Issue(issue_id PK, book_id FK, member_id FK, issue_date, return_date)\`.
- **How do you stop issuing an unavailable book?** Check \`available > 0\` and update the count in one **transaction**.
- **How is the fine calculated?** \`fine = max(0, daysLate) * rate\`; computed from \`return_date\` and due date.
- **Which OOP concepts?** Classes for Book and Member (encapsulation), an abstract \`User\` with \`Student\` and \`Librarian\` subclasses (inheritance, polymorphism).
- **How did you connect to the database?** JDBC: load driver, get a \`Connection\`, use a \`PreparedStatement\`, process the \`ResultSet\`, close resources (try-with-resources).
- **How did you prevent SQL injection?** Prepared statements with placeholders.
- **How would you search a book by title?** \`WHERE title LIKE ?\` with an index (or full-text search for large data).` },
{ lvl: 'basic', hot: true, tags: ['sample'], q: 'Sample project: E-commerce / online shopping website. What questions will come?', a: `**Summary:** users browse products, add to cart, place an order and pay; admin manages products and orders.

- **Entities:** User, Product, Category, Cart, Order, OrderItem, Payment, Address.
- **Why a separate OrderItem table?** An order has many products: a **many-to-many** relation resolved with a junction table that also stores quantity and the **price at purchase time** (prices may change later).
- **How does the cart work?** Stored in the database per user (or in session/local storage for guests).
- **Order placement flow:** validate stock -> create order in a **transaction** -> reduce stock -> payment -> confirmation email. If payment fails, roll back.
- **Payment:** through a gateway such as Razorpay or Stripe in test mode; never store card numbers.
- **Searching and filtering:** SQL with \`LIKE\`, category and price filters, **pagination** and indexes.
- **Security:** hashed passwords, JWT, role-based access to admin pages.
- **Scaling:** cache product pages, CDN for images, queue for emails.` },
{ lvl: 'basic', hot: true, tags: ['sample'], q: 'Sample project: Chat application or real-time system. What questions will come?', a: `**Summary:** users send messages in real time (WebSockets with Node.js/Socket.io or Spring Boot).

- **Why WebSockets and not normal HTTP?** HTTP is request-response, so the server cannot push; WebSocket keeps a **persistent, two-way** connection, so messages arrive instantly. (Alternatives: long polling, server-sent events.)
- **How are messages stored?** A \`messages\` table (sender, receiver or room, text, timestamp) or a NoSQL store; **index by room and timestamp** for fast history.
- **How do you handle many users?** Multiple server instances behind a load balancer need a pub/sub layer (Redis) to broadcast between them.
- **Online status?** Heartbeat messages, with last-seen stored.
- **Security:** authenticate the socket connection with a token; escape message text to prevent XSS.` },
{ lvl: 'basic', hot: true, tags: ['sample'], q: 'Sample project: Machine learning / data science project (for example, prediction or recommendation). What questions will come?', a: `**Summary:** train a model on a dataset (house prices, loan approval, movie recommendation, spam detection, sentiment analysis).

- **Dataset:** source, size, features, target column, how you handled **missing values**, outliers and encoding categorical data, and scaling.
- **Algorithm choice:** why logistic regression or random forest? What else did you try, and how did the results compare?
- **Evaluation:** train/test split, **accuracy, precision, recall, F1**, confusion matrix; why accuracy alone is misleading on **imbalanced data**.
- **Overfitting:** how you checked it (train vs test score, cross-validation) and fixed it.
- **Deployment:** wrapping the model in a Flask or FastAPI service and calling it from a web page.
- **Libraries:** Pandas, NumPy, scikit-learn, Matplotlib.

Be prepared to **explain the algorithm in simple words** and the data pipeline from raw data to prediction.` },
{ lvl: 'basic', tags: ['sample'], q: 'Sample project: Banking / ATM / Hospital / Hotel / Attendance management system. What questions will come?', a: `These are CRUD plus rules projects.

- **Core entities and relationships** (customer, account, transaction; patient, doctor, appointment; room, booking, guest). Know the primary and foreign keys.
- **Business rules:** minimum balance, insufficient funds, no double booking of a doctor or room slot, attendance percentage rules. Explain how code enforces them.
- **Transactions and ACID:** money transfer = debit + credit in one transaction; both succeed or both roll back.
- **OOP:** class design (Account -> Savings, Current), custom exceptions like \`InsufficientFundsException\`.
- **Concurrency:** two withdrawals at the same time (locking or optimistic version check).
- **Security and audit:** hashed PINs or passwords, transaction logs.` },
{ lvl: 'basic', tags: ['sample'], q: 'Sample project: Weather app, expense tracker, to-do app or portfolio website. What questions will come?', a: `Small projects are fine if you **understand them deeply**.

- **Weather app:** calling a third-party **REST API** (OpenWeatherMap), parsing JSON, handling errors and invalid city names, API key safety (do not commit it).
- **Expense tracker:** data model (expense: amount, category, date), totals and charts using \`GROUP BY\`, storage (localStorage or database).
- **To-do app:** CRUD, state management, filters, persistence.
- **Portfolio:** responsive layout (flexbox/grid, media queries), accessibility, hosting (GitHub Pages).

Questions focus on *how it works* and *what you would add* (login, notifications, deployment).` },
{ lvl: 'medium', tags: ['internship'], q: 'Questions about your internship, training or certifications.', a: `- **Internship:** company, duration, team, **tools used**, your tasks, one concrete result ("fixed 15 UI bugs", "wrote 30 test cases", "automated a report"), what you learned about working in a team, and how you received feedback.
- **Certifications and courses (NPTEL, Coursera, AWS, Infosys Springboard):** be ready to answer **basic questions on the topic**, because an interviewer may check that you really learned it.
- **Hackathons, competitions, open source, coding platforms (LeetCode, HackerRank, CodeChef):** mention ranks and counts honestly and be ready to solve a problem from the platform on the spot.
- **Do not list** a skill or tool on your resume that you cannot explain.` },
{ lvl: 'medium', hot: true, tags: ['resume'], q: 'How should you prepare your resume for an Infosys interview?', a: `- **One page**, clean, with sections: summary, education, skills, projects, internships, certifications, achievements.
- Put **only skills you can discuss.** If you list Java, SQL and Python, expect questions on all three.
- For each project: name, tech stack, a one-line problem statement and 2 or 3 bullets of **what you did and the result**.
- Match **names, dates and marks** with your documents.
- Keep a **GitHub** link with a README for projects.
- Have a **printed copy** (or two) and a PDF.
- **Practise explaining every line** of your resume. The interview usually starts from it.` },
{ lvl: 'adv', tags: ['depth'], q: 'Project deep-dive: a bug appears only in production and not on your machine. How do you debug it?', a: `1. **Reproduce** it: gather the exact steps, data and environment (OS, version, configuration, data volume).
2. **Read logs and metrics** from the time of the failure; compare them with a working case.
3. **List differences** between environments: configuration, library versions, database content, time zone, permissions, network.
4. Form a **hypothesis** and test it safely (staging, feature flag, extra logging), never experimenting blindly on production.
5. **Fix**, add a regression test, deploy, and watch.
6. **Prevent**: closer parity between environments, better logging, alerts. Write a short root-cause note.` },
{ lvl: 'adv', tags: ['depth'], q: 'Project deep-dive: how would you make your application handle 10 times more users?', a: `**Measure first** (find the bottleneck with profiling and load tests; do not guess). Then, typically:
- **Database:** add indexes, optimise queries, fix N+1, add **read replicas**, and cache hot reads.
- **Application:** make it **stateless** and add more instances behind a **load balancer**; use connection pools.
- **Caching:** Redis for sessions and frequent data; CDN for static files.
- **Async work:** move slow tasks (email, reports) to a **queue** and workers.
- **Protect:** rate limiting, timeouts, circuit breakers.
- **Observe:** monitoring and alerts to confirm the improvement.` },
{ lvl: 'medium', tags: ['depth'], q: 'What is the difference between a project and a product? What did you learn from your project beyond coding?', a: `A **project** is a time-bound effort with a defined goal; a **product** lives on, evolving with users, with long-term support and versions.

Beyond coding, talk about: requirement analysis, planning and estimation, teamwork and communication, version control, testing, documentation, handling feedback and meeting a deadline. This shows you understand that software work is **more than writing code**, which is exactly what a Systems Engineer role involves.` },
] });
