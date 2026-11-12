"""Content for the Communication Assessment guide: practice items with answers and model responses.

build_comm_guide.py checks word counts (emails >= 50 words, 45-second talks about 95-125 words)
and that every fill-in / error-correction answer is consistent with its sentence.
"""

# ---------------------------------------------------------------- A · Listening comprehension
LISTEN = [
    ("The team meeting has been moved from Monday to Wednesday at 3 p.m. because the client presentation on Monday "
     "will run the whole afternoon. Please update your calendars.",
     "Why has the team meeting been moved?",
     "The team meeting has been moved because the client presentation on Monday will run the whole afternoon."),
    ("Hi, this is Neha from HR. Your laptop is ready for collection at the IT desk on the second floor. Please bring "
     "your employee ID card when you come.",
     "What should the employee bring to collect the laptop?",
     "The employee should bring their employee ID card to collect the laptop."),
    ("Our office cafeteria will remain closed this Friday for maintenance work. Lunch coupons for a nearby restaurant "
     "will be given to all employees at the reception.",
     "Where will employees get the lunch coupons?",
     "Employees will get the lunch coupons at the reception."),
    ("The training on cloud security starts next Tuesday. It will run for three days, from 10 a.m. to 1 p.m., and "
     "everyone who joined this quarter must attend.",
     "How long will the cloud security training last?",
     "The cloud security training will last for three days, from 10 a.m. to 1 p.m. each day."),
    ("Rahul could not finish the sales report yesterday because the database was down for most of the day. He has "
     "promised to send it to the manager by noon today.",
     "When will Rahul send the sales report?",
     "Rahul will send the sales report to the manager by noon today."),
    ("Please note that from next month, travel claims must be submitted within fifteen days of the trip. Claims "
     "submitted after that will need approval from the finance head.",
     "Within how many days must travel claims be submitted?",
     "Travel claims must be submitted within fifteen days of the trip."),
    ("The client has asked for two changes to the website: a larger search bar on the home page and a dark mode "
     "option. The design team will share the new screens on Thursday.",
     "What changes has the client asked for?",
     "The client has asked for a larger search bar on the home page and a dark mode option."),
    ("Good morning everyone. Due to heavy rain, the shuttle buses will leave the office at 5 p.m. today instead of "
     "6 p.m. Employees who need to stay late should inform the transport desk.",
     "What should employees who need to stay late do?",
     "Employees who need to stay late should inform the transport desk."),
]

# ---------------------------------------------------------------- B · Conversation response
CONVERSE = [
    ("Manager: Can you send me the project report by today?",
     "Sure, I will share the project report with you by the end of the day."),
    ("Colleague: I am stuck with this Excel formula. Do you have a minute?",
     "Of course. Please share your screen, and we can look at the formula together."),
    ("Client: The application is loading very slowly since yesterday.",
     "I am sorry for the inconvenience. I will check the issue right away and update you within an hour."),
    ("Manager: Can you lead the client call tomorrow at 9 a.m.?",
     "Yes, I would be happy to lead the call. Could you share the agenda with me today so that I can prepare?"),
    ("Colleague: Could you cover my tasks on Friday? I have a family function.",
     "I am sorry, but I have a deadline on Friday. However, I can help you with your tasks on Thursday evening."),
    ("Team lead: Why was the deployment delayed last night?",
     "The deployment was delayed because two test cases failed at the last minute. We have fixed them, and it is "
     "scheduled again for tonight."),
    ("HR: Would you be comfortable relocating to Bengaluru?",
     "Yes, I am comfortable relocating to Bengaluru. I see it as a good opportunity to learn and grow."),
    ("Client: Can we move tomorrow's meeting to the afternoon?",
     "Certainly. Would 3 p.m. work for you? I will send an updated invitation."),
    ("Colleague: Great job on the presentation today!",
     "Thank you so much. Your feedback during the practice session really helped me."),
    ("Manager: I noticed a few errors in your last report.",
     "Thank you for pointing them out. I will correct them today and double-check my future reports before "
     "sending them."),
]

# ---------------------------------------------------------------- C · Reading aloud (/ = short pause, // = longer pause, CAPS = stressed word)
READ = [
    "Our COMPANY / has OFFICES in more than FORTY COUNTRIES, // and it HELPS CLIENTS / use TECHNOLOGY to GROW.",
    "Before the MEETING STARTS, / please make SURE / that your MICROPHONE is MUTED.",
    "The NEW SOFTWARE / will be INSTALLED on all LAPTOPS / by the END of this WEEK.",
    "If you have ANY QUESTIONS about the PROJECT, / feel FREE to CONTACT your TEAM LEAD.",
    "CUSTOMER SATISFACTION / is the MOST IMPORTANT MEASURE / of our SUCCESS.",
    "The TRAINING PROGRAMME / covers CLOUD COMPUTING, / DATA SECURITY, / and ARTIFICIAL INTELLIGENCE.",
    "Although the DEADLINE was TIGHT, // the TEAM DELIVERED the PRODUCT / on TIME.",
    "Please REMEMBER / to SUBMIT your TIMESHEET / every FRIDAY / before SIX P.M.",
]

