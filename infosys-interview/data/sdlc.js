IV.addModule({ id: 'sdlc', group: 'tech', title: 'SDLC, Agile and testing', blurb: 'SDLC phases and models, Agile and Scrum, STLC, types of testing, bug life cycle, DevOps, CI/CD and Git. Infosys projects run on these every day.', qa: [
{ lvl: 'basic', hot: true, tags: ['sdlc'], q: 'What is SDLC? Explain its phases.', a: `The **Software Development Life Cycle** is the structured process used to plan, build, test, deliver and maintain software.

| Phase | What happens | Output |
| --- | --- | --- |
| 1. Requirement gathering | Talk to the client, understand needs | SRS (Software Requirement Specification) |
| 2. Feasibility / planning | Cost, time, risk, resources | Project plan |
| 3. Design | High-level (architecture) and low-level (modules, DB) design | HLD, LLD documents |
| 4. Development (coding) | Developers write code to the design | Source code |
| 5. Testing | Find and fix defects | Test reports, bug-free build |
| 6. Deployment | Release to production | Live system |
| 7. Maintenance | Bug fixes, enhancements, support | Patches, new versions |

A bug found in the requirement phase costs far less to fix than the same bug found in production, which is why testing is planned early.` },
{ lvl: 'basic', hot: true, tags: ['models'], q: 'Explain the Waterfall model with advantages and disadvantages.', a: `Waterfall is a **linear, sequential** model. Each phase (requirements, design, code, test, deploy, maintain) must finish before the next one starts, and there is no going back.

**Advantages:** simple, easy to manage, clear documentation and milestones, works well when requirements are fixed.

**Disadvantages:** changes are expensive, the client sees working software only at the end, testing starts late, high risk if requirements were misunderstood.

**Use when:** requirements are clear and stable (government or regulated systems, small well-understood projects).` },
{ lvl: 'basic', hot: true, tags: ['models'], q: 'What is the Agile methodology? What are its principles?', a: `Agile is an **iterative and incremental** way of building software. Work is split into short cycles (1 to 4 weeks) that each deliver a small working piece, so the client can give feedback early and requirements can change.

The **Agile Manifesto** values:
- Individuals and interactions over processes and tools
- Working software over comprehensive documentation
- Customer collaboration over contract negotiation
- Responding to change over following a plan

Popular frameworks: **Scrum**, **Kanban**, XP (Extreme Programming), SAFe for large organisations.` },
{ lvl: 'basic', hot: true, tags: ['models', 'agile'], q: 'Waterfall vs Agile: what are the differences?', a: `| | Waterfall | Agile |
| --- | --- | --- |
| Approach | Linear, one pass | Iterative, many short cycles |
| Requirements | Fixed up front | Evolve with feedback |
| Customer involvement | At start and end | Throughout |
| Delivery | One big release | Frequent small releases |
| Testing | After development | Continuous, every sprint |
| Change | Hard and costly | Welcome |
| Risk | Found late | Found early |
| Documentation | Heavy | Light, just enough |` },
{ lvl: 'basic', hot: true, tags: ['agile', 'scrum'], q: 'What is Scrum? Explain the roles, events and artifacts.', a: `Scrum is the most common Agile framework. Work happens in fixed-length **sprints** (usually 2 weeks).

**Roles**
- **Product Owner:** owns the product backlog, decides priorities, represents the customer.
- **Scrum Master:** a servant-leader who coaches the team, removes blockers and makes sure Scrum is followed.
- **Development Team:** cross-functional people who build and test the product.

**Events**
- **Sprint planning:** decide what goes into this sprint.
- **Daily stand-up (15 min):** what I did yesterday, what I will do today, any blockers.
- **Sprint review:** demo the work to stakeholders.
- **Sprint retrospective:** what went well, what to improve.

**Artifacts**
- **Product backlog:** ordered list of everything wanted in the product.
- **Sprint backlog:** items picked for this sprint.
- **Increment:** the working, potentially shippable product at the end of the sprint.` },
{ lvl: 'medium', tags: ['agile', 'scrum'], q: 'What is a user story, story points and velocity?', a: `- **User story:** a requirement written from the user's view: *"As a (user), I want (goal) so that (benefit)."* Example: "As a customer, I want to reset my password so that I can log in if I forget it."
- **Acceptance criteria:** the conditions that must be true for the story to be "done".
- **Story points:** a relative measure of effort, complexity and uncertainty (often on a Fibonacci scale 1, 2, 3, 5, 8, 13), not hours.
- **Velocity:** the number of story points a team completes per sprint. It is used to forecast how much work fits in future sprints.
- **Burndown chart:** remaining work against time, showing whether the sprint is on track.` },
{ lvl: 'medium', tags: ['agile'], q: 'What is the Definition of Done? How is it different from acceptance criteria?', a: `**Definition of Done (DoD)** is a shared checklist that applies to **every** story (code reviewed, unit tests passing, merged, deployed to test environment, documented). **Acceptance criteria** are specific to **one** story and describe its expected behaviour. A story is finished only when it meets both.` },
{ lvl: 'basic', tags: ['models'], q: 'Explain the V-Model (Verification and Validation).', a: `The V-Model is an extension of Waterfall in which **every development phase has a matching testing phase**, forming a V shape.

| Development (left side) | Testing (right side) |
| --- | --- |
| Requirement analysis | Acceptance testing |
| System design | System testing |
| High-level design | Integration testing |
| Low-level design | Unit testing |
| Coding (bottom of the V) | |

- **Verification:** "Are we building the product right?" (reviews, walkthroughs, static checks).
- **Validation:** "Are we building the right product?" (running the software, dynamic testing).

Test planning starts early, so defects are caught sooner than in plain Waterfall. It is still rigid for changing requirements.` },
{ lvl: 'medium', tags: ['models'], q: 'Explain the Spiral, Iterative, Prototype and Big Bang models briefly.', a: `- **Spiral:** a risk-driven model. Each loop of the spiral has four steps: planning, risk analysis, engineering, evaluation. Good for large, high-risk projects; costly and complex to manage.
- **Iterative / Incremental:** build a small working version first, then add features in repeated cycles. Early working software, easier change.
- **Prototype:** build a quick mock-up to clarify unclear requirements with the client, then build the real system. Reduces misunderstanding but can mislead the client about effort.
- **Big Bang:** start coding with little planning. Only for tiny projects; very risky otherwise.` },
{ lvl: 'medium', tags: ['models'], q: 'How do you choose the right SDLC model for a project?', a: `| Situation | Suitable model |
| --- | --- |
| Stable, well-defined requirements, fixed contract | Waterfall or V-Model |
| Requirements change often, need early feedback | Agile / Scrum |
| Large, risky, expensive project | Spiral |
| Customer is unsure what they want | Prototype, then Agile |
| Continuous delivery of a web product | Agile with DevOps |

Most Infosys projects are **Agile**, but fixed-price and regulated projects still use Waterfall or V-Model elements.` },
{ lvl: 'medium', tags: ['agile'], q: 'What is Kanban? How is it different from Scrum?', a: `Kanban is a **visual workflow** method using a board with columns (To Do, In Progress, Testing, Done). Work is pulled continuously, and a **WIP (work-in-progress) limit** per column prevents overload.

| | Scrum | Kanban |
| --- | --- | --- |
| Cadence | Fixed sprints | Continuous flow |
| Roles | PO, Scrum Master, team | No fixed roles |
| Change mid-cycle | Discouraged within the sprint | Allowed any time |
| Measure | Velocity | Cycle time, throughput |
| Best for | Product development | Support, maintenance, operations |` },
{ lvl: 'basic', hot: true, tags: ['testing', 'stlc'], q: 'What is STLC? How is it different from SDLC?', a: `The **Software Testing Life Cycle** is the set of activities done to test software:

1. **Requirement analysis:** understand what to test.
2. **Test planning:** scope, strategy, effort, tools, schedule.
3. **Test case design:** write test cases and prepare test data.
4. **Environment setup:** prepare servers, builds, tools.
5. **Test execution:** run tests, log defects.
6. **Test closure:** report, metrics, lessons learned.

**SDLC** covers the whole software creation process; **STLC** is the testing part inside it.` },
{ lvl: 'basic', hot: true, tags: ['testing'], q: 'What are the different levels of testing?', a: `1. **Unit testing:** tests a single function or class, written by developers (JUnit, PyTest).
2. **Integration testing:** tests that modules work together (approaches: top-down, bottom-up, big bang, sandwich).
3. **System testing:** tests the complete application against requirements.
4. **Acceptance testing (UAT):** the client or end user confirms the system meets their needs before go-live.` },
{ lvl: 'basic', hot: true, tags: ['testing'], q: 'What is the difference between black-box, white-box and grey-box testing?', a: `- **Black-box:** tester checks inputs and outputs **without** seeing the code. Examples: functional testing, UAT. Techniques: equivalence partitioning, boundary value analysis.
- **White-box:** tester knows the **internal code** and tests paths, branches and conditions. Done mostly by developers (statement, branch and path coverage).
- **Grey-box:** partial knowledge of internals, for example knowing the database structure while testing through the UI.` },
{ lvl: 'basic', hot: true, tags: ['testing'], q: 'Functional vs non-functional testing. Give examples.', a: `**Functional testing** checks *what* the system does: login works, the cart totals correctly, the report downloads.

**Non-functional testing** checks *how well* it does it:
- **Performance:** speed under normal load.
- **Load:** expected number of users. **Stress:** beyond capacity until it breaks. **Spike:** sudden surge. **Endurance (soak):** long duration.
- **Security:** can it be attacked?
- **Usability:** is it easy to use?
- **Compatibility:** browsers, devices, OS.
- **Scalability, reliability, recovery.**` },
{ lvl: 'basic', hot: true, tags: ['testing'], q: 'What is regression testing? What is smoke and sanity testing?', a: `- **Regression testing:** re-running earlier tests after a change to confirm that old features still work. Usually automated.
- **Smoke testing:** a quick, shallow check that the **critical functions** of a new build work (can the app start, can I log in?). If it fails, the build is rejected. "Build verification test."
- **Sanity testing:** a narrow, focused check after a small change or bug fix to confirm that the specific change works.
- **Retesting:** running the same failed test again after the bug is fixed.

| | Smoke | Sanity |
| --- | --- | --- |
| Scope | Wide, shallow | Narrow, deep |
| When | On every new build | After minor changes |
| Scripted | Often yes | Often no |` },
{ lvl: 'basic', hot: true, tags: ['testing'], q: 'What is a bug life cycle (defect life cycle)?', a: `The states a defect passes through:

**New** -> **Assigned** -> **Open** (developer working) -> **Fixed** -> **Retest** -> **Verified** -> **Closed**

Other paths: **Reopened** (the bug still occurs after the fix), **Rejected** (not a valid defect), **Duplicate**, **Deferred** (postponed to a later release), **Not reproducible**.

Tools: **JIRA**, Bugzilla, Azure DevOps.` },
{ lvl: 'basic', tags: ['testing'], q: 'What is the difference between severity and priority? Give examples.', a: `- **Severity:** how badly the defect affects the system (decided by the tester).
- **Priority:** how soon it should be fixed (decided by the business or product owner).

| Example | Severity | Priority |
| --- | --- | --- |
| Application crashes on a rarely used screen | High | Low |
| Company logo spelling mistake on the home page | Low | High |
| Payment fails for every user | High | High |
| Slight alignment issue on an admin screen | Low | Low |` },
{ lvl: 'basic', tags: ['testing'], q: 'What is a test case? What does a good test case contain?', a: `A **test case** is a set of steps with inputs and an expected result used to check one behaviour.

It contains: test case ID, title, preconditions, test steps, test data, expected result, actual result, status (pass or fail) and remarks.

A good test case is **clear, independent, repeatable, traceable to a requirement** and has one expected outcome. A **test scenario** is a high-level thing to test ("verify login"); one scenario has many test cases (valid login, wrong password, blank fields, locked account).` },
{ lvl: 'medium', tags: ['testing'], q: 'Explain boundary value analysis and equivalence partitioning with an example.', a: `Suppose a field accepts an age from **18 to 60**.

- **Equivalence partitioning:** divide inputs into classes that behave alike and test one value from each: invalid (below 18, for example 10), valid (18 to 60, for example 30), invalid (above 60, for example 70).
- **Boundary value analysis:** defects cluster at the edges, so test the boundaries: **17, 18, 19, 59, 60, 61**.

Together they give maximum coverage with a minimum number of test cases.` },
{ lvl: 'medium', tags: ['testing'], q: 'What is UAT, alpha testing and beta testing?', a: `- **UAT (User Acceptance Testing):** done by the client or business users on a near-production environment to accept the product.
- **Alpha testing:** done in-house by internal staff before release.
- **Beta testing:** done by a small group of real external users in the real environment before the public release.` },
{ lvl: 'medium', tags: ['testing'], q: 'Manual vs automation testing. What tools are used?', a: `**Manual:** a person executes test cases. Best for exploratory, usability and one-off testing.
**Automation:** scripts execute tests. Best for regression, repetitive, data-heavy and performance tests. It saves time in the long run but needs upfront effort and maintenance.

Tools: **Selenium** (web UI), Cypress, Playwright, **JUnit/TestNG** (unit), **Postman/REST Assured** (API), **JMeter** (performance), Appium (mobile), Cucumber (BDD).` },
{ lvl: 'medium', tags: ['testing'], q: 'What is TDD and BDD?', a: `- **TDD (Test-Driven Development):** write a failing test first, write just enough code to pass it, then refactor. The cycle is **Red -> Green -> Refactor**.
- **BDD (Behaviour-Driven Development):** behaviour is described in plain language that business people can read, using **Given / When / Then**:

\`\`\`
Given the user is on the login page
When they enter a valid username and password
Then they are taken to the dashboard
\`\`\`
Tools: Cucumber, SpecFlow.` },
{ lvl: 'basic', hot: true, tags: ['devops'], q: 'What is DevOps? Why is it used?', a: `DevOps is a culture and a set of practices that unites **development** and **operations** so software can be built, tested and released **faster and more reliably** through automation and collaboration.

Benefits: faster releases, fewer failures, quick recovery, less manual work. Core practices: version control, **CI/CD**, infrastructure as code, automated testing, monitoring.

Common tools: **Git, Jenkins, Maven, Docker, Kubernetes, Ansible, Terraform, SonarQube, Nagios/Prometheus/Grafana.**` },
{ lvl: 'basic', hot: true, tags: ['devops'], q: 'What is CI/CD? Explain a typical pipeline.', a: `- **Continuous Integration (CI):** developers merge code into a shared repository often, and every merge triggers an **automatic build and test**, so integration problems appear early.
- **Continuous Delivery:** every good build is automatically prepared for release; deployment to production is a manual approval.
- **Continuous Deployment:** every build that passes all tests is deployed to production automatically.

A pipeline: **commit -> build -> unit tests -> code quality scan -> package (artifact) -> deploy to test -> integration tests -> deploy to production -> monitor.** Tools: Jenkins, GitHub Actions, GitLab CI, Azure DevOps.` },
{ lvl: 'basic', hot: true, tags: ['git'], q: 'What is Git? Explain the common commands.', a: `Git is a **distributed version control system** that tracks changes to code and lets many people work together. GitHub, GitLab and Bitbucket host Git repositories.

| Command | Purpose |
| --- | --- |
| \`git init\` / \`git clone <url>\` | Start or copy a repository |
| \`git status\` | See changed files |
| \`git add .\` | Stage changes |
| \`git commit -m "msg"\` | Save a snapshot locally |
| \`git push\` | Send commits to the remote |
| \`git pull\` | Fetch and merge remote changes |
| \`git branch\`, \`git checkout -b feature\` | List or create branches |
| \`git merge feature\` | Merge a branch |
| \`git log --oneline\` | History |
| \`git stash\` | Shelve uncommitted work |` },
{ lvl: 'medium', tags: ['git'], q: 'git fetch vs git pull, merge vs rebase, and how to resolve a merge conflict.', a: `- **fetch** downloads remote changes but does not touch your working files. **pull = fetch + merge.**
- **merge** joins two branches with a merge commit and keeps the true history. **rebase** replays your commits on top of another branch for a clean linear history. Never rebase commits that others have already pulled.
- **Merge conflict:** two branches changed the same lines. Git marks the file with \`<<<<<<<\`, \`=======\`, \`>>>>>>>\`. Edit the file to keep the correct content, remove the markers, then \`git add\` and \`git commit\`.
- **reset vs revert:** \`reset\` moves the branch pointer back (rewrites history; local use). \`revert\` creates a new commit that undoes an earlier one (safe for shared branches).` },
{ lvl: 'medium', tags: ['git'], q: 'What is a branching strategy? Explain Git Flow.', a: `A branching strategy defines how a team uses branches. **Git Flow** uses:
- **main:** production code only.
- **develop:** integration branch for the next release.
- **feature/*:** one branch per feature, merged into develop.
- **release/*:** stabilise a release before it goes to main.
- **hotfix/*:** urgent production fixes from main.

A simpler alternative is **trunk-based development**: short-lived branches merged to main many times a day, backed by strong CI. Pull requests with code review guard every merge.` },
{ lvl: 'medium', tags: ['maintenance'], q: 'Types of software maintenance?', a: `- **Corrective:** fix bugs found after release.
- **Adaptive:** change the software for a new environment (new OS, law, API).
- **Perfective:** add features or improve performance on user request.
- **Preventive:** refactor to prevent future problems.` },
{ lvl: 'medium', tags: ['design'], q: 'What is the difference between HLD and LLD?', a: `- **High-Level Design:** the overall architecture: modules, how they communicate, technology choices, database overview, external systems. Read by architects and managers.
- **Low-Level Design:** the detail of each module: classes, methods, algorithms, tables and columns, validations. Read by developers.` },
{ lvl: 'medium', tags: ['quality'], q: 'What are code review, static analysis and technical debt?', a: `- **Code review:** teammates read a change before it is merged to catch bugs, enforce standards and share knowledge (usually via a pull request).
- **Static analysis:** tools (SonarQube, Checkstyle) inspect code **without running it** for bugs, smells and security issues.
- **Technical debt:** the extra future cost of choosing a quick, messy solution now. Like financial debt, it grows with interest until it is repaid through refactoring.` },
{ lvl: 'adv', tags: ['agile', 'scrum'], q: 'Your sprint is about to end and a story is incomplete. What do you do?', a: `1. Do not mark it done; the **Definition of Done** is not negotiable.
2. Tell the Product Owner and Scrum Master early, at the stand-up, not on the last day.
3. Move the unfinished story back to the product backlog and re-estimate the remaining work; it is usually the first item in the next sprint.
4. In the retrospective, find the cause: poor estimation, an unclear story, a dependency or a blocker, and fix that.

Sprint length is never extended to fit the work.` },
{ lvl: 'adv', tags: ['testing'], q: 'How do you decide when to stop testing?', a: `Exhaustive testing is impossible, so testing stops when exit criteria are met: planned test cases executed with an agreed pass rate, no open critical or high defects, required code or requirement coverage achieved, defect discovery rate has dropped, and the deadline or budget limit is reached with the risk accepted by stakeholders.` },
] });
