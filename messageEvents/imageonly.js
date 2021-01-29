module.exports.run = async (client, message, isTesting, command, prefix, permlvl) => {
    // Image Only
    // By running this before the other commands, we both stop the user from getting XP from this and stop bot replies from remaining in the image-only channel.
    let imageOnlyChannelIds = client.ImageOnly.get("channels");
    let msg = message.content.toUpperCase();

    if (imageOnlyChannelIds && imageOnlyChannelIds.includes(message.channel.id)) {
        if (msg.startsWith(prefix) && command == "unlock" && permlvl >= 1) {
            // Passing the outermost if guarantees that our originating channel ID must be in the array so it's safe to assume that indexOf will always find a valid entry.
            imageOnlyChannelIds.splice(imageOnlyChannelIds.indexOf(message.channel.id), 1);
            client.ImageOnly.set("channels", imageOnlyChannelIds);
            return message.channel.send("This channel has been unlocked");
        }
        let attatchment = message.attachments.array();
        if (permlvl <= 2) {
            if (
                !message.content.match(
                    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
                )
            ) {
                if (!attatchment[0]) {
                    message.delete();
                    message.channel
                        .send("You can only send images in this channel.")
                        .then(msg => msg.delete({
                            timeout: 5000
                        }));
                    if (!client.logchn.has(message.guild.id)) return
                    if (client.logchn.get(message.guild.id) != "disabled") {
                        message.guild.channels.cache.get(client.logchn.get(message.guild.id)).send(`Deleted message in <#${message.channel.id}> by <@${message.author.id}>: \n${msgContent.join(" ")}`)
                    }
                    return;
                }
                if (attatchment[0].width <= 100 && attatchment[0].height <= 100) {
                    message.delete();
                    message.channel
                        .send("You can only send images in this channel")
                        .then(msg => msg.delete({
                            timeout: 5000
                        }));
                    if (!client.logchn.has(message.guild.id)) return
                    if (client.logchn.get(message.guild.id) != "disabled") {
                        message.guild.channels.cache.get(client.logchn.get(message.guild.id)).send(`Deleted message in <#${message.channel.id}> by <@${message.author.id}>: \n${msgContent.join(" ")}`)
                    }
                    return;
                }
            }
        }
    }
}