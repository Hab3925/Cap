module.exports.run = async (client, message, args) => {
    message.channel.send(`Check the <#454972890299891723> out! Your question is probably answered there. \nhttps://tenor.com/view/all-the-answers-mulder-book-xfiles-gif-11506981`, )
}

exports.help = {
    name: "faq",
    desc: "refrence the <#454972890299891723> channel",
    aliases: [],
    permLvl: 0,
    hidden: false,
    category: "volc",
    usage: "faq"
}