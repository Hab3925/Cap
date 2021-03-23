module.exports.run = async (client, message, args) => {
    const {
        inspect
    } = require("util");
    if (client[args[0]] instanceof Map) {
        if (args[1] == "delete") {
            try {
                client[args[0]].clear()
                message.channel.send(`Deleted content of ${args[0]}`)
            } catch (e) {
                message.channel.send(`Cannot delete content because: \`${e}\``)
            }
        } else if (args[1] == "set") {
            if (!args[3]) return message.channel.send("You need to add the content you want to set")
            try {
                client[args[0]].set(args[2], JSON.parse(args[3]))
                message.channel.send(`Set ${args[2]} = ${args[3]} in ${args[0]}`)
            } catch {
                client[args[0]].set(args[2], args[3])
                message.channel.send(`Set ${args[2]} = ${args[3]} in ${args[0]}`)
            }
        } else if (args[1] == "get") {
            if (!args[2]) return message.channel.send("You have to say what variable you want to `get`")
            message.channel.send(`\`\`\`` + inspect(client[args[0]].get(args[2])) + `\`\`\``)
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