module.exports.run = async (client, message, args, prefix, con) => {
    const Discord = require('discord.js')

    //title detection
    let title = ""
    for (i = 0; i < args.length; i++) {
        if (args[i] == "in") {
            break
        } else {
            title += `${args[i]} `
        }
    }
    if (!title) return message.channel.send(`You are missing the event name! \`${prefix + exports.help.usage}\``)


    //timezone calcluation
    let timezone = 0
    await con.query(`SELECT timezone from timezones where UserID = ${message.author.id}`, (err, result) => {
        if (!result[0]) return
        if (err) console.log(err)
        timezone = result[0].timezone
    })

    //computer time test
    try {
        await client.humanToComputerTime(args, message, con, exports.help.name)
    } catch (e) {
        switch (e) {
            case "incorrectArgs":
                return message.channel.send("I didnt quite understand you there, might want to check up on that spelling of yours!")
            case "missingArgs":
                return message.channel.send("You didn't include all the needed arguments! I dont understand when you want your event to happen!")
            case "timezone":
                return
        }
    }

    // initial response
    let startTime = new Date().getTime() + timezone * 3600000
    let endTime = await client.humanToComputerTime(args, message, con, exports.help.name)
    let displayTime = await client.computerToHumanTime(startTime)
    let embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setDescription(`Time left: ${client.timeDiff(startTime, endTime)}\nReact with ✅ to join`)
        .setFooter(`Started on ${displayTime} by ${message.member.displayName}`)

    const msg = await message.channel.send(embed)
    await msg.react("✅")
    let attendees = []

    setTimeout(() => {

        // user removed reaction
        client.on('messageReactionRemove', (reaction, user) => {
            if (reaction.message.id == msg.id) {
                attendees.forEach((a, i) => {
                    if (a == `<@${user.id}>`) {
                        attendees.splice(i, 1)
                        if (!attendees[0]) {
                            let embed = new Discord.MessageEmbed()
                                .setTitle(title)
                                .setDescription(`Time left: ${client.timeDiff(startTime, endTime)}\nReact with ✅ to join`)
                                .setFooter(`Started on ${displayTime} by ${message.member.displayName}`)
                            msg.edit(embed)
                        } else {
                            let embed = new Discord.MessageEmbed()
                                .setTitle(title)
                                .setDescription(`Time left: ${client.timeDiff(startTime, endTime)}\nReact with ✅ to join`)
                                .addField("Attendees:", `\n> ${attendees.join("\n> ")}`)
                                .setFooter(`Started on ${displayTime} by ${message.member.displayName}`)
                            msg.edit(embed)
                        }
                    }
                });
            }
        })

        // User added reaction
        msg.createReactionCollector(r => {
            if (r.bot) return

            r.users.cache.forEach(u => {
                if (!u.bot) {
                    if (attendees.includes(`<@${u.id}>`)) return
                    attendees.push(`<@${u.id}>`)
                }
            })
            let embed = new Discord.MessageEmbed()
                .setTitle(title)
                .setDescription(`Time left: ${client.timeDiff(startTime, endTime)}\nReact with ✅ to join`)
                .addField("Attendees:", `\n> ${attendees.join("\n> ")}`)
                .setFooter(`Started on ${displayTime} by ${message.member.displayName}`)
            msg.edit(embed)
        }, {
            time: 60000
        })
    }, 1000);

    // Countdown loop 
    const loop = setInterval(() => {
        let updatedEmbed = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(`Time left: ${client.timeDiff(startTime, endTime)}\nReact with ✅ to join`)
            .setFooter(`Started on ${displayTime} by ${message.member.displayName}`)

        if (attendees[0]) updatedEmbed.addField("Attendees", `\n> ${attendees.join("\n> ")}`)
        msg.edit(updatedEmbed)

    }, 5000);
}
exports.help = {
    name: "schedule",
    desc: "helps you schedule events with your friends",
    aliases: ['sch', 'event', 'e'],
    permLvl: 6,
    hidden: false,
    category: "misc",
    usage: "schedule [event name] [HH:MM]"
}