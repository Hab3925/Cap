module.exports.run = async (client, message) => {

    message.channel.send({
        files: [{
            attachment: "https://media.discordapp.net/attachments/494576341849735188/806560239599747131/How_Areas_Work.png?width=1440&height=480",
            name: "SPOILER_FILE.jpg"
        }]
    })
}

exports.help = {
    name: "map",
    desc: "gives you the map of the game to explain areas",
    aliases: [],
    permLvl: 0,
    hidden: false,
    category: "volc",
    usage: ".map"
}