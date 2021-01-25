// Quick switch between testing mode & regular mode.
const isTesting = true;
const token = isTesting ? "cog" : "cap";

// Discord IDs.

// Server
const volcanoidsServerId = "444244464903651348";
const captainsSubmarineServerId = "488708757304639520";

// Channel
const discussOtherGamesChannelId = "496325967883534337";
const autoReplyFeedbackChannelId = "754675846132006972";
const faqChannelId = "454972890299891723";

// Message
const autoReplyFeedbackMessageId = "754702829976944673";

// Emoji
const thumbsUpId_cogHand = "713469848193073303"; // :cogLike:
const thumbsUpId_testing = "545279802198851615"; // :kappa:
const thumbsUpId = isTesting ? thumbsUpId_testing : thumbsUpId_cogHand;

const thumbsDownId_cogHand = "722120016723574805"; // :cogThumbsDown:
const thumbsDownId_testing = "546734308161749011"; // :Shotgun:
const thumbsDownId = isTesting ? thumbsDownId_testing : thumbsDownId_cogHand;

// Other constants.
const Discord = require("discord.js");
const client = new Discord.Client();
let cooldown = new Set();
const {
	promisify
} = require("util");
const {
	inspect
} = require("util");
const readdir = promisify(require("fs").readdir);
const readline = require("readline");
let table;
let GSTable;

const mysql = require("mysql");
let con = mysql.createConnection({
	host: process.env.capConH,
	user: process.env.capConU,
	password: process.env.capConP,
	database: process.env.capConD,
	charset: process.env.capConC
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
	await client.connect(con);

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
	console.log("Loaded prefixes");
	console.log("Loaded locked channels");
	console.log(
		`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`
	);
	client.user.setActivity("Volcanoids", {
		type: "PLAYING"
	});
	//client.achievements()


});

// Init some global vars so we don't have to do this on each command.
thumbsUp = client.emojis.cache.get(thumbsUpId);
thumbsDown = client.emojis.cache.get(thumbsDownId);

