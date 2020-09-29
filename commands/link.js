module.exports.run = async (client, message, args, prefix, con) => {
    const superagent = require("superagent")
    if (!args[0]) return message.channel.send("If you dont know how to get your SteamID you can follow this article: ")

    if (args[0].toLowerCase() == 'delete') {
        let msg = await client.awaitReply(message, "Are you sure you want to disconnect your steamID? (yes/no)", 60000, false)
        if (!msg) return message.channel.send("Timed out")
        if (msg.toLowerCase() == 'yes') {
            let user = client.steam.get(message.author.id)
            if (!user) return message.channel.send("It seems like you havent linked your steam account yet!")
            client.steam.delete(message.author.id)
            message.channel.send("Your steam account was disconnected.")
            return
        } else return message.channel.send("Cancelled")
    }

    if (!args[0].match(/[0-9]{17}/gm)) return message.channel.send("Thats not a valid SteamID")
    let msg = await message.channel.send("Processing...")


    try {
        await superagent.get(`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=951440&key=2B231837CB0A3A275A598F5BCEDD3B21&steamid=${args[0]}`)
    } catch (err) {
        let content = JSON.parse(err.response.text)
        console.log(content)
        if (content.playerstats.success == false) {
            return msg.edit("Your achivements aren't public! Follow this guide on how to change that: ")
        } else {
            return msg.edit("Thats not a valid SteamID")
        }
    }
    const {
        body
    } = await superagent.get(`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=951440&key=2B231837CB0A3A275A598F5BCEDD3B21&steamid=${args[0]}`)

    if (client.steam.get(message.author.id)) {
        if (client.steam.get(message.author.id)[1] == body.playerstats.steamID) {
            msg.delete()
            let del = await client.awaitReply(message, "You already linked your steam profile, want to overwrite it? (yes / no)", 60000)
            if (del.toLowerCase() == "yes") {
                client.steam.set(message.author.id, [message.author.id, body.playerstats.steamID])
                client.giveAchievementRole(message.author.id)
                return message.channel.send("Your steam profile was overwritten")
            } else {
                message.channel.send("Alright, nothing changed")
            }
        }
    }

    client.steam.set(message.author.id, [message.author.id, body.playerstats.steamID])
    msg.edit("Steam profile linked!")

    client.giveAchievementRole(message.author.id)

}
exports.help = {
    name: "link",
    desc: "Link your steam account to The Captain",
    aliases: [],
    permLvl: 0,
    hidden: false,
    category: "misc",
    usage: ".link [SteamID] (delete)"
}