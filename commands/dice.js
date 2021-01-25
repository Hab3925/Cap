let cooldown = new Set();
module.exports.run = async (client, message) => {
    if (cooldown.has(message.author.id)) return message.channel.send('No need to spam bro...').then(msg => {
        msg.delete(3000);
        message.delete()
    })
    message.channel.send('Rolling... ' /* + rolling */ ).then(msg => {
        let rnd = Math.floor(Math.random() * 6) + 1;
        let emojiname = rnd + 'd'
        const dice = client.emojis.cache.find(emoji => emoji.name === `${emojiname}`)
        setTimeout(() => {
            msg.delete()
            message.channel.send(dice.toString())
        }, 2000);
    });
    cooldown.add(message.author.id)
    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, 3000);
}

exports.help = {
    name: "dice",
    desc: "Roll the dice and get a random number between 1 and 6.",
    aliases: [],
    permLvl: 0,
    hidden: false,
    category: "misc",
    usage: "dice"
}