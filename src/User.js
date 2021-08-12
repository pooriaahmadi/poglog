class User {
	constructor({ socket }) {
		this.socket = socket;
	}
	sendLog = (data) => {
		this.socket.emit("log", data);
	};
	sendError = (data) => {
		this.socket.emit("error", data);
	};
	sendSystemInfo = (data) => {
		this.socket.emit("systeminformation", data);
	};
}

module.exports = User;
