// Master Mock 4 - Verbal (20), English Grammar (5) and English Writing (1). Hand-written; options are placed by the shared rotation.
const L = require('./lib');
const { opts } = require('./rng');
const { mcq, dir, pp } = L;
const MM = { mm: 'M4', tough: true };
let slot = 0;
const nextPos = () => (slot = (slot * 3 + 2) % 4);
// add(sec, topic, question html, correct, [wrong x3], explanation, extra)
const add = (sec, topic, q, correct, wrongs, exp, extra = {}) => { const o = opts(correct, wrongs, nextPos()); return mcq(sec, topic, q, o.opts, o.ans, exp, { ...MM, ...extra }); };
const cr = t => `<p class='dir'>${t}</p>`;

// ---------------- Critical Reasoning (5) ----------------
add('V', 'Critical Reasoning', cr('Choose the option that most <b>weakens</b> the argument.') + pp("<b>Argument:</b> 'The city banned diesel cars last year and its air-quality index has improved since then. Clearly, the ban is the reason for cleaner air.'"),
  'Most factories in the region were shut for much of last year because of a power shortage.',
  ['The city had more diesel cars than petrol cars before the ban.', 'Other cities that did not ban diesel cars also have a high air-quality index.', 'The mayor announced the ban after a public meeting.'],
  'The argument assumes the ban is the only reason for the improvement. If factories, a bigger source of pollution, were shut, they could be the real cause, which weakens the claim. The other options do not offer an alternative cause (the second one is about a different group of cities).');
add('V', 'Critical Reasoning', cr('Choose the option that most <b>strengthens</b> the argument.') + pp("<b>Argument:</b> 'Students of Aryan Academy score higher in placement tests than students of other coaching centres, so Aryan Academy's teaching method is better.'"),
  'Students are admitted to the other centres on the same entrance test and had similar scores before joining.',
  ['Aryan Academy charges a higher fee than most other centres.', 'Aryan Academy has more classrooms than the other centres.', 'The other centres have been running for longer than Aryan Academy.'],
  'The argument compares results and credits the method. It becomes stronger if the groups were equal at the start, because then the difference in results is more likely due to teaching. Fees, rooms and age of the centre do not link the method to the scores.');
add('V', 'Critical Reasoning', cr('Identify the <b>assumption</b> on which the argument depends.') + pp("<b>Argument:</b> 'The company should replace its paper leave forms with a mobile app, because app forms can be filled in half the time.'"),
  'Saving time on leave forms is a worthwhile goal for the company and employees can use the app.',
  ['Paper forms are more expensive than the app.', 'Every other company has already switched to a mobile app.', 'Employees dislike filling in leave forms of any kind.'],
  'The conclusion (replace paper forms) rests on the unstated idea that faster filling is valuable and that people can actually use the app. Cost, other companies and dislike of forms are not needed for the argument.');
add('V', 'Critical Reasoning', cr('Choose the conclusion that <b>must be true</b> on the basis of the facts.') + pp("<b>Facts:</b> 'Everyone who has completed the safety course is allowed into the laboratory. Meena was not allowed into the laboratory.'"),
  'Meena has not completed the safety course.',
  ['Meena is not an employee of the company.', 'Everyone who is allowed into the laboratory has completed the safety course.', 'Meena will never be allowed into the laboratory.'],
  'Completed course &rarr; allowed in. By the contrapositive, not allowed in &rarr; has not completed the course. The second option is the converse (not valid); the others add facts that are not given.');
add('V', 'Critical Reasoning', cr('Choose the option that best <b>resolves the paradox</b>.') + pp("<b>Paradox:</b> 'Summer temperatures in a tourist town were higher than ever this year, yet the sales of ice cream there fell sharply.'"),
  'A new rule banned ice-cream carts from the busiest tourist areas of the town.',
  ['Ice cream is more popular in summer than in winter.', 'Tourists in the town prefer to visit museums in the evening.', 'The price of milk has been steady for three years.'],
  'A rule that removed the carts from where customers are explains why sales fell despite the heat. The other options do not explain a fall in sales, or are about things that did not change.');

// ---------------- English Corrective Usage (3) ----------------
add('V', 'English Corrective Usage', pp('Choose the word that correctly completes the sentence: <i>Neither the manager nor the engineers ______ aware of the change in the schedule.</i>'), 'were', ['was', 'is', 'has been'],
  'With "neither ... nor" the verb agrees with the subject nearest to it. The nearest subject, "the engineers", is plural, so the verb is "were".');
