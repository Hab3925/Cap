module.exports.run = async (client, message, args, prefix, con, table, permLvl, GSTable) => {
    con.query(`SELECT lockedChannels FROM ${GSTable} WHERE guildID = ${message.guild.id}`, async function (err, result) {
        if (result[0].lockedChannels == '') {
            message.channel.send("Something went wrong! Please try again!")
            return con.query(`UPDATE ${GSTable} SET lockedChannels = '[]' WHERE GuildID = ${message.guild.id}`)
        }
        let lockedChannels = JSON.parse(result[0].lockedChannels)

        const Discord = require('discord.js');
        if (!args[0]) {
            let disCmds = [];
            lockedChannels.forEach(obj => {
                disCmds.push(`**${prefix}${obj.command}** disabled in: <#${obj.channel}>`)
            })
            if (!lockedChannels[0]) return message.channel.send("There are no disabled commands here.")

            let embed = new Discord.RichEmbed()
                .setTimestamp()
                .setDescription(disCmds.join('\n'))
                .setTitle("Disabled commands")

            return message.channel.send(embed)
        }

        if (!message.guild.channels.has(args[1].replace(/<|#|>/g, ''))) return message.channel.send('This is not a channel in this server!');
        let cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
        if (args[0].toLowerCase() != 'all') {
            if (!cmd || cmd.help.permLvl > permLvl) return message.channel.send(`You didn\'t select a command, do ${prefix}help to view what commands you can enable in this channel`);
        }

        if (args[0].toLowerCase() == 'all') {
            let disArray = []
            lockedChannels.forEach(obj => {
                if (obj.channel == args[1].replace(/<|#|>/g, '')) return;
                disArray.push(obj)
            })

            message.channel.send(`All commands enabled in ${args[1]}`)
            con.query(`UPDATE ${GSTable} SET lockedChannels = '${JSON.stringify(disArray)}' WHERE GuildID = ${message.guild.id}`)
            return
        }

        let disabledCmds = [];

        lockedChannels.forEach(obj => {
            if (args[0] == obj.command) {
                if (args[1].replace(/<|#|>/g, '') == obj.channel) return;
            }
            disabledCmds.push(obj)
        });

        message.channel.send(`Enabled \`${args[0]}\` in ${args[1]}`)
        con.query(`UPDATE ${GSTable} SET lockedChannels = '${JSON.stringify(disabledCmds)}' WHERE GuildID = ${message.guild.id}`)

    })
}

exports.help = {
    name: "enable",
    desc: "enable a in a selected channel",
    aliases: ['en'],
    permLvl: 2,
    hidden: false,
    category: "admin",
    usage: "enable [command / all(selects all commands)] [#channel]"
}