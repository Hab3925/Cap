module.exports.run = async (client, message, args) => {
    let smc = client.smc.get('count')
    message.channel.send(`Subnautica has been mentioned here on the server ${smc} times!`)
}

exports.help = {
    name: "smc",
    desc: "Subnautica Mention Counter, explaines itself kinda?",
    aliases: [],
    permLvl: 0,
    hidden: false,
    category: "volc",
    usage: "smc"
}