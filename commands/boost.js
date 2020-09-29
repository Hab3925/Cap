module.exports.run = async (client, message, args, prefix, con, token) => {
    const Discord = require('discord.js');
    if(token == 'cog'){ table = 'TESTXP'; GSTable = 'TESTguildsettings'; }
    if(token == 'cap'){ table = 'XP'; GSTable = 'guildsettings'; }  

    con.query(`SELECT UserID, boosts FROM ${table}`, function (err, result) {
        if(err) throw err;

        let user = result[row(result, message.author.id)]

        let embed = new Discord.MessageEmbed()
        .setColor('#C54816')
        .addField('Your boosts:', `10x boost for 1 hr: ${user.boosts}\n`)
        .setTimestamp()
        

        message.channel.send(embed)
    });

    function row(result, userID){
        let i = 0
        while (result.length > i){
            if(result[i].UserID == userID)return i;
            i++
        }
        return null;
    }
}

exports.help = {
    name: "boost",
    desc: "no description",
    aliases: ['b'],
    permLvl: 6,
    hidden: false,
    category: "rank",
    usage: "boost (boostname)"
}