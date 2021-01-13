module.exports.run = async (client, message, args, prefix, con, table) => {

    let mention = message.mentions.users.first();
    let userID = message.author.id;

    if (args[1]) return message.channel.send('You can only check one persons rank at a time.')
    if (mention) userID = mention.id;

    con.query(`SELECT UserID, percentageToNextLvl, colour, Nickname, profilePic, xp, requieredXp, level, rankCard, guildID FROM ${table} WHERE guildID = ${message.guild.id} ORDER BY totalxp DESC`, function (err, result) {
        if (err) throw err
        let rank = client.rank(result, userID, message.guild.id);
        let user = result[row(result, userID)];
        if (user == null) return message.channel.send(`<@${userID}> doesn't have any rank yet.`)
        message.channel.send(client.rankcard(user, rank, message.guild.id))
    });


    function row(result, userID) {
        let i = 0
        while (result.length > i) {
            if (result[i].UserID == userID) return i;
            i++
        }
        return null;
    }
}

exports.help = {
    name: "rank",
    desc: "quickly check your own, or someone else's rank",
    aliases: ['r', 'rkan', 'rakn', 'rkna'],
    permLvl: 0,
    hidden: false,
    category: "rank",
    usage: "rank (@user)"
}