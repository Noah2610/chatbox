
const body = document.querySelector("body");
const loginDiv = document.querySelector(".loginDiv");
const loginInput = document.querySelector("#loginInput");
const loginBtn = document.querySelector("#loginBtn");
const chatbox = document.querySelector(".chatboxDiv");

const port = 5555;
let socket;
let id;
let name;
// let chatActive = false;

let chat;
// let input;
// let btn;


// login
function login() {
	// console.log("login function called");

	if (loginInput.value.length > 0) {  // name approved
		name = loginInput.value;  // set name
		// loginInput.removeAttribute("autofocus");
		body.removeChild(loginDiv);  // remove login div
		// create p with login name
		let p = document.createElement("p");
		p.id = "loginName";
		p.innerHTML = `Logged in as <b>${name}</b>`;
		// body.appendChild(p);
		body.prepend(p);
		// enable chatbox
		// chatActive = true;
		startChat();

	} else {  // name invalid
		console.log("not valid");
		let p = document.createElement("p");
		p.id = "nameInvalid";
		p.innerHTML = "Username not valid, please enter new username.";
		loginDiv.appendChild(p);
	}

}


// chatbox
// on connection
function startChat() {
	// connect to socket
	socket = io.connect("http://192.168.178.86:" + port);

	// emit new connection
	socket.emit("newConnection", name);

	// set socket receivers
	socket.on("chat", updateChat);  // get chat history

	// create input field
	mkInput();

}

// update chatbox
function updateChat(data) {

	chat = data;

	let table = document.createElement("table");
	table.id = "chatTable";
	let content = "";

	chat.forEach((msg,index) => {
		content += `
			<tr>
			<th class="timestamp"><u>${msg.time}</u></th>
			<th class="name">${msg.name}</th>
			${msg.text}
			</tr>
		`;
	});

	table.innerHTML = content;
	chatbox.innerHTML = "";
	chatbox.appendChild(table);

	chatbox.scrollTop = chatbox.scrollHeight;

}

// send msg
function send(msg) {
	document.querySelector(".msgInput").value = "";  // clear input field

	let data = {
		name: name,
		text: msg
	}
	socket.emit("newMsg", data);
}

// create input field and submit button
function mkInput() {
	// create input field
	let input = document.createElement("input");
	input.className = "msgInput";
	input.setAttribute("type", "text");
	// input.setAttribute("autofocus", "");
	// input.focus();
	body.appendChild(input);
	document.querySelector(".msgInput").focus();
	// create submit button
	let btn = document.createElement("button");
	btn.className = "inputBtn";
	btn.innerHTML = "Send";
	body.appendChild(btn);
	// set event listener for button
	btn.addEventListener("click", () => send(input.value));
	input.addEventListener("keydown", (event) => {if (event.key === "Enter") send(input.value)});
}


// login event listeners
loginBtn.addEventListener("click", login);
loginInput.addEventListener("keydown", (event) => {if (event.key === "Enter") login()});
