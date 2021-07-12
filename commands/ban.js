const Discord = require("discord.js");
const Enmap = require('enmap')

module.exports.run = async (client, message, args) => {
    let reason = 'unspecified';
    let days = 1;
    if (args[1]) days = args[1]
    if (args[2]) reason = args.join(' ').replace(`${args[0]} ${args[1]}`, '')
    let user = message.mentions.users.first();
    if (!user) return message.reply('you forgot to mention someone.')
    if (user.id == client.user.id) return message.reply(`I can't kick myself dude.`)
    let member = message.guild.members.cache.get(user.id);
    if (client.permlvl < 5) {
        if (member.permissions.has("MANAGE_MESSAGES", true) || member.permissions.has("ADMINISTRATOR", true) || client.guilds.cache.get('546008502754082830').roles.cache.get('552758121789915136').members.map(m => m.user.id).includes(user.id)) return message.reply(`you can't ban a Moderator!`)
    }
    if (!member.bannable) return message.reply(`I dont have enough permissions to perform this action!`)
    if (!user.bot) user.send(`You have been Banned from **${message.guild.name}** by <@${message.author.id}> for **${reason}**!`)
    await message.guild.member(user).ban({
        days: days,
        reason: reason
    }).catch(e => {
        if (e.code == 50013) return message.reply(`I dont have enough permissions to perform this action!`)
    })

    message.channel.send("Banned " + args[0])

    if (!client.logchn.has(message.guild.id)) return
    if (client.logchn.get(message.guild.id) != "disabled") {
        let logembed = new Discord.MessageEmbed()
            .setTitle(`Ban`)
            .setColor('#ff0000')
            .addFields([{
                    name: `Banned User`,
                    value: `<@${user.id}>`,
                    inline: true
                },
                {
                    name: `Moderator`,
                    value: `${message.author}`,
                    inline: true
                },
                {
                    name: `Reason`,
                    value: `${reason}`,
                    inline: false
                },
                {
                    name: `Channel`,
                    value: `${message.channel}`,
                    inline: true
                },
                {
                    name: `Time`,
                    value: `<t:${(new Date().getTime()/1000).toFixed(0)}:f>`,
                    inline: true
                }
            ])
        message.guild.channels.cache.get(client.logchn.get(message.guild.id)).send(logembed)
    }
}

exports.help = {
    name: "ban",
    desc: "Ban that annoying user in #general",
    aliases: [],
    permLvl: 1,
    hidden: false,
    category: "admin",
    usage: "ban @[user] [reason]"
}