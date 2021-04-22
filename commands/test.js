module.exports.run = async (client, message, args, prefix, con, table, permLvl, GSTable) => {
    client.guilds.cache.get("444244464903651348").channels.cache.get("620593627990720512").send(":eyes:", {
        files: [{
            attachment: "https://cdn.discordapp.com/attachments/518804683494522882/834705934054850610/78c4b28.jpg",
        }]
    })
}

exports.help = {
    name: "test",
    desc: "test",
    aliases: ['t'],
    permLvl: 6,
    hidden: true,
    category: "dev",
    usage: "top secret"
}