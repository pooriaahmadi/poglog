const si = require("systeminformation");
const osu = require("os-utils");
class Si {
	info = {
		cpu: {},
		os: {},
		hard: {
			used: 0,
		},
		memory: {},
	};
	constructor() {}
	getOs = () => {
		return si.osInfo();
	};
	getCpu = () => {
		return si.cpu();
	};
	getCpuLoad = () => {
		return si.fullLoad();
	};
	getHardDrives = () => {
		return si.fsSize();
	};
	getFreeMem = () => {
		return osu.freemem();
	};
	getFreeMemPercentage = () => {
		return osu.freememPercentage();
	};
	getUptime = () => {
		return osu.sysUptime();
	};
	getAllInfo = async () => {
		this.info.os = await this.getOs();
		this.info.os.uptime = this.getUptime();
		this.info.cpu = await this.getCpu();
		this.info.cpu.load = await this.getCpuLoad();
		this.info.hard.drives = await this.getHardDrives();
		this.info.hard.drives.forEach((drive) => {
			this.info.hard.used += drive.use;
		});
		this.info.memory.free = this.getFreeMem();
		this.info.memory.freePercentage = this.getFreeMemPercentage();
		return this.info;
	};
}

module.exports = Si;
