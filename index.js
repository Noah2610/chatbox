
import express from "express";
import socket from "socket.io";
import chalk from "chalk";
import datetime from "node-datetime";


const port = 5555;
const app = express();
const server = app.listen(port);
app.use(express.static("public"));
const io = socket(server);

console.log(chalk.green("server running on port " + port));

let chat = [];

// connection
io.sockets.on("connection", (socket) => {

	// get ip and id
	const ip = socket.handshake.address.substr(7);
	const id = socket.id;
	let connectName = "";  // set empty name
	// log connection
	console.log(chalk.green(chalk.underline(curDate("H:M:S")) + " - connected: " + chalk.bold(id + " - " + ip)));

	// add new connection to chat
	socket.on("newConnection", (name) => {
		// set name if not set yet
		if (connectName == "") {
			connectName = name;
		}
		chat.push({ name: "", time: curDate("H:M:S"), text: `<td class="msg__sys"><b>${name}</b> joined the chat.</td>` });
		// send chat history
		io.sockets.emit("chat", chat);
	});

	// new chat message
	socket.on("newMsg", (data) => {
		chat.push({ name: data.name, time: curDate("H:M:S"), text: `<td class="msg__text">${data.text}</td>` });
		// send chat history
		io.sockets.emit("chat", chat);
	});



	// disconnection
	socket.on("disconnect", () => {
		// send chat diconnection info
		chat.push({ name: "", time: curDate("H:M:S"), text: `<td class="msg__sys"><b>${connectName}</b> left the chat.</td>` });
		// send chat history
		io.sockets.emit("chat", chat);
		// log disconnection
		console.log(chalk.red(chalk.underline(curDate("H:M:S")) + " - disconnected: " + chalk.bold(socket.id + " - " + ip)));
	});

});



function curDate(frmt) {  // get date and/or time with format
	return datetime.create().format(frmt);
}
