module.exports.run = async (client, message, args) => {
    const { inspect } = require("util");
    let files = require(`./../storage/${args[0]}.json`)
    message.channel.send(inspect(files), {code: "ascii"});
}

exports.help = {
    name: "inspect",
    desc: "visual output of enmap database",
    aliases: [],
    permLvl: 6,
    hidden: false,
    category: "dev",
    usage: "inspect [filename]"
}