module.exports.run = async (client, message, args, prefix, con, table, permLvl, GSTable) => {
    const Discord = require('discord.js');

    if (!args[0]) {

        let embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setTitle("Disabled commands:")
        client.disabledCmds.forEach(g => {
            let channels = [];
            console.log(g)
            if (g.has(message.guild.id)) {
                g[message.guild.id].forEach(c => {
                    channels.push(`<#${c}>`)
                })
            }
            embed.addField(g, channels.join("\n"))
        });
        message.channel.send(embed)
    }

    if (!message.guild.channels.has(args[1].replace(/<|#|>/g, ''))) return message.channel.send('This is not a channel in this server!');
    let cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
    if (args[0].toLowerCase() != 'all') {
        if (!cmd || cmd.help.permLvl > permLvl) return message.channel.send(`You didn\'t select a command, do ${prefix}help to view what commands you can disable in this channel`);
    }

    if (args[0].toLowerCase() == 'all') {

    }





    con.query(`SELECT lockedChannels FROM ${GSTable} WHERE guildID = ${message.guild.id}`, async function (err, result) {
        if (result[0].lockedChannels == '') {
            message.channel.send("Something went wrong! Please try again!")
            return con.query(`UPDATE ${GSTable} SET lockedChannels = '[]' WHERE GuildID = ${message.guild.id}`)
        }
        let lockedChannels = JSON.parse(result[0].lockedChannels)

        const Discord = require('discord.js');
        if (!args[0]) {
            let disCmds = [];


            if (!lockedChannels[0]) return message.channel.send("There are no disabled commands here.")

            let embed = new Discord.MessageEmbed() //yes commented code go brr
                .setTimestamp()
                .setTitle("Disabled commands")


            return message.channel.send(embed)
        }
        if (!message.guild.channels.has(args[1].replace(/<|#|>/g, ''))) return message.channel.send('This is not a channel in this server!');
        let cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
        if (args[0].toLowerCase() != 'all') {
            if (!cmd || cmd.help.permLvl > permLvl) return message.channel.send(`You didn\'t select a command, do ${prefix}help to view what commands you can disable in this channel`);
        }



        if (args[0].toLowerCase() == "all") {
            let dbArray = [];
            client.commands.forEach(cmd => {
                if (cmd.help.permLvl < 0) return;
                let dbObject = {
                    channel: args[1].replace(/<|#|>/g, ''),
                    command: cmd.help.name
                }
                dbArray.push(dbObject);
            });
            con.query(`UPDATE ${GSTable} SET lockedChannels = '${JSON.stringify(dbArray)}' WHERE guildID = ${message.guild.id}`)
            message.channel.send(`All commands were disabled in ${args[1]}`)
            return;
        }

        let used = [];
        lockedChannels.forEach(obj => {
            if (obj.channel == args[1].replace(/<|#|>/g, '')) {
                if (obj.command == args[0]) {
                    used.push(1)
                    return message.channel.send("This command is already locked in this channel!")
                }
            }
        });
        if (used[0]) return
        let dbObject = {
            channel: args[1].replace(/<|#|>/g, ''),
            command: args[0]
        }
        lockedChannels.push(dbObject)
        con.query(`UPDATE ${GSTable} SET lockedChannels = '${JSON.stringify(lockedChannels)}' WHERE guildID = ${message.guild.id}`)
        message.channel.send(`The command \`${args[0]}\` can no longer be used in ${args[1]}.`)
    });
}

exports.help = {
    name: "disable",
    desc: "disable a in a selected channel",
    aliases: ['dis'],
    permLvl: 2,
    hidden: false,
    category: "admin",
    usage: "disable [command / all(selects all commands)] [#channel]"
}