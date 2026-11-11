"""Mock Test 5: full revision of all psychometric topics plus test strategy.
Topics: trait recognition across all workplace traits, Risk Orientation, Self-awareness,
Work-Life Balance, Big Five (OCEAN), consistency and response strategy.
Formats (new): Trait identification · Consistency pair · Big Five mapping · Test strategy · Best response with reason.
"""
MOCK_NO = 5
SHUFFLE = True

TID, CONS, B5, STRAT, RESP = ("Trait identification", "Consistency pair", "Big Five mapping",
                              "Test strategy", "Best response with reason")
TQ = 'In a psychometric test, which trait does this statement mainly measure? "{}"'


def tid(stmt, right, wrongs, why, diff="Easy"):
    return ("M", TID, "Trait Recognition", TQ.format(stmt), [right] + wrongs, why, diff)


AGREE = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]


def cons(first, second, right, why, diff="Medium"):
    q = (f'Earlier in the test you answered "Strongly Agree" to: "{first}". '
         f'To stay consistent, what is the best answer to: "{second}"?')
    return ("MF", CONS, "Consistency", q, AGREE, right, why, diff)


OCEAN = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism (low emotional stability)"]
BQ = 'Which Big Five (OCEAN) trait does this behaviour mainly show? "{}"'


def b5(behaviour, right, why, diff="Medium"):
    return ("MF", B5, "Big Five Personality Model", BQ.format(behaviour), OCEAN, right, why, diff)


def resp(stmt, good, wrongs, why, diff="Medium"):
    return ("M", RESP, "Response Strategy",
            f'What is the best response to this statement in a psychometric test, and why? "{stmt}"',
            [good] + wrongs, why, diff)


