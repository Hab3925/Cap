module.exports.run = async (client, message, args, prefix, con, table, permlvl, GSTable) => {
    if(!args[0]) return message.channel.send('You need to provide a prefix! `Command syntax: .prefix [optional prefix here]`')
    if(args[0].length > 3) return message.channel.send('Prefix can only be 3 or less characters long!')
    if(args[0].match(/[a-zA-Z]/i))return message.channel.send('The prefix cannot contain alphabetical characters');


    // Update prefix
    con.query(`UPDATE ${GSTable} SET prefix='${args[0]}' WHERE guildID=${message.guild.id}`)
    client.prefixes.set(message.guild.id, args[0])

    message.channel.send(`Prefix updated to \`${args[0]}\``)
}

exports.help = {
    name: "prefix",
    desc: "Change the prefix of the bot",
    aliases: ['p'],
    permLvl: 2,
    hidden: false,
    category: "admin",
    usage: "prefix [prefix]"
}