module.exports = (client, useDatabase) => {
    const Discord = require('discord.js');
    const times = x => f => {
        if (x > 0) {
            f()
            times(x - 1)(f)
        }
    }

    /**
     * Waits for the user to reply to a message, and returns the reply
     * @param {object} msg          The message object
     * @param {string} question     Question you want the user to reply to
     * @param {number} limit        How long it should wait for the reply before returning
     * @param {boolean} del         If you want to delete the message after they replied (optinal)
     */
    client.awaitReply = async (msg, question, limit, del) => {
        const filter = m => m.author.id === msg.author.id;
        const m = await msg.channel.send(question);
        try {
            const collected = await msg.channel.awaitMessages(filter, {
                max: 1,
                time: limit,
                errors: ["time"]
            });
            if (del) {
                m.delete();
                collected.first().delete()
            }
            return collected.first().content;
        } catch (e) {
            return false;
        }
    };

    /**
     * Fetches command to enmap database
     * @param commandName Name fo the command to fetch
     */
    client.loadcommand = (commandName) => {
        try {
            const props = require(`./../commands/${commandName}`);
            client.commands.set(props.help.name, props);

            props.help.aliases.forEach(a => {
                client.aliases.set(a, props.help.name)
            });
        } catch (e) {
            console.log(`Unable to load ${commandName}: ${e}`)
        }
    }

    if (useDatabase) {
        client.connect = (con) => {
            con.connect(function (err) {
                if (err) throw err
                console.log(`Connected to sql database`);
            });
        }
    }

    /**
     * Gets the rankembed for a given user
     * @param {object} user     User object
     * @param {number} rank     Rank of user
     * @param {number} design   Design ID of user
     */
    client.rankcard = (user, rank, guildID, design) => {
        if (design == undefined) design = user.rankCard;
        switch (design) {
            case 0:
                return client.rankembed1(user, rank, guildID)
            case 1:
                return client.rankembed3(user, rank, guildID)
            case 2:
                return client.rankembed4(user, rank, guildID)
        }
    }

    /**
     * Calculates the rank of a user from a server
     * @param {object} result   Database result
     * @param {string} id       Users ID
     * @param {string} guildID  Servers ID
     */
    client.rank = (result, id, guildID) => {
        i = 0;
        let output = null;
        result.forEach(u => {
            if (u.UserID === id && u.guildID === guildID) output = i + 1;
            i++
        });
        return output;
    }

    /**
     * Generates a string of random characters
     * @param length Length of string
     */
    client.makekey = (length) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    /**
     * Finds the index of argument in array that matches "|"
     * @param a Array of arguments
     */
    client.titleEnd = (a) => {
        let i = 1;
        while (i < a.length) {
            if (a[i].includes('|')) {
                return i
            }
            i++
        }
        return 0
    }

    /**
     * Checks a users achivements once every day, and updates roles
     */
    client.achievements = async () => {
        const superagent = require("superagent")
        const roles = require("./storage/achievements.json")

        setInterval(function () {
            client.steam.forEach(async user => {
                if (user.constructor !== Array) return
                const userID = user[0]
                const steamID = user[1]

                try {
                    await superagent.get(`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=951440&key=2B231837CB0A3A275A598F5BCEDD3B21&steamid=${steamID}`)
                } catch (err) {
                    console.log(`Cant access achivements of ${userID} because ${err}`)
                }

                const {
                    body
                } = await superagent.get(`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=951440&key=2B231837CB0A3A275A598F5BCEDD3B21&steamid=${steamID}`)

                body.playerstats.achievements.forEach(a => {
                    if (a.achieved == 1) {
                        roles.forEach(r => {
                            if (r.name == a.apiname) {
                                if (client.guilds.cache.get("488708757304639520").members.cache.get(userID).roles.cache.has(r.role)) return
                                client.guilds.cache.get("488708757304639520").members.cache.get(userID).roles.add(r.role)
                            }
                        });
                    }
                })
            })
        }, 86400000)
    }

    /**
     * Gives a user a role for an achivement
     * @param {string} id User ID for user to give role
     */
    client.giveAchievementRole = async (id) => {
        const superagent = require("superagent")
        const roles = require("./storage/achievements.json")
        const steamID = client.steam.get(id)[1]
        try {
            await superagent.get(`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=951440&key=2B231837CB0A3A275A598F5BCEDD3B21&steamid=${steamID}`)
        } catch (err) {
            console.log(`Cant access achivements of ${id} because ${err}`)
        }

        const {
            body
        } = await superagent.get(`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=951440&key=2B231837CB0A3A275A598F5BCEDD3B21&steamid=${steamID}`)

        body.playerstats.achievements.forEach(a => {
            if (a.achieved == 1) {
                roles.forEach(r => {
                    if (r.name == a.apiname) {
                        if (client.guilds.cache.get("488708757304639520").members.cache.get(id).roles.cache.has(r.role)) return
                        client.guilds.cache.get("488708757304639520").members.cache.get(id).roles.add(r.role)
                    }
                });
            }
        })
    }
}