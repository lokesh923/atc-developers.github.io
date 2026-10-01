// Practice bank - Verbal, Grammar and Writing (hand-written; each item has a worked explanation).
const L = require('./lib');
const { opts } = require('./rng');
const { mcq, pp } = L;
L.setId(9000);
let slot = 1;
const nextPos = () => (slot = (slot * 3 + 1) % 4);
const add = (sec, topic, q, correct, wrongs, exp, extra = {}) => { const o = opts(correct, wrongs, nextPos()); return mcq(sec, topic, q, o.opts, o.ans, exp, extra); };
const cr = (t, arg) => `<p class='dir'>${t}</p>` + pp(arg);

// ---------------- Critical Reasoning ----------------
add('V', 'Critical Reasoning', cr('Choose the option that most <b>strengthens</b> the argument.', "<b>Argument:</b> 'A bank introduced a mobile app and its customer complaints fell by a third in six months, so the app has made the bank's service better.'"),
  'Complaints about branch queues, the biggest source of earlier complaints, fell sharply once customers started using the app.',
  ['The bank has more branches than any other bank in the city.', 'The app was downloaded by older customers more than younger ones.', 'The bank advertised the app on television.'],
  'The conclusion links the app to better service. Showing that the app removed the main cause of complaints strengthens that link. The other options do not connect the app to the fall in complaints.', { tough: true });
add('V', 'Critical Reasoning', cr('Choose the option that most <b>weakens</b> the argument.', "<b>Argument:</b> 'Sales of the new energy drink doubled after we hired a famous cricketer as brand ambassador, so the cricketer was worth his fee.'"),
  'The company also halved the price of the drink in the same month.',
  ['The cricketer has played for the country for ten years.', 'The drink is sold in three flavours.', 'Other brand ambassadors charge higher fees.'],
  'A price cut is another possible cause of the jump in sales, so it weakens the claim that the cricketer caused it. The other options say nothing about what caused the increase.', { tough: true });
add('V', 'Critical Reasoning', cr('Identify the <b>assumption</b> behind the argument.', "<b>Argument:</b> 'Because our sales team has grown from 10 to 30 people, our revenue will triple next year.'"),
  'Each new salesperson will bring in about as much revenue as an existing one.',
  ['Revenue depends only on advertising spend.', 'Competitors will not hire any new salespeople.', 'The old sales team will leave the company next year.'],
  'To go from three times the people to three times the revenue, each person must be about equally productive. The other options are not required for the conclusion.', { tough: true });
add('V', 'Critical Reasoning', cr('Choose the conclusion that <b>must be true</b>.', "<b>Facts:</b> 'All the interns who finished the project were given a certificate. Rohan was not given a certificate.'"),
  'Rohan did not finish the project.', ['Rohan is not an intern.', 'Only interns were given certificates.', 'No intern who finished the project will be paid.'],
  'Finished &rarr; certificate. By the contrapositive, no certificate &rarr; did not finish. Rohan may or may not be an intern, and the other statements add information.', { tough: true });
add('V', 'Critical Reasoning', cr('Choose the option that best <b>resolves the paradox</b>.', "<b>Paradox:</b> 'A city built a new flyover to reduce traffic jams, yet the time taken to cross the city at peak hour has increased.'"),
  'The flyover attracted many more vehicles that earlier avoided that stretch of road.',
  ['The flyover has four lanes.', 'The city has a metro system.', 'The construction took two years.'],
  'If the flyover drew in extra traffic, travel time can rise even though the road is bigger. The other facts do not explain a longer travel time.', { tough: true });

