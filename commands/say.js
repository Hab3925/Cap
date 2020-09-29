module.exports.run = async (client, message, args) => {
    message.delete()
    if (!args[0]) return message.channel.send("No message provided!")
    if (client.channels.cache.get(args[0].replace(/<|#|>/gm, ''))) {
        let channel = args.shift()
        if (!args[0]) return message.channel.send("No message provided")
        client.channels.cache.get(channel.replace(/<|#|>/gm, '')).send(args.join(" "))
        return message.channel.send("Sent!")
    }
    message.channel.send(args.join(" "))
}

exports.help = {
    name: "say",
    desc: "Make the captain say anything you would like.",
    aliases: [],
    permLvl: 3,
    hidden: false,
    category: "dev",
    usage: "say [message]"
}