# ---------------------------------------------------------------- D · Listen and repeat
REPEAT = [
    ("Short", "Please close the door."), ("Short", "The report is ready."), ("Short", "I will call you later."),
    ("Short", "Lunch is served at one."),
    ("Medium", "The manager approved my leave request."), ("Medium", "Our team works on a banking project."),
    ("Medium", "Could you send me the meeting link?"), ("Medium", "The client visit has been postponed."),
    ("Long", "The training session will start after the coffee break."),
    ("Long", "Most employees prefer working from the office on Mondays."),
    ("Long", "Please update the document before you share it with the client."),
    ("Long", "Our new office in Pune has a large cafeteria and a gym."),
]

# ---------------------------------------------------------------- E · Fill in the missing word  (sentence with ___, answer, rule)
FILL = [
    ("Each of the employees ___ a laptop.", "has", "Each of + plural noun takes a singular verb."),
    ("She ___ working here since 2022.", "has been", "since + a point in time → present perfect continuous."),
    ("I ___ my assignment yesterday.", "submitted", "yesterday → simple past."),
    ("He is ___ honest person.", "an", "an before a vowel sound (h is silent in honest)."),
    ("She is ___ university student.", "a", "university starts with a 'yoo' sound, so a."),
    ("If I ___ the time, I would join the course.", "had", "Second conditional: if + past simple, would + verb."),
    ("The meeting will start ___ 10 a.m.", "at", "at for exact clock times."),
    ("We have a holiday ___ Monday.", "on", "on for days and dates."),
    ("I have lived in Delhi ___ five years.", "for", "for + a length of time; since + a starting point."),
    ("Neither the manager nor the employees ___ aware of the change.", "were",
     "neither…nor: the verb agrees with the nearer subject (employees → were)."),
    ("The manager, as well as his team, ___ attending the event.", "is",
     "as well as does not change the subject; the manager → is."),
    ("She is the ___ performer in our team.", "best", "Superlative of good = best (with the)."),
    ("This laptop is ___ than the old one.", "lighter", "Comparison of two things → comparative -er + than."),
    ("He said that he ___ tired.", "was", "Reported speech moves the tense back: is → was."),
    ("By the time we reached the station, the train ___ left.", "had", "Earlier of two past actions → past perfect."),
    ("Neither of the answers ___ correct.", "is", "Neither of + plural noun takes a singular verb."),
    ("The news ___ good today.", "is", "news is uncountable and singular."),
    ("I am looking forward to ___ you.", "meeting", "look forward to + -ing."),
    ("She is good ___ public speaking.", "at", "good at (a skill)."),
    ("The report was written ___ Priya.", "by", "Passive voice: the doer is introduced with by."),
]

# ---------------------------------------------------------------- F · Error correction (wrong, correct, rule)
ERRORS = [
    ("Each of the students have a laptop.", "Each of the students has a laptop.", "Each of → singular verb."),
    ("We will discuss about the project tomorrow.", "We will discuss the project tomorrow.",
     "discuss takes no preposition."),
    ("Please revert back to me by Friday.", "Please reply to me by Friday.",
     "revert already means go back; for replies, say reply."),
    ("I am working here since 2023.", "I have been working here since 2023.", "since + start point → present perfect continuous."),
    ("One of my friend works at Infosys.", "One of my friends works at Infosys.", "one of + plural noun, singular verb."),
    ("She don't like coffee.", "She doesn't like coffee.", "she / he / it → does not."),
    ("He is more taller than me.", "He is taller than me.", "Do not use more with -er (double comparative)."),
    ("I have completed my graduation in 2024.", "I completed my graduation in 2024.",
     "A finished past time (in 2024) → simple past, not present perfect."),
    ("Let's return back to the main topic.", "Let's return to the main topic.", "return already means come back."),
    ("I am having two years of experience.", "I have two years of experience.",
     "have (possess) is a state verb; do not use the -ing form."),
    ("The informations are on the portal.", "The information is on the portal.",
     "information is uncountable: no plural, singular verb."),
    ("He gave me many advices.", "He gave me a lot of advice.", "advice is uncountable."),
    ("Myself Rahul, from the testing team.", "I am Rahul, from the testing team.",
     "Introduce yourself with I am; myself is reflexive."),
    ("I passed out from college in 2025.", "I graduated from college in 2025.",
     "pass out means to faint; use graduated."),
    ("There is many reasons for the delay.", "There are many reasons for the delay.",
     "there is + singular, there are + plural (many reasons)."),
    ("She is senior than me.", "She is senior to me.", "senior / junior / superior take to, not than."),
    ("The team are working on it since morning.", "The team has been working on it since morning.",
     "since morning → present perfect continuous; a team acting as one unit takes a singular verb in Indian and American English."),
    ("I didn't went to office yesterday.", "I didn't go to the office yesterday.",
     "did / didn't + base verb (go), and the office."),
    ("We need to cope up with the changes.", "We need to cope with the changes.", "The verb is cope with."),
    ("He said me that he was busy.", "He told me that he was busy.", "say something; tell someone."),
    ("Can you explain me the process?", "Can you explain the process to me?", "explain something to someone."),
    ("Neither Ravi nor Anil have submitted the form.", "Neither Ravi nor Anil has submitted the form.",
     "neither…nor with two singular subjects → singular verb."),
    ("Ten kilometres are a long distance to walk.", "Ten kilometres is a long distance to walk.",
     "An amount of distance, money or time taken as one unit → singular verb."),
    ("She is good in coding.", "She is good at coding.", "good at a skill."),
    ("If I will get time, I will finish it.", "If I get time, I will finish it.",
     "First conditional: if + present simple, will + verb."),
]