// ---------------- Corrective Usage ----------------
add('V', 'English Corrective Usage', pp('Choose the word that best completes the sentence: <i>The auditor will ______ the accounts before the report is signed.</i>'), 'examine', ['exempt', 'expand', 'exhale'], '"Examine" means to inspect carefully, which fits an auditor. "Exempt" means to free from a duty.');
add('V', 'English Corrective Usage', pp('Choose the word that best completes the sentence: <i>The two proposals are so ______ that it is hard to choose between them.</i>'), 'similar', ['simile', 'familiar', 'singular'], '"Similar" means alike. "Simile" is a figure of speech and "familiar" means well known.');
add('V', 'English Corrective Usage', pp('Choose the best way to improve the underlined part: <i>He is <u>more cleverer</u> than his brother.</i>'), 'cleverer', ['most clever', 'more clever than', 'much more cleverer'], 'A comparative is formed either with "more" or with "-er", never both. "Cleverer" is correct.');
add('V', 'English Corrective Usage', pp('Choose the word that best completes the sentence: <i>The audience was ______ by the speaker\'s honest and simple words.</i>'), 'moved', ['removed', 'moving', 'movable'], '"Moved" (emotionally touched) fits; "removed" means taken away.');

// ---------------- Error Correction ----------------
add('V', 'English Error Correction', pp('Choose the correct version: <i>The news about the layoffs were shocking.</i>'), 'The news about the layoffs was shocking.', ['The news about the layoffs are shocking.', 'The news about the layoff were shocking.', 'The news about the layoffs have been shocking.'], '"News" is an uncountable noun and takes a singular verb: "was".');
add('V', 'English Error Correction', pp('Choose the correct version: <i>If I would have known the answer, I would have told you.</i>'), 'If I had known the answer, I would have told you.', ['If I knew the answer, I would have told you.', 'If I would know the answer, I would have told you.', 'If I have known the answer, I would told you.'], 'The third conditional is: if + past perfect, would have + past participle. "Would" is not used in the if-clause.');
add('V', 'English Error Correction', pp('Choose the correct version: <i>She did not know to whom should she give the form.</i>'), 'She did not know to whom she should give the form.', ['She did not know to whom did she give the form.', 'She did not know whom to should she give the form.', 'She did not know to whom should give the form.'], 'In an indirect question the word order is normal (subject before verb): "to whom she should give".');

// ---------------- Error Identification ----------------
const ei = (a, b, c) => pp(`Find the part of the sentence that has an error. If there is no error, choose (D).<br>(A) ${a}<br>(B) ${b}<br>(C) ${c}<br>(D) No error`);
add('V', 'English Error Identification', ei('She has been working', 'in this company since five years', 'and enjoys it very much.'), '(B)', ['(A)', '(C)', '(D)'], '"Since" is used with a point of time (since 2020); with a period of time we use "for": "for five years".');
add('V', 'English Error Identification', ei('The committee has decided', 'to postpone the meeting', 'until further notice.'), '(D)', ['(A)', '(B)', '(C)'], '"Committee" is treated as one unit here, so "has decided" is correct; "to postpone" and "until further notice" are also correct. There is no error.');
add('V', 'English Error Identification', ei('She is the taller', 'of all the girls', 'in the class.'), '(A)', ['(B)', '(C)', '(D)'], 'With more than two persons the superlative is needed: "the tallest of all the girls". "Taller" is used only when two are compared.');

// ---------------- Reading Comprehension ----------------
{
  const set = pp("<b>Passage.</b> When a city plants trees along its streets, the benefits are easy to see in summer: shade lowers the temperature of pavements and buildings, and people walk more. Less obvious is the effect on the city's budget. Cooler buildings need less air conditioning, and leaves trap dust that would otherwise have to be cleaned from the air by costly equipment. Critics point out that trees need regular watering and that falling branches can damage cars. Even so, most studies conclude that the savings are larger than the costs, provided the right species are chosen for the local climate.").replace('<p>', "<p class='passage'>");
  const w = (q, c, wr, exp) => { const o = opts(c, wr, nextPos()); return mcq('V', 'Reading Comprehension', q, o.opts, o.ans, exp, { set }); };
  w('According to the passage, which saving is less obvious to the public?', 'Lower spending on air conditioning and air cleaning', ['Lower prices of cars', 'Higher income from tourism', 'Lower water bills for homeowners'], 'The passage says the effect on the budget is "less obvious": cooler buildings need less air conditioning and leaves trap dust that costly equipment would otherwise clean.');
  w('Which of the following would the author most likely agree with?', 'Street trees are worth planting if suitable species are chosen.', ['Street trees should never be planted near parked cars.', 'Trees reduce the need for any other kind of planning.', 'The benefits of trees are visible only in winter.'], 'The final sentence says the savings exceed the costs "provided the right species are chosen", which supports the first option. The others are extreme or contradict the passage.');
  w("The word 'provided' in the last sentence means:", 'on the condition that', ['although', 'given as a gift', 'after a delay'], '"Provided (that)" introduces a condition, like "if".');
}

