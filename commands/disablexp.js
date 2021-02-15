module.exports.run = async (client, message, args) => {
    const Discord = require('discord.js')
    if (!client.disabledXp.has(message.guild.id)) {
        client.disabledXp.set(message.guild.id, [])
    }
    const channels = client.disabledXp.get(message.guild.id)

    if (!args[0]) {
        if (!channels) return message.channel.send(`XP isn't limited in any channels on this server. Disable xp gain in a channel with this command: \`${exports.help.usage}\``)
        if (!channels[0]) return message.channel.send(`XP isn't limited in any channels on this server. Disable xp gain in a channel with this command: \`${exports.help.usage}\``)
        let embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setTitle("XP is disabled in:")
            .setDescription(`| <#${channels.join("> | <#")}> |`)
            .setColor("#02C22A")
        return message.channel.send(embed)
    }

    if (args[0] == "delete" || args[0] == "remove") {
        if (!args[1]) return message.channel.send(`You didn't tell me what channel to remove! \`Usage: ${exports.help.usage}\``)
        if (!message.guild.channels.cache.has(args[1].replace(/<|#|>/gm, ""))) return message.channel.send("You didnt provide a valid channel!")
        if (!channels.includes(args[1].replace(/<|#|>/gm, ""))) return message.channel.send(`XP isnt disabled in this channel!`)

        let array = channels
        let i = 0;
        array.forEach(element => {
            if (element == args[1].replace(/<|#|>/gm, "")) {
                array.splice(i, 1)
            }
            i++;
        });
        client.disabledXp.set(message.guild.id, array)

        return message.channel.send(`XP is no longer disabled in ${args[1]}`)
    } else {
        let channel = args[0].replace(/<|#|>/gm, "")
        if (!message.guild.channels.cache.has(channel)) return message.channel.send("You didnt tell me what channel you wanted to disable xp in!")
        if (!message.guild.channels.cache.has(channel)) return message.channel.send("You didnt provide a valid channel!")
        if (channels.includes(channel)) return message.channel.send("XP is already disabled in this channel, to enable it use `disablexp remove #channel`")

        let array = channels
        array.push(channel)

        client.disabledXp.set(message.guild.id, array)
        return message.channel.send(`You can no longer gain xp in <#${channel}>`)
    }

}

exports.help = {
    name: "disablexp",
    desc: "Disables xp gain in a channel.",
    aliases: ['xp'],
    permLvl: 2,
    hidden: false,
    category: "admin",
    usage: "disablexp (remove) [#channel]"
}