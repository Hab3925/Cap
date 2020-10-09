// Quick switch between testing mode & regular mode.
const isTesting = true;
const token = isTesting? "cog" : "cap";

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
const thumbsUpId = isTesting? thumbsUpId_testing : thumbsUpId_cogHand;

const thumbsDownId_cogHand = "722120016723574805"; // :cogThumbsDown:
const thumbsDownId_testing = "546734308161749011"; // :Shotgun:
const thumbsDownId = isTesting? thumbsDownId_testing : thumbsDownId_cogHand;

// Other constants.
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./storage/config.json");
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
let con = mysql.createConnection(config.connection);

let thumbsUp;
let thumbsDown;
let consoleAutoreplyRegex = CreateAutoReplyRegex([
													`console.*(will|game|to|available)`,
													`(will|game|to|available).*console`,
													`xbox.*(will|game|to|available)`,
													`(will|game|to|available).*xbox`,
													`(ps4|ps5).*(will|game|to|available)`,
													`(will|game|to|available).*(ps4|ps5|playstation)`
												],
												`igm`);
let steamAutoreplyRegex = CreateAutoReplyRegex([
													`when('s|s| is)? (it|this|the game|volcanoid(s?)) coming out`,
													`is (it|this|the game|volcanoid(s?)) (out|released|available)( yet)?`,
													`(where|how) can.*?(get|buy|play).*?(this|game|volcanoid(s?))`,
													`(where|how).*?download`,
													`(is|if|will)( [^ \\n]+?)? (this|game|it|volcanoid(s?))( (?!only)[^ \\n]+?)? (free|on steam)`,
													`what.*?(get|buy|is).*?(this|game|it|volcanoid(s?)|be)( [^ \\n]+?)? on`,
													`how much.*?(this|game|it|volcanoid(s?)) cost`,
													`how (much|many)( [^ \\n]+?)? is( (that|the|this))? (game|it|volcanoid(s?))`,
													`can i play( [^ \\n]+?)? (this|game|it|volcanoid(s?)) now`,
													`price in (usd|dollars|aud|cad)`
												],
												`igm`);

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

	// Init some global vars so we don't have to do this on each command.
	thumbsUp = client.emojis.cache.get(thumbsUpId);
	thumbsDown = client.emojis.cache.get(thumbsDownId);
});

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

