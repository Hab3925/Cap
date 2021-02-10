// Quick switch between testing mode & regular mode.
const isTesting = true;
const useDatabase = true;
const token = isTesting ? "cog" : "cap";
const loginToken = process.env[token];

if (!loginToken) {
	console.log(`Error: No login token set. Please set '${token}' to a valid token.`);
	return;
}

// Uncomment to test regex only.
//require("./messageEvents/autoreply.js"); return; // Error to abort after printing/testing regex.

//constants
const Discord = require("discord.js");
const client = new Discord.Client();
const {
	promisify
} = require("util");
const {
	inspect
} = require("util");
const readdir = promisify(require("fs").readdir);
let table;
let GSTable;

const mysql = require("mysql");
let con = mysql.createConnection({
	host: process.env.capConH,
	user: process.env.capConU,
	password: process.env.capConP,
	database: process.env.capConD,
	charset: "utf8mb4_unicode_ci"
});

const Enmap = require("enmap");
client.commands = new Enmap();
client.aliases = new Enmap();
client.dates = new Enmap();
client.prefixes = new Enmap();
client.disabledCmds = new Enmap({
	name: "disabledCmds"
});
client.ImageOnly = new Enmap({
	name: "channels"
});
client.smc = new Enmap({
	name: "smc"
});
client.automod = new Enmap({
	name: "automod"
})
client.steam = new Enmap({
	name: "steam"
})
client.logchn = new Enmap({
	name: "logchn"
})
client.autoreply = new Enmap({
	name: "autoreply"
})

client.on("ready", async () => {
	if (useDatabase) await client.connect(con);

	if (token == "cog") {
		table = "TESTXP";
		GSTable = "TESTguildsettings";
	}
	if (token == "cap") {
		table = "XP";
		GSTable = "guildsettings";
	}

	const cmdFiles = await readdir("./commands/");
	let i = 0;
	cmdFiles.forEach(f => {
		client.loadcommand(f);
		i++;
	});
	console.log(`Loaded ${i} commands`);

	if (useDatabase) {
		con.query(`SELECT guildID, prefix, lockedChannels FROM ${GSTable};`, function (
			err,
			result
		) {
			if (!result) return;
			result.forEach(server => {
				client.prefixes.set(server.guildID, server.prefix);
				client.disabledCmds.set(server.guildID, server.lockedChannels);
			});
		});
		console.log("Loaded guildsettings");

	}
	//client.achievements()
	//console.log("Loaded achivements")

	console.log(`Bot has started`);
	client.user.setActivity("Volcanoids", {
		type: "PLAYING"
	});

});

