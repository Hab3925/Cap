module.exports.run = async (client, message, args) => {
    const discord = require('discord.js')

    let joinedTimestamp = new Date(message.member.joinedTimestamp).toUTCString()
    let createdTimestamp = new Date(message.author.createdTimestamp).toUTCString()
    let mention = message.mentions.members.first();
    let usermention = message.mentions.users.first();
    let tag = message.author.tag
    let avatar = message.author.avatarURL({ format: 'png', size: 2048 });
    let displayColor = message.member.displayHexColor;
    let displayName = message.member.displayName

    if (mention) { joinedTimestamp = new Date(mention.joinedTimestamp).toUTCString(); createdTimestamp = new Date(usermention.createdTimestamp).toUTCString(); tag = usermention.tag; avatar = usermention.avatarURL({ format: 'png', size: 2048 }); displayColor = mention.displayHexColor; displayName = mention.displayName }


    let embed = new discord.MessageEmbed()
        .setAuthor(tag, avatar)
        .setColor(displayColor)
        .addField('Userinfo:', `**Nickname:** ${displayName} \n\n**Joined this server at:** \n${joinedTimestamp} \n\n**Account created at:** \n${createdTimestamp}`)

    message.channel.send(embed);
}

exports.help = {
    name: "userinfo",
    desc: "check some general info about a user!",
    aliases: ['u', 'ui'],
    permLvl: 0,
    hidden: false,
    category: "misc",
    usage: "userinfo (@user)"
}