// ---------------- Para Jumbles ----------------
add('V', 'Para Jumbles', pp('Arrange the sentences to form a coherent paragraph.<br>P. Many of them now rent rather than buy.<br>Q. The cost of housing in big cities has risen faster than salaries.<br>R. This shift is changing what developers choose to build.<br>S. Young professionals have felt the squeeze the most.'), 'QSPR', ['QPSR', 'SQPR', 'QSRP'], 'Q states the problem. S narrows to the group most affected. P describes what that group does ("Many of them"). R draws the consequence ("This shift"). Order: Q S P R.');
add('V', 'Para Jumbles', pp('Arrange the sentences to form a coherent paragraph.<br>P. Within a week, the pilot team had cut the report time by half.<br>Q. The firm wanted to speed up its monthly reports.<br>R. It therefore tested a new template with one team.<br>S. The success led the firm to roll the template out to all departments.'), 'QRPS', ['QPRS', 'RQPS', 'QRSP'], 'Q gives the aim. R ("therefore tested") follows from Q. P reports the result of the test and S the decision that followed. Order: Q R P S.');

// ---------------- Synonyms & Antonyms ----------------
add('V', 'Synonyms & Antonyms', pp('Choose the word that is closest in meaning to <b>MERIT</b>.'), 'worth', ['defect', 'delay', 'denial'], 'Merit means value or excellence; "worth" is the closest.');
add('V', 'Synonyms & Antonyms', pp('Choose the word that is most opposite in meaning to <b>FRUGAL</b>.'), 'wasteful', ['thrifty', 'careful', 'modest'], 'Frugal means careful with money; its opposite is "wasteful" (or extravagant).');
add('V', 'Synonyms & Antonyms', pp('Choose the word that is closest in meaning to <b>CANDID</b>.'), 'frank', ['secretive', 'brave', 'polite'], 'Candid means honest and direct, i.e. frank.');

