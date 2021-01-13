module.exports = (client) => {
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
            const props = require(`./commands/${commandName}`);
            client.commands.set(props.help.name, props);

            props.help.aliases.forEach(a => {
                client.aliases.set(a, props.help.name)
            });
        } catch (e) {
            console.log(`Unable to load ${commandName}: ${e}`)
        }
    }

    /**
     * Calculates the difference between two unix timestamps
     * @param {number} start   First timestamp
     * @param {number} stop    Second timestamp
     */
    client.timeDiff = (start, stop) => {
        var distance = stop - start;
        var weeks = Math.floor(distance / (1000 * 60 * 60 * 24 * 7));
        var days = Math.floor((distance % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60) / 1000));

        if (weeks > 0)
            return weeks + "w " + days + "d " + hours + "h " + minutes + "min ";

        else if (days > 0)
            return days + "d " + hours + "h " + minutes + "min ";

        else if (hours > 0)
            return hours + "h " + minutes + "min ";

        else if (minutes > 0) {
            if (minutes < 10) return minutes + 'min ' + seconds + "sec";
            else return minutes + "min ";
        } else if (seconds > 0)
            return seconds + "sec";

        else if (seconds < 0)
            return "Now";
    }

    client.connect = (con) => {
        con.connect(function (err) {
            if (err) throw err
            console.log(`Connected to sql database`);
        });
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
     * Convert Unix time to "ddd at hh:mm"
     * @param ct        Unix time number
     * @param timezone  Offset from UTC in hours
     */
    client.computerToHumanTime = async (ct, timezone) => {
        return new Promise(async (resolve, reject) => {
            if (!timezone) timezone = 0
            let date = new Date(ct + timezone * 3600000)
            let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            let day = date.getUTCDay()
            let hour = date.getUTCHours()
            let minute = date.getUTCMinutes()
            if (hour.toString().length == 1) hour = `0${hour}`;
            if (minute.toString().length == 1) minute = `0${minute}`

            resolve(`${days[day - 1]} at ${hour}:${minute}`)
        })
    }

    /**
     * EXPIRIMENTAL
     * @param {*} humanTime 
     * @param {*} msg 
     * @param {*} con 
     * @param {*} event 
     */
    client.humanToComputerTime = async (humanTime, msg, con, event) => {
        return new Promise(async (resolve, reject) => {
            let i;
            let numWordsD = ["two", "three", "four", "five", "six", "seven"]
            let numWordsH = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelwe", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "twentyone", "twentytwo", "twentythree", "twentyfour"]
            let type = null;
            let err;
            let sec = 1000;
            let minute = 60000;
            let hour = 3600000;
            let day = 86400000;

            for (i = 0; i < humanTime.length; i++) {
                if (!humanTime[i + 1]) {
                    err = "missingArgs"
                    break;
                }
                if (humanTime[i].toLowerCase() == "in") {
                    if (!humanTime[i + 1]) {
                        err = "missingArgs"
                        break;
                    }
                    if (numWordsD.includes(humanTime[i + 1]) || humanTime[i + 1].match(/[1-7]/gm)) {
                        if (humanTime[i + 2].toLowerCase() == "days") {
                            if (!humanTime[i + 3]) {
                                type = 2
                                break
                            } else if (humanTime[i + 3].toLowerCase() == "at") {
                                type = 1
                                break
                            } else {
                                err = "incorrectArgs"
                                break
                            }
                        } else if (humanTime[i + 2].match(/hours|hour|hr|hrs/gmi)) {
                            type = 2
                            break
                        } else {
                            err = "incorrectArgs"
                            break
                        }
                    } else if (numWordsH.includes(humanTime[i + 1]) || humanTime[i + 1].match(/[1-24]/gm)) {
                        if (humanTime[i + 2].match(/hours|hour|hr|hrs/gmi)) {
                            type = 2
                            break
                        } else {
                            err = "incorrectArgs"
                            break
                        }
                    } else {
                        err = "incorrectArgs"
                        break
                    }
                } else if (humanTime[i].toLowerCase() == "tomorrow") {
                    if (!humanTime[i + 1] || !humanTime[i + 2]) {
                        type = 3
                        break
                    } else if (humanTime[i + 1].toLowerCase() == "at") {
                        if (numWordsH.includes(humanTime[i + 2]) || humanTime[i + 2].match(/[1-24]/gm)) {
                            type = 1
                            break
                        }


                    } else {
                        type = 3
                        break
                    }
                } else if (humanTime[i].toLowerCase() == "next") {
                    if (!humanTime[i + 1] || !humanTime[i + 2] || !humanTime[i + 3]) {
                        err = "missingArgs";
                        break
                    }
                    if (humanTime[i + 1].toLowerCase() !== "week") {
                        err = "incorrectArgs"
                        break
                    }
                }
            };

            if (err) reject(err)

            con.query(`SELECT timezone from timezones where UserID = ${msg.author.id}`, async function (err, result) {
                if (type == 1) {
                    let numdays = humanTime[i + 1]
                    let time = humanTime[i + 4]

                    if (!time.match(/[0-2][0-3]:[0-5][0-9]/)) {
                        msg.channel.send(`I dont understand when you want your ${event} to happen!`);
                        reject("timezone")
                    }

                    if (!result[0]) {
                        let utc = await client.awaitReply(msg, "You havent saved your timezone yet, head over to https://thecaptain.ga/timezone to set ur timezone! \n\n Or do you want to run your commands relative to UTC/GMT? (y=yes, n=no)", 60000, false)

                        if (utc.toLowerCase() !== "y") {
                            msg.channel.send("Save your timezone at https://thecaptain.ga/timezone, and run the command again!")
                            reject("timezone")
                        } else {
                            let timeArr = time.split(":")
                            let hr = timeArr[0]
                            let min = timeArr[1]
                            let nowHr = new Date().getUTCHours()
                            let nowMin = new Date().getUTCMinutes()
                            let nowSec = new Date().getUTCSeconds()

                            if (!numdays.match(/^[0-9]+$/)) {
                                let days;
                                let i = 1;
                                numWordsD.forEach(w => {
                                    i++
                                    if (numdays.toLowerCase() == w) days = i;
                                    if (numdays.toLowerCase() == "tomorrow") days = 1
                                })

                                let output = new Date().getTime() + days * day + (hr * hour - nowHr * hour) + (min * minute - nowMin * minute) - nowSec * sec;
                                resolve(output)

                            } else {
                                let output = new Date().getTime() + parseInt(numdays) * day + (hr * hour - nowHr * hour) + (min * minute - nowMin * minute) - nowSec * sec;
                                resolve(output)
                            }
                        }
                    } else {
                        let timeArr = time.split(":")
                        let hr = timeArr[0]
                        let min = timeArr[1]
                        let nowHr = new Date().getUTCHours()
                        let nowMin = new Date().getUTCMinutes()
                        let nowSec = new Date().getUTCSeconds()
                        let timezone = result[0].timezone;

                        if (!numdays.match(/^[0-9]+$/)) {
                            let days;
                            let i = 1;
                            numWordsD.forEach(w => {
                                i++
                                if (numdays.toLowerCase() == w) days = i;
                            })

                            let output = new Date().getTime() + days * day + timezone * hour + (hr * hour - nowHr * hour) + (min * minute - nowMin * minute) - nowSec * sec;
                            resolve(output)

                        } else {
                            let output = new Date().getTime() + parseInt(numdays) * day + timezone * hour + (hr * hour - nowHr * hour) + (min * minute - nowMin * minute) - nowSec * sec;
                            resolve(output)
                        }
                    }
                }

                if (type == 2) {
                    let num = humanTime[i + 1]
                    if (!result[0]) {
                        let utc = await client.awaitReply(msg, "You havent saved your timezone yet, head over to https://thecaptain.ga/timezone to set ur timezone! \n\n Or do you want to run your commands relative to UTC/GMT? (y=yes, n=no)", 60000, false)

                        if (utc.toLowerCase() !== "y") {
                            msg.channel.send("Save your timezone at https://thecaptain.ga/timezone, and run the command again!")
                            reject("timezone")
                        } else {
                            if (!num.match(/^[0-9]+$/)) {
                                if (humanTime[i + 2] == "days") {
                                    let days;
                                    let i = 1;
                                    numWordsD.forEach(w => {
                                        i++
                                        if (num.toLowerCase() == w) days = i - 1;
                                    })
                                    let output = new Date().getTime() + days * day
                                    resolve(output)
                                } else if (humanTime[i + 2].match(/hours|hour|hr|hrs/gmi)) {
                                    let hours;
                                    let i = 1;
                                    numWordsH.forEach(w => {
                                        i++
                                        if (num.toLowerCase() == w) hours = i - 1;
                                    })
                                    let output = new Date().getTime() + hours * hour
                                    resolve(output)
                                }

                            } else {

                                let output = new Date().getTime() + parseInt(num) * hour;
                                resolve(output)
                            }
                        }
                    } else {
                        if (!num.match(/^[0-9]+$/)) {
                            let timezone = result[0].timezone
                            if (humanTime[i + 2] == "days") {
                                let days;
                                let i = 1;
                                numWordsD.forEach(w => {
                                    i++
                                    if (num.toLowerCase() == w) days = i - 1;
                                })
                                let output = new Date().getTime() + days * day + timezone * hour
                                resolve(output)
                            } else if (humanTime[i + 2].match(/hours|hour|hr|hrs/gmi)) {
                                let hours;
                                let i = 1;
                                numWordsH.forEach(w => {
                                    i++
                                    if (num.toLowerCase() == w) hours = i - 1;
                                })
                                let output = new Date().getTime() + hours * hour + timezone * hour
                                resolve(output)
                            }
                        } else {
                            if (humanTime[i + 2] == "days") {
                                let timezone = result[0].timezone
                                let output = new Date().getTime() + timezone * hour + parseInt(num) * hour;
                                resolve(output)
                            } else if (humanTime[i + 2].match(/hours|hour|hr|hrs/gmi)) {
                                let timezone = result[0].timezone
                                let output = new Date().getTime() + timezone * hour + parseInt(num) * hour;
                                resolve(output)
                            }
                        }
                    }
                }

                if (type == 3) {
                    if (!result[0]) {
                        let utc = await client.awaitReply(msg, "You havent saved your timezone yet, head over to https://thecaptain.ga/timezone to set ur timezone! \n\n Or do you want to run your commands relative to UTC/GMT? (y=yes, n=no)", 60000, false)

                        if (utc.toLowerCase() !== "y") {
                            msg.channel.send("Save your timezone at https://thecaptain.ga/timezone, and run the command again!")
                            resolve()
                        } else {
                            if (!numDays.match(/^[0-9]+$/)) {
                                let days;
                                let i = 1;
                                numWordsD.forEach(w => {
                                    i++
                                    if (numDays.toLowerCase() == w) days = i;
                                    if (numdays.toLowerCase() == "tomorrow") days = 1
                                })
                                let output = new Date().getTime() + days * day
                                resolve(output)
                            } else {
                                let output = new Date().getTime() + numDays * day
                                resolve(output)
                            }
                        }
                    } else {
                        if (!numDays.match(/^[0-9]+$/)) {
                            let hours;
                            let i = 1;
                            numWordsD.forEach(w => {
                                i++
                                if (numDays.toLowerCase() == w) hours = i;
                            })
                            let timezone = result[0].timezone
                            let output = new Date().getTime() + timezone * hour + hours * hour
                            resolve(output)
                        } else {
                            let timezone = result[0].timezone
                            let output = new Date().getTime() + timezone * hour + parseInt(numDays) * hour;
                            resolve(output)
                        }
                    }
                }
            })

        })
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
    /**
     * Pass an array of individual regex to match. This will merge them into one pattern.
     *
     * @param individualLinesToMatch Patterns to merge.
     * @param flags                  (Optional) Regex flags to use.
     * @param ignoreQuotedText       (Optional) Makes sure each individual pattern ignores lines that start with `>`.
     * @param ignoreCodeText         (Optional) Makes sure each individual pattern ignores matches surrounded with `. (Currently broken.)
     */
    client.CreateAutoReplyRegex = (individualLinesToMatch, flags = "", ignoreQuotedText = true, ignoreCodeText = true) => {
        let regexStr = ``;

        individualLinesToMatch.forEach((line, index) => {
            let toMatch = line
            if (index > 0) regexStr += `|`;

            // Broken. Doesn't work for lines that start directly with the part we're matching.
            //if (ignoreCodeText === true) toMatch = `[^\`]${toMatch}[^\`]`

            if (ignoreQuotedText === true) toMatch = `^(?!>).*?${toMatch}`;

            regexStr += `(${toMatch})`
        });

        //console.log(`Made Regex: ${regexStr}`);

        return RegExp(regexStr, flags);
    }

    /**
     * Creates a reply on the given channel with the response text.
     * Also handles waiting for feedback.
     *
     * @param channel                      The channel to send the message to.
     * @param response                     The text to use as the base for the message.
     * @param includeCheckFaqMsgInResponse (Optional) Whether to append the canned message about checking the FAQ to the end of the response message.
     */
    client.CreateAutoReply = async (channel, response, includeCheckFaqMsgInResponse = true) => {
        if (includeCheckFaqMsgInResponse === true) {
            response += `\n\nIf you have any other questions, make sure to read the <#${faqChannelId}>, your question might be already answered there.`;
        }

        channel.send(`${response}\n\nThis autoreply is a work in progress feature, did this help you? (react with ${thumbsUp}) Or was it misplaced? (react with ${thumbsDown}) Thanks for the input!`)
            .then(async (m) => {
                await m.react(thumbsUp);
                await m.react(thumbsDown);
                setTimeout(() => {
                    m.createReactionCollector(async (r) => {
                        let currentGood = parseInt(client.autoreply.get("good"));
                        let currentBad = parseInt(client.autoreply.get("bad"));

                        if (r.emoji.id == thumbsUp.id) {
                            currentGood++;
                            await UpdateAutoReplyStats(currentGood, currentBad);
                            client.autoreply.set("good", currentGood);

                            m.edit(response);

                            ShowThanksForFeedback(r);
                            return;
                        } else if (r.emoji.id == thumbsDown.id) {
                            currentBad++;
                            await UpdateAutoReplyStats(currentGood, currentBad);
                            client.autoreply.set("bad", currentBad);

                            m.edit(response);
                            m.delete({
                                timeout: 10000
                            });

                            ShowThanksForFeedback(r);
                            return;
                        }
                    }, {
                        time: 60000
                    });
                    setTimeout(() => {
                        m.edit(response);
                        m.reactions.cache.forEach(re => re.remove());
                    }, 60000);
                }, 200);
            });

        // Shows the new status ratio.
        client.UpdateAutoReplyStats = async (currentGood, currentBad) => {
            const newStatusMessage = `Good response: ${currentGood} | Bad response: ${currentBad} | Ratio: ${Math.floor(currentGood / (currentGood + currentBad) * 100)}%`;

            if (isTesting) { // CogBot cannot edit Cap's stats post.
                console.log(newStatusMessage);
            } else {
                let statsMsg = await client.guilds.cache.get(captainsSubmarineServerId).channels.cache.get(autoReplyFeedbackChannelId).messages.fetch(autoReplyFeedbackMessageId);
                statsMsg.edit(newStatusMessage);
            }
        }

        // Local func so we don't have to repeat it for each potential emoji reply.
        client.ShowThanksForFeedback = async (r) => {
            channel.send("Thanks for the feedback").then(mess => mess.delete({
                timeout: 5000
            }));
            r.message.reactions.cache.forEach(re => re.remove());
        }
    }
}