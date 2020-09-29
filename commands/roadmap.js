module.exports.run = async (client, message, args) => {
    const Discord = require('discord.js')
    const superagent = require('superagent')
    let searchTerm = args.join(' ')

    if (!searchTerm) {
        message.channel.send('Check the game\'s roadmap out here: <https://trello.com/b/xsj3vAs1/volcanoids-roadmap>');
        return
    }

    //return message.channel.send("This function is out of order...")
    let msg = await message.channel.send('Searching...')
    let { body } = await superagent.get('https://api.trello.com/1/boards/5bbb86e08ff11c7f22b8a1ed/cards?key=621658a9d93216e7d5561463391da9a0&token=121960dadce3acc654bfaef10f2521d47dbca4f6ad5c7d93734fd6201d6d2f40')

    let cardArray = body
    let searchResult = card(searchTerm)

    if (searchResult == null) return msg.edit('No card matched your search!');

    let i = 0;
    while (i < searchResult.length) {
        let title = cardArray[searchResult[i]].name;
        let desc = cardArray[searchResult[i]].desc;

        if (cardArray[searchResult[i]].closed == true) {
            if ((i + 2) > searchResult.length) return message.channel.send('No card matched your search!');
        }

        if (cardArray[searchResult[i]].closed) {
            searchResult.shift();
            continue;
        }
        if (i == 0) msg.delete()

        if (i > 2) {
            message.channel.send(`And ${searchResult.length - 2} more result(s)...`)
            return;
        }

        if (!desc) desc = 'No description \n'
        let embed = new Discord.MessageEmbed()
            .setColor('#C54816')
            .setTitle(title)
            .setDescription(desc.slice(0, 925) + ' ...' + `\n[See the card here](${cardArray[searchResult[i]].url})`)

        if (cardArray[searchResult[i]].cover.idAttachment) {
            let card = await superagent.get(`https://api.trello.com/1/cards/${cardArray[searchResult[i]].id}?key=621658a9d93216e7d5561463391da9a0&token=121960dadce3acc654bfaef10f2521d47dbca4f6ad5c7d93734fd6201d6d2f40`)
            embed.setImage(card.body.cover.scaled[card.body.cover.scaled.length - 1].url)

        }

        await message.channel.send(embed);
        i++
    }


    function card(cardName) {
        let i = 0;
        let result = [];
        while (i < cardArray.length) {
            if (cardArray[i].name.toUpperCase().match(cardName.toUpperCase())) {
                result.push(i)
            }
            i++;
        }

        if (!result[0]) {
            return null;
        } else return result;
    }

}

exports.help = {
    name: "roadmap",
    desc: "gives you Volcanoids' [roadmap](https://trello.com/b/xsj3vAs1/volcanoids-roadmap), can also be used to search for cards",
    aliases: ['rm', 'raodmap'],
    permLvl: 0,
    hidden: false,
    category: "volc",
    usage: "roadmap (searchterm)"
}