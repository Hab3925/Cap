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

    client.rankembed1 = (user, rank, guildID) => {
        let xpBar = [];
        const gearfull = client.emojis.cache.find(emoji => emoji.name == 'gearfull');
        const gearempty = client.emojis.cache.find(emoji => emoji.name == 'gearempty');

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

    client.rankembed3 = (user, rank, guildID) => {
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

    client.rankembed4 = (user, rank, guildID) => {
        let xpBar = [];

        let progress = Math.floor(user.percentageToNextLvl / 100);
        if (progress == 0) {
            xpBar.push(client.emojis.cache.get('687021068342394912'))
            times(progress - 2(() => xpBar.push(client.emojis.cache.get('686951422679711799'))))
        } else {
            times(progress - 1(() => xpBar.push(client.emojis.cache.get('686951422679711799'))))
            xpBar.push(client.emojis.cache.get('687021068342394912'))
        }

        let embed = new Discord.MessageEmbed()
            .setAuthor(`${user.Nickname} #${rank}`, user.profilePic)
            .setColor(user.colour)
            .setFooter(`Level ${user.level}`)
            .setDescription(`${user.xp}xp / ${user.requieredXp}xp\n${xpBar.join('')}\n[Leaderboard](https://thecaptain.ga/leaderboard?id=${guildID}) | [Invite me](https://discordapp.com/oauth2/authorize?client_id=488418871745970177&scope=bot&permissions=8) | [GitHub](https://github.com/Hab3925/Cap)`)
            .setTimestamp()

        return embed
    }
}