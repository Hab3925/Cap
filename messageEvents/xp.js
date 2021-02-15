let cooldown = new Set();

module.exports.run = async (client, message, isTesting, command, prefix, permlvl, con, table, GSTable, useDatabase) => {
    if (!useDatabase) return;

    //xp
    if (!client.disabledXp.has(message.guild.id)) return
    let disabledChannels = client.disabledXp.get(message.guild.id)
    if (disabledChannels.includes(message.channel.id)) return

    let msg = message.content.toUpperCase();

    if (!cooldown.has(message.author.id)) {
        if (!msg.startsWith(prefix)) {
            con.query(
                `SELECT UserID, Nickname, xp, profilePic, level, totalxp FROM ${table} WHERE UserID = ${message.author.id} AND guildID = ${message.guild.id}`,
                function (err, result) {
                    let gainedXp = Math.floor(Math.random() * 10 + 15);
                    let user = result[0];
                    let profilePic = message.author.avatarURL({
                        format: 'png',
                        size: 2048
                    });
                    let nickname = message.member.displayName
                        .replace(/'/g, `\\'`)
                        .replace(/"/g, `\\"`);

                    if (profilePic == null)
                        profilePic =
                        "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png";
                    if (user === undefined || user === null)
                        return con.query(
                            `INSERT INTO ${table} (ID, UserID, Nickname, xp, level, profilePic, percentageToNextLvl, requieredXp, totalxp, colour, rankCard, boosts, guildID) VALUES (NULL, "${message.author.id}", "${nickname}", "${gainedXp}", 0, "${profilePic}", ${gainedXp}, "100", "${gainedXp}", "#C54816", 0, 0, ${message.guild.id})`
                        );

                    let xp = parseInt(user.xp);
                    let totalxp = parseInt(user.totalxp);
                    let currentlvl = parseInt(user.level);
                    let lvl = parseInt(user.level) + 1;

                    let nextlvl = lvl + 1;
                    let reqxp = 5 * lvl * lvl + 40 * lvl + 55;
                    let nextreqxp = 5 * nextlvl * nextlvl + 40 * nextlvl + 55;
                    let percentageToNextLvl = Math.floor(((xp + gainedXp) / reqxp) * 100);

                    let lvlUpXp = xp + gainedXp - reqxp;
                    let lvlUpPercentageToNextLvl = Math.floor(
                        (lvlUpXp / nextreqxp) * 100
                    );

                    var query = `SELECT roles FROM ${GSTable} WHERE guildID = ${message.guild.id}`;
                    con.query(query, function (err, result) {
                        if (result[0].roles !== null || result[0] !== undefined) {
                            let roles = JSON.parse(result[0].roles);
                            roles.forEach(r => {
                                if (currentlvl >= r.lvl) {
                                    let role = message.guild.roles.cache.get(r.role);
                                    if (!message.member.roles.cache.has(role)) {
                                        message.member.roles.add(role);
                                    }
                                }
                            });
                        }
                    });

                    if (xp + gainedXp >= reqxp) {
                        con.query(
                            `UPDATE ${table} SET level = ${lvl}, requieredXp = ${nextreqxp}, xp = ${lvlUpXp}, percentageToNextLvl = ${lvlUpPercentageToNextLvl} WHERE UserID = '${message.author.id}' AND guildID = '${message.guild.id}'`
                        );
                    } else {
                        con.query(
                            `UPDATE ${table} SET xp = ${xp +
                            gainedXp}, percentageToNextLvl = ${percentageToNextLvl}, totalxp = ${totalxp +
                            gainedXp} WHERE UserID = '${message.author.id
                            }' AND guildID = '${message.guild.id}'`
                        );
                    }

                    if (user.Nickname !== message.member.displayName)
                        con.query(
                            `UPDATE ${table} SET Nickname = '${nickname}' WHERE UserID = ${message.author.id} AND guildID='${message.guild.id}'`
                        );
                    if (user.profilePic !== message.author.avatarURL({
                            format: 'png',
                            size: 2048
                        }))
                        con.query(
                            `UPDATE ${table} SET profilePic = '${profilePic}' WHERE UserID = ${message.author.id}`
                        );

                    cooldown.add(message.author.id);
                    setTimeout(() => {
                        cooldown.delete(message.author.id);
                    }, 60000);
                }
            );
        }
    }

}