client.on("message", async message => {
	if (!message.guild) return;

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
	if (~config.volcdev.indexOf(message.author.id)) permlvl = 3;
	if (~config.codev.indexOf(message.author.id)) permlvl = 5;
	if (~config.dev.indexOf(message.author.id)) permlvl = 6;

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

	// Autoreply (If running as cogbot or on the Volcanoids server. Ignoring discuss-other-games.)
	if ((isTesting || message.guild.id == volcanoidsServerId) && message.channel.id !== discussOtherGamesChannelId) {
		if (consoleAutoreplyRegex.exec(message.content)) {
			CreateAutoReply(message.channel, `**Volcanoids**? On **consoles**? Yes sir! But so far the main priority is adding more content before they dive into all the console shenanigans. That Rich guy will keep you updated!`, true /* Include check FAQ text. */);
		}
		if (steamAutoreplyRegex.exec(message.content)) {
			CreateAutoReply(message.channel, `You can get Volcanoids on Steam here: https://store.steampowered.com/app/951440/Volcanoids/`, true /* Include check FAQ text. */);
		}
	}


	// Image Only
	client.ImageOnly.get("channels").forEach(c => {
		if (c == message.channel.id) {
			if (msg.startsWith(prefix) && command == "unlock" && permlvl >= 2) {
				let channels = [];
				client.ImageOnly.get("channels").forEach(c => {
					if (c == message.channel.id) return;
					channels.push(c);
				});
				client.ImageOnly.set("channels", channels);
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
						if (!client.logchn.has(message.guild.id)) return
						if (client.logchn.get(message.guild.id) != "disabled") {
							message.guild.channels.cache.get(client.logchn.get(message.guild.id)).send(`Deleted message in <#${message.channel.id}> by <@${message.author.id}>: \n${msgContent.join(" ")}`)
						}
						return;
					}
					if (attatchment[0].width <= 100 && attatchment[0].height <= 100) {
						message.delete();
						message.channel
							.send("You can only send images in this channel")
							.then(msg => msg.delete({
								timeout: 5000
							}));
						if (!client.logchn.has(message.guild.id)) return
						if (client.logchn.get(message.guild.id) != "disabled") {
							message.guild.channels.cache.get(client.logchn.get(message.guild.id)).send(`Deleted message in <#${message.channel.id}> by <@${message.author.id}>: \n${msgContent.join(" ")}`)
						}
						return;
					}
				}
			}
		}
	});


	// Updating the members in the database
	con.query(`UPDATE ${GSTable} SET members = ${message.guild.memberCount} WHERE guildID = ${message.guild.id}`)

	//xp
	if (!cooldown.has(message.author.id)) {
		if (!msg.startsWith(prefix)) {
			con.query(
				`SELECT UserID, Nickname, xp, profilePic, level, totalxp FROM ${table} WHERE UserID = ${message.author.id} AND guildID = ${message.guild.id}`,
				function (err, result) {
					if (err) throw err;
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
client.login(config[token]);

/**
 * Pass an array of individual regex to match. This will merge them into one pattern.
 *
 * @param individualLinesToMatch Patterns to merge.
 * @param flags                  (Optional) Regex flags to use.
 * @param ignoreQuotedText       (Optional) Makes sure each individual pattern ignores lines that start with `>`.
 * @param ignoreCodeText         (Optional) Makes sure each individual pattern ignores matches surrounded with `. (Currently broken.)
 */
function CreateAutoReplyRegex(individualLinesToMatch, flags = "", ignoreQuotedText = true, ignoreCodeText = true) {
	let regexStr = ``;

	individualLinesToMatch.forEach((line, index) => {
		let toMatch = line
		if (index > 0) regexStr += `|`;

		// Broken. Doesn't work for lines that start directly with the part we're matching.
		//if (ignoreCodeText === true) toMatch = `[^\`]${toMatch}[^\`]`

		if (ignoreQuotedText === true) toMatch = `^(?!>).*?${toMatch}`;

		regexStr += `(${toMatch})`
	});

	console.log(`Made Regex: ${regexStr}`);

	return RegExp(regexStr, flags);
}

/**
 * Creates a reply on the given channel with the response text.
 * Also handles waiting for feedback.
 *
 * @param channel                      The channel to send the message to.
 * @param response                     The text to use as the base for the message.
 * @param includeCheckFaqMsgInResponse (Optional) Whether to append the canned message about checking the FAQ to the end of the response message.
 */
function CreateAutoReply(channel, response, includeCheckFaqMsgInResponse = true) {
	if (includeCheckFaqMsgInResponse === true) {
		response += `\n\nIf you have any other questions, make sure to read the <#${faqChannelId}>, your question might be already answered there.`;
	}

	channel.send(`${response}\n\nThis autoreply is a work in progress feature, did this help you? (react with ${thumbsUp}) Or was it misplaced? (react with ${thumbsDown}) Thanks for the input!`)
		.then(async (m) => {
			await m.react(thumbsUp);
			await m.react(thumbsDown);
			setTimeout(() => {
				m.createReactionCollector(async (r) => {
					let currentGood = client.autoreply.get("good");
					let currentBad = client.autoreply.get("bad");

					if (r.emoji.id == thumbsUp.id) {
						currentGood++;
						await UpdateAutoReplyStats(currentGood, currentBad);
						client.autoreply.set("good", currentGood);

						m.edit(response);

						ShowThanksForFeedback(r);
						return;
					} else if (r.emoji.id == thumbsDown.id) {
						currentBad++;
						await UpdateAutoReplyStats(currentGood, currentBad);
						client.autoreply.set("bad", currentBad);

						m.edit(response);
						m.delete({ timeout: 10000 });

						ShowThanksForFeedback(r);
						return;
					}
				}, {
					time: 60000
				});
				setTimeout(() => {
					m.edit(response);
					m.reactions.cache.forEach(re => re.remove());
				}, 60000);
			}, 200);
		});

	// Shows the new status ratio.
	async function UpdateAutoReplyStats(currentGood, currentBad) {
		const newStatusMessage = `Good response: ${currentGood} | Bad response: ${currentBad} | Ratio: ${Math.floor(currentGood / (currentGood + currentBad) * 100)}%`;

		if (isTesting) { // CogBot cannot edit Cap's stats post.
			console.log(newStatusMessage);
		} else {
			let statsMsg = await client.guilds.cache.get(captainsSubmarineServerId).channels.cache.get(autoReplyFeedbackChannelId).messages.fetch(autoReplyFeedbackMessageId);
			statsMsg.edit(newStatusMessage);
		}
	}

	// Local func so we don't have to repeat it for each potential emoji reply.
	function ShowThanksForFeedback(r) {
		channel.send("Thanks for the feedback").then(mess => mess.delete({
			timeout: 5000
		}));
		r.message.reactions.cache.forEach(re => re.remove());
	}
}
