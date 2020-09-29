module.exports.run = async (client, message, args) => {
    message.delete({timeout:5000})
    const Discord = require('discord.js')
    const emojiregex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
    const { inspect } = require("util");

    const channel = await client.awaitReply(message, 'Ok! lets set up your giveaway! What channel do you want to have the giveaway in? \nYou can type `cancel` at any time to cancel.', 60000); if (!channel) return message.channel.send('Timed out.')
    if (channel.toLowerCase() == ('c' || 'cancel')) { return message.channel.send('Cancelled') } else if (!client.channels.cache.has(channel.replace(/<|#|>/g, ''))) return message.channel.send('That is not a valid channel')

    const announceMsg = await client.awaitReply(message, 'Got you! Now, what do you want the message to display? Remember to seperate the title and the description of the messsage by a | ', 60000); if (!announceMsg) return message.channel.send('Timed out.')
    let announceArgs = announceMsg.split(' ')
    if (client.titleEnd(announceArgs) === 0) return message.channel.send('You have to give your message a title. Seperate the title from the description with |')
    let description = announceArgs.splice(client.titleEnd(announceArgs)).join(' ').replace('|', '')
    let title = announceArgs.join(' ');
    if (title.length > 200) return message.channel.send('Your title have exceeded the 200 character limit')
    if (description.length > 2000) return message.channel.send('Your description have exceeded the 2000 character limit')

    let winners = await client.awaitReply(message, 'Ok! Message saved! Next, how many winners do you want? `(1-100)`', 60000); if (!winners) return message.channel.send('Timed out.')
    if (winners.toLowerCase() == ('c' || 'cancel')) { return message.channel.send('Cancelled') } if (!winners.match(/^([1-9]|[1-9][0-9]|100)$/g)) return message.channel.send('That is not a number between 1 and 100')

    let reaction = await client.awaitReply(message, `\`${winners}\` winners it is! Any prefered emoji that you want the participants to react with to join?`, 60000); if (!reaction) return message.channel.send('Timed out.')
    let canUse = [];
    if (!reaction.match(emojiregex)) {
        if (message.guild.emojis.cache.has(reaction.replace(/<|\:(.*?)\:|:|\>/g, ''))) {
            message.guild.members.cache.get(client.user.id).roles.cache.forEach(r => {
                if (inspect(message.guild.emojis.cache.find(e => e.id == reaction.replace(/<|\:(.*?)\:|:|\>/g, '')).roles)[20] !== undefined) {
                    message.guild.emojis.cache.find(e => e.id == reaction.replace(/<|\:(.*?)\:|:|\>/g, '')).roles.cache.forEach(role => {
                        if (!role) return canUse.push(1)
                        if (r.id == role.id) {
                            canUse.push(1);
                        }
                    });
                } else canUse.push(1)
            });
            if (!canUse[0]) return message.channel.send('Sorry! I cant use this emoji!')
        } else if (reaction.toLowerCase() !== 'no') return message.channel.send('Sorry! I cant use this emoji!')
    }

    let dm = []
    const DM = await client.awaitReply(message, `Sweet! ${reaction} it is! Do you want me to send the winners a DM?`, 60000); if (!DM) return message.channel.send('Timed out.')
    if (DM.toLowerCase() == ('c' || 'cancel')) { return message.channel.send('Cancelled') } if (DM.toLowerCase() == 'yes') {
        DMmsg = await client.awaitReply(message, 'What do you want the message to be?', 60000);
        if (!DMmsg) return message.channel.send('Timed out.')
        dm.push({ message: DMmsg, dm: true })
    }
    if (DM.toLowerCase() == 'no') { dm.push({ message: undefined, dm: false }) }
    if (!DM.toLowerCase().match(/^(yes|no)$/g)) return message.channel.send('You have to reply with either yes or no.');

    const start = await client.awaitReply(message, 'Ok! How long do you want me to wait before starting the giveaway? *(Format it like this: HH:MM H=hour M=Minute)*', 60000); if (!start) return message.channel.send('Timed out.')
    if (start.toLowerCase() == ('c' || 'cancel')) { return message.channel.send('Cancelled') } else if (!start.match(/^[0-4]?[0-7]:[0-5][0-9]$/gm)) { return message.channel.send('Thats not a valid time. (You cannot have more than 48 hrs and 59 min)') }

    const stop = await client.awaitReply(message, 'And how long do you want the giveaway to last? *(Format it like this: HH:MM H=hour M=Minute)*', 60000); if (!stop) return message.channel.send('Timed out.')
    if (stop.toLowerCase() == ('c' || 'cancel')) { return message.channel.send('Cancelled') } else if (!stop.match(/^[0-4]?[0-7]:[0-5][0-9]$/gm)) { return message.channel.send('Thats not a valid time. (You cannot have more than 48 hrs and 59 min)') }

    let year = new Date().getUTCFullYear()
    let month = new Date().getUTCMonth()
    let day = new Date().getUTCDate()
    let hours = new Date().getUTCHours()
    let minutes = new Date().getUTCMinutes()
    let seconds = new Date().getUTCSeconds()
    let startArr = start.split(':')
    let stopArr = stop.split(':')
    let startTime = new Date(year, month, day, hours + parseInt(startArr[0]), minutes + parseInt(startArr[1]), seconds).getTime()
    let stopTime = new Date(year, month, day, hours + parseInt(stopArr[0]) + parseInt(startArr[0]), minutes + parseInt(stopArr[1]) + parseInt(startArr[1]), seconds).getTime()
    let startSting = new Date(startTime).toLocaleString()
    let stopString = new Date(stopTime).toLocaleString()
    if (reaction.toLowerCase() == "no") { reaction = "🎉" }

    let confirmationembed = new Discord.MessageEmbed()
        .setTitle('Does this look right? (yes/ no)')
        .setDescription(`Giveaway-channel: ${channel}\nStart: *${startSting} UTC*\nEnd: *${stopString} UTC*\nWinners: ${winners}\nEmoji: ${reaction} \n`)
        .setColor('#C54816')
        .setTimestamp()

    const Confirm = await client.awaitReply(message, confirmationembed, 60000, true); if (!Confirm) return message.channel.send('Timed out.')
    if (Confirm.toLowerCase() == ('no' || 'cancel')) return message.channel.send('Cancelled'); if (Confirm.toLowerCase() !== 'yes') return message.channel.send('That is not a valid reply.')

    let infoembed = new Discord.MessageEmbed()
        .setTitle('Here are ur Giveaway infos:')
        .setDescription(`Giveaway-channel: ${channel}\nStart: *${startSting} UTC*\nEnd: *${stopString} UTC*\nWinners: ${winners}\nEmoji: ${reaction}`)
        .setColor('#C54816')
        .setTimestamp()
    message.channel.send(infoembed)

    let now = new Date(year, month, day, hours, minutes, seconds).getTime()
    let timer = startTime - now;
    setTimeout(async () => {
        let timeLeft = client.timeDiff(startTime, stopTime)
        const giveawayEmbed = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(`${description} \n\n*Winners will be announced in: **${timeLeft}** \nEnter by reacting with ${reaction}*`)
            .setTimestamp()
        if ((startTime - stopTime) <= 600000) { giveawayEmbed.setColor("#ff0000") } else { giveawayEmbed.setColor("#C54816") }

        let msg = await message.guild.channels.cache.get(channel.replace(/<|#|>/g, '')).send("**:volcano: GIVEAWAY :volcano:**", giveawayEmbed)
        await msg.react(reaction.replace(/<|\:(.*?)\:|:|\>/g, ''));
        msg.pin();

        let participants = [];
        let reactions = msg.createReactionCollector(r => {
            r.users.cache.forEach(u => {
                if (u.bot) return;
                for (let i = 0; i < participants.length; i++) {
                    if (participants[i].id == u.id) return;
                }
                participants.push(u)
            })
        });

        let lastTime = [timeLeft]
        let loop = setInterval(function () {
            let Hrs = new Date().getUTCHours(); let Min = new Date().getUTCMinutes(); let day = new Date().getUTCDate(); let year = new Date().getUTCFullYear(); let month = new Date().getUTCMonth(); let sec = new Date().getUTCSeconds();
            let now = new Date(year, month, day, Hrs, Min, sec).getTime();
            let timeLeft = client.timeDiff(now, stopTime)
            if (timeLeft == lastTime[0]) return

            let updatedGiveawayEmbed = new Discord.MessageEmbed()
                .setTitle(title)
                .setDescription(`${description} \n\n*Winners will be announced in: **${timeLeft}** \nEnter by reacting with ${reaction}*`)
                .setTimestamp()
            if ((startTime - stopTime) <= 600000) { updatedGiveawayEmbed.setColor("#ff0000") } else { updatedGiveawayEmbed.setColor("#C54816") }


            msg.edit("**:volcano: GIVEAWAY :volcano:**", updatedGiveawayEmbed)

            lastTime = [timeLeft]
            if (stopTime - now <= 0) {
                let winnerUser = [];
                if (!participants) return message.guild.channels.cache.get(channel.replace(/<|#|>/g, '')).send("No participants")
                if (winners > participants.length) winners = participants.length;

                reactions.users.forEach(u => { if (u.bot) return; participants.push(u) });
                for (let i = 0; i < parseInt(winners); i++) {
                    let rnd = Math.floor(Math.random() * participants.length);
                    let c = [];
                    winnerUser.forEach(u => {
                        if (u == participants[rnd]) c.push(1)
                    })
                    if (c[0]) return
                    winnerUser.push(participants[rnd])
                }

                let winnerstring = [];
                winnerUser.forEach(u => {
                    winnerstring.push(`<@${u.id}>`)
                })

                let endGiveaway = new Discord.MessageEmbed()
                    .setColor("#C54816")
                    .setTitle("The winners are:")
                    .setDescription(winnerstring.join('\n'))
                    .setTimestamp()

                
                msg.edit('**:volcano: THE GIVEAWAY ENDED :volcano:**', endGiveaway);

                if (dm[0].dm) {
                    winnerUser.forEach(user => {
                        client.users.cache.get(user.id).send(dm[0].message)
                    });
                }

                clearInterval(loop)
            }
        }, 5000);
    }, timer);
}

exports.help = {
    name: "giveaway",
    desc: "start a giveaway on ur server",
    aliases: ['g'],
    permLvl: 1,
    hidden: false,
    category: "admin",
    usage: "giveaway"
}