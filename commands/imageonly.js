module.exports.run = async (client, message, args) => {
    const Discord = require('discord.js')
    if (!client.ImageOnly.has(message.guild.id)) {
        client.ImageOnly.set(message.guild.id, [])
    }
    const channels = client.ImageOnly.get(message.guild.id)



    if (!args[0]) {
        if (!channels) return message.channel.send(`There are no image only channels on this server. Limit a channel to images only with this command: \`${exports.help.usage}\``)
        if (!channels[0]) return message.channel.send(`There are no image only channels on this server. Limit a channel to images only with this command: \`${exports.help.usage}\``)
        let embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setTitle("Image only channels")
            .setDescription(`| <#${channels.join("> | <#")}> |`)
            .setColor("#EFCF01")
        return message.channel.send(embed)
    }

    if (args[0] == "delete" || args[0] == "remove") {
        if (!args[1]) return message.channel.send(`You didn't tell me what channel to remove! \`Usage: ${exports.help.usage}\``)
        if (!message.guild.channels.cache.has(args[1].replace(/<|#|>/gm, ""))) return message.channel.send("You didnt provide a valid channel!")
        if (!channels.includes(args[1].replace(/<|#|>/gm, ""))) return message.channel.send(`This channel isn't limited to images only.`)

        let array = channels
        let i = 0;
        array.forEach(element => {
            if (element == args[1].replace(/<|#|>/gm, "")) {
                array.splice(i, 1)
            }
            i++;
        });
        client.ImageOnly.set(message.guild.id, array)

        message.guild.channels.cache.get(args[1].replace(/<|#|>/gm)).send("This channel will no longer be limited to images only!")
        return message.channel.send(`${args[1]} Will no longer be limited to images only`)
    } else {
        let channel = args[0].replace(/<|#|>/gm, "")
        if (!message.guild.channels.cache.has(channel)) return message.channel.send("You didnt tell me what channel you wanted to limit!")
        if (!message.guild.channels.cache.has(channel)) return message.channel.send("You didnt provide a valid channel!")
        if (channels.includes(channel)) return message.channel.send("This channel is already limited to images only.")

        let array = channels
        array.push(channel)

        client.ImageOnly.set(message.guild.id, array)
        message.guild.channels.cache.get(channel).send("This channel is now limited to images only!")
        return message.channel.send(`<#${channel}> is now limited to images only!`)
    }

}

exports.help = {
    name: "imageonly",
    desc: "limits the channel the command is used in to images only",
    aliases: ['io'],
    permLvl: 2,
    hidden: false,
    category: "admin",
    usage: "imageonly (delete) [#channel]"
}