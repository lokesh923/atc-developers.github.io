IV.addModule({ id: 'modern', group: 'tech', title: 'Web, cloud and modern tech', blurb: 'HTML/CSS/JavaScript basics, REST APIs, Spring Boot, microservices, Docker, cloud, Linux commands, AI and ML basics and cybersecurity. Interviewers use these to test how current your knowledge is.', qa: [
{ lvl: 'basic', hot: true, tags: ['web'], q: 'How does a web application work, from typing a URL to seeing the page?', a: `1. The browser checks its cache, then asks **DNS** to turn the domain into an IP address.
2. It opens a **TCP connection** (and a **TLS handshake** for HTTPS) to the server.
3. It sends an **HTTP request** (\`GET /index.html\`).
4. The server (web server -> application server -> database) builds a response with a status code (200) and the HTML.
5. The browser parses the HTML, requests CSS, JavaScript and images, builds the DOM, and **renders** the page.

Frontend = what runs in the browser (HTML, CSS, JavaScript). Backend = server logic and database.` },
{ lvl: 'basic', hot: true, tags: ['web'], q: 'What are HTML, CSS and JavaScript used for? What is the DOM?', a: `- **HTML:** structure and content (headings, links, forms).
- **CSS:** presentation (colours, layout, responsive design).
- **JavaScript:** behaviour and interactivity.
- **DOM (Document Object Model):** a tree representation of the page that JavaScript can read and change.

CSS selectors: \`p\` (tag), \`.box\` (class), \`#nav\` (id). The **box model**: content + padding + border + margin. **Flexbox** and **Grid** are the modern layout systems. Semantic tags (\`header\`, \`nav\`, \`main\`, \`footer\`) improve accessibility and SEO.` },
{ lvl: 'medium', hot: true, tags: ['web'], q: 'JavaScript basics: var vs let vs const, == vs ===, closures, and the output of tricky snippets.', a: `| | var | let | const |
| --- | --- | --- | --- |
| Scope | Function | Block | Block |
| Reassign | Yes | Yes | No |
| Hoisting | Hoisted, value \`undefined\` | In temporal dead zone | In temporal dead zone |

- \`==\` converts types before comparing (\`"5" == 5\` is true); \`===\` checks type and value (**always prefer ===**).
- A **closure** is a function that remembers variables from the scope where it was created.
- \`typeof null\` is \`"object"\` (a historic quirk). \`0.1 + 0.2 !== 0.3\`. \`[] + []\` is an empty string.
- **Asynchronous JS:** callbacks, **Promises**, and \`async/await\` handle slow operations (network) without blocking; the **event loop** runs queued callbacks when the call stack is empty.` },
{ lvl: 'basic', hot: true, tags: ['api'], q: 'What is an API? What is REST and what are the HTTP methods?', a: `An **API** is a contract that lets one piece of software use another. **REST** (Representational State Transfer) is a style for web APIs: resources are identified by URLs and manipulated with standard HTTP methods; communication is **stateless** (each request carries everything the server needs), usually exchanging **JSON**.

| Method | Purpose | Example | Idempotent |
| --- | --- | --- | --- |
| GET | Read | \`GET /users/5\` | Yes |
| POST | Create | \`POST /users\` | No |
| PUT | Replace | \`PUT /users/5\` | Yes |
| PATCH | Partial update | \`PATCH /users/5\` | Usually not |
| DELETE | Remove | \`DELETE /users/5\` | Yes |

Common status codes: **200** OK, **201** Created, **204** No Content, **400** Bad Request, **401** Unauthorized, **403** Forbidden, **404** Not Found, **500** Internal Server Error, **503** Service Unavailable.` },
{ lvl: 'medium', tags: ['api'], q: 'REST vs SOAP. What is JSON and how is authentication done (session, JWT, OAuth)?', a: `| | REST | SOAP |
| --- | --- | --- |
| Type | Architectural style | Protocol |
| Format | JSON, XML, others | XML only |
| Weight | Light, fast | Heavy |
| Standards | Flexible | Strict (WSDL, WS-Security) |

**JSON** is a lightweight text format of key-value pairs: \`{"name": "Asha", "age": 22}\`.

**Authentication** proves who you are; **authorization** decides what you may do.
- **Session/cookie:** server stores the session, the browser sends a session ID.
- **JWT (JSON Web Token):** a signed token (header.payload.signature) the client sends with each request, so the server stays stateless.
- **OAuth 2.0:** lets an app access your data on another service without your password ("Sign in with Google").` },
{ lvl: 'basic', hot: true, tags: ['spring'], q: 'What is Spring Boot? Why is it popular at Infosys and other service companies?', a: `**Spring** is a Java framework providing **dependency injection** and many modules (web, data, security). **Spring Boot** sits on top and removes configuration work with **auto-configuration**, **starter dependencies** and an **embedded server** (Tomcat), so you can run a REST service as a plain jar with \`java -jar\`.

Most enterprise Java projects at service companies are Spring Boot microservices, so expect questions on it if Java is on your resume.` },
{ lvl: 'medium', hot: true, tags: ['spring'], q: 'What are dependency injection and inversion of control? Explain common Spring annotations.', a: `**Inversion of Control (IoC):** the framework, not your code, creates and wires objects. **Dependency Injection (DI):** an object receives its dependencies from outside (constructor, setter or field) instead of creating them with \`new\`, which makes code loosely coupled and easy to test with mocks. The **Spring container** (ApplicationContext) manages these objects, called **beans**.

| Annotation | Meaning |
| --- | --- |
| \`@SpringBootApplication\` | Entry point (config + auto-config + component scan) |
| \`@Component\`, \`@Service\`, \`@Repository\`, \`@Controller\` | Register a bean (service layer, data layer, web layer) |
| \`@RestController\` | Controller whose methods return JSON |
| \`@Autowired\` | Inject a dependency |
| \`@GetMapping\`, \`@PostMapping\` | Map HTTP requests |
| \`@PathVariable\`, \`@RequestParam\`, \`@RequestBody\` | Read URL part, query parameter, JSON body |
| \`@Entity\`, \`@Id\` | JPA entity and primary key |
| \`@Transactional\` | Run a method in a database transaction |` },
{ lvl: 'medium', tags: ['spring'], q: 'Explain the layers of a Spring Boot application, JPA and Hibernate.', a: `**Controller** (handles HTTP) -> **Service** (business logic) -> **Repository** (database access) -> **Database**. Data moves between layers using **DTOs**, and entities map to tables.

**JPA** is the Java specification for object-relational mapping (ORM); **Hibernate** is the most popular implementation. It maps classes to tables and objects to rows so you work with objects instead of raw SQL. Spring Data's \`JpaRepository\` gives \`save\`, \`findById\`, \`findAll\`, \`delete\` without writing code. Watch for the **N+1 query problem** (one query for the parent plus one per child); fix with fetch joins.` },
{ lvl: 'basic', hot: true, tags: ['architecture'], q: 'Monolithic vs microservices architecture.', a: `A **monolith** is one deployable application containing every feature. **Microservices** split the system into **small, independent services**, each owning one business capability and its own database, communicating over HTTP/REST, gRPC or messaging.

| | Monolith | Microservices |
| --- | --- | --- |
| Deployment | All or nothing | Per service |
| Scaling | Whole app | Only the busy service |
| Technology | One stack | Different per service |
| Fault isolation | One bug can bring down everything | Failure contained |
| Complexity | Simple to start | Distributed system: networking, monitoring, data consistency |

Supporting pieces: **API gateway**, service discovery, load balancer, circuit breaker (stops calling a failing service), centralised logging, message brokers (**Kafka**, RabbitMQ).` },
{ lvl: 'basic', hot: true, tags: ['docker'], q: 'What is Docker? Container vs virtual machine.', a: `**Docker** packages an application with everything it needs (code, runtime, libraries) into a **container image** that runs the same way on any machine, which fixes "it works on my machine".

| | Container | Virtual machine |
| --- | --- | --- |
| Shares host OS kernel | Yes | No (own guest OS) |
| Size | MBs | GBs |
| Start time | Seconds | Minutes |
| Isolation | Process level | Hardware level (stronger) |

Key terms: **image** (read-only template), **container** (running instance), **Dockerfile** (recipe to build an image), **registry** (Docker Hub), **volume** (persistent data), **docker-compose** (run multi-container apps).` },
{ lvl: 'medium', tags: ['docker'], q: 'Common Docker commands and a sample Dockerfile. What is Kubernetes?', a: `\`\`\`
docker build -t myapp:1.0 .      # build an image
docker run -d -p 8080:8080 myapp:1.0   # run a container, map ports
docker ps                        # running containers
docker logs <id>                 # view logs
docker exec -it <id> bash        # shell inside a container
docker stop <id>  |  docker rm <id>
\`\`\`
\`\`\`
FROM eclipse-temurin:17-jre
COPY target/app.jar /app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
\`\`\`
**Kubernetes (K8s)** orchestrates containers at scale: it schedules **pods**, restarts failed ones, **scales** replicas, load-balances traffic and does rolling updates.` },
{ lvl: 'basic', hot: true, tags: ['cloud'], q: 'What is cloud computing? Explain IaaS, PaaS, SaaS and the deployment models.', a: `Cloud computing means using computing resources (servers, storage, databases, networking) **over the internet, on demand, paying for what you use**, instead of owning hardware.

| Model | You manage | Examples |
| --- | --- | --- |
| **IaaS** (Infrastructure) | OS, runtime, apps | AWS EC2, Azure VMs |
| **PaaS** (Platform) | Your code and data | Azure App Service, Google App Engine, Heroku |
| **SaaS** (Software) | Nothing, just use it | Gmail, Salesforce, Office 365 |

**Deployment:** public cloud, private cloud, **hybrid** (mix), multi-cloud. Benefits: scalability, elasticity, cost efficiency, reliability. Big providers: **AWS, Microsoft Azure, Google Cloud**.` },
{ lvl: 'medium', hot: true, tags: ['cloud'], q: 'Name the core AWS services every fresher should know.', a: `| Need | AWS service |
| --- | --- |
| Virtual servers | **EC2** |
| Object storage (files, backups) | **S3** |
| Relational database (managed) | **RDS** (MySQL, PostgreSQL), Aurora |
| NoSQL | **DynamoDB** |
| Serverless functions | **Lambda** |
| Virtual private network | **VPC** |
| Identity and permissions | **IAM** |
| Load balancing / auto scaling | **ELB**, Auto Scaling |
| DNS | **Route 53** |
| Monitoring and logs | **CloudWatch** |
| Content delivery | **CloudFront** |
| Containers | ECS, EKS |

Azure equivalents: Virtual Machines, Blob Storage, Azure SQL, Functions, Entra ID. A certification such as **AWS Cloud Practitioner** or **Azure AZ-900** is a good addition to a fresher resume.` },
{ lvl: 'medium', tags: ['cloud'], q: 'What is serverless, auto scaling, load balancing and high availability?', a: `- **Serverless:** you write functions and the cloud runs them on demand; no server management, you pay per execution (AWS Lambda).
- **Auto scaling:** automatically adds or removes servers as load changes.
- **Load balancer:** spreads incoming requests over many servers so none is overloaded, and skips unhealthy ones.
- **High availability:** designing so the service stays up even if a component fails: redundancy across **availability zones**, replication, failover.
- **Horizontal scaling** adds more machines; **vertical scaling** makes one machine bigger.` },
{ lvl: 'basic', hot: true, tags: ['linux'], q: 'Basic Linux commands an engineer must know.', a: `| Task | Command |
| --- | --- |
| Where am I / list files | \`pwd\`, \`ls -l\` |
| Change directory | \`cd /var/log\` |
| Create / remove | \`mkdir d\`, \`touch f\`, \`rm f\`, \`rm -r d\` |
| Copy / move | \`cp a b\`, \`mv a b\` |
| View a file | \`cat f\`, \`less f\`, \`head -n 5 f\`, \`tail -f log\` |
| Search text | \`grep "error" app.log\`, \`grep -i -n word f\` |
| Find files | \`find / -name "*.log"\` |
| Permissions | \`chmod 755 f\`, \`chown user f\` |
| Processes | \`ps aux\`, \`top\`, \`kill -9 PID\` |
| Disk / memory | \`df -h\`, \`du -sh *\`, \`free -m\` |
| Network | \`ping host\`, \`curl url\`, \`netstat -tulpn\`, \`ssh user@host\` |
| Count lines / words | \`wc -l f\` |
| Pipe and redirect | \`ls \\| wc -l\`, \`cmd > out.txt\`, \`cmd >> out.txt\` |` },
{ lvl: 'medium', tags: ['linux'], q: 'Explain Linux file permissions such as 755 and 644.', a: `Each file has permissions for **owner, group, others**, each made of **r**ead = 4, **w**rite = 2, e**x**ecute = 1.

- **755** = owner 7 (4+2+1: rwx), group 5 (4+1: r-x), others 5 (r-x): \`rwxr-xr-x\`, typical for scripts and directories.
- **644** = owner rw-, group r--, others r--: typical for normal files.
- **600** = only the owner can read and write (private keys).

\`chmod +x script.sh\` makes it executable. \`sudo\` runs a command as the administrator.` },
{ lvl: 'medium', tags: ['linux'], q: 'What is a shell script? Write a small one.', a: `A shell script is a text file of commands run by the shell (bash).

\`\`\`bash
#!/bin/bash
# count files and warn if disk is above 80%
count=$(ls | wc -l)
echo "Files here: $count"
usage=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
if [ "$usage" -gt 80 ]; then
  echo "Disk almost full"
fi
for f in *.log; do
  echo "Processing $f"
done
\`\`\`
Run with \`chmod +x s.sh && ./s.sh\`. Variables have no spaces around \`=\`; use \`$var\` to read them. **cron** schedules scripts (\`0 2 * * * /path/s.sh\` = every day at 2 AM).` },
{ lvl: 'basic', hot: true, tags: ['ai'], q: 'What is the difference between AI, machine learning and deep learning?', a: `- **Artificial Intelligence:** the broad goal of machines doing tasks that need human intelligence.
- **Machine Learning:** a part of AI where systems **learn patterns from data** instead of being explicitly programmed.
- **Deep Learning:** a part of ML using **multi-layer neural networks**; powers image recognition, speech and language models.
- **Generative AI / LLMs:** models (such as ChatGPT or Claude) trained on huge text data to generate text, code and images.

Types of ML: **supervised** (labelled data: classification, regression), **unsupervised** (no labels: clustering), **reinforcement** (learning by rewards).` },
{ lvl: 'medium', tags: ['ai'], q: 'Explain overfitting, train/test split, and common ML algorithms and metrics.', a: `- **Overfitting:** the model memorises the training data and does badly on new data. Fix with more data, simpler model, regularisation, cross-validation. **Underfitting:** too simple to capture the pattern.
- **Train/test split:** keep unseen data aside (for example 80/20) to measure real performance.
- **Algorithms:** linear and logistic regression, decision trees, random forest, k-NN, SVM, k-means, neural networks.
- **Metrics:** accuracy, **precision** (of predicted positives, how many are right), **recall** (of actual positives, how many were found), F1 score, confusion matrix; RMSE for regression.
- Python libraries: **NumPy, Pandas, scikit-learn, TensorFlow, PyTorch, Matplotlib**.` },
{ lvl: 'medium', tags: ['ai'], q: 'How would you use AI tools (like ChatGPT or Copilot) responsibly in your work?', a: `A good answer shows judgement:
- Use them to **speed up** boilerplate, explanations, tests and debugging ideas, not to replace understanding.
- **Always review and test** generated code; it can be wrong, insecure or outdated.
- Never paste **client data, secrets or proprietary code** into public tools; follow company policy.
- Be able to **explain every line** you submit.

Infosys is investing heavily in AI (for example its Topaz offering), so showing awareness and a sensible attitude is a plus.` },
{ lvl: 'basic', hot: true, tags: ['security'], q: 'What are the basic cybersecurity concepts? Explain the CIA triad.', a: `**CIA triad:**
- **Confidentiality:** only authorised people can see data (encryption, access control).
- **Integrity:** data is not altered improperly (hashing, checksums, digital signatures).
- **Availability:** systems are accessible when needed (backups, redundancy, DDoS protection).

Related: **authentication** (who are you), **authorisation** (what can you do), **non-repudiation**, **MFA** (multi-factor authentication), **least privilege** principle.` },
{ lvl: 'medium', hot: true, tags: ['security'], q: 'Encryption, hashing and digital signatures: differences. Symmetric vs asymmetric.', a: `- **Encryption** is reversible with a key (confidentiality).
  - **Symmetric:** same key to encrypt and decrypt, fast (AES).
  - **Asymmetric:** public key encrypts, private key decrypts, slower (RSA, ECC). Used to exchange keys safely.
- **Hashing** is **one-way**: SHA-256 turns data into a fixed-size fingerprint; used for integrity and **password storage** (with salt, using bcrypt or Argon2). Not reversible.
- **Digital signature:** sign with your **private** key, others verify with your **public** key, proving origin and integrity.
- **HTTPS** uses asymmetric encryption to agree on a session key, then symmetric encryption for the data.` },
{ lvl: 'medium', hot: true, tags: ['security'], q: 'What are the OWASP Top 10 style attacks: SQL injection, XSS, CSRF, phishing, DoS?', a: `| Attack | What happens | Defence |
| --- | --- | --- |
| **SQL injection** | Attacker's input becomes part of a SQL query | Prepared statements, input validation |
| **XSS** (cross-site scripting) | Malicious script runs in another user's browser | Escape or sanitise output, Content-Security-Policy |
| **CSRF** | A logged-in user's browser is tricked into sending an unwanted request | Anti-CSRF tokens, SameSite cookies |
| **Phishing** | Fake email or site steals credentials | Awareness, MFA, email filtering |
| **DoS / DDoS** | Flood the service so real users cannot use it | Rate limiting, CDN, load balancers |
| **Man-in-the-middle** | Attacker intercepts traffic | HTTPS / TLS |
| **Broken authentication / weak passwords** | Account takeover | MFA, strong password policy, lockouts |

Also: never hard-code secrets, keep dependencies patched, and log security events.` },
{ lvl: 'medium', tags: ['basics'], q: 'What is a data structure used in real projects? Where would you use a cache, a queue, or a message broker?', a: `- **Cache** (Redis, Memcached, an in-memory map): keep frequently read data close to avoid slow database calls; remember to **expire or invalidate** stale entries.
- **Queue / message broker** (Kafka, RabbitMQ, SQS): decouple services, absorb traffic spikes and process work asynchronously (sending emails, order processing).
- **Index:** speeds up database reads.
- **CDN:** serves static files from servers near the user.

Connecting theory to a real use like this shows depth in a project discussion.` },
{ lvl: 'medium', tags: ['api'], q: 'How do you test and debug an API? What is Postman?', a: `**Postman** is a tool to send HTTP requests (choose method, URL, headers, body) and inspect the status code, headers and response; collections can be run as automated tests. Alternatives: \`curl\`, Swagger UI, REST Assured (Java), pytest + requests.

\`\`\`
curl -X POST http://localhost:8080/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Asha","age":22}'
\`\`\`
Debug by checking: the URL and method, the request body format, authentication headers, the status code, and the server logs.` },
{ lvl: 'adv', tags: ['architecture'], q: 'How would you design a URL shortener (basic system design for freshers)?', a: `**Requirements:** convert a long URL to a short code and redirect when the short URL is opened. Read-heavy.

1. **API:** \`POST /shorten {url}\` -> \`{code}\`; \`GET /{code}\` -> **301/302 redirect**.
2. **Code generation:** a counter or unique ID encoded in **base62** (a-z, A-Z, 0-9). 7 characters give 62^7 (about 3.5 trillion) codes.
3. **Storage:** a table \`(code PRIMARY KEY, long_url, created_at, user_id)\`. A key-value store or SQL both work.
4. **Speed:** put a **cache** (Redis) in front for hot codes; put an **index** on the code.
5. **Scale:** stateless app servers behind a **load balancer**, database replication or sharding by code, rate limiting to stop abuse.

For a fresher interview, clear thinking about requirements, API, storage and caching matters more than perfection.` },
] });
