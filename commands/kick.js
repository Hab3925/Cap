const Discord = require("discord.js");
const Enmap = require('enmap')

const inline = false

module.exports.run = async (client, message, args) => {
    let reason='unspecified';if(args[1])reason=args.join(' ').replace(`${args[0]}`,'')
    let user = message.mentions.users.first();
    if(user.id==client.user.id)return message.reply(`I can't kick myself dude.`)
    if(!user)return message.reply('you forgot to mention someone.')
    let member = message.guild.members.cache.get(user.id);
    if(client.permlvl<5){if(member.permissions.has("MANAGE_MESSAGES", true)||member.permissions.has("ADMINISTRATOR", true)||client.guilds.cache.get('546008502754082830').roles.cache.get('552758121789915136').members.map(m=>m.user.id).includes(user.id))return message.reply(`you can't kick a Moderator!`)}
    if(!member.kickable)return message.reply(`I dont have enough permissions to perform this action!`)
    if(!user.bot)user.send(`You have been Kicked from **${message.guild.name}** by <@${message.author.id}> for **${reason}**!`)
    // await message.guild.member(user).kick(reason).catch(e=>{if(e.code==50013)return message.reply(`I dont have enough permissions to perform this action!`)})
    let embed = new Discord.MessageEmbed()
    .setTitle(`Kick`)
    .setColor('#ff6600')
    .addFields([
        {name:`Kicked User`,value:`${user.tag}`,inline:inline},
        {name:`Moderator`,value:`${message.author}`,inline:inline},
        {name:`Reason`,value:`${reason}`,inline:inline},
        {name:`Time`,value:`${message.createdAt}`,inline:inline},
    ])
    message.channel.send(embed)
    if(!client.logchn.has(message.guild.id))return
    if(client.logchn.get(message.guild.id)!="disabled"){
    let logembed = new Discord.MessageEmbed()
    .setTitle(`Kick`)
    .setColor('#ff6600')
    .addFields([
        {name:`Kicked User`,value:`${user.tag}`,inline:inline},
        {name:`Moderator`,value:`${message.author}`,inline:inline},
        {name:`Reason`,value:`${reason}`,inline:inline},
        {name:`Channel`,value:`${message.channel}`,inline:inline},
        {name:`Time`,value:`${message.createdAt}`,inline:inline},
    ])
    message.guild.channels.cache.get(client.logchn.get(message.guild.id)).send(logembed)
}
}

exports.help = {
    name: "kick",
    desc: "kick that slightly less annoying user in #general",
    aliases: [],
    permLvl: 2,
    hidden: false,
    category: "admin",
    usage: "kick @[user] [reason]"
}