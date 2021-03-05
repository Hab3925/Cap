module.exports.run = async (client, message, isTesting, cmd) => {
    //Automod
    if (cmd !== "automod" && cmd !== "am") {
        if (client.automod.has(message.guild.id)) {
            client.automod.get(message.guild.id).forEach(m => {
                const spacerList = `+(\\s|[^a-zA-Z])*`
                let charArray = m.split('');
                let wordWithRegex = '(\\S|^|\\s)' + charArray.join(spacerList) + '+(\s|$|([^a-zA-Z]*(\s*[^a-zA-Z]|$)))';
                let regexObj = RegExp(wordWithRegex, 'gmiu');
                if (message.content.toLowerCase().match(regexObj)) {
                    message.delete()
                    message.author.send(`You are not allowed to use the word "${m}" in ${message.guild.name}!`);
                    if (!client.logchn.has(message.guild.id)) return
                    if (client.logchn.get(message.guild.id) != "disabled") {
                        message.guild.channels.cache.get(client.logchn.get(message.guild.id)).send(`Deleted message in <#${message.channel.id}> by <@${message.author.id}>: \n${message.content}`)
                    }
                    return
                }
            })
        }
    }
}