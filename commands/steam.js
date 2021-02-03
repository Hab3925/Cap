module.exports.run = async (client, message, args) => {
    message.channel.send(`You can get Volcanoids on Steam here: https://store.steampowered.com/app/951440/Volcanoids/`)
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