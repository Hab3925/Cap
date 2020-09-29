module.exports.run = async (client, message, args, prefix, con, table, permLvl) => {
    const Discord = require('discord.js')
    let aliases = [];
    
    client.commands.forEach(cmd => {
        if(cmd.help.permLvl > permLvl)return
        if(cmd.help.hidden) return
        if(!cmd.help.aliases[0])return
        let obj = {name: cmd.help.name, aliases: cmd.help.aliases}
        aliases.push(obj)
    });
    
    let output = [];
    aliases.forEach(a => {output.push(`**${a.name}:** ${a.aliases.join(', ')}`)})

    let embed = new Discord.MessageEmbed()
    .setTimestamp()
    .setColor('#C54816')
    .setFooter('The Captain', client.user.avatarURL({format:'png',size:2048}))
    .addField('Aliases', output.join('\n'))

    message.channel.send(embed)
}

exports.help = {
    name: 'aliases',
    desc: "View all the aliases for the different commands",
    aliases: ['a'],
    permLvl: 0,
    hidden: false,
    category: "misc",
    usage: "aliases"
}