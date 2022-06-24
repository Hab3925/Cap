module.exports.run = async (client, message, args, prefix, con) => {
    message.channel.send("Check out the <#831103119252520960>! If you are making a mod, check out the Guides made by me on steam! \n<https://steamcommunity.com/profiles/76561199202303435/myworkshopfiles/?appid=951440&section=guides>")
}
exports.help = {
    name: "mfaq",
    desc: "reference the <#831103119252520960> channel",
    aliases: ['moddingfaq', 'mod'],
    permLvl: 0,
    hidden: false,
    category: "volc",
    usage: "mfaq"
}
