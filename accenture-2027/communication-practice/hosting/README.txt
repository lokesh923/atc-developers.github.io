Upload to Hostinger (newoffcampusjobs.com)
1. hPanel -> Websites -> newoffcampusjobs.com -> File Manager -> open public_html
2. Create a folder "practice" (if it does not exist) and open it
3. Upload newoffcampusjobs-communication-practice.zip and Extract it here
   -> you get public_html/practice/communication/index.html and .htaccess
4. Open https://newoffcampusjobs.com/practice/communication/ to check
5. Graphy -> Create new item -> Text -> HTML/iFrame (code view), paste exactly this (fixed height, not vh):
<iframe src="https://newoffcampusjobs.com/practice/communication/?embed=1" allow="microphone; autoplay; fullscreen" allowfullscreen scrolling="yes" style="display:block;width:100%;height:640px;border:0;" title="Communication Assessment"></iframe>

If the lesson area in Graphy is short, lower 640px (for example 560px). The page scrolls inside the frame,
and the "Full screen" button at the bottom right of the page gives it the whole screen.
