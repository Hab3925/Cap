module.exports.run = async (client, message, args) => {
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