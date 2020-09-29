module.exports.run = async (client, message, args) => {
    const Discord = require('discord.js');

    const upvote = client.emojis.find(emoji => emoji.name === "goldcheck")
    const downvote = client.emojis.find(emoji => emoji.name === "goldcross")
    const dev = message.member.roles.has('444925837066764289');
    const mod = message.member.roles.has('452833523095830538'); 
    const explorer = message.member.roles.has('452828776212987951');
    const gunslinger = message.member.roles.has('452828720185606144');
    const veteran = message.member.roles.has('452828649331097621');
    const artificer = message.member.roles.has('452828451984900106');
    let ranked = dev || mod || explorer || veteran || artificer || gunslinger;

    if (message.guild.id !== '444244464903651348') return message.channel.send('This command can only be used in the offical Volcanoids server.')    
    if(message.channel.id !== '447889422185398312') {message.delete({timeout:5000}); message.channel.send('This command doesent work here! Try <#447889422185398312>').then(msg => msg.delete({timeout:5000})); return}
    if(!ranked) return message.channel.send('You can not use this feature yet, you need to have the explorer rank.')
    if (!args[0])return message.channel.send('Seems like you forgot to type in your actuall suggestion');

    function titleEnd() {
        let i = 1;
        while (i < args.length) {
            if (args[i].includes('|')){
                return i
            }
            i++
        }
        return 0
    }

    if(titleEnd() === 0) return message.channel.send('You have to give your suggestion a title. Seperate the title from the suggestion with |')
    let suggestion = args.splice(titleEnd()).join(' ').replace('|', '')
    let title = args.join(' ');
    if (title.length > 200) return message.channel.send('Your title have exceeded the 200 character limit, try to keep it short and make it easy to understand what you are suggesting')
    if (suggestion.length > 2000) return message.channel.send('You have exceeded the 2000 character limit, try to keep your suggestion brief so that people don`t have to read walls of text when voting')


    const embed = new Discord.MessageEmbed()
    .setColor("#C54816")
    .setFooter(`Volcanoids | ${message.author.tag}`, 'https://cdn.discordapp.com/attachments/466495097479888907/490497766351568896/Logo.png')
    .setTimestamp()
    .setTitle(title)
    .setDescription(suggestion)
    

    const response = await client.awaitReply(message, 'Are you sure you want to send this? Make sure to explain your suggestion so that its easy to understand. (y=yes, n=no)', 60000);

    if (response.toLowerCase() === 'y' || response.toLowerCase() === 'yes') {
        message.channel.send('Suggestion posted to voting channel');

        client.channels.cache.get('533357093340708895').send({embed}).then(async msg => {
            await msg.react(upvote);
            await msg.react(downvote);
        });
    }else

    if (response.toLowerCase() === 'n' || response.toLowerCase() === 'no') {
        message.channel.send('Cancelled');
    }else 

    if(!response || response !== ["yes", "y", "n", "no", "cancel"]) return message.channel.send('You have to answer with either yes or no, please try again')


}

exports.help = {
    name: "suggest",
    desc: "leave a suggestion for the game, bot or server!",
    aliases: ['s'],
    permLvl: 0,
    hidden: false,
    category: "volc",
    usage: "suggest [title] | [description]"
}