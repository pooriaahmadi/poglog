const blessed = require("blessed");
const contrib = require("blessed-contrib");
const chalk = require("chalk");
class Screen {
	components = {
		boxes: {},
		donuts: {},
		logs: {},
	};
	constructor({ title }) {
		this.screen = blessed.screen({
			smartCSR: true,
		});
		this.screen.title = title;
		this.screen.key(["escape", "q", "C-c"], function (ch, key) {
			return process.exit(0);
		});
	}
	getComponent = ({ type, name }) => {
		return this.components[type][name];
	};
	getDonut = (name) => {
		return this.components.donuts[name];
	};
	setDonut = ({ name, newData }) => {
		this.components.donuts[name] = newData;
	};
	getLog = (name) => {
		return this.components.logs[name];
	};
	setLog = ({ name, newData }) => {
		this.components.logs[name] = newData;
	};
	getBox = (name) => {
		return this.components.boxes[name];
	};
	setBox = ({ name, newData }) => {
		this.components.boxes[name] = newData;
	};

	boxInsertLine = ({ boxName, lineNumber, content }) => {
		const box = this.getBox(boxName);
		if (lineNumber) {
			box.insertLine(lineNumber, content);
		} else {
			box.insertBottom(content);
		}
		box.setScrollPerc(100);
		this.setBox({
			name: boxName,
			newData: box,
		});
		this.render();
	};
	createDonut = ({ name, details }) => {
		const donut = contrib.donut(details);
		this.components.donuts[name] = donut;
		this.append(donut);
	};
	setDonutData = ({ name, data }) => {
		this.components.donuts[name].setData(data);
		this.render();
	};
	createBox = ({ name, details }) => {
		const box = blessed.box(details);
		this.components.boxes[name] = box;
		this.append(box);
	};
	createLog = ({ name, details }) => {
		const log = contrib.log(details);
		this.components.logs[name] = log;
		this.append(log);
	};
	newLog = ({ name, content }) => {
		const log = this.components.logs[name];
		log.log(content);
		this.render();
	};
	setLogContent = ({ name, content }) => {
		this.components.logs[name].content = content;
		this.render();
	};
	append = (component) => {
		this.screen.append(component);
		this.screen.render();
	};
	delete = ({ type, name }) => {
		const component = this.components[type][name];
		delete this.components[type][name];
		this.screen.remove(component);
		this.render();
	};
	render = () => {
		this.components.boxes.console.focus();
		this.screen.render();
	};
	create = (systemInformation) => {
		this.createBox({
			name: "console",
			details: {
				top: 0,
				left: 0,
				label: "CONSOLE",
				width: "100%",
				height: "60%",
				tags: true,
				border: {
					type: "line",
				},
				style: {
					fg: "white",
					border: {
						fg: "#f0f0f0",
					},
				},
				keys: true,
				vi: true,
				alwaysScroll: true,
				scrollable: true,
				mouse: true,
				scrollbar: {
					style: {
						bg: "yellow",
					},
				},
			},
		});
		this.createLog({
			name: "systeminformation",
			details: {
				fg: "green",
				selectedFg: "green",
				label: "Server info",
				width: "30%",
				height: "40%",
				content: `Platform: ${systemInformation.os.platform} ${
					systemInformation.os.arch
				} ${systemInformation.os.build}\nOS: ${
					systemInformation.os.distro
				}\nName: ${systemInformation.os.hostname}\nCores: ${
					systemInformation.cpu.cores
				}\nUptime: ${Math.ceil(systemInformation.os.uptime / 3600 / 24)}D`,
				top: "60%",
				border: {
					type: "line",
				},
				style: {
					border: {
						fg: "#f0f0f0",
					},
				},
			},
		});
		this.createDonut({
			name: "usage",
			details: {
				top: "60%",
				left: "30%",
				width: "70%",
				label: "USAGE",
				height: "40%",
				tags: true,
				radius: 12,
				arcWidth: 4,
				remainColor: "black",
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
				border: {
					type: "line",
				},
				style: {
					fg: "white",
					border: {
						fg: "#f0f0f0",
					},
				},
			},
		});
	};
}
module.exports = Screen;
