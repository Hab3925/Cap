module.exports.run = async (client, message, args, prefix, con, table, permLvl) => {
    const Discord = require('discord.js')
    const latest = (result) => {
        let recent = []
        result.forEach(element => {
            if (!recent[0]) {
                recent.push(element)
            } else if (element.date > recent[0].date) {
                recent.unshift(element)
            }
        });
        return recent[0]
    }

    if (permLvl == 6) {
        if (!args[0]) {
            con.query(`SELECT * FROM changelogs`, function (err, result) {
                let changelog = latest(result);
                if (!changelog) return message.channel.send("Could not get any changelogs at the moment! Please check back later!")
                let date = new Date(parseInt(changelog.date)).toUTCString()
                let embed = new Discord.MessageEmbed()
                    .setTitle(`${changelog.title}`)
                    .setDescription(changelog.content)
                    .setFooter(date)
                    .setColor("#15A0E2")
                return message.channel.send(embed)
            })
        } else {
            let description = args.splice(client.titleEnd(args)).join(' ').replace('|', '')
            let title = args.join(' ');
            let timestamp = new Date().getTime()
            con.query(`INSERT INTO changelogs (content, title, date) VALUE ('${description}', '${title}', '${timestamp}')`)
            return message.channel.send("Changelog saved!")
        }
    } else {
        con.query(`SELECT * FROM changelogs`, function (err, result) {
            let changelog = latest(result);
            if (!changelog) return message.channel.send("Could not get any changelogs at the moment! Please check back later!")
            let date = new Date(parseInt(changelog.date)).toUTCString()
            let embed = new Discord.MessageEmbed()
                .setTitle(`${changelog.title}`)
                .setDescription(changelog.content)
                .setFooter(date)
                .setColor("#15A0E2")
            return message.channel.send(embed)
        })
    }
}


exports.help = {
    name: "changelog",
    desc: "View the changelogs for the bot!",
    aliases: ['c'],
    permLvl: 0,
    hidden: false,
    category: "misc",
    usage: "changelog"
}