# Infosys Systems Engineer interview prep

Static site (no build step). Open `index.html`, or serve the folder on GitHub Pages at `/infosys-interview/`.

- 12 question modules (DSA, OOPs, DBMS, OS, networks, SDLC, modern tech, Java, Python, C/C++, HR, projects) plus the process guide
- 28 coding problems with Java, Python and C solutions
- 31 SQL queries on a sample database with real outputs
- 9 cheat sheets, 7/14/30-day study plans, mock interview, progress saved in localStorage

## Verification
`node tools/verify-interview.js` compiles and runs every `// runnable` code block and every coding solution (Java, Python, C, C++), checks their output against the stated results, and runs all SQL on SQLite.
`python3 tools/gen-interview-sql.py` regenerates `data/sql.js` from real query results.

## Packaging
`node tools/bundle-interview.js <outdir>` writes a single-file HTML and a SCORM 1.2 zip.