# ---------------------------------------------------------------- G · Speaking on a topic (topic, outline, model answer ~45 s)
TALKS = [
    ("Work from home or work from office: which is better?",
     ["View: a hybrid model works best", "Home: saves travel time, fewer distractions", "Office: teamwork, faster learning for freshers"],
     "In my opinion, a hybrid model is the best option. Working from home saves a lot of travel time and helps "
     "people focus on tasks that need deep concentration. However, the office has its own advantages. When we "
     "sit together, we solve problems faster, and freshers learn much more by watching experienced colleagues. "
     "Informal conversations also build trust in a team. So, I believe two or three days in the office and the "
     "rest at home gives us the best of both worlds. It keeps productivity high and the team connected."),
    ("The role of technology in education",
     ["View: technology has made learning open to everyone", "Online courses and videos for any topic", "Needs balance: screen time and discipline"],
     "Technology has completely changed the way we learn. Today, a student in a small town can watch lectures "
     "from the best teachers in the world, often for free. Online courses, videos and practice platforms let us "
     "learn at our own pace and revise whenever we want. During my own preparation, I used coding websites to "
     "practise every day. However, technology also brings distractions, so self-discipline is very important. "
     "In conclusion, technology is a powerful tool for education, as long as we use it with a clear goal."),
    ("Your biggest strength",
     ["Strength: I learn new things quickly", "Example: learned React in two weeks for a college project", "Why it matters in IT"],
     "My biggest strength is that I learn new things quickly. For example, in my final year, our team needed a "
     "web interface for our project, but none of us knew React. I took the responsibility, followed online "
     "tutorials and built the first version within two weeks. Later, I also helped my teammates understand the "
     "code. In the IT industry, technologies change very fast, so the ability to learn quickly is extremely "
     "valuable. I believe this strength will help me adapt to any project and contribute from the first day."),
    ("Why is teamwork important?",
     ["View: big goals need many skills", "Example: college hackathon", "Teams share load and ideas"],
     "Teamwork is important because most real projects are too big for one person. A software product needs "
     "developers, testers, designers and business analysts working together. When people with different skills "
     "share ideas, the final result is much better. I experienced this during a college hackathon, where our "
     "team of four built a working app in twenty-four hours. We divided the work according to our strengths and "
     "supported each other when someone was stuck. Good teamwork also reduces stress, because the workload is "
     "shared. That is why companies value team players so much."),
    ("Social media: a boon or a bane?",
     ["View: both, depends on how we use it", "Boon: connection, learning, opportunities", "Bane: addiction, fake news"],
     "I think social media is both a boon and a bane, and it depends on how we use it. On the positive side, it "
     "connects people across the world, helps small businesses reach customers and gives us access to useful "
     "information. Platforms like LinkedIn also help students find internships and jobs. On the negative side, "
     "too much social media can become addictive, waste our time and spread fake news very quickly. So, the key "
     "is balance. If we use it with purpose and check facts before sharing, social media can be a great tool."),
    ("How do you handle pressure?",
     ["Stay calm and plan", "Example: two deadlines in one week", "Break work into small tasks, communicate early"],
     "I handle pressure by staying calm and making a clear plan. When I have too much work, I first list all the "
     "tasks and decide which ones are most urgent. Then I break big tasks into smaller steps, so that I can see "
     "progress. For example, last semester I had two project submissions and an exam in the same week. I made a "
     "day-by-day schedule, finished the coding part first and asked my professor early about one doubt. I "
     "completed everything on time. I also believe in communicating early if I need help, instead of waiting "
     "until the last moment."),
    ("A skill you want to learn",
     ["Skill: cloud computing", "Why: most companies are moving to the cloud", "Plan: certification + projects"],
     "One skill I really want to learn is cloud computing. Today, most companies are moving their applications "
     "and data to cloud platforms like AWS, Azure and Google Cloud, so cloud skills are in very high demand. I "
     "have already studied the basics, such as virtual machines and storage, and now I plan to complete a "
     "beginner certification. I also want to deploy one of my college projects on the cloud, because practical "
     "experience is more valuable than theory. I believe this skill will make me a stronger engineer and open "
     "many career opportunities."),
    ("The importance of time management",
     ["View: time is the one resource we cannot get back", "Plan the day, prioritise", "Example: placement preparation"],
     "Time management is important because time is the one resource we can never get back. People who manage "
     "their time well finish their work on time, feel less stressed and still have time for family and health. "
     "A simple method is to plan the day in the morning and do the most important task first. During my "
     "placement preparation, I divided my day into fixed slots for aptitude, coding and communication practice. "
     "This routine helped me stay consistent. In short, good time management is the foundation of success in "
     "both studies and work."),
]

