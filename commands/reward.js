module.exports.run = async (client, message, args, prefix, con, table, permlvl, GSTable) => {
    const Discord = require('discord.js');


    if (!args[0]) {
        con.query(`SELECT roles FROM ${GSTable} WHERE guildID = ${message.guild.id}`, async function (err, result) {
            let roles = JSON.parse(result[0].roles)
            if (!roles[0]) return message.channel.send(`You aren't rewarding any roles or emojis at the moment! Configure rewards with this command! (\`${exports.help.usage}\`)`)

            function sort(a, b) {
                if (a.lvl > b.lvl) return 1;
                if (b.lvl > a.lvl) return -1;
                return 0;
            }

            roles.sort(sort)
            let rewardRoles = [];
            roles.forEach(r => {
                rewardRoles.push(`**<@&${r.role}>:** Lvl ${r.lvl}`)
            })

            const embed = new Discord.MessageEmbed()
                .setColor('#C54816')
                .setTitle('Role rewards:')
                .setDescription(rewardRoles.join('\n\n'))
                .setTimestamp()
                .setFooter('The Captain', client.user.avatarURL({
                    format: 'png',
                    size: 2048
                }))
            message.channel.send(embed)
        })
        return;
    }

    con.query(`SELECT roles FROM ${GSTable} WHERE guildID = ${message.guild.id}`, function (err, result) {

        if (args[0].toLowerCase() === 'delete') {
            if (!args[1]) return message.channel.send('You have to provide what role you want to delete.')
            if (message.guild.roles.cache.has(args[1].replace(/<|@|&|>/g, ''))) {
                let roles = JSON.parse(result[0].roles)
                let role = [];
                roles.forEach(r => {
                    if (r.role == args[1].replace(/<|@|&|>/g, '')) return;
                    role.push(r);
                });
                if (role == roles) return message.channel.send('I am not rewarding this role at the moment.');
                con.query(`UPDATE ${GSTable} SET roles = '${JSON.stringify(role)}' WHERE guildID = ${message.guild.id}`)
                return message.channel.send('That role will no longer be rewarded.')
            } else return message.channel.send('This is not a role on the server.')
        }

        if (message.guild.roles.cache.has(args[0].replace(/<|@|&|>/g, ''))) {

            let roles = JSON.parse(result[0].roles)

            if (!args[0]) return message.channel.send(`You have to add what level you want to reward this role at! (\`${exports.help.usage}\`)`)
            if (!/\d/.test(args[1])) return message.channel.send(`You didnt provide a valid number for the level! (\`${exports.help.usage}\`)`)
            if (!roles[0]) {
                con.query(`UPDATE ${GSTable} SET roles = '[{"role": "${args[0].replace(/<|@|&|>/g, '')}", "lvl": ${args[1]}}]' WHERE guildID = ${message.guild.id}`)
                message.channel.send(`Users will now be rewarded the role ${args[0]} at lvl ${args[1]}`)
                return;
            }

            let i = -1;
            const reply = [];
            roles.forEach(async (r) => {
                i++
                if (r.role == args[0].replace(/<|@|&|>/g, '')) {
                    reply.push(1)
                    const response = await client.awaitReply(message, `This role is already rewarded at level ${r.lvl}, do you want to change this? (y = yes, n = no)`, 60000);
                    if (response.toLowerCase() === 'y' || response.toLowerCase() === 'yes') {
                        roles[i] = {
                            role: args[0].replace(/<|@|&|>/g, ''),
                            lvl: parseInt(args[1])
                        }
                        con.query(`UPDATE ${GSTable} SET roles = '${JSON.stringify(roles)}' WHERE guildID = ${message.guild.id}`)
                        message.channel.send(`Users will now be rewarded the role ${args[0]} at lvl ${args[1]}`)
                        return;
                    } else if (response.toLowerCase() === 'n' || response.toLowerCase() === 'no') return message.channel.send('Cancelled')
                    else {
                        return message.channel.send('Cancelled')
                    }
                } else {
                    if (!roles[i + 1] && !reply[0]) {
                        roles.push({
                            role: args[0].replace(/<|@|&|>/g, ''),
                            lvl: parseInt(args[1])
                        })
                        con.query(`UPDATE ${GSTable} SET roles = '${JSON.stringify(roles)}' WHERE guildID = ${message.guild.id}`)
                        message.channel.send(`Users will now be rewarded the role ${args[0]} at lvl ${args[1]}`)
                        return;
                    }
                    return;
                }
            });
        }
        message.channel.send("That's not a role on the server, make sure to tag it!")
    });
}
exports.help = {
    name: "reward",
    desc: "Set a reward for people reacing a certan level",
    aliases: ['re', 'rw'],
    permLvl: 1,
    hidden: false,
    category: "admin",
    usage: "reward [@role/:emoji:] [level/@role] *to remove:* reward delete [@role/:emoji:]"
}