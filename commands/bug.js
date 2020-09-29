module.exports.run = async (client, message, args) =>{
    let randValue = Math.floor(Math.random() * 3);
    let baseValue = Math.floor(Math.random() * 3);
    if(randValue !== baseValue)return;

    message.channel.send('(∩｀-´)⊃━━☆ﾟ.*･｡ﾟ\nWoosh! The code is now filled with bugs')
}

exports.help = {
    name: "bug",
    desc: "",
    aliases: [],
    permLvl: 0,
    hidden: true,
    category: "misc",
    usage: "bug"
}