ITEMS = [
    # ---------- Trait identification (14) ----------
    tid("I adjust quickly when my project is changed at short notice.", "Adaptability",
        ["Integrity", "Extraversion", "Creativity"], "Coping well with sudden change is the definition of adaptability."),
    tid("I always report my own mistakes to my lead.", "Integrity",
        ["Time Management", "Extraversion", "Learning Agility"], "Reporting your own mistakes is about honesty, which is integrity."),
    tid("I enjoy finding new ways to solve old problems.", "Innovation & Creativity",
        ["Conscientiousness", "Stress Management", "Customer Orientation"], "Looking for new solutions to familiar problems is creativity."),
    tid("I remain calm when systems go down during a release.", "Stress Management / Emotional Stability",
        ["Leadership", "Openness", "Teamwork"], "Staying calm in a crisis measures emotional stability under stress."),
    tid("I make sure every task I accept is completed on time.", "Ownership & Dependability",
        ["Extraversion", "Creativity", "Diversity & Inclusion"], "Finishing what you accept, on time, is dependability."),
    tid("I can sense when a colleague is upset and adjust how I talk to them.", "Emotional Intelligence",
        ["Time Management", "Risk Orientation", "Decision Making"], "Reading others' emotions and adjusting to them is emotional intelligence.", "Medium"),
    tid("I invite quieter team members to share their views.", "Inclusion & Leadership",
        ["Conscientiousness", "Risk Orientation", "Learning Agility"], "Making space for everyone to contribute is inclusive leadership.", "Medium"),
    tid("I try to understand the client's business goals before designing a solution.", "Customer Orientation",
        ["Extraversion", "Stress Management", "Time Management"], "Starting from the client's goals is customer orientation.", "Medium"),
    tid("I break my work into daily targets.", "Time Management",
        ["Agreeableness", "Integrity", "Extraversion"], "Splitting work into daily targets is a time-management habit."),
    tid("I would rather discuss a disagreement than avoid it.", "Conflict Resolution",
        ["Learning Agility", "Customer Orientation", "Time Management"], "Choosing to address disagreements is about conflict resolution.", "Medium"),
    tid("I sign up for online courses in my free time.", "Learning Agility",
        ["Agreeableness", "Conflict Resolution", "Risk Orientation"], "Learning without being asked shows learning agility and self-motivation."),
    tid("I check the facts before I accept a conclusion.", "Decision Making / Critical Thinking",
        ["Extraversion", "Diversity & Inclusion", "Teamwork"], "Verifying facts before concluding is critical thinking.", "Medium"),
    tid("I am willing to take calculated risks when the potential benefit is clear.", "Risk Orientation",
        ["Integrity", "Agreeableness", "Punctuality"], "Weighing risk against benefit before acting is a balanced risk orientation.", "Hard"),
    tid("I know my strengths and the areas where I need to improve.", "Self-awareness",
        ["Extraversion", "Time Management", "Customer Orientation"], "Knowing your own strengths and gaps is self-awareness.", "Medium"),

    # ---------- Consistency pair (12) ----------
    cons("I enjoy working in teams.", "I get more done when I work completely alone.", 2,
         "The second statement is the reversed form of teamwork. To stay consistent, disagree with it."),
    cons("I am honest even when it costs me.", "Small lies at work are harmless.", 1,
         "This is the reversed form of integrity, a core value. Strongly Disagree keeps you consistent.", "Easy"),
    cons("I stay calm under pressure.", "Tight deadlines make me panic.", 2,
         "Panic is the opposite of staying calm. Disagree to stay consistent."),
    cons("I love learning new technologies.", "I prefer to keep using only the tools I already know.", 2,
         "Preferring only familiar tools contradicts a love of learning. Disagree."),
    cons("I take responsibility for my results.", "When things go wrong, it is usually someone else's fault.", 1,
         "Blaming others is the reverse of ownership, a core value. Strongly Disagree.", "Easy"),
    cons("I adapt easily to change.", "I enjoy it when my role gives me new challenges.", 4,
         "This is the same trait in a positive form, so agree. That keeps your stand consistent.", "Hard"),
    cons("I double-check my work.", "I submit work without reviewing it when I am short of time.", 2,
         "Skipping reviews contradicts double-checking. Disagree."),
    cons("I respect different points of view.", "I value hearing opinions that challenge mine.", 4,
         "This is a positive restatement of the same trait. Agree to stay consistent.", "Hard"),
    cons("I always meet my deadlines.", "I often need extensions to complete my work.", 2,
         "Frequently needing extensions contradicts meeting deadlines. Disagree."),
    cons("I raise problems early.", "I prefer to solve problems silently before anyone finds out.", 2,
         "Hiding problems is the reverse of raising them early. Disagree."),
    cons("I follow rules strictly.", "Rules can be ignored when the manager is not around.", 1,
         "This is a reversed integrity statement. Strongly Disagree.", "Easy"),
    cons("I enjoy meeting new people.", "I feel energised after networking events.", 4,
         "Same trait (sociability), positively worded. Agree to stay consistent.", "Hard"),

    # ---------- Big Five mapping (10) ----------
    b5("Loves trying new foods, ideas and art forms.", 1,
       "Curiosity and enjoying new experiences is Openness. A high level suits fast-changing tech roles.", "Easy"),
    b5("Keeps a detailed planner and never misses a deadline.", 2,
       "Organisation and reliability is Conscientiousness, the trait most valued for freshers.", "Easy"),
    b5("Feels energised after a full day of meetings and networking.", 3,
       "Gaining energy from social interaction is Extraversion.", "Easy"),
    b5("Forgives easily and likes helping others.", 4,
       "Kindness, cooperation and forgiveness are Agreeableness.", "Easy"),
    b5("Often feels anxious and has frequent mood swings.", 5,
       "Anxiety and mood swings reflect high Neuroticism. Workplace profiles aim for low neuroticism, which is high emotional stability."),
    b5("Often asks 'What if we tried a completely different way?' in discussions.", 1,
       "Questioning the usual approach and imagining alternatives is Openness."),
    b5("Prefers to cooperate rather than compete with teammates.", 4,
       "Cooperation over competition is a classic Agreeableness behaviour."),
    b5("Takes charge and speaks first in group discussions.", 3,
       "Assertiveness and speaking up readily are part of Extraversion."),
    b5("Checks every detail and follows procedures carefully.", 2,
       "Carefulness and following procedures is Conscientiousness."),
    b5("Worries for days about small mistakes.", 5,
       "Prolonged worry over small things is a sign of high Neuroticism, meaning lower emotional stability.", "Hard"),

    # ---------- Test strategy (10) ----------
    ("M", STRAT, "Test Strategy", "In a 54-question behavioural test, how often should you ideally choose 'Neutral'?",
     ["Rarely, about fewer than 5 times", "As often as possible, to stay safe",
      "Never, under any circumstances", "For every question that feels difficult"],
     "Occasional Neutral answers are fine, but overusing them makes you look indecisive and gives the test little information.", "Easy"),
    ("M", STRAT, "Test Strategy", "How should you answer a statement that uses 'never' to describe perfect behaviour, for example 'I have never been late'?",
     ["Disagree, because no real person is perfect", "Strongly Agree, to look ideal",
      "Skip it", "Always choose Neutral"],
     "'Never/always' claims of perfect behaviour are honesty checks. Agreeing makes your profile less believable.", "Easy"),
    ("M", STRAT, "Test Strategy", "Why do psychometric tests ask about the same trait several times?",
     ["To check whether your answers are consistent", "To fill up the time limit",
      "Because of errors in the test", "To test your memory"],
     "Repeated, reworded items detect inconsistent or random answering.", "Easy"),
    ("M", STRAT, "Test Strategy", "What is a 'reversed' (reverse-keyed) statement?",
     ["A statement describing the opposite of a desirable trait, so the ideal answer is to disagree",
      "A statement written backwards", "A statement with no right answer", "A statement you should skip"],
     "Reversed statements test the same trait from the opposite side. Words like 'not', 'rarely' and 'avoid' often signal them.", "Medium"),
    ("M", STRAT, "Test Strategy", "In the Accenture behavioural round (54 statements in 20 minutes), about how much time do you get per statement?",
     ["About 22 seconds", "About 10 seconds", "About 1 minute", "About 2 minutes"],
     "20 minutes ÷ 54 statements ≈ 22 seconds each, which is enough time if you trust your first instinct.", "Easy"),
    ("M", STRAT, "Test Strategy", "Which answer pattern looks the LEAST believable to a psychometric test?",
     ["Strongly Agree to every positive statement and Strongly Disagree to every negative one",
      "A mix of Agree and Strongly Agree", "Disagreeing with 'too perfect' claims", "Using Neutral a few times"],
     "An all-extreme pattern looks like someone trying too hard. Balanced answers are more believable.", "Medium"),
    ("M", STRAT, "Test Strategy", "What is the best mindset for a behavioural test?",
     ["Answer as your best professional self, honestly and consistently",
      "Answer as whatever person you think the company wants, regardless of the truth",
      "Answer randomly to finish faster", "Answer as you behave on your worst day"],
     "Honest, consistent answers from your best professional self give a strong and believable profile.", "Easy"),
    ("M", STRAT, "Test Strategy", "You are unsure how to answer a statement. What is the best approach?",
     ["Identify the trait it measures and go with your first professional instinct",
      "Spend two minutes thinking about it", "Leave it blank", "Always choose Neutral"],
     "Identify the trait, check whether the statement is positive or reversed, and answer quickly. Overthinking wastes time.", "Medium"),
    ("M", STRAT, "Test Strategy", "Is the Accenture behavioural (psychometric) part reported to cause direct elimination?",
     ["Candidates report no direct elimination, but it should still be taken seriously",
      "Yes, it is the most elimination-heavy round", "It is not part of the assessment", "Only for the Advanced ASE role"],
     "Candidate reports suggest no direct elimination, but your profile may still be used with your other results.", "Medium"),
    ("M", STRAT, "Test Strategy", "Which words in a statement should make you slow down and re-read it carefully?",
     ["'not', 'rarely', 'avoid'", "'team', 'work'", "'I', 'my'", "'company', 'office'"],
     "These words often reverse the meaning of a statement. Misreading them causes inconsistent answers.", "Easy"),

    # ---------- Best response with reason (8) ----------
    resp("I rarely ask for help, even when I am stuck.",
         "Disagree, because asking for help early saves time and shows good communication",
         ["Agree, because it shows independence", "Strongly Agree, because it shows confidence",
          "Neutral, because there is no right answer"],
         "Not asking for help when stuck wastes time. This is a reversed communication statement."),
    resp("I enjoy being the one who decides everything in a group.",
         "Disagree, because good leaders involve others in decisions",
         ["Strongly Agree, because leaders must decide everything", "Agree, because it shows confidence",
          "Neutral, to avoid looking bossy"],
         "Wanting to control every decision signals poor collaboration. Leadership is about involving people.", "Hard"),
    resp("I sometimes feel tired after a long working day.",
         "Agree, because it is a normal, honest admission",
         ["Strongly Disagree, because I am never tired", "Disagree, because admitting tiredness looks weak",
          "Skip it, because it is a trick question"],
         "Normal human admissions make your profile believable. Denying them looks like faking.", "Medium"),
    resp("I would keep quiet if I saw a colleague falsifying a report.",
         "Strongly Disagree, because integrity requires reporting it",
         ["Neutral, because it is not my business", "Agree, to avoid conflict with the colleague",
          "Disagree only if it affects my own work"],
         "Falsifying reports is a serious ethical breach. Integrity items need a firm answer.", "Easy"),
    resp("I like trying different approaches to solve the same problem.",
         "Agree, because it shows creativity and openness",
         ["Disagree, because one approach is always enough", "Strongly Disagree, because it wastes time",
          "Neutral, because it does not matter"],
         "Exploring alternatives is a positive sign of creativity and openness.", "Easy"),
    resp("I get upset when other people review my work.",
         "Disagree, because reviews help improve quality",
         ["Agree, because reviews are annoying", "Strongly Agree, because my work does not need review",
          "Neutral, because it depends on my mood"],
         "Reviews are standard in IT. Getting upset by them signals low openness to feedback."),
    resp("Work-life balance does not matter as long as the work gets done.",
         "Disagree, because a sustainable balance keeps performance high, while staying flexible for urgent needs",
         ["Strongly Agree, because work always comes first", "Agree, to show dedication",
          "Neutral, to avoid taking a position"],
         "Burnout lowers performance. A balanced view, flexible when it is truly urgent, is the mature answer.", "Hard"),
    resp("I prefer a quiet environment when I need to concentrate.",
         "Agree, because it is a normal work preference that does not harm teamwork",
         ["Strongly Disagree, because I must show I love busy places",
          "Disagree, because preferring quiet means I am not a team player",
          "Skip it, because it is a trap"],
         "Not every statement is a trap. Harmless personal preferences can be answered honestly.", "Hard"),
]