add('V', 'English Corrective Usage', pp('Choose the word that correctly completes the sentence: <i>The new attendance policy will ______ every employee from next month.</i>'), 'affect', ['effect', 'infect', 'afford'],
  '"Affect" is the verb meaning to influence. "Effect" is normally a noun (the result of something).');
add('V', 'English Corrective Usage', pp('Choose the best way to improve the underlined part: <i>The teacher, along with her students, <u>were present</u> at the function.</i>'), 'was present', ['were present', 'are present', 'have been present'],
  'In "A along with B" the verb agrees with A, the main subject. "The teacher" is singular, so "was present" is correct.');

// ---------------- English Error Correction (3) ----------------
add('V', 'English Error Correction', pp('Choose the correct version of the sentence: <i>Each of the players have received a medal.</i>'), 'Each of the players has received a medal.',
  ['Each of the players have received medals.', 'Each of the player has received a medal.', 'Each of the players are receiving a medal.'],
  '"Each" is singular, so it takes "has" even though "players" comes after "of". Option 3 changes the tense and still uses a plural verb.');
add('V', 'English Error Correction', pp('Choose the correct version of the sentence: <i>I prefer tea than coffee in the morning.</i>'), 'I prefer tea to coffee in the morning.',
  ['I prefer tea over than coffee in the morning.', 'I prefer tea rather than coffee in the morning.', 'I am preferring tea than coffee in the morning.'],
  '"Prefer" is followed by "to" (prefer X to Y), never by "than".');
add('V', 'English Error Correction', pp('Choose the correct version of the sentence: <i>He is one of those people who always complains about the food.</i>'), 'He is one of those people who always complain about the food.',
  ['He is one of those people who always complaining about the food.', 'He is one of those person who always complains about the food.', 'He is one of those people whom always complains about the food.'],
  'In "one of those people who ...", the relative pronoun "who" refers to the plural "people", so the verb is plural: "complain".');

// ---------------- English Error Identification (3) ----------------
const ei = (a, b, c) => pp(`Find the part of the sentence that has an error. If there is no error, choose (D).<br>(A) ${a}<br>(B) ${b}<br>(C) ${c}<br>(D) No error`);
add('V', 'English Error Identification', ei('The number of applicants', 'have increased sharply', 'since the rules were relaxed.'), '(B)', ['(A)', '(C)', '(D)'],
  '"The number of" takes a singular verb: "has increased". (Compare "a number of applicants have applied", which is plural.)');
add('V', 'English Error Identification', ei('No sooner did he open the door', 'than the cat', 'runs out of the room.'), '(C)', ['(A)', '(B)', '(D)'],
  'The sentence is about a completed past action, so the verb must be "ran out". "No sooner ... than" is used correctly in (A) and (B).');
add('V', 'English Error Identification', ei('Despite of the heavy rain', 'the match', 'was not cancelled.'), '(A)', ['(B)', '(C)', '(D)'],
  '"Despite" is never followed by "of". Use "Despite the heavy rain" or "In spite of the heavy rain".');

// ---------------- Reading Comprehension (3, one passage) ----------------
{
  const set = pp('<b>Passage.</b> Remote work, once a rare perk, became common almost overnight. Companies discovered that many tasks could be done without a shared office, and workers saved hours once lost to commuting. Yet the shift has not been uniformly smooth. Junior employees, who learn mostly by watching colleagues, often report feeling isolated, and managers struggle to judge effort when output is the only visible measure. Some firms have therefore adopted a hybrid model, asking staff to meet in person on fixed days. Early surveys suggest the arrangement keeps most of the flexibility while repairing some of the lost collaboration, although its long-term effect on promotion and pay remains unclear.').replace("<p>", "<p class='passage'>");
  const w = (topic, q, c, wr, exp) => { const o = opts(c, wr, nextPos()); return mcq('V', topic, q, o.opts, o.ans, exp, { set, ...MM }); };
  w('Reading Comprehension', 'Which of the following best expresses the main idea of the passage?', 'Remote work has brought clear benefits but also problems, which hybrid arrangements try to ease.',
    ['Remote work has failed and companies should return to full-time office work.', 'Junior employees are less productive than senior employees.', 'Hybrid work has been proved to improve promotion and pay.'],
    'The passage lists gains (no commute, flexibility), problems (isolation, hard to judge effort) and the hybrid response, so the main idea covers all three. The other options are too extreme or go beyond the passage (the last one contradicts "remains unclear").');
  w('Reading Comprehension', 'According to the passage, why do junior employees find remote work especially difficult?', 'They learn largely by observing their colleagues.', ['They are not given any output targets.', 'They have to commute for longer hours.', 'Their managers prefer the hybrid model.'],
    'The passage says juniors "learn mostly by watching colleagues", which is hard to do remotely, so they feel isolated.');
  w('Reading Comprehension', "The word 'uniformly' as used in the passage most nearly means:", 'evenly', ['quickly', 'officially', 'rarely'],
    '"Not uniformly smooth" means not smooth in the same way for everyone or everywhere, i.e. not evenly smooth.');
}

