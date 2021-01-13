module.exports.run = async (client, message, args) => {
    if (client[args[0]] instanceof Map) {
        if (args[1] == "delete") {
            client[args[0]].deleteAll()
            message.channel.send(`Deleted content of ${args[0]}`)
        } else if (args[1] == "set") {
            if (!args[2] && args[3]) return message.channel.send("You need to add the content you want to set")
            client[args[0]].set(args[2], JSON.parse(args[3]))
            message.channel.send(`Set ${args[2]} = ${args[3]} in ${args[0]}`)
        } else if (args[1] == "get") {
            if (!args[2]) return message.channel.send("You have to say what variable you want to `get`")
            message.channel.send(client[args[0]].get(args[2]))
        } else {
            message.channel.send("Invalid operation")
        }
    } else {
        message.channel.send(`Thats not an enmap.`)
    }
}

exports.help = {
    name: "enmap",
    desc: "Modify enmaps",
    aliases: [],
    permLvl: 6,
    hidden: false,
    category: "dev",
    usage: ".enmap [name] [action] (content)"
}