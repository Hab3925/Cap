module.exports.run = async (client, message, args) => {
    //if guild doesent have an entery in the enmap
    if (!client.mute.has(message.guild.id)) {
        client.mute.set(message.guild.id, {
            role: undefined,
            users: []
        })
    }

    let obj = client.mute.get(message.guild.id)

    //if user mentions a role
    if (args[0].match(/<@&\d{18}>/g)) {
        if (obj.role != undefined) {
            //if there already is a role, ask if user wants to replace it.
            const newRole = await client.awaitReply(message, "You have already saved a muted role on this server, do you want to replace it?", 60000)
            if (newRole.toLowerCase() == "y" || newRole.toLowerCase() == "yes") {
                obj.role = args[0].replace(/<|@|&|>/g, "")
                client.mute.set(message.guild.id, obj)
                message.channel.send("Mute role set to " + args[0])
            } else {
                message.channel.send(`Mute role remains unchanged. (<@&${obj.role}>)`)
            }
        } else {
            //If not, set the said role.
            obj.role = args[0].replace(/<|@|&|>/g, "")
            client.mute.set(message.guild.id, obj)
            message.channel.send("Mute role set to " + args[0])
        }
        //if user mentioned a person
    } else if (args[0].match(/<@!?\d{18}>/g)) {
        const mutedRole = message.guild.roles.cache.get(obj.role);
        if (!message.guild.roles.cache.has(obj.role)) return message.channel.send("The current mute role doesent exist! You need to set a new one.")

        const target = message.mentions.members.first();
        target.roles.add(mutedRole);

        if (!args[1]) args[1] = ""

        // if they provided a time
        if (args[1].match(/\d+/g)) {
            obj.users.push({
                user: args[0].replace(/<|@|!|>/g, ""),
                time: args[1] * 3600000 + new Date().getTime()
            })
            client.mute.set(message.guild.id, obj)
            message.channel.send(`Muted ${args[0]} for ${args[1]} hours.`)

            //wait for timer to expire
            setTimeout(() => {
                obj = client.mute.get(message.guild.id)

                // remove user from database 
                obj.users.forEach((user, i) => {
                    if (user.user == args[0].replace(/<|@|!|>/g, "")) {
                        obj.users.splice(i, 1)
                        client.mute.set(message.guild.id, obj)
                    }
                });
                target.roles.remove(mutedRole)
            }, args[1] * 3600000);
        } else {
            // if there is no time
            obj.users.push({
                user: args[0].replace(/<|@|!|>/g, ""),
                time: undefined
            })
            client.mute.set(message.guild.id, obj)
            message.channel.send(`Muted ${args[0]}`)
        }
    }
}

exports.help = {
    name: "mute",
    desc: "Mute a user.",
    aliases: [""],
    permLvl: 1,
    hidden: false,
    category: "admin",
    usage: "mute [@user] (hours)"
}