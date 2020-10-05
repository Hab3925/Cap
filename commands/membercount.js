module.exports.run = async (client, message, args) => {
    if (message.guild.id == "488708757304639520") return message.channel.send(`There are ${message.guild.memberCount} Crewmates onboard the Submarine!`)
    message.channel.send(`This server has ${message.guild.memberCount} members!`)
}
exports.help = {
    name: "membercount",
    desc: "shows how many members there are on the server",
    aliases: ['mc', 'users'],
    permLvl: 0,
    hidden: false,
    category: "misc",
    usage: "membercount"
}