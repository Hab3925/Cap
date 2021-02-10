module.exports.run = async (client, message, args) => {
    message.channel.send(`**Volcanoids**? On **consoles**? Yes sir! But so far the main priority is adding more content before they dive into all the console shenanigans. That Rich guy will keep you updated!`)
}


exports.help = {
    name: "consoles",
    desc: "Make cap send the consoles message",
    aliases: ["console", "ps4", "playstation", "xbox"],
    permLvl: 0,
    hidden: true,
    category: "volc",
    usage: "consoles"
}