// ================= English Grammar =================
add('G', 'Tenses', pp('Choose the correct form: <i>She ______ in Pune since 2019.</i>'), 'has been living', ['is living', 'lived', 'was living'], '"Since 2019" shows an action that began in the past and continues now: present perfect continuous.');
add('G', 'Tenses', pp('Choose the correct form: <i>This time tomorrow, we ______ over the Arabian Sea.</i>'), 'will be flying', ['will fly', 'are flying', 'will have flown'], 'An action in progress at a future moment takes the future continuous: "will be flying".');
add('G', 'Subject-Verb Agreement', pp('Choose the correct form: <i>The quality of these products ______ excellent.</i>'), 'is', ['are', 'were', 'have been'], 'The verb agrees with the main subject "quality" (singular), not with "products".');
add('G', 'Subject-Verb Agreement', pp('Choose the correct form: <i>Either the teacher or the students ______ responsible for the mistake.</i>'), 'are', ['is', 'was', 'has been'], 'With "either ... or" the verb agrees with the nearer subject: "the students" (plural).');
add('G', 'Articles & Prepositions', pp('Choose the correct option: <i>He has been working here ______ 2018 and will retire ______ March.</i>'), 'since, in', ['for, on', 'since, at', 'from, in'], '"Since" goes with a point of time (2018). Months take "in".');
add('G', 'Articles & Prepositions', pp('Choose the correct article: <i>She wants to become ______ M.B.A. graduate.</i>'), 'an', ['a', 'the', 'no article'], '"M.B.A." is pronounced with a vowel sound ("em"), so "an".');
add('G', 'Parts of Speech', pp('Choose the correct option: <i>Between you and ______, the plan will not work.</i>'), 'me', ['I', 'myself', 'mine'], 'After a preposition ("between") the object form "me" is used.');
add('G', 'Parts of Speech', pp('Identify the part of speech of the underlined word: <i>She spoke <u>softly</u> to the child.</i>'), 'adverb', ['adjective', 'noun', 'preposition'], '"Softly" tells how she spoke, so it modifies a verb: an adverb.');
add('G', 'Active & Passive Voice', pp('Choose the correct passive form: <i>The engineers are testing the new software.</i>'), 'The new software is being tested by the engineers.', ['The new software is tested by the engineers.', 'The new software was being tested by the engineers.', 'The new software has been tested by the engineers.'], 'Present continuous passive = is/are being + past participle.');
add('G', 'Active & Passive Voice', pp('Choose the correct active form: <i>The report had been submitted by the team before noon.</i>'), 'The team had submitted the report before noon.', ['The team has submitted the report before noon.', 'The team submitted the report before noon.', 'The team had been submitting the report before noon.'], 'Past perfect passive "had been submitted" becomes past perfect active "had submitted".');
add('G', 'Direct & Indirect Speech', pp('Choose the correct indirect speech: <i>The manager said to me, "Submit the file today."</i>'), 'The manager told me to submit the file that day.', ['The manager told me that I submit the file today.', 'The manager asked me that I submitted the file that day.', 'The manager said me to submit the file today.'], 'A command becomes "told + object + to + verb"; "today" becomes "that day".');
add('G', 'Direct & Indirect Speech', pp('Choose the correct indirect speech: <i>She asked, "Where do you live?"</i>'), 'She asked me where I lived.', ['She asked me where did I live.', 'She asked me where I live.', 'She asked me that where I lived.'], 'A wh-question becomes a statement order in indirect speech and the tense moves back: "where I lived".');
add('G', 'Punctuation', pp('Choose the correctly punctuated sentence.'), "My brother's friends, who live in Pune, are visiting us on Sunday.", ["My brothers' friends who live in Pune are visiting us on Sunday.", "My brother's friends, who live in Pune are visiting us on Sunday.", "My brothers friends, who live in Pune, are visiting us on Sunday."], "The apostrophe shows possession (brother's), and the non-essential clause 'who live in Pune' needs commas on both sides.");
add('G', 'Punctuation', pp('Choose the correctly punctuated sentence.'), '"Please wait here," said the receptionist, "until your name is called."', ['"Please wait here" said the receptionist "until your name is called".', '"Please wait here", said the receptionist, "until your name is called."', 'Please wait here, said the receptionist, until your name is called.'], 'A comma goes inside the closing quotation mark, and the quoted words are enclosed in quotation marks.');

