module.exports.run = async (client, message, args, perfix, con, table) => {
    let msg = await client.guilds.cache.get("444244464903651348").channels.cache.get("510556959645237289").messages.fetch("754028877650722992")
    let participants = msg.reactions.cache.users.cache
    participants.forEach(element => {

    });
}

exports.help = {
    name: "test2",
    desc: "test",
    aliases: ['t2'],
    permLvl: 5,
    hidden: false,
    category: "dev",
    usage: "top secret"
}