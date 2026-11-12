/* Front-end Technology practice bank.
 * stack: "web" (HTML + CSS + JS), "react" (App.jsx + CSS, JSX compiled in the browser), "vue" (HTML template + JS + CSS).
 * files / solution: starter code and reference solution for each file of the stack.
 * tests: run one by one, each in a fresh preview. fn(t) gets helpers (see makeHelpers in the app) and must
 *        return true, or throw / return a string explaining what is wrong.
 */
var FE_BANK = [
/* ======================================================================= 1 (exam pattern) */
{ id:"f1", original:true, stack:"web", difficulty:"Easy", topic:"DOM + classList + CSS",
  title:"Change a Paragraph's Style on Click",
  intro:"You are styling HTML elements (border and background) for a project. Complete the HTML, CSS and JavaScript code to implement the following.",
  objectives:[
    "Create a paragraph element with id <b>\"p\"</b>, class <b>\"default\"</b> and inner text <b>\"This a paragraph\"</b>, above the button.",
    "Give the paragraph a width of <b>120px</b>.",
    "Create a class named <b>\"change\"</b> that sets a <b>dashed</b> border and the background-color <b>#71E5F4</b>.",
    "When the <b>\"Click\"</b> button is pressed, replace the paragraph's class with <b>\"change\"</b>, so the new styles are applied dynamically."],
  constraints:["Do not change the id of the button.","The dashed border and the colour must come from the change class, not be set before the click."],
  files:{
html:`<!-- TODO: create the paragraph here -->

<button id="btn">Click</button>
`,
css:`body { font-family: Arial, sans-serif; padding: 20px; }

#btn {
    background-color: #8B4513;
    color: white;
    border: none;
    padding: 8px 30px;
    border-radius: 4px;
    margin-top: 10px;
}

/* TODO: width of the paragraph */

/* TODO: create the .change class */
`,
js:`// TODO: when the button is clicked, change the paragraph's class to "change"
`},
  solution:{
html:`<p id="p" class="default">This a paragraph</p>

<button id="btn">Click</button>
`,
css:`body { font-family: Arial, sans-serif; padding: 20px; }

#btn {
    background-color: #8B4513;
    color: white;
    border: none;
    padding: 8px 30px;
    border-radius: 4px;
    margin-top: 10px;
}

#p { width: 120px; }

.change {
    border: 2px dashed black;
    background-color: #71E5F4;
}
`,
js:`document.getElementById("btn").addEventListener("click", function () {
    document.getElementById("p").className = "change";
});
`},
  tests:[
    {name:"Paragraph #p exists with the text \"This a paragraph\"", fn:t=>{var p=t.$("p#p");t.ok(p,"No <p> with id=\"p\" found.");t.ok(t.text(p)==="This a paragraph","Paragraph text is \""+t.text(p)+"\".");return true;}},
    {name:"Paragraph width is 120px", fn:t=>{var p=t.$("#p");t.ok(p,"No #p element.");t.ok(t.css(p,"width")==="120px","Width is "+t.css(p,"width")+".");return true;}},
    {name:"Before the click the border is not dashed", fn:t=>{var p=t.$("#p");t.ok(p,"No #p element.");t.ok(t.css(p,"border-top-style")!=="dashed","The dashed border is already applied before the click.");return true;}},
    {name:"After the click the class is \"change\"", fn:async t=>{await t.click(t.$("#btn"));var p=t.$("#p");t.ok(p&&p.classList.contains("change"),"Class after click: \""+(p?p.className:"")+"\".");t.ok(!p.classList.contains("default"),"The old class \"default\" should be replaced.");return true;}},
    {name:"After the click: dashed border and background #71E5F4", fn:async t=>{await t.click(t.$("#btn"));var p=t.$("#p");t.ok(t.css(p,"border-top-style")==="dashed","Border style is "+t.css(p,"border-top-style")+".");t.sameColor(p,"background-color","#71E5F4");return true;}}
  ]},

/* ======================================================================= 2 (exam pattern) */
{ id:"f2", original:true, stack:"web", difficulty:"Medium", topic:"JS functions + Math + CSS",
  title:"Trigonometry Calculator",
  intro:"Create a simple trigonometry calculator that calculates sine, cosine and tangent for any angle. The structure and most styling are ready; implement three key features.",
  objectives:[
    "Add a heading <b>h1</b> with the text <b>\"Calculator\"</b> at the top of the container.",
    "Set the <b>background-color</b> of the calculate button to <b>#4CAF50</b> (green).",
    "Complete the <b>calculateResult</b> function to return the correct trigonometric value for the selected function and angle."],
  constraints:["Use the Math object for trigonometric calculations.","Angles are entered in degrees, but JavaScript trigonometric functions use radians. Convert the angle before calculating."],
  files:{
html:`<div class="container">
    <!-- TODO: add the heading -->
    <label for="function">Select Function:</label>
    <select id="function">
        <option value="sin">Sine (sin)</option>
        <option value="cos">Cosine (cos)</option>
        <option value="tan">Tangent (tan)</option>
    </select>
    <label for="angle">Angle (degrees):</label>
    <input type="number" id="angle" value="30">
    <button id="calculate">Calculate</button>
    <div class="result-box">Result: <span id="result">-</span></div>
</div>
`,
css:`body { font-family: Arial, sans-serif; display: flex; justify-content: center; padding: 20px; }
.container { width: 340px; display: flex; flex-direction: column; gap: 8px; }
h1 { text-align: center; margin: 0 0 8px; }
select, input { padding: 8px; font-size: 15px; }
#calculate {
    color: white;
    border: none;
    padding: 10px;
    font-size: 16px;
    border-radius: 6px;
    /* TODO: background colour */
}
.result-box { background: #e3f2fd; padding: 12px; text-align: center; font-weight: bold; border-radius: 6px; }
`,
js:`function calculateResult(functionName, angleDegrees) {
    // TODO: convert the angle to radians and
    // return Math.sin / Math.cos / Math.tan of it based on functionName
}

document.getElementById("calculate").addEventListener("click", function () {
    var fn = document.getElementById("function").value;
    var angle = parseFloat(document.getElementById("angle").value);
    var value = calculateResult(fn, angle);
    document.getElementById("result").textContent =
        (typeof value === "number") ? parseFloat(value.toFixed(4)) : "-";
});
`},
  solution:{
html:`<div class="container">
    <h1>Calculator</h1>
    <label for="function">Select Function:</label>
    <select id="function">
        <option value="sin">Sine (sin)</option>
        <option value="cos">Cosine (cos)</option>
        <option value="tan">Tangent (tan)</option>
    </select>
    <label for="angle">Angle (degrees):</label>
    <input type="number" id="angle" value="30">
    <button id="calculate">Calculate</button>
    <div class="result-box">Result: <span id="result">-</span></div>
</div>
`,
css:`body { font-family: Arial, sans-serif; display: flex; justify-content: center; padding: 20px; }
.container { width: 340px; display: flex; flex-direction: column; gap: 8px; }
h1 { text-align: center; margin: 0 0 8px; }
select, input { padding: 8px; font-size: 15px; }
#calculate {
    color: white;
    border: none;
    padding: 10px;
    font-size: 16px;
    border-radius: 6px;
    background-color: #4CAF50;
}
.result-box { background: #e3f2fd; padding: 12px; text-align: center; font-weight: bold; border-radius: 6px; }
`,
js:`function calculateResult(functionName, angleDegrees) {
    var angleRadians = (angleDegrees * Math.PI) / 180;
    if (functionName === "sin") {
        return Math.sin(angleRadians);
    } else if (functionName === "cos") {
        return Math.cos(angleRadians);
    } else if (functionName === "tan") {
        return Math.tan(angleRadians);
    }
}

document.getElementById("calculate").addEventListener("click", function () {
    var fn = document.getElementById("function").value;
    var angle = parseFloat(document.getElementById("angle").value);
    var value = calculateResult(fn, angle);
    document.getElementById("result").textContent =
        (typeof value === "number") ? parseFloat(value.toFixed(4)) : "-";
});
`},
  tests:[
    {name:"h1 with the text \"Calculator\"", fn:t=>{var h=t.$("h1");t.ok(h,"No h1 found.");t.ok(t.text(h)==="Calculator","h1 text is \""+t.text(h)+"\".");return true;}},
    {name:"Calculate button background is #4CAF50", fn:t=>{t.sameColor(t.$("#calculate"),"background-color","#4CAF50");return true;}},
    {name:"calculateResult(\"sin\", 30) is 0.5", fn:t=>{var f=t.win.calculateResult;t.ok(typeof f==="function","calculateResult is not defined.");var v=f("sin",30);t.ok(typeof v==="number"&&Math.abs(v-0.5)<1e-9,"Returned "+v+".");return true;}},
    {name:"calculateResult works for cos and tan", fn:t=>{var f=t.win.calculateResult;var c=f("cos",60),g=f("tan",45);t.ok(Math.abs(c-0.5)<1e-9,"cos(60) returned "+c+".");t.ok(Math.abs(g-1)<1e-9,"tan(45) returned "+g+".");return true;}},
    {name:"UI: cos of 0 degrees shows 1", fn:async t=>{await t.select(t.$("#function"),"cos");await t.type(t.$("#angle"),"0");await t.click(t.$("#calculate"));t.ok(t.text(t.$("#result"))==="1","Result shows \""+t.text(t.$("#result"))+"\".");return true;}}
  ]},

/* ======================================================================= 3 (exam pattern) */
{ id:"f3", original:true, stack:"web", difficulty:"Medium", topic:"Search filter + data attributes",
  title:"Product Search Filter",
  intro:"You are developing a search filter for a new website. The setup is incomplete; finish it correctly.",
  objectives:[
    "Add <b>5 list elements</b> (fruits or vegetables) in the unordered list, each with the class <b>\"product\"</b> and an attribute <b>\"data-name\"</b> containing its search tag (for example data-name=\"banana\"). At least one must contain \"nana\".",
    "Set the initial search value to <b>\"nana\"</b>.",
    "Display a product if the search text is part of its data-name (ignore upper/lower case); otherwise hide it using the CSS <b>display</b> style. The filter must run on page load and every time the search text changes.",
    "Set the font size of the list items to <b>25px</b>."],
  constraints:["Do not change the id or class attributes of the elements given in the starter code.","Hide items with style.display = \"none\" and show them with an empty display value."],
  files:{
html:`<input type="text" id="search" placeholder="Search...">
<ul id="productList">
    <!-- TODO: add 5 li.product items with data-name -->
</ul>
`,
css:`body { font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0; }
#search { width: 280px; padding: 10px; font-size: 18px; border: 2px solid #2e7d32; border-radius: 6px; }
ul { list-style: none; padding: 0; }
.product { padding: 6px 0; }
/* TODO: font size of the list items */
`,
js:`var search = document.getElementById("search");

function filterProducts() {
    // TODO: show a product if search.value is part of its data-name, else hide it
}

// TODO: set the initial search value, run the filter now and on every input
`},
  solution:{
html:`<input type="text" id="search" placeholder="Search...">
<ul id="productList">
    <li class="product" data-name="banana">Banana</li>
    <li class="product" data-name="apple">Apple</li>
    <li class="product" data-name="mango">Mango</li>
    <li class="product" data-name="carrot">Carrot</li>
    <li class="product" data-name="ananas pineapple">Pineapple</li>
</ul>
`,
css:`body { font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0; }
#search { width: 280px; padding: 10px; font-size: 18px; border: 2px solid #2e7d32; border-radius: 6px; }
ul { list-style: none; padding: 0; }
.product { padding: 6px 0; }
li { font-size: 25px; }
`,
js:`var search = document.getElementById("search");

function filterProducts() {
    var term = search.value.toLowerCase();
    document.querySelectorAll(".product").forEach(function (item) {
        var name = item.getAttribute("data-name").toLowerCase();
        item.style.display = name.includes(term) ? "" : "none";
    });
}

search.value = "nana";
filterProducts();
search.addEventListener("input", filterProducts);
`},
  tests:[
    {name:"5 li.product items, each with a data-name", fn:t=>{var l=t.$$("ul#productList li.product");t.ok(l.length===5,"Found "+l.length+" li.product items, expected 5.");t.ok(l.every(x=>x.hasAttribute("data-name")&&x.getAttribute("data-name").trim()),"Every product needs a non-empty data-name.");return true;}},
    {name:"Initial search value is \"nana\"", fn:t=>{t.ok(t.$("#search").value==="nana","Search value is \""+t.$("#search").value+"\".");return true;}},
    {name:"On load only products matching \"nana\" are visible", fn:t=>{var l=t.$$("li.product");var m=l.filter(x=>x.getAttribute("data-name").toLowerCase().includes("nana"));t.ok(m.length>0,"No product contains \"nana\" in its data-name.");t.ok(m.length<l.length,"All products contain \"nana\"; add some that do not.");l.forEach(x=>{var vis=t.css(x,"display")!=="none";var should=x.getAttribute("data-name").toLowerCase().includes("nana");t.ok(vis===should,"\""+x.getAttribute("data-name")+"\" is "+(vis?"visible":"hidden")+" but should be "+(should?"visible":"hidden")+".");});return true;}},
    {name:"Typing a new search updates the list", fn:async t=>{var l=t.$$("li.product");var term=l[0].getAttribute("data-name").slice(0,3).toUpperCase();await t.type(t.$("#search"),term);l.forEach(x=>{var vis=t.css(x,"display")!=="none";var should=x.getAttribute("data-name").toLowerCase().includes(term.toLowerCase());t.ok(vis===should,"After typing \""+term+"\", \""+x.getAttribute("data-name")+"\" should be "+(should?"visible":"hidden")+".");});await t.type(t.$("#search"),"");t.ok(l.every(x=>t.css(x,"display")!=="none"),"An empty search should show every product.");return true;}},
    {name:"List items have font-size 25px", fn:t=>{var l=t.$$("li.product");t.ok(l.length,"No list items.");t.ok(l.every(x=>t.css(x,"font-size")==="25px"),"Font size is "+t.css(l[0],"font-size")+".");return true;}}
  ]},

/* ======================================================================= 4 (exam pattern) */
{ id:"f4", original:true, stack:"web", difficulty:"Medium", topic:"DOM structure + remove()",
  title:"Notification Center",
  intro:"You are creating a Notification Center for a new website. The goal is to set up the correct logic for notifications. The project is not complete yet; finish it.",
  objectives:[
    "Inside the div with class <b>notification-list</b>, add three div tags with the class names <b>\"slide\"</b>, <b>\"message\"</b> and <b>\"time\"</b>, containing the texts <b>\"Account Alert\"</b>, <b>\"Your account password was updated successfully\"</b> and <b>\"5 mins ago\"</b> respectively.",
    "Remove the background colour of the class <b>notification-list</b> in the CSS code.",
    "Write JavaScript so that clicking the cross (<b>.close</b>) removes the notification from the page."],
  constraints:["You must <b>remove</b> the notification element from the page, not just hide it.","Do not change the id or class attributes of existing elements."],
  files:{
html:`<h1>Notification Center</h1>
<div class="notification-list">
    <span class="close">&times;</span>
    <!-- TODO: add the slide, message and time divs -->
</div>
`,
css:`body { font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; }
.notification-list {
    position: relative;
    width: 420px;
    padding: 14px 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,.08);
    background-color: #ffe0e0;
}
.close { position: absolute; top: 8px; right: 14px; cursor: pointer; font-size: 20px; }
.slide { font-weight: bold; font-size: 20px; }
.message { margin: 6px 0; }
.time { color: #888; }
`,
js:`// TODO: remove the notification when the cross is clicked
`},
  solution:{
html:`<h1>Notification Center</h1>
<div class="notification-list">
    <span class="close">&times;</span>
    <div class="slide">Account Alert</div>
    <div class="message">Your account password was updated successfully</div>
    <div class="time">5 mins ago</div>
</div>
`,
css:`body { font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; }
.notification-list {
    position: relative;
    width: 420px;
    padding: 14px 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,.08);
}
.close { position: absolute; top: 8px; right: 14px; cursor: pointer; font-size: 20px; }
.slide { font-weight: bold; font-size: 20px; }
.message { margin: 6px 0; }
.time { color: #888; }
`,
js:`document.querySelector(".close").addEventListener("click", function () {
    this.closest(".notification-list").remove();
});
`},
  tests:[
    {name:".slide contains \"Account Alert\"", fn:t=>{var s=t.$(".notification-list .slide");t.ok(s,"No div.slide inside .notification-list.");t.ok(t.text(s).indexOf("Account Alert")===0,".slide text starts with \""+t.text(s).slice(0,20)+"\".");return true;}},
    {name:".message has the password text", fn:t=>{var s=t.$(".notification-list .message");t.ok(s,"No div.message.");t.ok(t.text(s).indexOf("Your account password was updated successfully")===0,".message text is \""+t.text(s).slice(0,50)+"\".");return true;}},
    {name:".time shows \"5 mins ago\"", fn:t=>{var s=t.$(".notification-list .time");t.ok(s,"No div.time.");t.ok(t.text(s)==="5 mins ago",".time text is \""+t.text(s)+"\".");return true;}},
    {name:"notification-list has no background colour", fn:t=>{var b=t.css(t.$(".notification-list"),"background-color");t.ok(b==="rgba(0, 0, 0, 0)"||b==="transparent","Background colour is still "+b+".");return true;}},
    {name:"Clicking the cross removes the notification from the DOM", fn:async t=>{await t.click(t.$(".close"));t.ok(!t.$(".notification-list"),"The notification is still in the page (it must be removed, not hidden).");return true;}}
  ]},

/* ======================================================================= 5 (pattern) */
{ id:"f5", original:true, stack:"web", difficulty:"Hard", topic:"Forms + state + DOM rendering",
  title:"Financial Dashboard",
  intro:"A Financial Dashboard tracks income and expenses. The layout is ready; complete the footer and the transaction logic.",
  objectives:[
    "Add a <b>footer</b> at the bottom with the text <b>\"© 2025 Financial Dashboard\"</b>.",
    "When <b>#addBtn</b> is clicked, read the amount from <b>#amount</b> and the type from <b>#type</b> (credit or debit). Ignore empty, zero or negative amounts.",
    "Credit adds to the balance and debit subtracts from it. Show the balance in <b>#balance</b> as <b>$</b> followed by 2 decimals, e.g. <b>$70.00</b> (negative: <b>-$5.00</b>).",
    "Add one <b>div.transaction</b> to <b>#transactionList</b> for every added transaction, then clear the amount input.",
    "<b>#clearBtn</b> removes all transactions and resets the balance to <b>$0.00</b>."],
  constraints:["Keep the given ids.","Do not reload the page."],
  files:{
html:`<div class="dash">
    <h1>Financial Dashboard</h1>
    <p class="sub">Track your finances with ease</p>
    <section class="card">
        <h3>Current Balance</h3>
        <div id="balance">$0.00</div>
    </section>
    <section class="card">
        <h3>New Transaction</h3>
        <input type="number" id="amount" placeholder="Enter amount">
        <select id="type">
            <option value="credit">Income (Credit)</option>
            <option value="debit">Expense (Debit)</option>
        </select>
        <button id="addBtn">Add Transaction</button>
    </section>
    <section class="card">
        <h3>Recent Transactions</h3>
        <div id="transactionList"></div>
        <button id="clearBtn">Clear All</button>
    </section>
    <!-- TODO: add a footer with the text © 2025 Financial Dashboard -->
</div>
`,
css:`body { background: #121212; color: #eee; font-family: Arial, sans-serif; margin: 0; }
.dash { max-width: 520px; margin: 0 auto; padding: 20px; text-align: center; }
.sub { color: #aaa; margin-top: -8px; }
.card { background: #1e1e1e; border-radius: 14px; padding: 16px; margin: 14px 0; }
#balance { font-size: 40px; font-weight: bold; color: #22d3ee; }
input, select { width: 100%; padding: 10px; margin: 6px 0; border-radius: 8px; border: 1px solid #333; background: #111; color: #eee; }
button { padding: 10px 16px; border: 0; border-radius: 8px; background: #2563eb; color: #fff; margin-top: 6px; }
.transaction { display: flex; justify-content: space-between; padding: 6px 4px; border-bottom: 1px solid #333; }
footer { color: #777; font-size: 13px; padding: 10px; }
`,
js:`var balance = 0;

function formatMoney(value) {
    // TODO: return "$70.00" or "-$5.00"
}

function addTransaction() {
    // TODO: validate the amount, update the balance and the list
}

function clearAll() {
    // TODO
}

document.getElementById("addBtn").addEventListener("click", addTransaction);
document.getElementById("clearBtn").addEventListener("click", clearAll);
`},
  solution:{
html:`<div class="dash">
    <h1>Financial Dashboard</h1>
    <p class="sub">Track your finances with ease</p>
    <section class="card">
        <h3>Current Balance</h3>
        <div id="balance">$0.00</div>
    </section>
    <section class="card">
        <h3>New Transaction</h3>
        <input type="number" id="amount" placeholder="Enter amount">
        <select id="type">
            <option value="credit">Income (Credit)</option>
            <option value="debit">Expense (Debit)</option>
        </select>
        <button id="addBtn">Add Transaction</button>
    </section>
    <section class="card">
        <h3>Recent Transactions</h3>
        <div id="transactionList"></div>
        <button id="clearBtn">Clear All</button>
    </section>
    <footer>© 2025 Financial Dashboard</footer>
</div>
`,
css:`body { background: #121212; color: #eee; font-family: Arial, sans-serif; margin: 0; }
.dash { max-width: 520px; margin: 0 auto; padding: 20px; text-align: center; }
.sub { color: #aaa; margin-top: -8px; }
.card { background: #1e1e1e; border-radius: 14px; padding: 16px; margin: 14px 0; }
#balance { font-size: 40px; font-weight: bold; color: #22d3ee; }
input, select { width: 100%; padding: 10px; margin: 6px 0; border-radius: 8px; border: 1px solid #333; background: #111; color: #eee; }
button { padding: 10px 16px; border: 0; border-radius: 8px; background: #2563eb; color: #fff; margin-top: 6px; }
.transaction { display: flex; justify-content: space-between; padding: 6px 4px; border-bottom: 1px solid #333; }
footer { color: #777; font-size: 13px; padding: 10px; }
`,
js:`var balance = 0;

function formatMoney(value) {
    var sign = value < 0 ? "-" : "";
    return sign + "$" + Math.abs(value).toFixed(2);
}

function addTransaction() {
    var input = document.getElementById("amount");
    var amount = parseFloat(input.value);
    if (isNaN(amount) || amount <= 0) return;
    var type = document.getElementById("type").value;
    balance += type === "credit" ? amount : -amount;
    document.getElementById("balance").textContent = formatMoney(balance);

    var row = document.createElement("div");
    row.className = "transaction";
    row.textContent = (type === "credit" ? "+ " : "- ") + formatMoney(amount);
    document.getElementById("transactionList").appendChild(row);
    input.value = "";
}

function clearAll() {
    balance = 0;
    document.getElementById("transactionList").innerHTML = "";
    document.getElementById("balance").textContent = formatMoney(0);
}

document.getElementById("addBtn").addEventListener("click", addTransaction);
document.getElementById("clearBtn").addEventListener("click", clearAll);
`},
  tests:[
    {name:"Footer with \"© 2025 Financial Dashboard\"", fn:t=>{var f=t.$("footer");t.ok(f,"No <footer> element.");t.ok(t.text(f)==="© 2025 Financial Dashboard","Footer text is \""+t.text(f)+"\".");return true;}},
    {name:"Credit 100 makes the balance $100.00", fn:async t=>{await t.type(t.$("#amount"),"100");await t.select(t.$("#type"),"credit");await t.click(t.$("#addBtn"));t.ok(t.text(t.$("#balance"))==="$100.00","Balance shows \""+t.text(t.$("#balance"))+"\".");t.ok(t.$("#amount").value==="","The amount input should be cleared.");return true;}},
    {name:"Then debit 30.5 gives $69.50 and 2 transactions", fn:async t=>{await t.type(t.$("#amount"),"100");await t.select(t.$("#type"),"credit");await t.click(t.$("#addBtn"));await t.type(t.$("#amount"),"30.5");await t.select(t.$("#type"),"debit");await t.click(t.$("#addBtn"));t.ok(t.text(t.$("#balance"))==="$69.50","Balance shows \""+t.text(t.$("#balance"))+"\".");t.ok(t.$$("#transactionList .transaction").length===2,"Found "+t.$$("#transactionList .transaction").length+" .transaction rows.");return true;}},
    {name:"Empty or negative amounts are ignored; negative balance shows -$", fn:async t=>{await t.type(t.$("#amount"),"");await t.click(t.$("#addBtn"));await t.type(t.$("#amount"),"-20");await t.click(t.$("#addBtn"));t.ok(t.$$("#transactionList .transaction").length===0,"Invalid amounts were added.");await t.type(t.$("#amount"),"5");await t.select(t.$("#type"),"debit");await t.click(t.$("#addBtn"));t.ok(t.text(t.$("#balance"))==="-$5.00","Balance shows \""+t.text(t.$("#balance"))+"\", expected -$5.00.");return true;}},
    {name:"Clear All resets the list and the balance", fn:async t=>{await t.type(t.$("#amount"),"40");await t.click(t.$("#addBtn"));await t.click(t.$("#clearBtn"));t.ok(t.$$("#transactionList .transaction").length===0,"Transactions are still listed.");t.ok(t.text(t.$("#balance"))==="$0.00","Balance shows \""+t.text(t.$("#balance"))+"\".");return true;}}
  ]},

/* ======================================================================= 6 */
{ id:"f6", stack:"web", difficulty:"Medium", topic:"Events + createElement + Enter key",
  title:"To-Do List",
  intro:"Build the logic of a small to-do list.",
  objectives:[
    "Clicking <b>#addBtn</b> adds the text of <b>#taskInput</b> as a new <b>li</b> in <b>#taskList</b>, then clears the input. Pressing <b>Enter</b> in the input does the same.",
    "Ignore empty input or input with only spaces, and trim the text.",
    "Each li contains the task text in a <b>span</b> and a <b>button.delete</b> (text \"Delete\") that removes that task.",
    "<b>#count</b> always shows <b>\"Tasks: N\"</b>, where N is the number of tasks."],
  constraints:["Keep the given ids."],
  files:{
html:`<div class="todo">
    <h2>My Tasks</h2>
    <div class="row">
        <input id="taskInput" placeholder="New task">
        <button id="addBtn">Add</button>
    </div>
    <ul id="taskList"></ul>
    <p id="count">Tasks: 0</p>
</div>
`,
css:`body { font-family: Arial, sans-serif; display: flex; justify-content: center; padding: 20px; }
.todo { width: 360px; }
.row { display: flex; gap: 8px; }
#taskInput { flex: 1; padding: 8px; }
li { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; }
.delete { background: #ef4444; color: #fff; border: 0; border-radius: 4px; }
`,
js:`var input = document.getElementById("taskInput");
var list = document.getElementById("taskList");

function updateCount() {
    // TODO
}

function addTask() {
    // TODO
}

// TODO: connect the button click and the Enter key
`},
  solution:{
html:`<div class="todo">
    <h2>My Tasks</h2>
    <div class="row">
        <input id="taskInput" placeholder="New task">
        <button id="addBtn">Add</button>
    </div>
    <ul id="taskList"></ul>
    <p id="count">Tasks: 0</p>
</div>
`,
css:`body { font-family: Arial, sans-serif; display: flex; justify-content: center; padding: 20px; }
.todo { width: 360px; }
.row { display: flex; gap: 8px; }
#taskInput { flex: 1; padding: 8px; }
li { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; }
.delete { background: #ef4444; color: #fff; border: 0; border-radius: 4px; }
`,
js:`var input = document.getElementById("taskInput");
var list = document.getElementById("taskList");

function updateCount() {
    document.getElementById("count").textContent = "Tasks: " + list.children.length;
}

function addTask() {
    var text = input.value.trim();
    if (!text) return;
    var li = document.createElement("li");
    var span = document.createElement("span");
    span.textContent = text;
    var del = document.createElement("button");
    del.className = "delete";
    del.textContent = "Delete";
    del.addEventListener("click", function () {
        li.remove();
        updateCount();
    });
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
    input.value = "";
    updateCount();
}

document.getElementById("addBtn").addEventListener("click", addTask);
input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") addTask();
});
`},
  tests:[
    {name:"Add button adds a trimmed task and clears the input", fn:async t=>{await t.type(t.$("#taskInput"),"  Buy milk  ");await t.click(t.$("#addBtn"));var li=t.$$("#taskList li");t.ok(li.length===1,"Found "+li.length+" li.");var s=li[0].querySelector("span");t.ok(s&&t.text(s)==="Buy milk","Task span text should be \"Buy milk\".");t.ok(t.$("#taskInput").value==="","Input not cleared.");return true;}},
    {name:"Enter key adds a task", fn:async t=>{await t.type(t.$("#taskInput"),"Read");await t.key(t.$("#taskInput"),"Enter");t.ok(t.$$("#taskList li").length===1,"Pressing Enter did not add the task.");return true;}},
    {name:"Empty or blank input is ignored", fn:async t=>{await t.type(t.$("#taskInput"),"   ");await t.click(t.$("#addBtn"));t.ok(t.$$("#taskList li").length===0,"A blank task was added.");return true;}},
    {name:"Delete removes only that task", fn:async t=>{for(var x of ["A","B","C"]){await t.type(t.$("#taskInput"),x);await t.click(t.$("#addBtn"));}var b=t.$$("#taskList li")[1].querySelector("button.delete");t.ok(b,"No button.delete in the li.");await t.click(b);var names=t.$$("#taskList li span").map(t.text);t.ok(names.join(",")==="A,C","Remaining tasks: "+names.join(",")+".");return true;}},
    {name:"#count shows \"Tasks: N\" after adding and deleting", fn:async t=>{for(var x of ["A","B"]){await t.type(t.$("#taskInput"),x);await t.click(t.$("#addBtn"));}t.ok(t.text(t.$("#count"))==="Tasks: 2","Count shows \""+t.text(t.$("#count"))+"\" after 2 adds.");await t.click(t.$("#taskList button.delete"));t.ok(t.text(t.$("#count"))==="Tasks: 1","Count shows \""+t.text(t.$("#count"))+"\" after a delete.");return true;}}
  ]},

/* ======================================================================= 7 */
{ id:"f7", stack:"web", difficulty:"Medium", topic:"Form validation + preventDefault",
  title:"Sign-up Form Validation",
  intro:"Add live validation to a sign-up form.",
  objectives:[
    "<b>#submitBtn</b> stays <b>disabled</b> until the email is valid and the password has <b>at least 8 characters</b>.",
    "A valid email has text before <b>@</b>, and a domain after it containing a <b>.</b> (e.g. a@b.co). Use the regular expression <code>/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/</code>.",
    "While the email field is not empty and invalid, <b>#emailError</b> shows <b>\"Invalid email\"</b>; otherwise it is empty.",
    "Submitting the form must <b>not reload</b> the page and must show <b>\"Registered!\"</b> in <b>#success</b>."],
  constraints:["Validate on every input event."],
  files:{
html:`<form id="signup">
    <h2>Create account</h2>
    <input type="text" id="email" placeholder="Email">
    <span id="emailError"></span>
    <input type="password" id="password" placeholder="Password (min 8)">
    <button type="submit" id="submitBtn" disabled>Sign up</button>
    <p id="success"></p>
</form>
`,
css:`body { font-family: Arial, sans-serif; display: flex; justify-content: center; padding: 30px; }
form { width: 300px; display: flex; flex-direction: column; gap: 8px; }
input { padding: 9px; }
#emailError { color: #dc2626; font-size: 13px; min-height: 16px; }
#submitBtn { padding: 10px; background: #2563eb; color: #fff; border: 0; border-radius: 6px; }
#submitBtn:disabled { background: #9ca3af; }
#success { color: #16a34a; font-weight: bold; }
`,
js:`var email = document.getElementById("email");
var password = document.getElementById("password");

function validate() {
    // TODO: show/hide the email error and enable/disable the button
}

// TODO: listen to input events and handle the submit
`},
  solution:{
html:`<form id="signup">
    <h2>Create account</h2>
    <input type="text" id="email" placeholder="Email">
    <span id="emailError"></span>
    <input type="password" id="password" placeholder="Password (min 8)">
    <button type="submit" id="submitBtn" disabled>Sign up</button>
    <p id="success"></p>
</form>
`,
css:`body { font-family: Arial, sans-serif; display: flex; justify-content: center; padding: 30px; }
form { width: 300px; display: flex; flex-direction: column; gap: 8px; }
input { padding: 9px; }
#emailError { color: #dc2626; font-size: 13px; min-height: 16px; }
#submitBtn { padding: 10px; background: #2563eb; color: #fff; border: 0; border-radius: 6px; }
#submitBtn:disabled { background: #9ca3af; }
#success { color: #16a34a; font-weight: bold; }
`,
js:`var email = document.getElementById("email");
var password = document.getElementById("password");
var pattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

function validate() {
    var emailOk = pattern.test(email.value);
    document.getElementById("emailError").textContent =
        email.value && !emailOk ? "Invalid email" : "";
    document.getElementById("submitBtn").disabled = !(emailOk && password.value.length >= 8);
}

email.addEventListener("input", validate);
password.addEventListener("input", validate);

document.getElementById("signup").addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("success").textContent = "Registered!";
});
`},
  tests:[
    {name:"Invalid email shows \"Invalid email\"", fn:async t=>{await t.type(t.$("#email"),"abc@xyz");t.ok(t.text(t.$("#emailError"))==="Invalid email","Error shows \""+t.text(t.$("#emailError"))+"\".");await t.type(t.$("#email"),"");t.ok(t.text(t.$("#emailError"))==="","An empty email should not show the error.");return true;}},
    {name:"Valid email clears the error", fn:async t=>{await t.type(t.$("#email"),"bad");await t.type(t.$("#email"),"ravi@mail.com");t.ok(t.text(t.$("#emailError"))==="","Error still shows \""+t.text(t.$("#emailError"))+"\".");return true;}},
    {name:"Password rule: 7 characters disabled, 8 enabled", fn:async t=>{await t.type(t.$("#email"),"ravi@mail.com");await t.type(t.$("#password"),"1234567");t.ok(t.$("#submitBtn").disabled,"Button is enabled with a short password.");await t.type(t.$("#password"),"12345678");t.ok(!t.$("#submitBtn").disabled,"Button is still disabled with an 8-character password.");return true;}},
    {name:"Button enabled when both fields are valid", fn:async t=>{await t.type(t.$("#email"),"ravi@mail.com");await t.type(t.$("#password"),"12345678");t.ok(!t.$("#submitBtn").disabled,"Button is still disabled.");await t.type(t.$("#email"),"ravi@mail");t.ok(t.$("#submitBtn").disabled,"Button should disable again for an invalid email.");return true;}},
    {name:"Submit shows \"Registered!\" without reloading", fn:async t=>{t.win.__marker=1;await t.type(t.$("#email"),"ravi@mail.com");await t.type(t.$("#password"),"12345678");await t.click(t.$("#submitBtn"));await t.sleep(150);t.ok(t.win.__marker===1,"The page reloaded. Call preventDefault() in the submit handler.");t.ok(t.text(t.$("#success"))==="Registered!","#success shows \""+t.text(t.$("#success"))+"\".");return true;}}
  ]},

/* ======================================================================= 8 */
{ id:"f8", stack:"web", difficulty:"Easy", topic:"Input event + classList.toggle",
  title:"Character Counter",
  intro:"Build a live character counter for a message box.",
  objectives:[
    "Limit the textarea <b>#msg</b> to <b>100</b> characters using an HTML attribute.",
    "<b>#counter</b> shows <b>\"X/100\"</b> where X is the current length, updated as the user types.",
    "When the length is <b>more than 90</b>, add the class <b>\"warning\"</b> to #counter; remove it otherwise.",
    "In CSS, <b>.warning</b> makes the text <b>red</b> (#ff0000)."],
  constraints:["Keep the given ids."],
  files:{
html:`<div class="box">
    <label for="msg">Your message</label>
    <textarea id="msg" rows="4"></textarea>
    <div id="counter">0/100</div>
</div>
`,
css:`body { font-family: Arial, sans-serif; padding: 30px; }
.box { width: 360px; display: flex; flex-direction: column; gap: 6px; }
textarea { padding: 8px; font-size: 15px; }
#counter { text-align: right; color: #555; }
/* TODO: .warning */
`,
js:`var msg = document.getElementById("msg");
var counter = document.getElementById("counter");

// TODO: update the counter on every input
`},
  solution:{
html:`<div class="box">
    <label for="msg">Your message</label>
    <textarea id="msg" rows="4" maxlength="100"></textarea>
    <div id="counter">0/100</div>
</div>
`,
css:`body { font-family: Arial, sans-serif; padding: 30px; }
.box { width: 360px; display: flex; flex-direction: column; gap: 6px; }
textarea { padding: 8px; font-size: 15px; }
#counter { text-align: right; color: #555; }
#counter.warning, .warning { color: #ff0000; }
`,
js:`var msg = document.getElementById("msg");
var counter = document.getElementById("counter");

msg.addEventListener("input", function () {
    var n = msg.value.length;
    counter.textContent = n + "/100";
    counter.classList.toggle("warning", n > 90);
});
`},
  tests:[
    {name:"Textarea has maxlength 100", fn:t=>{t.ok(t.$("#msg").getAttribute("maxlength")==="100","maxlength is "+t.$("#msg").getAttribute("maxlength")+".");return true;}},
    {name:"Counter updates while typing", fn:async t=>{await t.type(t.$("#msg"),"hello");t.ok(t.text(t.$("#counter"))==="5/100","Counter shows \""+t.text(t.$("#counter"))+"\".");return true;}},
    {name:"Exactly 90 characters: no warning", fn:async t=>{await t.type(t.$("#msg"),"x".repeat(90));t.ok(!t.$("#counter").classList.contains("warning"),"warning is added at 90 characters; it should start above 90.");return true;}},
    {name:"91 characters: warning class and red text", fn:async t=>{await t.type(t.$("#msg"),"x".repeat(91));var c=t.$("#counter");t.ok(c.classList.contains("warning"),"warning class missing at 91 characters.");t.sameColor(c,"color","#ff0000");return true;}},
    {name:"Warning is removed when text gets shorter", fn:async t=>{await t.type(t.$("#msg"),"x".repeat(95));await t.type(t.$("#msg"),"x".repeat(10));t.ok(!t.$("#counter").classList.contains("warning"),"warning class is still there.");t.ok(t.text(t.$("#counter"))==="10/100","Counter shows \""+t.text(t.$("#counter"))+"\".");return true;}}
  ]},

/* ======================================================================= 9 */
{ id:"f9", stack:"web", difficulty:"Medium", topic:"Tabs UI + data attributes",
  title:"Tabs Component",
  intro:"Make a tabs component work. Each tab button has a data-target attribute with the id of its panel.",
  objectives:[
    "On load, the first tab has the class <b>\"active\"</b> and only its panel is visible.",
    "Clicking a <b>.tab</b> button gives it the class <b>\"active\"</b> and removes it from the other tabs.",
    "Only the panel whose id equals the clicked tab's <b>data-target</b> is shown; the other <b>.panel</b> elements are hidden with <b>display: none</b>.",
    "In CSS, <b>.tab.active</b> has background-color <b>#1d4ed8</b> and text colour <b>white</b>."],
  constraints:["Keep the given ids, classes and data-target values."],
  files:{
html:`<div class="tabs">
    <button class="tab" data-target="home">Home</button>
    <button class="tab" data-target="profile">Profile</button>
    <button class="tab" data-target="settings">Settings</button>
</div>
<div class="panel" id="home">Welcome home!</div>
<div class="panel" id="profile">This is your profile.</div>
<div class="panel" id="settings">Change your settings here.</div>
`,
css:`body { font-family: Arial, sans-serif; padding: 24px; }
.tabs { display: flex; gap: 6px; }
.tab { padding: 8px 18px; border: 1px solid #1d4ed8; background: #fff; color: #1d4ed8; border-radius: 6px 6px 0 0; }
/* TODO: .tab.active */
.panel { border: 1px solid #ccc; padding: 16px; }
`,
js:`var tabs = document.querySelectorAll(".tab");
var panels = document.querySelectorAll(".panel");

function showTab(tab) {
    // TODO
}

// TODO: click handlers and the initial state
`},
  solution:{
html:`<div class="tabs">
    <button class="tab" data-target="home">Home</button>
    <button class="tab" data-target="profile">Profile</button>
    <button class="tab" data-target="settings">Settings</button>
</div>
<div class="panel" id="home">Welcome home!</div>
<div class="panel" id="profile">This is your profile.</div>
<div class="panel" id="settings">Change your settings here.</div>
`,
css:`body { font-family: Arial, sans-serif; padding: 24px; }
.tabs { display: flex; gap: 6px; }
.tab { padding: 8px 18px; border: 1px solid #1d4ed8; background: #fff; color: #1d4ed8; border-radius: 6px 6px 0 0; }
.tab.active { background-color: #1d4ed8; color: white; }
.panel { border: 1px solid #ccc; padding: 16px; }
`,
js:`var tabs = document.querySelectorAll(".tab");
var panels = document.querySelectorAll(".panel");

function showTab(tab) {
    tabs.forEach(function (t) { t.classList.remove("active"); });
    tab.classList.add("active");
    panels.forEach(function (p) {
        p.style.display = p.id === tab.dataset.target ? "" : "none";
    });
}

tabs.forEach(function (tab) {
    tab.addEventListener("click", function () { showTab(tab); });
});
showTab(tabs[0]);
`},
  tests:[
    {name:"On load: first tab active, only #home visible", fn:t=>{var tb=t.$$(".tab");t.ok(tb[0].classList.contains("active"),"First tab is not active on load.");t.ok(t.css(t.$("#home"),"display")!=="none","#home is hidden on load.");t.ok(t.css(t.$("#profile"),"display")==="none"&&t.css(t.$("#settings"),"display")==="none","Other panels should be hidden on load.");return true;}},
    {name:"Clicking Profile makes only it active", fn:async t=>{var tb=t.$$(".tab");await t.click(tb[1]);t.ok(tb[1].classList.contains("active"),"Profile tab is not active.");t.ok(!tb[0].classList.contains("active")&&!tb[2].classList.contains("active"),"Other tabs still have the active class.");return true;}},
    {name:"Clicking Settings shows only #settings", fn:async t=>{await t.click(t.$$(".tab")[2]);t.ok(t.css(t.$("#settings"),"display")!=="none","#settings is hidden.");t.ok(t.css(t.$("#home"),"display")==="none"&&t.css(t.$("#profile"),"display")==="none","Other panels are still visible.");return true;}},
    {name:"Clicking back to Home works", fn:async t=>{var tb=t.$$(".tab");await t.click(tb[2]);await t.click(tb[0]);t.ok(tb[0].classList.contains("active")&&!tb[2].classList.contains("active"),"Active class did not move back to Home.");t.ok(t.css(t.$("#home"),"display")!=="none"&&t.css(t.$("#settings"),"display")==="none","Panels did not switch back.");return true;}},
    {name:"Active tab colours: #1d4ed8 background, white text", fn:t=>{var a=t.$(".tab.active");t.ok(a,"No active tab.");t.sameColor(a,"background-color","#1d4ed8");t.sameColor(a,"color","#ffffff");return true;}}
  ]},

/* ======================================================================= 10 */
{ id:"f10", stack:"web", difficulty:"Easy", topic:"CSS Flexbox + box model",
  title:"Responsive Card Layout (CSS only)",
  intro:"The HTML for three feature cards is ready. Style it with CSS only.",
  objectives:[
    "<b>.container</b> uses <b>display: flex</b>, <b>justify-content: space-between</b> and a <b>gap of 20px</b>.",
    "Each <b>.card</b> has <b>border-radius: 8px</b>, <b>padding: 16px</b> and a box-shadow.",
    "Card headings (<b>.card h2</b>) have the colour <b>#333333</b> and font-size <b>20px</b>.",
    "On screens <b>600px wide or less</b>, .container switches to <b>flex-direction: column</b>."],
  constraints:["Do not edit the HTML or JavaScript."],
  files:{
html:`<div class="container">
    <div class="card"><h2>Fast</h2><p>Pages load in under a second.</p></div>
    <div class="card"><h2>Secure</h2><p>Your data is encrypted.</p></div>
    <div class="card"><h2>Simple</h2><p>No setup needed.</p></div>
</div>
`,
css:`body { font-family: Arial, sans-serif; padding: 20px; background: #f5f6fa; }
.card { background: #fff; flex: 1; }
/* TODO: container, card, heading and media query */
`,
js:`// No JavaScript needed for this question.
`},
  solution:{
html:`<div class="container">
    <div class="card"><h2>Fast</h2><p>Pages load in under a second.</p></div>
    <div class="card"><h2>Secure</h2><p>Your data is encrypted.</p></div>
    <div class="card"><h2>Simple</h2><p>No setup needed.</p></div>
</div>
`,
css:`body { font-family: Arial, sans-serif; padding: 20px; background: #f5f6fa; }
.card { background: #fff; flex: 1; }

.container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}
.card {
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.card h2 { color: #333333; font-size: 20px; }

@media (max-width: 600px) {
    .container { flex-direction: column; }
}
`,
js:`// No JavaScript needed for this question.
`},
  tests:[
    {name:".container is a flex box with space-between", fn:t=>{var c=t.$(".container");t.ok(t.css(c,"display")==="flex","display is "+t.css(c,"display")+".");t.ok(t.css(c,"justify-content")==="space-between","justify-content is "+t.css(c,"justify-content")+".");return true;}},
    {name:".container gap is 20px", fn:t=>{var c=t.$(".container");t.ok(t.css(c,"column-gap")==="20px","gap is "+t.css(c,"column-gap")+".");return true;}},
    {name:"Cards: radius 8px, padding 16px, a box-shadow", fn:t=>{var c=t.$(".card");t.ok(t.css(c,"border-top-left-radius")==="8px","border-radius is "+t.css(c,"border-top-left-radius")+".");t.ok(t.css(c,"padding-top")==="16px"&&t.css(c,"padding-left")==="16px","padding is "+t.css(c,"padding")+".");t.ok(t.css(c,"box-shadow")!=="none","No box-shadow.");return true;}},
    {name:"Headings: #333333 and 20px", fn:t=>{var h=t.$(".card h2");t.sameColor(h,"color","#333333");t.ok(t.css(h,"font-size")==="20px","font-size is "+t.css(h,"font-size")+".");return true;}},
    {name:"At 500px width the cards stack in a column", fn:async t=>{await t.resize(500);var d=t.css(t.$(".container"),"flex-direction");await t.resize(1000);t.ok(d==="column","At 500px flex-direction is "+d+".");t.ok(t.css(t.$(".container"),"flex-direction")!=="column","At 1000px the cards should be in a row.");return true;}}
  ]},

/* ======================================================================= 11 React */
{ id:"r1", stack:"react", difficulty:"Easy", topic:"React useState + events",
  title:"React Counter",
  intro:"Complete a React counter component in App.jsx (React 18, function components and hooks).",
  objectives:[
    "Show the current count in <b>&lt;h2 id=\"count\"&gt;</b>, starting at <b>0</b>.",
    "<b>#inc</b> adds 1 and <b>#dec</b> subtracts 1, but the count must <b>never go below 0</b>.",
    "<b>#reset</b> sets the count back to 0.",
    "Disable <b>#dec</b> while the count is 0."],
  constraints:["Use the useState hook.","Export the component as <code>export default App</code>; the editor renders it into #root for you."],
  files:{
jsx:`import React, { useState } from "react";

function App() {
    // TODO: count state

    return (
        <div className="counter">
            <h2 id="count">0</h2>
            <div className="buttons">
                <button id="dec">-</button>
                <button id="inc">+</button>
                <button id="reset">Reset</button>
            </div>
        </div>
    );
}

export default App;
`,
css:`body { font-family: Arial, sans-serif; display: flex; justify-content: center; padding: 30px; }
.counter { text-align: center; }
#count { font-size: 48px; margin: 10px 0; }
.buttons { display: flex; gap: 10px; }
button { padding: 10px 18px; font-size: 18px; }
`},
  solution:{
jsx:`import React, { useState } from "react";

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="counter">
            <h2 id="count">{count}</h2>
            <div className="buttons">
                <button id="dec" disabled={count === 0}
                        onClick={() => setCount(c => Math.max(0, c - 1))}>-</button>
                <button id="inc" onClick={() => setCount(c => c + 1)}>+</button>
                <button id="reset" onClick={() => setCount(0)}>Reset</button>
            </div>
        </div>
    );
}

export default App;
`,
css:`body { font-family: Arial, sans-serif; display: flex; justify-content: center; padding: 30px; }
.counter { text-align: center; }
#count { font-size: 48px; margin: 10px 0; }
.buttons { display: flex; gap: 10px; }
button { padding: 10px 18px; font-size: 18px; }
`},
  tests:[
    {name:"Starts at 0 with #dec disabled", fn:t=>{t.ok(t.text(t.$("#count"))==="0","#count shows \""+t.text(t.$("#count"))+"\".");t.ok(t.$("#dec").disabled,"#dec should be disabled at 0.");return true;}},
    {name:"+ three times shows 3", fn:async t=>{for(var i=0;i<3;i++)await t.click(t.$("#inc"));t.ok(t.text(t.$("#count"))==="3","#count shows \""+t.text(t.$("#count"))+"\".");return true;}},
    {name:"- goes down but never below 0", fn:async t=>{await t.click(t.$("#inc"));await t.click(t.$("#inc"));await t.click(t.$("#dec"));t.ok(t.text(t.$("#count"))==="1","After +, +, - the count shows \""+t.text(t.$("#count"))+"\".");var d=t.$("#dec");d.disabled=false;await t.click(d);d=t.$("#dec");d.disabled=false;await t.click(d);t.ok(t.text(t.$("#count"))==="0","The count went to \""+t.text(t.$("#count"))+"\"; it must stop at 0.");return true;}},
    {name:"#dec is enabled when count > 0", fn:async t=>{await t.click(t.$("#inc"));t.ok(!t.$("#dec").disabled,"#dec is still disabled at 1.");return true;}},
    {name:"Reset sets the count to 0", fn:async t=>{for(var i=0;i<4;i++)await t.click(t.$("#inc"));t.ok(t.text(t.$("#count"))==="4","After 4 clicks the count shows \""+t.text(t.$("#count"))+"\".");await t.click(t.$("#reset"));t.ok(t.text(t.$("#count"))==="0","#count shows \""+t.text(t.$("#count"))+"\" after reset.");return true;}}
  ]},

/* ======================================================================= 12 React */
{ id:"r2", stack:"react", difficulty:"Medium", topic:"React lists + filter + conditional rendering",
  title:"React Product Search",
  intro:"Render a searchable product list in React.",
  objectives:[
    "Render each product of the given <b>products</b> array as <b>&lt;li className=\"item\"&gt;</b> showing its name, using <b>map()</b> with a <b>key</b>.",
    "The input <b>#search</b> is a controlled input. Only products whose name contains the search text (ignore case) are shown.",
    "<b>#total</b> shows <b>\"Showing N of 6\"</b>, where N is the number of visible products.",
    "When nothing matches, show <b>&lt;p id=\"empty\"&gt;No products found&lt;/p&gt;</b> instead of the list items."],
  constraints:["Use useState for the search text.","Do not change the products array."],
  files:{
jsx:`import React, { useState } from "react";

const products = ["Laptop", "Mouse", "Keyboard", "Monitor", "Mobile Stand", "Headphones"];

function App() {
    // TODO: search state and filtering

    return (
        <div className="shop">
            <input id="search" placeholder="Search products" />
            <p id="total">Showing 0 of 6</p>
            <ul>
                {/* TODO: list items */}
            </ul>
        </div>
    );
}

export default App;
`,
css:`body { font-family: Arial, sans-serif; padding: 24px; }
.shop { width: 320px; }
#search { width: 100%; padding: 8px; }
.item { padding: 6px 0; border-bottom: 1px solid #eee; list-style: none; }
ul { padding: 0; }
#empty { color: #b91c1c; }
`},
  solution:{
jsx:`import React, { useState } from "react";

const products = ["Laptop", "Mouse", "Keyboard", "Monitor", "Mobile Stand", "Headphones"];

function App() {
    const [query, setQuery] = useState("");
    const visible = products.filter(p => p.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="shop">
            <input id="search" placeholder="Search products"
                   value={query} onChange={e => setQuery(e.target.value)} />
            <p id="total">Showing {visible.length} of {products.length}</p>
            {visible.length === 0
                ? <p id="empty">No products found</p>
                : <ul>{visible.map(p => <li className="item" key={p}>{p}</li>)}</ul>}
        </div>
    );
}

export default App;
`,
css:`body { font-family: Arial, sans-serif; padding: 24px; }
.shop { width: 320px; }
#search { width: 100%; padding: 8px; }
.item { padding: 6px 0; border-bottom: 1px solid #eee; list-style: none; }
ul { padding: 0; }
#empty { color: #b91c1c; }
`},
  tests:[
    {name:"All 6 products render as li.item", fn:t=>{var l=t.$$("li.item");t.ok(l.length===6,"Found "+l.length+" li.item.");t.ok(t.text(l[0])==="Laptop","First item is \""+t.text(l[0])+"\".");return true;}},
    {name:"Search \"mo\" (any case) shows Mouse, Monitor, Mobile Stand", fn:async t=>{await t.type(t.$("#search"),"MO");var n=t.$$("li.item").map(t.text);t.ok(n.join(",")==="Mouse,Monitor,Mobile Stand","Visible: "+n.join(", ")+".");return true;}},
    {name:"#total shows \"Showing N of 6\"", fn:async t=>{t.ok(t.text(t.$("#total"))==="Showing 6 of 6","Initially #total is \""+t.text(t.$("#total"))+"\".");await t.type(t.$("#search"),"key");t.ok(t.text(t.$("#total"))==="Showing 1 of 6","After \"key\" #total is \""+t.text(t.$("#total"))+"\".");return true;}},
    {name:"No match shows #empty and no items", fn:async t=>{await t.type(t.$("#search"),"zzz");var e=t.$("#empty");t.ok(e&&t.text(e)==="No products found","#empty is missing or has the wrong text.");t.ok(t.$$("li.item").length===0,"Items are still rendered.");return true;}},
    {name:"Clearing the search shows everything again", fn:async t=>{await t.type(t.$("#search"),"zzz");await t.type(t.$("#search"),"");t.ok(t.$$("li.item").length===6&&!t.$("#empty"),"The list did not come back.");return true;}}
  ]},

/* ======================================================================= 13 React */
{ id:"r3", stack:"react", difficulty:"Medium", topic:"React controlled input + conditional class",
  title:"React Greeting with Theme Toggle",
  intro:"Build a greeting card with a dark-mode toggle.",
  objectives:[
    "The outer div <b>.app</b> has the class <b>\"light\"</b> by default and <b>\"dark\"</b> after toggling (className <code>\"app light\"</code> / <code>\"app dark\"</code>).",
    "<b>#name</b> is a controlled input. <b>#greet</b> shows <b>\"Hello, NAME!\"</b> using the trimmed name, or <b>\"Hello, Guest!\"</b> when it is empty.",
    "<b>#theme</b> toggles the theme. Its text is <b>\"Dark Mode\"</b> while light, and <b>\"Light Mode\"</b> while dark.",
    "In CSS, <b>.app.dark</b> has background <b>#111827</b> and text colour <b>#f9fafb</b>."],
  constraints:["Use useState.","Export the component as the default export."],
  files:{
jsx:`import React, { useState } from "react";

function App() {
    // TODO: name and theme state

    return (
        <div className="app light">
            <input id="name" placeholder="Your name" />
            <p id="greet">Hello, Guest!</p>
            <button id="theme">Dark Mode</button>
        </div>
    );
}

export default App;
`,
css:`body { margin: 0; font-family: Arial, sans-serif; }
.app { min-height: 200px; padding: 24px; }
.app.light { background: #ffffff; color: #111827; }
/* TODO: .app.dark */
#name { padding: 8px; }
`},
  solution:{
jsx:`import React, { useState } from "react";

function App() {
    const [name, setName] = useState("");
    const [dark, setDark] = useState(false);
    const shown = name.trim() || "Guest";

    return (
        <div className={"app " + (dark ? "dark" : "light")}>
            <input id="name" placeholder="Your name"
                   value={name} onChange={e => setName(e.target.value)} />
            <p id="greet">Hello, {shown}!</p>
            <button id="theme" onClick={() => setDark(d => !d)}>
                {dark ? "Light Mode" : "Dark Mode"}
            </button>
        </div>
    );
}

export default App;
`,
css:`body { margin: 0; font-family: Arial, sans-serif; }
.app { min-height: 200px; padding: 24px; }
.app.light { background: #ffffff; color: #111827; }
.app.dark { background: #111827; color: #f9fafb; }
#name { padding: 8px; }
`},
  tests:[
    {name:"Typing a name updates the greeting", fn:async t=>{await t.type(t.$("#name"),"Asha");t.ok(t.text(t.$("#greet"))==="Hello, Asha!","#greet shows \""+t.text(t.$("#greet"))+"\".");return true;}},
    {name:"Blank or spaces-only name shows Guest; name is trimmed", fn:async t=>{await t.type(t.$("#name"),"   ");t.ok(t.text(t.$("#greet"))==="Hello, Guest!","For spaces #greet shows \""+t.text(t.$("#greet"))+"\".");await t.type(t.$("#name"),"  Ravi ");t.ok(t.text(t.$("#greet"))==="Hello, Ravi!","Name is not trimmed: \""+t.text(t.$("#greet"))+"\".");return true;}},
    {name:"Starts light; toggle switches the class to dark", fn:async t=>{var a=t.$(".app");t.ok(a.classList.contains("light")&&!a.classList.contains("dark"),"Should start with class light.");await t.click(t.$("#theme"));a=t.$(".app");t.ok(a.classList.contains("dark")&&!a.classList.contains("light"),"After toggle class is \""+a.className+"\".");return true;}},
    {name:"Button text follows the theme", fn:async t=>{t.ok(t.text(t.$("#theme"))==="Dark Mode","Initial text \""+t.text(t.$("#theme"))+"\".");await t.click(t.$("#theme"));t.ok(t.text(t.$("#theme"))==="Light Mode","After toggle text \""+t.text(t.$("#theme"))+"\".");await t.click(t.$("#theme"));t.ok(t.text(t.$("#theme"))==="Dark Mode","Toggling back did not restore \"Dark Mode\".");return true;}},
    {name:"Dark theme colours", fn:async t=>{await t.click(t.$("#theme"));var a=t.$(".app");t.sameColor(a,"background-color","#111827");t.sameColor(a,"color","#f9fafb");return true;}}
  ]},

/* ======================================================================= 14 Vue */
{ id:"v1", stack:"vue", difficulty:"Easy", topic:"Vue 3 reactivity + v-if + :disabled",
  title:"Vue Counter with Limit",
  intro:"Complete a Vue 3 app (global build, <code>Vue.createApp</code>). The template is in the HTML tab and the app code in the JavaScript tab.",
  objectives:[
    "Show the count (starting at 0) in <b>&lt;span id=\"count\"&gt;</b> using interpolation.",
    "<b>#inc</b> increases the count by 1, up to a maximum of <b>5</b>; bind <b>:disabled</b> so the button is disabled at 5.",
    "Show <b>&lt;p id=\"msg\"&gt;Limit reached!&lt;/p&gt;</b> only when the count is 5, using <b>v-if</b> (it must not be in the page otherwise).",
    "<b>#reset</b> sets the count to 0."],
  constraints:["Use data() or setup() with ref().","Mount the app on #app."],
  files:{
html:`<div id="app">
    <h2>Count: <span id="count">0</span></h2>
    <button id="inc">Add</button>
    <button id="reset">Reset</button>
    <!-- TODO: message -->
</div>
`,
js:`const { createApp } = Vue;

createApp({
    data() {
        return {
            // TODO
        };
    },
    methods: {
        // TODO
    }
}).mount("#app");
`,
css:`body { font-family: Arial, sans-serif; padding: 30px; }
button { padding: 8px 16px; margin-right: 6px; }
#msg { color: #b91c1c; font-weight: bold; }
`},
  solution:{
html:`<div id="app">
    <h2>Count: <span id="count">{{ count }}</span></h2>
    <button id="inc" :disabled="count >= 5" @click="increment">Add</button>
    <button id="reset" @click="count = 0">Reset</button>
    <p id="msg" v-if="count === 5">Limit reached!</p>
</div>
`,
js:`const { createApp } = Vue;

createApp({
    data() {
        return {
            count: 0
        };
    },
    methods: {
        increment() {
            if (this.count < 5) this.count++;
        }
    }
}).mount("#app");
`,
css:`body { font-family: Arial, sans-serif; padding: 30px; }
button { padding: 8px 16px; margin-right: 6px; }
#msg { color: #b91c1c; font-weight: bold; }
`},
  tests:[
    {name:"Count starts at 0 and Add increases it", fn:async t=>{t.ok(t.text(t.$("#count"))==="0","#count shows \""+t.text(t.$("#count"))+"\".");await t.click(t.$("#inc"));await t.click(t.$("#inc"));t.ok(t.text(t.$("#count"))==="2","After 2 clicks #count shows \""+t.text(t.$("#count"))+"\".");return true;}},
    {name:"#msg is not in the page below 5", fn:async t=>{for(var i=0;i<4;i++)await t.click(t.$("#inc"));t.ok(t.text(t.$("#count"))==="4","After 4 clicks #count shows \""+t.text(t.$("#count"))+"\".");t.ok(!t.$("#msg"),"#msg should not exist before the limit (use v-if).");return true;}},
    {name:"At 5: message shown and button disabled", fn:async t=>{for(var i=0;i<5;i++)await t.click(t.$("#inc"));var m=t.$("#msg");t.ok(m&&t.text(m)==="Limit reached!","#msg missing or wrong at 5.");t.ok(t.$("#inc").disabled,"#inc should be disabled at 5.");return true;}},
    {name:"Never goes above 5", fn:async t=>{for(var i=0;i<8;i++){var b=t.$("#inc");b.disabled=false;await t.click(b);}t.ok(t.text(t.$("#count"))==="5","#count shows \""+t.text(t.$("#count"))+"\". Also guard the limit inside the method.");return true;}},
    {name:"Reset brings it back to 0 and removes the message", fn:async t=>{for(var i=0;i<5;i++)await t.click(t.$("#inc"));t.ok(t.$("#msg"),"The limit message did not appear at 5.");await t.click(t.$("#reset"));t.ok(t.text(t.$("#count"))==="0"&&!t.$("#msg")&&!t.$("#inc").disabled,"Reset did not restore the initial state.");return true;}}
  ]},

/* ======================================================================= 15 Vue */
{ id:"v2", stack:"vue", difficulty:"Hard", topic:"Vue v-for + v-model + computed + :class",
  title:"Vue To-Do with Remaining Count",
  intro:"Build a to-do list in Vue 3.",
  objectives:[
    "The input <b>#newTodo</b> uses <b>v-model</b>. Clicking <b>#add</b> adds the trimmed text as a new todo (ignore blank input) and clears the input.",
    "Render each todo with <b>v-for</b> as <b>&lt;li class=\"todo\"&gt;</b> containing a <b>checkbox</b> and the text in a <b>span</b>.",
    "Checking the box marks the todo done: the li gets the class <b>\"done\"</b> (use <b>:class</b>).",
    "<b>#remaining</b> shows <b>\"N left\"</b>, the number of todos not done, using a <b>computed</b> property.",
    "Start with two todos: <b>\"Learn Vue\"</b> (not done) and <b>\"Practice JS\"</b> (done)."],
  constraints:["Use v-model, v-for with :key, :class and computed."],
  files:{
html:`<div id="app">
    <h2>Todos</h2>
    <input id="newTodo" placeholder="Add a todo">
    <button id="add">Add</button>
    <ul>
        <!-- TODO: li.todo for each todo -->
    </ul>
    <p id="remaining">0 left</p>
</div>
`,
js:`const { createApp } = Vue;

createApp({
    data() {
        return {
            newTodo: "",
            todos: []
        };
    },
    computed: {
        // TODO
    },
    methods: {
        // TODO
    }
}).mount("#app");
`,
css:`body { font-family: Arial, sans-serif; padding: 24px; }
ul { list-style: none; padding: 0; }
.todo { padding: 4px 0; }
.todo.done span { text-decoration: line-through; color: #888; }
`},
  solution:{
html:`<div id="app">
    <h2>Todos</h2>
    <input id="newTodo" placeholder="Add a todo" v-model="newTodo">
    <button id="add" @click="addTodo">Add</button>
    <ul>
        <li v-for="todo in todos" :key="todo.id" class="todo" :class="{ done: todo.done }">
            <input type="checkbox" v-model="todo.done">
            <span>{{ todo.text }}</span>
        </li>
    </ul>
    <p id="remaining">{{ remaining }} left</p>
</div>
`,
js:`const { createApp } = Vue;

createApp({
    data() {
        return {
            newTodo: "",
            nextId: 3,
            todos: [
                { id: 1, text: "Learn Vue", done: false },
                { id: 2, text: "Practice JS", done: true }
            ]
        };
    },
    computed: {
        remaining() {
            return this.todos.filter(t => !t.done).length;
        }
    },
    methods: {
        addTodo() {
            const text = this.newTodo.trim();
            if (!text) return;
            this.todos.push({ id: this.nextId++, text: text, done: false });
            this.newTodo = "";
        }
    }
}).mount("#app");
`,
css:`body { font-family: Arial, sans-serif; padding: 24px; }
ul { list-style: none; padding: 0; }
.todo { padding: 4px 0; }
.todo.done span { text-decoration: line-through; color: #888; }
`},
  tests:[
    {name:"Starts with Learn Vue and Practice JS (done); \"1 left\"", fn:t=>{var l=t.$$("li.todo");t.ok(l.length===2,"Found "+l.length+" li.todo.");t.ok(t.text(l[0].querySelector("span")||l[0])==="Learn Vue"&&!l[0].classList.contains("done"),"First todo should be Learn Vue, not done.");t.ok(l[1].classList.contains("done"),"Practice JS should have the class done.");t.ok(t.text(t.$("#remaining"))==="1 left","#remaining shows \""+t.text(t.$("#remaining"))+"\".");return true;}},
    {name:"Add creates a trimmed todo and clears the input", fn:async t=>{await t.type(t.$("#newTodo"),"  Build app ");await t.click(t.$("#add"));var l=t.$$("li.todo");t.ok(l.length===3,"Found "+l.length+" todos after adding.");t.ok(t.text(l[2].querySelector("span"))==="Build app","New todo text is \""+t.text(l[2])+"\".");t.ok(t.$("#newTodo").value==="","Input not cleared.");return true;}},
    {name:"Blank input is not added", fn:async t=>{await t.type(t.$("#newTodo"),"   ");await t.click(t.$("#add"));t.ok(t.$$("li.todo").length===2,"A blank todo was added.");return true;}},
    {name:"Checking a todo adds the class done", fn:async t=>{var cb=t.$("li.todo input[type=checkbox]");t.ok(cb,"No checkbox in li.todo.");await t.click(cb);t.ok(t.$$("li.todo")[0].classList.contains("done"),"li did not get the class done.");return true;}},
    {name:"#remaining updates as todos change", fn:async t=>{await t.type(t.$("#newTodo"),"A");await t.click(t.$("#add"));t.ok(t.text(t.$("#remaining"))==="2 left","After adding: \""+t.text(t.$("#remaining"))+"\".");await t.click(t.$("li.todo input[type=checkbox]"));t.ok(t.text(t.$("#remaining"))==="1 left","After checking one: \""+t.text(t.$("#remaining"))+"\".");return true;}}
  ]}
];
