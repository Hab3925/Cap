module.exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send('You need to mention a channel for me to send the logs to')
    if (args[0].toLowerCase() == 'disable') {
        client.logchn.get(message.guild.id) == 'disabled' ? message.channel.send(`I can't remember sending mod logs anywhere...`) : message.channel.send(`Ok, I'll stop sending mod logs to <#${client.logchn.get(message.guild.id)}>`);
        client.logchn.set(message.guild.id, 'disabled');
        return
    }
    //*Ctrl+C* "JOINK" *Ctrl+V*
    if (message.guild.channels.cache.has(args[0].replace(/<|#|>/g, ''))) {
        client.logchn.set(message.guild.id, args[0].replace(/<|#|>/g, ''))
        message.channel.send(`Got it! I will now send the Mod Logs to ${message.guild.channels.cache.get(args[0].replace(/<|#|>/g, ''))}`)
    } else {
        message.channel.send("That's not a channel in this server, make sure to mention it!")
    }
}

exports.help = {
    name: "modlog",
    desc: "Set up a channel to monitor all the moderation im doing on your server",
    aliases: [],
    permLvl: 2,
    hidden: false,
    category: "admin",
    usage: "modlog [#channel] or [disable]"
}