module.exports.run = async (client, message, args) => {

    console.log(client.guilds.get(message.guild.id).members.cache)
}

exports.help = {
    name: "ban",
    desc: "Ban that annoying user in #general",
    aliases: [],
    permLvl: 1,
    hidden: false,
    category: "admin",
    usage: "ban @[user] [reason]"
}