// ---- more grammar ----
add('G', 'Tenses', pp('Choose the correct form: <i>When I reached the station, the train ______ already.</i>'), 'had left', ['has left', 'was leaving', 'leaves'], 'Two past actions: the earlier one ("left") takes the past perfect, "had left".');
add('G', 'Tenses', pp('Choose the correct form: <i>If I ______ you, I would accept the offer.</i>'), 'were', ['am', 'would be', 'had been'], 'The second conditional (unreal present) uses the past subjunctive "were" in the if-clause.');
add('G', 'Subject-Verb Agreement', pp('Choose the correct form: <i>Bread and butter ______ my usual breakfast.</i>'), 'is', ['are', 'were', 'have been'], 'Two nouns that form one idea ("bread and butter") take a singular verb.');
add('G', 'Subject-Verb Agreement', pp('Choose the correct form: <i>A number of students ______ absent today.</i>'), 'are', ['is', 'was', 'has been'], '"A number of" means several and takes a plural verb; "the number of" would take a singular verb.');
add('G', 'Articles & Prepositions', pp('Choose the correct preposition: <i>The meeting is scheduled ______ 10 a.m. ______ Monday.</i>'), 'for, on', ['at, in', 'on, at', 'in, on'], 'Times use "at" or "for" in a schedule; days take "on". Here "scheduled for 10 a.m. on Monday" is the standard form.');
add('G', 'Articles & Prepositions', pp('Choose the correct option: <i>She plays ______ violin and her brother plays ______ football.</i>'), 'the, no article', ['a, the', 'the, the', 'no article, a'], 'Musical instruments take "the"; names of games take no article.');
add('G', 'Parts of Speech', pp('Choose the correct word: <i>He is the ______ student in the whole school.</i>'), 'most intelligent', ['more intelligent', 'most intelligenter', 'intelligentest'], 'Long adjectives form the superlative with "most". Comparatives ("more") are for two things.');
add('G', 'Parts of Speech', pp('Identify the part of speech of the underlined word: <i>She is <u>proud</u> of her team.</i>'), 'adjective', ['adverb', 'verb', 'noun'], '"Proud" describes the noun/pronoun "she", so it is an adjective.');
add('G', 'Parts of Speech', pp('Choose the correct conjunction: <i>He worked hard ______ he failed the exam.</i>'), 'yet', ['so', 'because', 'unless'], '"Yet" shows contrast: working hard but still failing. "So" and "because" show cause and result.');
add('G', 'Active & Passive Voice', pp('Choose the correct passive form: <i>Someone has stolen my wallet.</i>'), 'My wallet has been stolen.', ['My wallet was stolen.', 'My wallet is stolen.', 'My wallet had been stolen.'], 'Present perfect active becomes "has/have been + past participle".');
add('G', 'Direct & Indirect Speech', pp('Choose the correct indirect speech: <i>"Can you help me?" she asked him.</i>'), 'She asked him if he could help her.', ['She asked him that could he help her.', 'She asked him if he can help me.', 'She asked him could he help her.'], 'A yes/no question uses "if/whether"; "can" becomes "could"; pronouns change (you &rarr; he, me &rarr; her).');
add('G', 'Punctuation', pp('Choose the correctly punctuated sentence.'), "Its colour is red, but the company's logo is blue.", ["It's colour is red but the companys logo is blue.", "Its colour is red; but the company's logo, is blue.", "It's colour is red, but the companies logo is blue."], '"Its" (possessive) has no apostrophe; "company\'s" shows possession; a comma comes before "but" joining two clauses.');
add('G', 'Punctuation', pp('Choose the correctly punctuated sentence.'), 'On Monday, 5 May, we visited Pune, Mumbai and Nashik.', ['On Monday 5 May we visited Pune Mumbai, and Nashik.', 'On Monday, 5 May we visited, Pune, Mumbai and Nashik.', 'On Monday; 5 May, we visited Pune, Mumbai, and, Nashik.'], 'Commas separate the date elements and the items of a list; no comma is needed before the last "and" in this style.');

// ================= English Writing =================
L.bank.push({ id: 9900, sec: 'W', topic: 'Essay Writing', type: 'write', q: "<p>Write an essay on <b>'Should mobile phones be allowed in classrooms?'</b> Give a clear thesis, two or three reasons with examples, a counter-argument and a conclusion. <i>(about 250 words)</i></p>", exp: '' });
L.bank.push({ id: 9901, sec: 'W', topic: 'Paragraph Writing', type: 'write', q: "<p>Write a paragraph of about 100 words on <b>why teamwork matters in a software project</b>. Begin with a topic sentence and end with a concluding sentence.</p>", exp: '' });
L.bank.push({ id: 9902, sec: 'W', topic: 'Coherence & Logical Structure', type: 'write', q: "<p>Rewrite the following notes as one well-linked paragraph using suitable transition words: <i>The app crashed on Monday. We fixed the bug. We found two more bugs. We tested the app again. The release is on Friday.</i></p>", exp: '' });

module.exports = L.bank;