client.on("guildCreate", guild => {
	let name = guild.name.replace(/'/g, `\\'`).replace(/"/g, `\\"`);
	console.log(`| New Guild | ${guild.name} - ${guild.memberCount}`);
	var query = `INSERT INTO ${GSTable} (guildID, roles, prefix, guildName, guildIcon, lockedChannels, members) VALUE ('${guild.id}', '[]','.','${name}','${guild.iconURL({ format: 'png', size: 2048 })}', '[]','${guild.memberCount}');`;
	con.query(query);
});

client.on("guildDelete", guild => {
	console.log(`| Kicked | ${guild.name}`);
	var query = `DELETE FROM ${GSTable} WHERE guildID='${guild.id}'`;
	con.query(query);
});

require("./functions")(client);
require("./embeds.js")(client);

let consoleAutoreplyRegex = client.CreateAutoReplyRegex([
	`console.*(will|game|to|available)`,
	`(will|game|to|available).*console`,
	`xbox.*(will|game|to|available)`,
	`(will|game|to|available).*xbox`,
	`(ps4|ps5).*(will|game|to|available)`,
	`(will|game|to|available).*(ps4|ps5|playstation)`
],
	`igm`);

// A var since I keep copying the "the game", "it", "this", etc in many of these.
const theGameRegex = `( (that|the|this))?( (game|it|volcanoid(s?)))?`;
let steamAutoreplyRegex = client.CreateAutoReplyRegex([
	`when(('|’)s|s| is)?${theGameRegex} (come|coming) out`,
	`is${theGameRegex} (out|released|available)( yet)?`,
	`(where|how) (can|do).*?(get|buy|play).*?${theGameRegex}`,
	`(where|how).*?download`,
	`(is|if|will)( [^ \\n]+?)?${theGameRegex}( (?!only)[^ \\n]+?)? (free|on steam)`,
	`what.*?(get|buy|is).*?${theGameRegex}( [^ \\n]+?)? on`,
	`how much.*?${theGameRegex} cost`,
	`how (much|many)( [^ \\n]+?)? is${theGameRegex}`,
	`can i play( [^ \\n]+?)?${theGameRegex} now`,
	`price in (usd|dollars|aud|cad)`
],
	`igm`);

client.on("message", async message => {
	if (!message.guild) return;

	const originatingServerId = message.guild.id;
	const originatingChannelId = message.channel.id;

	if (message.author.bot) return;
	if (!client.prefixes.has(message.guild.id)) {
		let name = message.guild.name.replace(/'/g, `\\'`).replace(/"/g, `\\"`);
		var query = `INSERT INTO ${GSTable} (guildID, roles, prefix, guildName, guildIcon, lockedChannels, members) VALUE ('${message.guild.id}', '[]','.','${name}','${message.guild.iconURL({ format: 'png', size: 2048 })}', '[]', '${message.guild.memberCount}');`;
		con.query(query);
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
	let msgContent = message.content
		.toLowerCase()
		.trim()
		.split(" ");
	let timestamp = new Date().toLocaleString();
	message.guild.members.fetch(message.author);

	// Permissions
	let permlvl = 0;
	try {
		if (message.member.permissions.has("MANAGE_MESSAGES", true)) permlvl = 1;
		if (message.member.permissions.has("ADMINISTRATOR", true)) permlvl = 2;
	} catch (e) {
		console.log(message.author + "\n\nCaused:" + e)
	}
	if (message.author.id == "188762891137056769") permlvl = 6;

	//Automod
	if (command !== "automod") {
		if (client.automod.has(message.guild.id)) {
			client.automod.get(message.guild.id).forEach(m => {
				if (msgContent.join("").toLowerCase().match(m)) {
					message.delete()
					message.author.send(`You are not allowed to use the word "${m}" in ${message.guild.name}!`);
					if (!client.logchn.has(message.guild.id)) return
					if (client.logchn.get(message.guild.id) != "disabled") {
						message.guild.channels.cache.get(client.logchn.get(message.guild.id)).send(`Deleted message in <#${message.channel.id}> by <@${message.author.id}>: \n${msgContent.join(" ")}`)
					}
					return
				}
			})
		}
	}


	// Image Only
	// By running this before the other commands, we both stop the user from getting XP from this and stop bot replies from remaining in the image-only channel.
	let imageOnlyChannelIds = client.ImageOnly.get("channels");

	if (imageOnlyChannelIds && imageOnlyChannelIds.includes(originatingChannelId)) {
		if (msg.startsWith(prefix) && command == "unlock" && permlvl >= 2) {
			// Passing the outermost if guarantees that our originating channel ID must be in the array so it's safe to assume that indexOf will always find a valid entry.
			imageOnlyChannelIds.splice(imageOnlyChannelIds.indexOf(originatingChannelId), 1);
			client.ImageOnly.set("channels", imageOnlyChannelIds);
			return message.channel.send("This channel has been unlocked");
		}
		let attatchment = message.attachments.array();
		if (permlvl <= 2) {
			if (
				!message.content.match(
					/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
				)
			) {
				if (!attatchment[0]) {
					message.delete();
					message.channel
						.send("You can only send images in this channel.")
						.then(msg => msg.delete({
							timeout: 5000
						}));
					if (!client.logchn.has(originatingServerId)) return
					if (client.logchn.get(originatingServerId) != "disabled") {
						message.guild.channels.cache.get(client.logchn.get(originatingServerId)).send(`Deleted message in <#${originatingChannelId}> by <@${message.author.id}>: \n${msgContent.join(" ")}`)
					}
					return;
				}
				console.log(attatchment[0])
				if (attatchment[0].width <= 100 && attatchment[0].height <= 100) {
					message.delete();
					message.channel
						.send("You can only send images in this channel")
						.then(msg => msg.delete({
							timeout: 5000
						}));
					if (!client.logchn.has(originatingServerId)) return
					if (client.logchn.get(originatingServerId) != "disabled") {
						message.guild.channels.cache.get(client.logchn.get(originatingServerId)).send(`Deleted message in <#${originatingChannelId}> by <@${message.author.id}>: \n${msgContent.join(" ")}`)
					}
					return;
				}
			}
		}
	}

	// Autoreply (If running as cogbot or on the Volcanoids server. Ignoring discuss-other-games.)
	if ((isTesting || message.guild.id == volcanoidsServerId) && message.channel.id !== discussOtherGamesChannelId) {
		if (consoleAutoreplyRegex.exec(message.content)) {
			CreateAutoReply(message.content, message.channel, `**Volcanoids**? On **consoles**? Yes sir! But so far the main priority is adding more content before they dive into all the console shenanigans. That Rich guy will keep you updated!`, true /* Include check FAQ text. */);
		}
		if (steamAutoreplyRegex.exec(message.content)) {
			CreateAutoReply(message.content, message.channel, `You can get Volcanoids on Steam here: https://store.steampowered.com/app/951440/Volcanoids/`, true /* Include check FAQ text. */);
		}
	}


	// Updating the members in the database
	con.query(`UPDATE ${GSTable} SET members = ${message.guild.memberCount} WHERE guildID = ${message.guild.id}`)

	//xp
	if (!cooldown.has(message.author.id)) {
		if (!msg.startsWith(prefix)) {
			con.query(
				`SELECT UserID, Nickname, xp, profilePic, level, totalxp FROM ${table} WHERE UserID = ${message.author.id} AND guildID = ${message.guild.id}`,
				function (err, result) {
					//if (err) throw err;
					let gainedXp = Math.floor(Math.random() * 10 + 15);
					let user = result[0];
					let profilePic = message.author.avatarURL({
						format: 'png',
						size: 2048
					});
					let nickname = message.member.displayName
						.replace(/'/g, `\\'`)
						.replace(/"/g, `\\"`);

					if (profilePic == null)
						profilePic =
							"https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png";
					if (user === undefined || user === null)
						return con.query(
							`INSERT INTO ${table} (ID, UserID, Nickname, xp, level, profilePic, percentageToNextLvl, requieredXp, totalxp, colour, rankCard, boosts, guildID) VALUES (NULL, "${message.author.id}", "${nickname}", "${gainedXp}", 0, "${profilePic}", ${gainedXp}, "100", "${gainedXp}", "#C54816", 0, 0, ${message.guild.id})`
						);

					let xp = parseInt(user.xp);
					let totalxp = parseInt(user.totalxp);
					let currentlvl = parseInt(user.level);
					let lvl = parseInt(user.level) + 1;

					let nextlvl = lvl + 1;
					let reqxp = 5 * lvl * lvl + 40 * lvl + 55;
					let nextreqxp = 5 * nextlvl * nextlvl + 40 * nextlvl + 55;
					let percentageToNextLvl = Math.floor(((xp + gainedXp) / reqxp) * 100);

					let lvlUpXp = xp + gainedXp - reqxp;
					let lvlUpPercentageToNextLvl = Math.floor(
						(lvlUpXp / nextreqxp) * 100
					);

					var query = `SELECT roles FROM ${GSTable} WHERE guildID = ${message.guild.id}`;
					con.query(query, function (err, result) {
						if (result[0].roles !== null || result[0] !== undefined) {
							let roles = JSON.parse(result[0].roles);
							roles.forEach(r => {
								if (currentlvl >= r.lvl) {
									let role = message.guild.roles.cache.get(r.role);
									if (!message.member.roles.cache.has(role)) {
										message.member.roles.add(role);
									}
								}
							});
						}
					});

					if (xp + gainedXp >= reqxp) {
						con.query(
							`UPDATE ${table} SET level = ${lvl}, requieredXp = ${nextreqxp}, xp = ${lvlUpXp}, percentageToNextLvl = ${lvlUpPercentageToNextLvl} WHERE UserID = '${message.author.id}' AND guildID = '${message.guild.id}'`
						);
					} else {
						con.query(
							`UPDATE ${table} SET xp = ${xp +
							gainedXp}, percentageToNextLvl = ${percentageToNextLvl}, totalxp = ${totalxp +
							gainedXp} WHERE UserID = '${message.author.id
							}' AND guildID = '${message.guild.id}'`
						);
					}

					if (user.Nickname !== message.member.displayName)
						con.query(
							`UPDATE ${table} SET Nickname = '${nickname}' WHERE UserID = ${message.author.id} AND guildID='${message.guild.id}'`
						);
					if (user.profilePic !== message.author.avatarURL({
						format: 'png',
						size: 2048
					}))
						con.query(
							`UPDATE ${table} SET profilePic = '${profilePic}' WHERE UserID = ${message.author.id}`
						);

					cooldown.add(message.author.id);
					setTimeout(() => {
						cooldown.delete(message.author.id);
					}, 60000);
				}
			);
		}
	}

	//prefix
	if (msgContent.includes("prefix") && !msg.startsWith(prefix))
		message.channel.send(`My prefix on this server is ${prefix}`);

	if (
		message.guild.id === volcanoidsServerId &&
		msgContent.includes(".roadmap") &&
		command !== "roadmap"
	) {
		message.channel.send(
			`Check the game's roadmap out here: <https://trello.com/b/xsj3vAs1/volcanoids-roadmap> `
		);
		console.log(`| ${timestamp} | ${message.author.tag} | roadmap`);
	}
	if (
		message.guild.id === volcanoidsServerId &&
		msgContent.includes(".diaries") &&
		command !== "diaries"
	) {
		message.channel.send(
			`Here is a link to a playlist with all the devdiaries on youtube! \nhttps://www.youtube.com/watch?v=19zJL_iIM0U&list=PLW0elFlCp2ZsQP3XXkzrTL8--GPQaVHDP`
		);
		console.log(`| ${timestamp} | ${message.author.tag} | diaries`);
	}

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
	if (message.guild.id !== volcanoidsServerId) {
		if (cmd.help.category == "volc" && permlvl < 5) return;
	}

	console.log(`| ${timestamp} | ${message.guild} | ${message.author.tag} | ${cmd.help.name}`);
	cmd.run(client, message, args, prefix, con, table, permlvl, GSTable);

});

client.on("guildMemberUpdate", (oldMember, newMember) => {
	if (oldMember.displayName !== newMember.displayName) {
		let nickname = newMember.displayName.replace(/'/g, `\\'`).replace(/"/g, `\\"`);
		con.query(
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
		con.query(
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
		con.query(
			`UPDATE ${GSTable} SET guildIcon = '${newGuild.iconURL({ format: 'png', size: 2048 })}' WHERE guildID = '${newGuild.id}'`
		);
	if (oldGuild.name !== newGuild.name)
		con.query(
			`UPDATE ${GSTable} SET guildName = '${newGuild.name}' WHERE guildID = '${newGuild.id}'`
		);
});

client.on("error", console.error);
client.login(process.env[token]);