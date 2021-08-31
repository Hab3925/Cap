module.exports = (client) => {
    const Discord = require('discord.js');
    const times = x => f => {
        if (x > 0) {
            f()
            times(x - 1)(f)
        }
    }

    client.steamembed = (latest, matches, content) => {
        let embed = new Discord.MessageEmbed()
            .setThumbnail('https://cdn.discordapp.com/attachments/466495097479888907/490497766351568896/Logo.png')
            .setColor("#C54816")
            .setTimestamp()
            .setImage(matches[0])
            .setFooter(latest.author + ' | Volcanoids', 'https://cdn.discordapp.com/attachments/466495097479888907/490497766351568896/Logo.png')
            .addField(latest.title, content + `\n\n**Read the whole update** [here](${latest.url}) **|** [Invite me](https://discordapp.com/oauth2/authorize?client_id=488418871745970177&scope=bot&permissions=8)`)
        return embed;
    }

    client.gearrank = (user, rank, guildID) => {
        let xpBar = [];
        const gearfull = client.emojis.cache.get('558183850304471052');
        const gearempty = client.emojis.cache.get('558184027736113172');

        times(Math.floor(user.percentageToNextLvl / 10))(() => xpBar.push(gearfull));
        times(Math.ceil((100 - user.percentageToNextLvl) / 10))(() => xpBar.push(gearempty));

        embed = new Discord.MessageEmbed()
            .setAuthor(`${user.Nickname} #${rank}`, user.profilePic)
            .setColor(user.colour)
            .setDescription(`Level ${user.level} \n${xpBar.join('')}\n[Leaderboard](https://thecaptain.ga/leaderboard?id=${guildID}) | [Invite me](https://discordapp.com/oauth2/authorize?client_id=488418871745970177&scope=bot&permissions=8) | [GitHub](https://github.com/Hab3925/Cap)`)
            .setFooter(`${user.xp}xp / ${user.requieredXp}xp`)
            .setTimestamp()
        return embed;
    }

    client.rankembed2 = (user, rank, guildID) => {
        let xpBar = [];
        const arrow = client.emojis.cache.find(emoji => emoji.name === 'lava2');

        times(Math.floor(user.percentageToNextLvl / 5))(() => xpBar.push(arrow));
        times(Math.ceil((100 - user.percentageToNextLvl) / 5))(() => xpBar.push('░'));

        embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setFooter(user.Nickname, user.profilePic)
            .setColor(user.colour)
            .addField(`${user.xp}xp / ${user.requieredXp}xp #${rank}`, `${xpBar.join('')} Lvl ${user.level + 1}\n[Leaderboard](https://thecaptain.ga/leaderboard?id=${guildID}) | [Invite me](https://discordapp.com/oauth2/authorize?client_id=488418871745970177&scope=bot&permissions=8) | [GitHub](https://github.com/Hab3925/Cap)`)
        return embed;
    }

    client.OLDlavarank = (user, rank, guildID) => {
        let xpBar = [];
        let i = 0
        times(Math.floor(user.percentageToNextLvl / 9))(() => {
            xpBar.push(client.emojis.cache.find(emoji => emoji.name == `lava${i}`));
            i++
        });
        times(Math.ceil((100 - user.percentageToNextLvl) / 9))(() => xpBar.push(client.emojis.cache.find(emoji => emoji.name == `obsidian`)));

        embed = new Discord.MessageEmbed()
            .setAuthor(`${user.Nickname} #${rank}`, user.profilePic)
            .setColor(user.colour)
            .setDescription(`Level ${user.level} \n${xpBar.join('')}\n[Leaderboard](https://thecaptain.ga/leaderboard?id=${guildID}) | [Invite me](https://discordapp.com/oauth2/authorize?client_id=488418871745970177&scope=bot&permissions=8) | [GitHub](https://github.com/Hab3925/Cap)`)
            .setFooter(`${user.xp}xp / ${user.requieredXp}xp`)
            .setTimestamp()

        return embed;
    }

    client.lavarank = (user, rank, guildID) => {
        let xpBar = [];
        const lava = client.emojis.cache.get('848871336596340766');
        const lavatip = client.emojis.cache.get('848871442926010379');
        const dirt = client.emojis.cache.get('848871499007787028');

        times(Math.floor(user.percentageToNextLvl / 10) - 1)(() => xpBar.push(lava));
        xpBar.push(lavatip)
        times(Math.ceil((100 - user.percentageToNextLvl) / 10))(() => xpBar.push(dirt));

        embed = new Discord.MessageEmbed()
            .setAuthor(`${user.Nickname} #${rank}`, user.profilePic)
            .setColor(user.colour)
            .setDescription(`Level ${user.level} \n${xpBar.join('')}\n[Leaderboard](https://thecaptain.ga/leaderboard?id=${guildID}) | [Invite me](https://discordapp.com/oauth2/authorize?client_id=488418871745970177&scope=bot&permissions=8) | [GitHub](https://github.com/Hab3925/Cap)`)
            .setFooter(`${user.xp}xp / ${user.requieredXp}xp`)
            .setTimestamp()
        return embed;
    }

    client.drillrank = (user, rank, guildID) => {

        const dirt = client.emojis.cache.get('839452362065444894')
        const drill = client.emojis.cache.get('839456993886208020')
        const segment = client.emojis.cache.get('839456993885945866')
        const segmentEnd = client.emojis.cache.get('839456993059799080')
        const hole = client.emojis.cache.get('839456992275202048')
        const end = client.emojis.cache.get('839457911636754453')

        let xpBar = [];

        xpBar.push(end)
        times(Math.ceil((100 - user.percentageToNextLvl) / 10) - 1)(() => xpBar.unshift(dirt));
        xpBar.unshift(drill)

        if (Math.floor(user.percentageToNextLvl / 10) - 1 >= 3) {
            xpBar.unshift(segment)
            xpBar.unshift(segment)
            xpBar.unshift(segmentEnd)
        } else if (Math.floor(user.percentageToNextLvl / 10) - 1 == 2) {
            xpBar.unshift(segment)
            xpBar.unshift(segment)
        } else if (Math.floor(user.percentageToNextLvl / 10) - 1 == 1) {
            xpBar.unshift(segment)
        }

        times(Math.floor((user.percentageToNextLvl) / 10) - 4)(() => xpBar.unshift(hole));

        let embed = new Discord.MessageEmbed()
            .setAuthor(`${user.Nickname} #${rank}`, user.profilePic)
            .setColor(user.colour)
            .setDescription(`Level ${user.level} \n${xpBar.join('')}\n[Leaderboard](https://thecaptain.ga/leaderboard?id=${guildID}) | [Invite me](https://discordapp.com/oauth2/authorize?client_id=488418871745970177&scope=bot&permissions=8) | [GitHub](https://github.com/Hab3925/Cap)`)
            .setFooter(`${user.xp}xp / ${user.requieredXp}xp`)
            .setTimestamp()

        return embed;

    }

    client.submarinerank = (user, rank, guildID) => {
        const ocean = client.emojis.cache.get("881869572741931029")
        const submarine = client.emojis.cache.get("881869584033017916")
        const island = client.emojis.cache.get("881869559928340550")
        const subOnIsland = client.emojis.cache.get("881869591297523773")

        let xpBar = [];

        if (user.percentageToNextLvl < 90) {
            xpBar.unshift(subOnIsland)
            times(9)(() => xpBar.unshift(ocean))
        } else {
            xpBar.unshift(island)
            times(Math.ceil((100 - user.percentageToNextLvl) / 10) - 1)(() => xpBar.unshift(ocean))
            xpBar.unshift(submarine)
            times(Math.ceil(user.percentageToNextLvl / 10) - 1)(() => xpBar.unshift(ocean))
        }

        let embed = new Discord.MessageEmbed()
            .setAuthor(`${user.Nickname} #${rank}`, user.profilePic)
            .setColor(user.colour)
            .setDescription(`Level ${user.level} \n${xpBar.join('')}\n[Leaderboard](https://thecaptain.ga/leaderboard?id=${guildID}) | [Invite me](https://discordapp.com/oauth2/authorize?client_id=488418871745970177&scope=bot&permissions=8) | [GitHub](https://github.com/Hab3925/Cap)`)
            .setFooter(`${user.xp}xp / ${user.requieredXp}xp`)
            .setTimestamp()

        return embed;
    }
}