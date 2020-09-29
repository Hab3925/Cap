module.exports.run = async (client, message, args, prefix, con, table) => {
    const limit = 300000;

    con.query(`SELECT UserID FROM XP`, function (err, result){if (result[user(result)] == null) return message.channel.send('You are not ranked. Get a rank before you can change your rankcard');})

        if(args[0]){
            if(args[1])return message.channel.send('That isn\'t a valid hexcode, remember to include the #')

            if(args[0].match(/[#a-fA-F1-9]/g) && args[0].length == 7 && args[0].startsWith('#')){
                con.query(`UPDATE ${table} SET colour = '${args[0]}' WHERE UserID = '${message.author.id}'`)
                message.channel.send('Rankcard updated!')
            }else message.channel.send('That isn\'t a valid hexcode, remember to include the #')
            return
        }

        const response = await client.awaitReply(message, 'To customize the colour of your rankcard send the hexcode for the color you want your card to have \n(You can find the hexcode here: https://htmlcolorcodes.com/color-picker/)', limit);
        if(!response)return;
        let resargs = response.trim().split(' ');
        if(resargs[1])return message.channel.send('That isn\'t a valid hexcode, remember to include the #')

        if(resargs[0].match(/[#a-fA-F1-9]/g) && resargs[0].length == 7 && resargs[0].startsWith('#')){
            con.query(`UPDATE ${table} SET colour = '${resargs[0]}' WHERE UserID = '${message.author.id}'`)
            message.channel.send('Rankcard updated!')
        }else message.channel.send('That isn\'t a valid hexcode, remember to include the #')
        
        function user(result) {
            let i = 0
            while (result.length > i){
                if(result[i].UserID == message.author.id)return i;
                i++
            }
            return null
        }
};

exports.help = {
    name: "rankcolor",
    desc: "Change the color of your rankcard!",
    aliases: ['rc', 'rankcolour'],
    permLvl: 0,
    hidden: false,
    category: "rank",
    usage: "rankcolor (color)"
}