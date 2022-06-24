module.exports.run = async (client, message, args, prefix, con) => {
    message.channel.send(client.rankembed4())
}
exports.help = {
    name: "test3",
    desc: "test",
    aliases: ['t3'],
    permLvl: 6,
    hidden: false,
    category: "dev",
    usage: "top secret"
}