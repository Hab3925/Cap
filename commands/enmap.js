module.exports.run = async (client, message, args) => {
    if (client[args[0]] instanceof Map) {
        if (args[1] == "delete") {
            client[args[0]].deleteAll()
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