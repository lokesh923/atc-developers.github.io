# Infosys SE Practice Arena

A static practice platform for the Infosys Systems Engineer written test. Open `infosys-se/index.html` (or the folder URL on GitHub Pages). There is no build step for the site itself.

## What is inside

* **Full mock tests** that follow the real pattern (7 sections, own timer per section, answers final once submitted): Mock 1, 2, 3, **Mock 4 Master (image-based)**, plus a **Fresh Mock** that is built from the whole bank every time (unseen questions first, every topic covered, figure questions preferred in Reasoning, Technical and Puzzles).
* **Quick figure tests**: Reasoning (15), Technical (10) and a 50-question hard Reasoning image test (13 figure sets).
* **A practice area for every section** (`#/s/R`, `#/s/T`, `#/s/V`, `#/s/P`, `#/s/Z`, `#/s/G`, `#/s/W`):
  * **Learn**: the study guide chapter by chapter (formulas, question types, solved examples with step-by-step solutions, common mistakes, exam tips, figures).
  * **Quick check**: the practice sets of the guide with answers.
  * **Topic practice**: untimed drills per topic with instant feedback and an explanation for every question, a "figures only" mode, and "retry my mistakes".
  * **Timed tests**: an exam-pattern sectional test, a figure-only sectional test and the whole bank against the clock.
* Progress (attempts and accuracy per question) is kept in the browser's `localStorage`; nothing is sent anywhere.

## Layout

| Path | Purpose |
| --- | --- |
| `index.html`, `style.css` | page shell and theme (light and dark) |
| `app.js` | exam engine: login, instructions, timed sections, results, practice screen |
| `hub.js` | section hubs, Learn view, fresh-mock builder, hash router |
| `data/bank.js` | the original question bank and mocks |
| `data/extra.js` | generated questions and mocks (do not edit by hand) |
| `data/guides.js` | study-guide content parsed from the PDFs (do not edit by hand) |
| `guides/img/` | figures taken from the study guides |
| `../tools/` | generators and parsers that produce `extra.js` and `guides.js` |

## Rebuilding the generated data

```sh
node tools/build.js                    # writes infosys-se/data/extra.js (needs only Node)
node tools/validate.js                 # checks every question: answer index, options, NaN/undefined, mocks
node tools/parse-guides.js <pdf-dir>   # writes data/guides.js and guides/img (needs poppler-utils, ImageMagick, python3 + pymupdf)
```

Every generated question is **computed in code** (charts, seating, floors, syllogisms, Sudoku, logic grids, cube nets, flowcharts, pseudocode traces ...) and, where a puzzle has hidden rules, checked by a solver for a unique answer. The 50-question image set is cross-checked against the answer key of the source PDF while building.

## Adding questions

A question is `{id, sec, topic, type:'mcq', q, opts, ans, exp}` (`set` holds shared HTML such as a figure or passage; `type:'text'` takes `answers`, `type:'write'` is a writing task). Add generators under `tools/gen-bank-*.js` or hand-written items in `tools/gen-bank-vgw.js`, then run `node tools/build.js && node tools/validate.js`.