client.on("guildCreate", guild => {
	let name = guild.name.replace(/'/g, `\\'`).replace(/"/g, `\\"`);
	console.log(`| New Guild | ${guild.name} - ${guild.memberCount}`);
	var query = `INSERT INTO ${GSTable} (guildID, roles, prefix, guildName, guildIcon, lockedChannels, members) VALUE ('${guild.id}', '[]','.','${name}','${guild.iconURL({ format: 'png', size: 2048 })}', '[]','${guild.memberCount}');`;
	if (useDatabase) con.query(query);
});

client.on("guildDelete", guild => {
	console.log(`| Kicked | ${guild.name}`);
	var query = `DELETE FROM ${GSTable} WHERE guildID='${guild.id}'`;
	if (useDatabase) con.query(query);
});

require("./utility/functions.js")(client, useDatabase);
require("./utility/embeds.js")(client);
require("./utility/time.js")(client);

client.on("messageUpdate", async (oldMessage, newMessage) => {

	if (oldMessage.author.bot || newMessage.author.bot) return;
	let prefix = client.prefixes.get(newMessage.guild.id);
	let args = newMessage.content
		.slice(prefix.length)
		.trim()
		.split(" ");
	let command = args.shift().toLowerCase();


	// Permissions
	let permlvl = 0;
	try {
		if (newMessage.member.permissions.has("MANAGE_MESSAGES", true)) permlvl = 1;
		if (newMessage.member.permissions.has("ADMINISTRATOR", true)) permlvl = 2;
	} catch (e) {
		console.log(newMessage.author + "\n\nCaused:\n\n" + e)
	}
	if (newMessage.author.id == "188762891137056769") permlvl = 6;

	let evtFiles = await readdir("./messageEvents")
	evtFiles.forEach(file => {
		if (file == "xp.js" || file == "commandHandler.js") return
		const event = require(`./messageEvents/${file}`)
		event.run(client, newMessage, isTesting, command, prefix, permlvl, con, table, GSTable, useDatabase)
	})
})

client.on("message", async message => {
	if (!message.guild) return;

	if (message.author.bot) return;

	// Updating the members in the database
	if (useDatabase) con.query(`UPDATE ${GSTable} SET members = ${message.guild.memberCount} WHERE guildID = ${message.guild.id}`)
	if (!client.prefixes.has(message.guild.id)) {
		let name = message.guild.name.replace(/'/g, `\\'`).replace(/"/g, `\\"`);
		var query = `INSERT INTO ${GSTable} (guildID, roles, prefix, guildName, guildIcon, lockedChannels, members) VALUE ('${message.guild.id}', '[]','.','${name}','${message.guild.iconURL({ format: 'png', size: 2048 })}', '[]', '${message.guild.memberCount}');`;
		if (useDatabase) con.query(query);
		client.prefixes.set(message.guild.id, ".");
		console.log(`| New Guild | ${message.guild.name} - ${message.guild.memberCount}`)
		return;
	}
	//if no config exists for a server, create a entry
	if (!client.logchn.has(message.guild.id)) client.logchn.set(message.guild.id, 'disabled')

	let prefix = client.prefixes.get(message.guild.id);
	let msg = message.content.toUpperCase();
	let args = message.content
		.slice(prefix.length)
		.trim()
		.split(" ");
	let command = args.shift().toLowerCase();
	let timestamp = new Date().toLocaleString();
	message.guild.members.fetch(message.author);

	// Permissions
	let permlvl = 0;
	try {
		if (message.member.permissions.has("MANAGE_MESSAGES", true)) permlvl = 1;
		if (message.member.permissions.has("ADMINISTRATOR", true)) permlvl = 2;
	} catch (e) {
		console.log(message.author + "\n\nCaused:\n\n" + e)
	}
	if (message.author.id == "188762891137056769") permlvl = 6;


	let evtFiles = await readdir("./messageEvents")
	evtFiles.forEach(file => {
		const event = require(`./messageEvents/${file}`)
		event.run(client, message, isTesting, command, prefix, permlvl, con, table, GSTable, useDatabase)
	})

	// Command handler 

	if (!msg.startsWith(prefix)) return;
	let cmd =
		client.commands.get(command) ||
		client.commands.get(client.aliases.get(command));
	if (!cmd) return;
	if (cmd.help.permLvl > permlvl)
		return message.channel.send(
			"You dont have the permission to use this command!"
		);
	if (message.guild.id !== "444244464903651348") {
		if (cmd.help.category == "volc" && permlvl < 5) return;
	}

	console.log(`| ${timestamp} | ${message.guild} | ${message.author.tag} | ${cmd.help.name}`);
	cmd.run(client, message, args, prefix, con, table, permlvl, GSTable);

});

client.on("guildMemberUpdate", (oldMember, newMember) => {
	if (oldMember.displayName !== newMember.displayName) {
		let nickname = newMember.displayName.replace(/'/g, `\\'`).replace(/"/g, `\\"`);
		if (useDatabase) con.query(
			`UPDATE ${table} SET Nickname = '${nickname}' WHERE UserID = '${newMember.user.id}' AND guildID = '${newMember.guild.id}'`
		);
	}
});

client.on("userUpdate", (oldUser, newUser) => {
	if (oldUser.avatarURL({
		format: 'png',
		size: 2048
	}) !== newUser.avatarURL({
		format: 'png',
		size: 2048
	}))
		if (useDatabase) con.query(
			`UPDATE ${table} SET profilePic = '${newUser.avatarURL({ format: 'png', size: 2048 })}' WHERE UserID = '${newUser.id}'`
		);
});

client.on("guildUpdate", (oldGuild, newGuild) => {
	newGuild.name.replace(/'/g, `\\'`).replace(/"/g, `\\"`);
	if (oldGuild.iconURL({
		format: 'png',
		size: 2048
	}) !== newGuild.iconURL({
		format: 'png',
		size: 2048
	}))
		if (useDatabase) con.query(
			`UPDATE ${GSTable} SET guildIcon = '${newGuild.iconURL({ format: 'png', size: 2048 })}' WHERE guildID = '${newGuild.id}'`
		);
	if (oldGuild.name !== newGuild.name)
		if (useDatabase) con.query(
			`UPDATE ${GSTable} SET guildName = '${newGuild.name}' WHERE guildID = '${newGuild.id}'`
		);
});

client.on("error", console.error);
client.login(loginToken);