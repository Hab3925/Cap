exports.run = async (client, message, args) => {
    const Discord = require('discord.js')

    const channel = await client.awaitReply(message, 'Ok! lets set up your countdown! What channel do you want to have the countdown in? \nYou can type `cancel` at any time to cancel.', 60000); if (!channel) return message.channel.send('Timed out.')
    // if (channel.toLowerCase() == ('c' || 'cancel')) { return message.channel.send('Cancelled') } else if (!client.channels.cache.has(channel.replace(/<|#|>/g, ''))) return message.channel.send('That is not a valid channel, please start over')
    if (['c','cancel'].includes(channel.toLowerCase())) { return message.channel.send('Cancelled') } else if (!client.channels.cache.has(channel.replace(/<|#|>/g, ''))) return message.channel.send('That is not a valid channel, please start over')

    const announceMsg = await client.awaitReply(message, 'Got you! Now, what do you want the message to display? Remember to seperate the title and the description of the messsage by a |, write {timeLeft} where you want the coountdown. Example: "Birthday party! | Im having a birthday party in {timeLeft}, come join me!"', 60000); if (!announceMsg) return message.channel.send('Timed out.')
    if (['c','cancel'].includes(announceMsg.toLowerCase())) { return message.channel.send('Cancelled') }
    let announceArgs = announceMsg.split(' ')
    if (client.titleEnd(announceArgs) === 0) return message.channel.send('You have to give your message a title. Seperate the title from the description with |, please start over.')
    let description = announceArgs.splice(client.titleEnd(announceArgs)).join(' ').replace('|', '')
    let title = announceArgs.join(' ');
    if (title.length > 200) return message.channel.send('Your title have exceeded the 200 character limit. Please start over.')
    if (description.length > 2000) return message.channel.send('Your description have exceeded the 2000 character limit, Please start over')
    if (!description.match("{timeLeft}")) return message.channel.send("You are missing {timeLeft} from your description! Please start over.")

    const endMsg = await client.awaitReply(message, 'Alright! And what do you want to display once the countdown is done? Same format as previously with |, but without {timeLeft}.', 60000); if (!endMsg) return message.channel.send('Timed out.')
    if (['c','cancel'].includes(endMsg.toLowerCase())) { return message.channel.send('Cancelled') }
    let endArgs = endMsg.split(" ")
    if (client.titleEnd(endArgs) === 0) return message.channel.send('You have to give your message a title. Seperate the title from the description with |, please start over.')
    let endDescription = endArgs.splice(client.titleEnd(endArgs)).join(' ').replace('|', '')
    let endTitle = endArgs.join(' ');
    if (endTitle.length > 200) return message.channel.send('Your title have exceeded the 200 character limit. Please start over.')
    if (endDescription.length > 2000) return message.channel.send('Your description have exceeded the 2000 character limit, Please start over')

    const start = await client.awaitReply(message, 'Ok! How long do you want me to wait before starting the countdown? *(Format it like this: HH:MM H=hour M=Minute)*', 60000); if (!start) return message.channel.send('Timed out.')
    if (['c','cancel'].includes(start.toLowerCase())) { return message.channel.send('Cancelled') } else if (!start.match(/^[0-4]?[0-8]:[0-5][0-9]$/gm)) { return message.channel.send('Thats not a valid time. (You cannot have more than 72 hrs and 59 min) Please start over') }

    const stop = await client.awaitReply(message, 'And how long do you want the countdown to last? *(Format it like this: HH:MM H=hour M=Minute)*', 60000); if (!stop) return message.channel.send('Timed out.')
    if (['c','cancel'].includes(stop.toLowerCase())) { return message.channel.send('Cancelled') } else if (!stop.match(/^[0-4]?[0-8]:[0-5][0-9]$/gm)) { return message.channel.send('Thats not a valid time. (You cannot have more than 72 hrs and 59 min) Please start over.') }

    message.channel.send("You are all set. Sit back and let me handle the rest :smile:")

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

    let now = new Date(year, month, day, hours, minutes, seconds).getTime();
    let timer = startTime - now

    setTimeout(async () => {
        let timeLeft = client.timeDiff(startTime, stopTime)
        const giveawayEmbed = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(`${description.replace(/{timeLeft}/g, timeLeft)}`)
            .setTimestamp()

        let msg = await message.guild.channels.cache.get(channel.replace(/<|#|>/g, '')).send(giveawayEmbed)

        let lastTime = [timeLeft]
        let loop = setInterval(function () {
            let Hrs = new Date().getUTCHours(); let Min = new Date().getUTCMinutes(); let day = new Date().getUTCDate(); let year = new Date().getUTCFullYear(); let month = new Date().getUTCMonth(); let sec = new Date().getUTCSeconds();
            let now = new Date(year, month, day, Hrs, Min, sec).getTime();
            let timeLeft = client.timeDiff(now, stopTime)
            if (timeLeft == lastTime[0]) return

            let updatedGiveawayEmbed = new Discord.MessageEmbed()
                .setTitle(title)
                .setDescription(`${description.replace(/{timeLeft}/g, timeLeft)}`)
                .setTimestamp()

            msg.edit(updatedGiveawayEmbed)

            lastTime = [timeLeft]
            if (stopTime - now <= 0) {
                let endGiveaway = new Discord.MessageEmbed()
                    .setColor("#C54816")
                    .setTitle(endTitle)
                    .setDescription(endDescription)
                    .setTimestamp()
                msg.edit(endGiveaway);

                clearInterval(loop)
            }
        }, 5000);
    }, timer);
}
exports.help = {
    name: "countdown",
    desc: "count down to a set time",
    aliases: ['cd'],
    permLvl: 1,
    hidden: false,
    category: "misc",
    usage: "countdown"
}