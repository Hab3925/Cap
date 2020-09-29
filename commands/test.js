module.exports.run = async (client, message, args, prefix, con, table, permLvl, GSTable) => {
    if (!client.commands.get(args[0]) || permLvl < exports.help.permLvl) return message.channel.send(`Thts is not a command! Do \`${prefix}help\` to view all the commands.`);
    if (!message.guild.channels.cache.has(args[1].replace(/<|#|>/g, ''))) return message.channel.send(`You didn't tag a channel in this server, make sure to add the # before the name.`)

    con.query(`SELECT lockedChannels FROM ${GSTable} WHERE guildID = ${message.guild.id}`, async function (err, result) {
        if (result[0].lockedChannels == '') {
            message.channel.send("Failed, please try again.")
            return con.query(`UPDATE ${GSTable} SET lockedChannels = '[]' WHERE GuildID = ${message.guild.id}`)
        }

        let lockedChannels = JSON.parse(result[0].lockedChannels)

        let dbObject = {
            channel: args[1].replace(/<|#|>/g, ''),
            command: args[0]
        }
        lockedChannels.push(dbObject)
        con.query(`UPDATE ${GSTable} SET lockedChannels = '${JSON.stringify(lockedChannels)}' WHERE guildID = ${message.guild.id}`)
        message.channel.send(`The command \`${args[0]}\` can no longer be used in ${args[1]}.`)
    });
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