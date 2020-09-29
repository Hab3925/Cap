module.exports.run = async (client, message) => {
    let now = new Date().getTime();
    message.channel.send(`I have been online for ${client.timeDiff(now, now + client.uptime)}.`)
}

exports.help = {
    name: "uptime",
    desc: "Check the bots uptime",
    aliases: [],
    permLvl: 0,
    hidden: false,
    category: "misc",
    usage: "uptime"
}