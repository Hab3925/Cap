module.exports.run = async (client, message, args) => {
    message.channel.send('Invite me to your server here: <https://thecaptain.ga/invite> \n\nJoin the developmentserver: https://discord.gg/vcUsSWP \n\nOffical Volcanoids discord invite link: https://discord.gg/volcanoids')
}
exports.help = {
    name: "invite",
    desc: "get the links to [invite the bot](https://thecaptain.ga/invite), join the [developmentserver](https://discord.gg/vcUsSWP) and to join the [volc server](https://discord.gg/volcanoids)",
    aliases: ['i', 'inv'],
    permLvl: 0,
    hidden: false,
    category: "misc",
    usage: "invite"
}