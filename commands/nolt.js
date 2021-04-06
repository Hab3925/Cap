module.exports.run = async (client, message, args) => {
    message.channel.send(`You can leave a suggestion on nolt! (https://volcanoids.nolt.io/) \nMake sure someone didnt suggest what you want to suggest before you post!`)
}

exports.help = {
    name: "nolt",
    desc: "Make cap",
    aliases: ["n"],
    permLvl: 0,
    hidden: true,
    category: "volc",
    usage: "nolt"
}