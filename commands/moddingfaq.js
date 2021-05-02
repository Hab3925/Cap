module.exports.run = async (client, message, args) => {
    message.channel.send(`Check the <#831103119252520960> out! Your question is probably answered there. \nhttps://tenor.com/view/all-the-answers-mulder-book-xfiles-gif-11506981`,)
}
exports.help = {
    name: "moddingfaq",
    desc: "Refrence the <#831103119252520960> channel",
    aliases: ["mfaq"],
    permLvl: 0,
    hidden: false,
    category: "volc",
    usage: "moddingfaq"
}