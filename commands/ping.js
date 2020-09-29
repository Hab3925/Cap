exports.run = (client, message) => {
    message.channel.send('Ping?').then((msg) => {
        msg.edit(`Pong! Latency: ${msg.createdTimestamp - message.createdTimestamp}ms. API latency: ${Math.round(client.ws.ping)}ms.`)
    });
}

exports.help = {
    name: "ping",
    desc: "check the ping of the bot",
    aliases: [],
    permLvl: 0,
    hidden: false,
    category: "misc",
    usage: "ping"
}