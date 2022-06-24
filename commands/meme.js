let cooldown = new Set();
module.exports.run = async (client, message, args) => {
    let cdseconds = 15;
    const Discord = require('discord.js')

    if (cooldown.has(message.author.id)) return message.channel.send("You have to wait 15 seconds to use this again.").then(msg => msg.delete({
        timeout: 5000
    }));
    cooldown.add(message.author.id)
    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, cdseconds * 1000);

    let superagent = require('superagent');
    let msg = await message.channel.send('Generating...');

    let subreddits = ['funny', 'memes', 'dankmemes']
    let rand = Math.floor(Math.random() * subreddits.length)

    let body

    try {
        body = await superagent
            .get(`https://www.reddit.com/r/${subreddits[rand]}.json?limit=100`);
    } catch (e) {
        console.log('Memes didnt load because: ' + e);
        return msg.edit('I am unable to generate any memes at the moment :sob: \nPlease check in later!');
    }

    let rnd = Math.floor(Math.random() * body.body.data.children.length)
    let img = body.body.data.children[rnd].data.url;
    let title = body.body.data.children[rnd].data.title;
    let link = 'https://reddit.com' + body.body.data.children[rnd].data.permalink;


    if (body.body.data.children[rnd].data.is_video) {
        let rnd = Math.floor(Math.random() * body.body.data.children.length)
        let img = body.body.data.children[rnd].data.url;
        let title = body.body.data.children[rnd].data.title;
        let link = 'https://reddit.com' + body.body.data.children[rnd].data.permalink;

        let embed = new Discord.MessageEmbed()
            .setColor('#28DFAF')
            .setDescription(`[${title}](${link})`)
            .setImage(img)
            .setTimestamp()
            .setFooter('The Captain', client.user.avatarURL({
                format: 'png',
                size: 2048
            }))
        message.channel.send(embed);

        msg.delete();
    } else {
        let embed = new Discord.MessageEmbed()
            .setColor('#28DFAF')
            .setDescription(`[${title}](${link})`)
            .setImage(img)
            .setTimestamp()
            .setFooter('The Captain', client.user.avatarURL({
                format: 'png',
                size: 2048
            }))
        message.channel.send(embed);

        msg.delete();
    }
}

exports.help = {
    name: "meme",
    desc: "Bored? Have some fresh memes to look at!",
    aliases: ['m'],
    permLvl: 0,
    hidden: false,
    category: "misc",
    usage: "meme"
}