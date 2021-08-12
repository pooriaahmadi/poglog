#!/usr/bin/env node
const { spawn } = require("child_process");
const Screen = require("../src/Screen");
const chalk = require("chalk");
const Si = require("../src/Si");
const yargs = require("yargs");
let systemInformation;
const server = require("http").createServer();
const socketIo = require("socket.io");
const io = socketIo(server);
const User = require("../src/User");
let clients = [];
const getDate = () => {
	const date = new Date();
	return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
const argv = yargs
	.option("password", {
		alias: "pass",
		description: "password for remote connecting",
		type: "string",
	})
	.option("port", {
		description: "Socket port default: 6754",
		default: 6754,
		type: "number",
	})
	.help()
	.alias("help", "h").argv;

if (!argv._.length) {
	console.log(chalk.redBright("Please provide filepath. Ex. poglog index.js"));
	process.exit(1);
}
const command = spawn("node", argv._);

const app = async () => {
	console.log(chalk.greenBright("Getting things ready..."));
	systemInformation = new Si();
	await systemInformation.getAllInfo();
	systemInformation = systemInformation.info;
	const screen = new Screen({
		title: `PogLog-server`,
	});
	screen.create(systemInformation);
	const command = spawn("node", argv._);
	command.stdout.on("data", (chunk) => {
		const dateTime = getDate();
		const log = String(chunk).substr(0, chunk.length - 1);
		clients.forEach((item) => {
			item.sendLog({ dateTime: dateTime, content: log });
		});
		screen.boxInsertLine({
			boxName: "console",
			content: `${chalk.cyan(dateTime)}: ${chalk.yellow(log)}`,
		});
	});
	command.on("close", (code) => {
		const dateTime = getDate();
		clients.forEach((item) => {
			item.sendError({ dateTime: dateTime, code: code });
		});
		screen.boxInsertLine({
			boxName: "console",
			content: `${chalk.cyan(dateTime)}: ${chalk.red(
				`Process Crashed with code ${code}`
			)}`,
		});
	});

	setInterval(async () => {
		systemInformation = new Si();
		systemInformation = await systemInformation.getAllInfo();
		clients.forEach((client) => {
			client.sendSystemInfo(systemInformation);
		});
		screen.setDonutData({
			name: "usage",
			data: [
				{ percent: systemInformation.cpu.load, label: "Cpu", color: "green" },
				{
					percent:
						systemInformation.hard.used /
						Object.keys(systemInformation.hard.drives).length,
					label: "Hard",
					color: "red",
				},
				{
					percent: 100 - systemInformation.memory.freePercentage * 100,
					label: "Memory",
					color: "blue",
				},
			],
		});
		screen.setLogContent({
			name: "systeminformation",
			content: `Platform: ${systemInformation.os.platform} ${
				systemInformation.os.arch
			} ${systemInformation.os.build}\nOS: ${
				systemInformation.os.distro
			}\nName: ${systemInformation.os.hostname}\nCores: ${
				systemInformation.cpu.cores
			}\nUptime: ${Math.ceil(systemInformation.os.uptime / 3600 / 24)}D`,
		});
	}, 1 * 60 * 1000);

	server.listen(argv.port || 6754);
	io.on("connection", (socket) => {
		if (argv.password) {
			if (argv.password === socket.handshake.headers.authorization) {
				const user = new User({ socket: socket });
				clients.push(user);
				user.sendSystemInfo(systemInformation);
				user.sendLog(screen.getBox("console").content);
				return;
			} else {
				socket.emit("passwordError", "");
				return;
			}
		}
		const user = new User({ socket: socket });
		clients.push(user);
		user.sendSystemInfo(systemInformation);
		user.sendLog(screen.getBox("console").content);
	});

	io.on("disconnect", (socket) => {
		clients = clients.filter((item) => item.socket !== socket);
	});
};
app();
