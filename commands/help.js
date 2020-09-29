module.exports.run = async (client, message, args, prefix, con, table, permLvl ) => {
    const Discord = require('discord.js')

    if(args[0]){
        if(!client.commands.has(args[0]) || permLvl < client.commands.get(args[0]).help.permLvl) return message.channel.send(`This isn\'t a command you have access to. Do ${prefix}help to view all the commands you can use!`);
        let cmd = client.commands.get(args[0])
        message.channel.send(`The syntax for ${cmd.help.name} is: \`${cmd.help.usage}\``)
        return;
    }

    let rankcmds = [];
    let devcmds = [];
    let volccmds = [];
    let admin = [];
    let misc = []; 

    client.commands.forEach(cmd => {
        if(cmd.help.hidden == true)return;   
        if(cmd.help.permLvl > permLvl) return;

        switch (cmd.help.category){
            case "rank":
                rankcmds.push(`**${prefix}${cmd.help.name}:** ${cmd.help.desc}`)
            break;
            case "dev":
                devcmds.push(`**${prefix}${cmd.help.name}:** ${cmd.help.desc}`)
            break;
            case "volc":
                volccmds.push(`**${prefix}${cmd.help.name}:** ${cmd.help.desc}`)
            break;
            case "admin":
                admin.push(`**${prefix}${cmd.help.name}:** ${cmd.help.desc}`)
            break;
            case "misc":
                misc.push(`**${prefix}${cmd.help.name}:** ${cmd.help.desc}`)
        }
    });    

    let embed = new Discord.MessageEmbed()
    .setTimestamp()
    .setColor('#C54816')
    .setFooter('The Captain', client.user.avatarURL({format:'png',size:2048}))
    if(message.guild.id == '444244464903651348') embed.addField('Volcanoids related:', volccmds.join('\n'))
    embed.addField('Miscellaneous', misc.join('\n'))
    .addField('Rank commands:', rankcmds.join('\n'));
    if(admin[0]) embed.addField('Admin:', admin.join('\n'))
    if(devcmds[0]) embed.addField('Dev commands:', devcmds.join('\n'))

    message.channel.send(embed)    
}

exports.help = {
    name: "help",
    desc: "View all the commands you are able to use",
    aliases: ['h', 'halp'],
    permLvl: 0,
    hidden: false,
    category: "misc",
    usage: "help (command)"
}