# ---------------------------------------------------------------- Email tasks (task, subject, body)
EMAILS = [
    ("You missed yesterday's team meeting. Write an email to your manager, Mr. Sharma, apologising and explaining.",
     "Apology for Missing Yesterday's Team Meeting",
     "Dear Mr. Sharma,\n\nI am writing to apologise for missing yesterday's team meeting. Due to an unexpected "
     "network outage at my location, I was unable to join the call.\n\nI have gone through the minutes of the "
     "meeting and noted the action items assigned to me. I will complete them by Thursday. I have also arranged a "
     "backup internet connection so that this does not happen again.\n\nThank you for your understanding.\n\n"
     "Best regards,\nAnkit Verma"),
    ("Write an email to your team lead, Ms. Priya, requesting two days of leave next week for a family function.",
     "Leave Request for 14 and 15 November",
     "Dear Ms. Priya,\n\nI would like to request leave for two days, on 14 and 15 November, as I need to attend a "
     "family wedding in my hometown.\n\nI will complete my current tasks before I leave, and Rohit has agreed to "
     "handle any urgent issues during my absence. I will also be reachable on my phone if needed.\n\nKindly let me "
     "know if this is possible.\n\nThank you,\nSneha Iyer"),
    ("The client asked for an update on a delayed module. Write an email explaining the delay and the new date.",
     "Update on the Payment Module Delivery",
     "Dear Mr. Kapoor,\n\nThank you for your patience. I would like to update you on the payment module. During "
     "testing, we found an issue with refunds that needed to be fixed before release.\n\nThe issue has now been "
     "resolved, and the module is in its final round of testing. We will deliver it by Monday, 18 November. I "
     "will share the test report along with it.\n\nPlease let me know if you have any questions.\n\nKind regards,"
     "\nRahul Mehta"),
    ("Write an email to the IT helpdesk reporting that your laptop restarts again and again.",
     "Laptop Restarting Repeatedly – Request for Support",
     "Dear IT Support Team,\n\nI am facing a problem with my laptop (asset ID LT-20457). Since this morning, it "
     "restarts every ten to fifteen minutes, even when only the browser is open. I have already installed the "
     "latest updates, but the problem continues.\n\nThis is affecting my work, so I would be grateful if someone "
     "could check it today. I am available at my desk on the third floor.\n\nThank you,\nKavya Nair"),
    ("Write an email to a colleague thanking them for helping you complete a project.",
     "Thank You for Your Help on the Dashboard Project",
     "Hi Arjun,\n\nI wanted to thank you for your help with the dashboard project last week. Your suggestion to "
     "use a shared data model saved us a lot of time, and the client was very happy with the final demo.\n\nI "
     "really appreciate that you made time for this despite your own deadlines. Please let me know if I can help "
     "you with anything in the future.\n\nBest wishes,\nDiya"),
    ("Write an email to your manager asking to reschedule a meeting because you have a client call at the same time.",
     "Request to Reschedule Tomorrow's 11 a.m. Meeting",
     "Dear Ms. Rao,\n\nI have a client call tomorrow from 10:30 a.m. to 12 p.m., which clashes with our 11 a.m. "
     "review meeting.\n\nCould we please move our meeting to 2 p.m. or 4 p.m. on the same day? I will make sure "
     "the review document is shared with you before the meeting.\n\nI apologise for the inconvenience, and thank "
     "you for your flexibility.\n\nRegards,\nVikram Singh"),
]
