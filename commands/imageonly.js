module.exports.run = async (client, message, args) => {
    message.delete()
    let array = [];
    client.ImageOnly.get('channels').forEach(c => { if (c == message.channel.id) return; array.push(c) });

    array.push(message.channel.id)

    client.ImageOnly.set('channels', array)


    message.channel.send(`<#${message.channel.id}> is now limited to images only!`)
}

exports.help = {
    name: "imageonly",
    desc: "limits the channel the command is used in to images only",
    aliases: ['io'],
    permLvl: 2,
    hidden: false,
    category: "admin",
    usage: "imageonly"
}