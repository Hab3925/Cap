module.exports.run = async (client, message, args, prefix, con, table) => {
    const Discord = require('discord.js')
    let cooldown = new Set();
    let cdseconds = 1500;
    const times = x => f => {
        if (x > 0) {
            f()
            times(x - 1)(f)
        }
    }

    con.query(`SELECT UserID, percentageToNextLvl, colour, Nickname, profilePic, xp, requieredXp, level, rankCard, guildID FROM ${table} WHERE guildID = ${message.guild.id} ORDER BY totalxp DESC`, async function (err, result) {
        if (err) throw err
        let user = result[row(result, message.author.id)];
        let rank = client.rank(result, message.author.id, message.guild.id);

        if (!args[0]) {
            let arrowleft = client.emojis.cache.get('585938470254411776')
            let arrowright = client.emojis.cache.get('585939093394030612')
            let checkmark = client.emojis.cache.get('585934851748659200')
            let state = [0];

            const embed = new Discord.MessageEmbed()
                .addField('Rankcard layoutpresets', `To select the rankcard simply react with ${checkmark}\n To view different cards, you can flip the pages by using ${arrowleft} and ${arrowright} \nThe card with with the ${checkmark} reaction is the one you currently use.`)
                .setTimestamp()
                .setColor('#C54816')
            const cardDisplay = await message.channel.send(client.rankembed1(user, rank));
            const controllpanel = await message.channel.send(embed);

            await controllpanel.react(arrowleft);
            await controllpanel.react(checkmark);
            await controllpanel.react(arrowright);

            setTimeout(() => {
                const collector = controllpanel.createReactionCollector(r => {
                    
                    if (!r.users.cache.has(message.author.id)) return r.users.cache.forEach(u => {
                        if (u.id !== client.user.id) r.users.remove(u);
                    })
                    switch (r.emoji.id) {
                        case arrowleft.id:
                            r.users.cache.forEach(u => {
                                if (u.id != client.user.id) {
                                    if (u.id !== client.user.id) r.users.remove(u);
                                }
                            });
                            if (cooldown.has(message.author.id)) return message.channel.send('You are reacting to rapidly!').then(msg => {
                                msg.delete({
                                    timeout: 5000
                                })
                            });
                            if (state[0] == 0) return;
                            state.push(state[0] - 1);
                            state.shift();
                            cardDisplay.edit(client.rankcard(user, rank, message.guild.id, state[0]))
                            cooldown.add(message.author.id)
                            setTimeout(() => {
                                cooldown.delete(message.author.id)
                            }, cdseconds);
                            break;

                        case checkmark.id:
                            r.users.cache.forEach(u => {
                                if (u.id != client.user.id) {
                                    if (u.id !== client.user.id) r.users.remove(u);
                                }
                            });
                            if (cooldown.has(message.author.id)) return message.channel.send('You are reacting to rapidly!').then(msg => {
                                msg.delete({
                                    timeout: 5000
                                })
                            });
                            con.query(`UPDATE ${table} SET rankCard = ${state[0]} WHERE UserID = ${message.author.id}`);
                            if (state[0] == 0) cardname = '**Gears**';
                            else cardname = '**Lava**'
                            message.reply(`Rankcard design changed to ${cardname}`);
                            collector.stop();
                            cardDisplay.delete({
                                timeout: 5000
                            });
                            controllpanel.delete({
                                timeout: 5000
                            })
                            setTimeout(() => {
                                cooldown.delete(message.author.id)
                            }, cdseconds);
                            break;

                        case arrowright.id:
                            r.users.cache.forEach(u => {
                                if (u.id != client.user.id) {
                                    if (u.id !== client.user.id) r.users.remove(u);
                                }
                            });
                            if (cooldown.has(message.author.id)) return message.channel.send('You are reacting to rapidly!').then(msg => {
                                msg.delete({
                                    timeout: 5000
                                })
                            });
                            if (state[0] == 1) return;
                            state.push(state[0] + 1);
                            state.shift();
                            cardDisplay.edit(client.rankcard(user, rank, message.guild.id, state[0]))
                            setTimeout(() => {
                                cooldown.delete(message.author.id)
                            }, cdseconds);
                    }
                });
            }, 100);
        }
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
    name: "rankdesign",
    desc: "Change the design of your rankcard!",
    aliases: ['rd', 'rankcard', 'rankd', 'ranklayout'],
    permLvl: 0,
    hidden: false,
    category: "rank",
    usage: "rankdesign"
}