module.exports.run = async (client, message, args) => {
    const Discord = require('discord.js')
    let superagent = require('superagent');
    let timestamp = new Date().toLocaleString();
    let volcAuthors = 'Richard' || 'Volcanoids';

    let { body } = await superagent
        .get('http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=951440&count=3&maxlength=1795&format=json');


    let latest = body.appnews.newsitems[0];
    if (latest.author !== volcAuthors) latest = body.appnews.newsitems[1];
    var matches = latest.contents.match(/\bhttps?:\/\/\S+/gi);
    let capital = latest.contents.match(/\b([A-Z]{2,})\b/g);

    let content;
    if (matches != null) {
        content = latest.contents.replace(matches[0], '').replace(matches[1], '').replace(matches[2], '').replace(matches[3], '')
    } else { content = latest.contents }


    let embed = new Discord.MessageEmbed()
        .setThumbnail('https://cdn.discordapp.com/attachments/466495097479888907/490497766351568896/Logo.png')
        .setColor("#C54816")
        .setTimestamp()
        .setTitle(latest.title)
        .setDescription(content + ` \n\n**Read the whole update** [here](${latest.url}) **|** [Invite me](https://discordapp.com/oauth2/authorize?client_id=488418871745970177&scope=bot&permissions=8)`)
    if (matches != null) embed.setImage(matches[0])

    message.channel.send({ embed })
}


exports.help = {
    name: "devupdate",
    desc: "Get the latest update from the devs on steam",
    aliases: ['du'],
    permLvl: 0,
    hidden: false,
    category: "volc",
    usage: "devupdate"
}