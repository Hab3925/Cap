module.exports.run = async (client, message, args, prefix, con, table) => {
    const superagent = require('superagent')
    const Discord = require("discord.js")
    let msg = await message.channel.send("Processing...")

    try {
        await superagent.get('https://store.steampowered.com/api/appdetails?appids=951440')
    } catch (e) {
        console.log(`Couldn't get volc requirements because: ${e}`)
        msg.edit("I wasnt able to get the requirements for volcanoids at the moment! Try again later!")
    }

    let {
        body
    } = await superagent.get('https://store.steampowered.com/api/appdetails?appids=951440')

    if (!args[0]) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Windows requirements")
            .addField('\u200B', body['951440'].data.pc_requirements.minimum.replace(/<.?strong>/gm, "**").replace(/<li>/gm, "\r\n - ").replace(/<.+?>/gm, ""), true)
            .addField('\u200B', body['951440'].data.pc_requirements.recommended.replace(/<.?strong>/gm, "**").replace(/<li>/gm, "\r\n - ").replace(/<.+?>/gm, ""), true)
            .setColor("#3FB22D")
        msg.edit('', embed)

    } else if (args[0].toLowerCase() == "win" || args[0].toLowerCase() == "windows") {
        let embed = new Discord.MessageEmbed()
            .setTitle("Windows requirements")
            .addField('\u200B', body['951440'].data.pc_requirements.minimum.replace(/<.?strong>/gm, "**").replace(/<li>/gm, "\r\n - ").replace(/<.+?>/gm, ""), true)
            .addField('\u200B', body['951440'].data.pc_requirements.recommended.replace(/<.?strong>/gm, "**").replace(/<li>/gm, "\r\n - ").replace(/<.+?>/gm, ""), true)
            .setColor("#3FB22D")
        msg.edit('', embed)

    } else if (args[0].toLowerCase() == "l" || args[0].toLowerCase() == "linux") {
        let embed = new Discord.MessageEmbed()
            .setTitle("Linux requirements")
            .addField('\u200B', body['951440'].data.linux_requirements.minimum.replace(/<.?strong>/gm, "**").replace(/<li>/gm, "\r\n - ").replace(/<.+?>/gm, ""), true)
            .addField('\u200B', body['951440'].data.linux_requirements.recommended.replace(/<.?strong>/gm, "**").replace(/<li>/gm, "\r\n - ").replace(/<.+?>/gm, ""), true)
            .setColor("#E1941D")
        msg.edit('', embed)

    } else {
        let embed = new Discord.MessageEmbed()
            .setTitle("Windows requirements")
            .addField('\u200B', body['951440'].data.pc_requirements.minimum.replace(/<.?strong>/gm, "**").replace(/<li>/gm, "\r\n - ").replace(/<.+?>/gm, ""), true)
            .addField('\u200B', body['951440'].data.pc_requirements.recommended.replace(/<.?strong>/gm, "**").replace(/<li>/gm, "\r\n - ").replace(/<.+?>/gm, ""), true)
            .setColor("#3FB22D")
        msg.edit('', embed)

    }
}

exports.help = {
    name: "requirements",
    desc: "Gives you the required specs to run volcanoids",
    aliases: ['req, specs'],
    permLvl: 0,
    hidden: false,
    category: "volc",
    usage: "requirements (l/w)"
}