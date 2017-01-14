
const body = document.querySelector("body");
const loginDiv = document.querySelector(".loginDiv");
const loginInput = document.querySelector("#loginInput");
const loginBtn = document.querySelector("#loginBtn");
const chatbox = document.querySelector(".chatboxDiv");
const sound = document.querySelector("#sound");

const port = 5555;
let socket;
let id;
let name;

let chat;


// login
function login() {
	if (loginInput.value.length > 0) {  // name approved
		name = loginInput.value;  // set name
		body.removeChild(loginDiv);  // remove login div
		// create p with login name
		let p = document.createElement("p");
		p.id = "loginName";
		p.innerHTML = `Logged in as <b>${name}</b>`;
		body.prepend(p);
		// start chatbox
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
	// socket = io.connect("http://192.168.178.86:" + port);
	socket = io.connect("http://10.0.0.10:" + port);

	// emit new connection
	socket.emit("newConnection", name);

	// set socket receivers
	socket.on("chat", updateChat);  // get chat history

	// create input field
	mkInput();

}

// update chatbox
function updateChat(data) {
	// play notification sound
	// if (window.closed) {
		sound.play();
		// console.log("test");
	// }

	chat = data;

	if (document.querySelector("#chatTable")) {
		chatbox.removeChild(document.querySelector("#chatTable"));
	}

	let table = document.createElement("table");
	table.id = "chatTable";
	// table.border = "1";
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
	chatbox.appendChild(table);
	// set chatbox style
	chatbox.style.height = parseInt(body.clientHeight / 100 * 75) + "px";  // 75% - screen height
	chatbox.style.borderBottom = "solid 2px black";  // bottom border
	// scroll to bottom of chat
	chatbox.scrollTop = chatbox.scrollHeight;

}

// send msg
function send(msgRaw) {
	document.querySelector(".msgInput").value = "";  // clear input field

	let msg = msgRaw.replace(/\n/g,"<br>");

	let data = {
		name: name,
		text: msg
	}
	socket.emit("newMsg", data);
}

// create input field and submit button
function mkInput() {
	// create input field
	// let input = document.createElement("input");
	let input = document.createElement("textarea");
	input.className = "msgInput";
	// input.setAttribute("type", "text");
	body.appendChild(input);
	input.focus();
	// document.querySelector(".msgInput").value = "";
	// create submit button
	let btn = document.createElement("button");
	btn.className = "inputBtn";
	btn.innerHTML = "Send";
	body.appendChild(btn);
	// set event listeners
	btn.addEventListener("click", () => send(input.value));
	input.addEventListener("keydown", (event) => {
		// submit msg
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			send(input.value);
		}
	});
}


// login event listeners
loginBtn.addEventListener("click", login);
loginInput.addEventListener("keyup", (event) => {if (event.key === "Enter") login()});