// ---------------- Para jumbles (2) ----------------
add('V', 'Para Jumbles', pp('Arrange the sentences to form a coherent paragraph.<br>P. As a result, many farmers installed it within a year.<br>Q. Water tables in the region had fallen sharply over two decades.<br>R. To address this, the government offered subsidies on drip irrigation kits.<br>S. Within five years, water use per acre dropped by a third.'), 'QRPS', ['QPRS', 'RQPS', 'QRSP'],
  'Q states the problem and must come first. R ("To address this") gives the response to Q. P ("As a result") shows the effect of the subsidies, and S gives the later outcome. Order: Q R P S.');
add('V', 'Para Jumbles', pp('Arrange the sentences to form a coherent paragraph.<br>P. Such enthusiasm, however, rarely lasts beyond the first month.<br>Q. Many people begin the new year with ambitious resolutions.<br>R. Researchers suggest that starting with one small change works better.<br>S. They promise to exercise daily or to give up sweets altogether.'), 'QSPR', ['QPSR', 'SQPR', 'QSRP'],
  'Q introduces the topic. S ("They promise ...") explains the resolutions of Q. P ("Such enthusiasm, however") contrasts with the promises, and R offers the advice that follows. Order: Q S P R.');

// ---------------- Synonyms & Antonyms (1) ----------------
add('V', 'Synonyms & Antonyms', pp("Choose the word that is most <b>opposite</b> in meaning to <b>EPHEMERAL</b>."), 'permanent', ['fleeting', 'fragile', 'ordinary'],
  'Ephemeral means lasting a very short time, so its opposite is "permanent". "Fleeting" is a synonym.');

// ================= English Grammar (5) =================
add('G', 'Tenses', pp('Choose the correct form: <i>By the time the guests arrived, the cook ______ the dinner.</i>'), 'had finished', ['has finished', 'finished', 'was finishing'],
  '"By the time" + simple past in the first clause needs the earlier action in the past perfect: "had finished".');
add('G', 'Subject-Verb Agreement', pp('Choose the correct form: <i>Neither of the two answers ______ correct.</i>'), 'is', ['are', 'were', 'have been'],
  '"Neither" (of two) is singular and takes a singular verb: "is".');
add('G', 'Articles & Prepositions', pp('Choose the correct articles: <i>He is ______ honest man who works at ______ university.</i>'), 'an, a', ['a, a', 'an, an', 'a, an'],
  '"Honest" starts with a vowel sound (silent h), so "an honest". "University" starts with a "you" sound, so "a university".');
add('G', 'Active & Passive Voice', pp('Choose the correct passive form of: <i>The manager will approve the proposal tomorrow.</i>'), 'The proposal will be approved by the manager tomorrow.',
  ['The proposal will approve by the manager tomorrow.', 'The proposal is approved by the manager tomorrow.', 'The proposal will be approving by the manager tomorrow.'],
  'Future simple passive = will be + past participle: "will be approved".');
add('G', 'Direct & Indirect Speech', pp('Choose the correct indirect speech: <i>Ravi said, "I am leaving for Pune tomorrow."</i>'), 'Ravi said that he was leaving for Pune the next day.',
  ['Ravi said that he is leaving for Pune tomorrow.', 'Ravi said that I was leaving for Pune the next day.', 'Ravi said that he was leaving for Pune tomorrow.'],
  'The reporting verb "said" is in the past, so "am leaving" becomes "was leaving"; the pronoun "I" becomes "he"; "tomorrow" becomes "the next day".');

// ================= English Writing (1) =================
L.bank.push({ id: 5900, sec: 'W', topic: 'Email / Letter Writing', type: 'write', q: "<p>You have registered for a professional certification exam that is held on two working days next month. Write an email to your manager requesting two days' leave. Give the dates, the reason, how you will manage your work in your absence, and a polite closing. <i>(about 120-150 words)</i></p>", exp: '', mm: 'M4' });

module.exports = L.bank;
