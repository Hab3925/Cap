module.exports.run = async (client, message, args) => {
    client.user.setActivity(args.join(" "), {
        type: "PLAYING"
    });
    message.channel.send("Status set")
}

exports.help = {
    name: "setstatus",
    desc: "change the captains status with a simple command",
    aliases: ['status'],
    permLvl: 6,
    hidden: false,
    category: "misc",
    usage: "setstatus [status]"
}