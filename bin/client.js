#!/usr/bin/env node
const io = require("socket.io-client");
const Screen = require("../src/Screen");
const yargs = require("yargs");
const chalk = require("chalk");
const argv = yargs
	.option("address", {
		alias: "ip",
		description: "ex. localhost, 192.168.1.5",
		default: "localhost",
		type: "string",
	})
	.option("password", {
		alias: "pass",
		description: "password for remote connecting",
		type: "string",
	})
	.option("port", {
		description: "Socket port, default: 6754",
		default: 6754,
		type: "number",
	})
	.option("simple", {
		description: "If used, Just logs will be shown.",
		type: "string",
	})
	.help()
	.alias("help", "h").argv;
const extraHeaders = {};
if (argv.password) {
	extraHeaders.authorization = argv.password;
}
const socket = io(`http://${argv.address}:${argv.port}`, {
	extraHeaders: extraHeaders,
});
let isCreated = false;
let firstLog = true;
if (argv.simple === "") {
	socket.on("log", (data) => {
		if (firstLog) {
			console.log(data);
			firstLog = false;
		} else {
			console.log(
				`${chalk.cyan(data.dateTime)}: ${chalk.yellow(data.content)}`
			);
		}
	});
	socket.on("error", (data) => {
		console.log(
			`${chalk.cyan(data.dateTime)}: ${chalk.redBright(
				`Process crashed with code ${data.code}`
			)}`
		);
	});
} else {
	const screen = new Screen({
		title: `PogLog-client ${argv.address}:${argv.port}`,
	});
	socket.on("systeminformation", (data) => {
		if (isCreated) {
			screen.setDonutData({
				name: "usage",
				data: [
					{ percent: data.cpu.load, label: "Cpu", color: "green" },
					{
						percent: data.hard.used / Object.keys(data.hard.drives).length,
						label: "Hard",
						color: "red",
					},
					{
						percent: 100 - data.memory.freePercentage * 100,
						label: "Memory",
						color: "blue",
					},
				],
			});
			screen.setLogContent({
				name: "systeminformation",
				content: `Platform: ${data.os.platform} ${data.os.arch} ${
					data.os.build
				}\nOS: ${data.os.distro}\nName: ${data.os.hostname}\nCores: ${
					data.cpu.cores
				}\nUptime: ${Math.ceil(data.os.uptime / 3600 / 24)}D`,
			});
		} else {
			screen.create(data);
			isCreated = true;
		}
	});
	socket.on("log", (data) => {
		if (firstLog) {
			screen.boxInsertLine({
				boxName: "console",
				content: data,
			});
			firstLog = false;
		} else {
			screen.boxInsertLine({
				boxName: "console",
				content: `${chalk.cyan(data.dateTime)}: ${chalk.yellow(data.content)}`,
			});
		}
	});
	socket.on("error", (data) => {
		screen.boxInsertLine({
			boxName: "console",
			content: `${chalk.cyan(data.dateTime)}: ${chalk.redBright(
				`Process crashed with code ${data.code}`
			)}`,
		});
	});
}
socket.on("passwordError", (data) => {
	console.log(chalk.redBright("Password incorrect"));
});
