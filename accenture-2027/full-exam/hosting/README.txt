Full exam on your website, shown in Graphy through an iframe (the microphone works in the Communication round)

Upload to Hostinger (newoffcampusjobs.com)
1. hPanel -> Websites -> newoffcampusjobs.com -> File Manager -> open public_html
2. Open the folder "practice" (create it if it does not exist)
3. Upload newoffcampusjobs-full-exam.zip and Extract it here
   -> you get public_html/practice/full-exam/index.html and .htaccess
   (.htaccess starts with a dot: in File Manager turn on "Show hidden files" to see it)
4. Open https://newoffcampusjobs.com/practice/full-exam/ to check that the exam opens
5. Graphy -> Create new item -> Text -> HTML/iFrame (source / code view), paste:

<iframe src="https://newoffcampusjobs.com/practice/full-exam/" allow="microphone; autoplay; fullscreen; clipboard-write" allowfullscreen style="width:100%;height:92vh;min-height:640px;border:0;" title="Accenture Full Exam Simulation"></iframe>

Notes
- The page is about 9 MB; it loads once and then runs in the browser.
- The Coding round's Java / C++ / C / Python run on wandbox.org, so candidates need internet.
- Scores are shown in the final report on the page; this iframe route does not send a score to Graphy
  (use the SCORM zip if you need the score inside Graphy, but there the microphone stays blocked).
