module.exports.run = async ( client, message, args) => {
    let config = require('./../storage/config.json')
    message.channel.send(`You can get Volcanoids on Steam here: ${config.download}`)
}

exports.help = {
    name: "steam",
    desc: "Gives you Volcanoids\' [steam link](https://store.steampowered.com/app/951440/Volcanoids/)",
    aliases: ['staem', 'setam'],
    permLvl: 0,
    hidden: false,
    category: "volc",
    usage: "steam"
}
