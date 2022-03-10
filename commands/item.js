module.exports.run = async (client, message, args) => {
    let searchTerm = args.join(' ')
    const superagent = require('superagent')
    const Discord = require('discord.js')

    if (!searchTerm) return message.channel.send("Seems you forgot to include a searchterm!")
    let msg = await message.channel.send('Searching...')
    let { body } = await superagent.get('http://volc-wiki.brutsches.com/pages.json')

    let searchResult = search(searchTerm, body)

    if (!searchResult) return msg.edit("Nothing on the wiki matched your search!")
    msg.delete()

    let itemObj = []
    let items = []
    
    searchResult.forEach(item => {
        if(item.type == "item"){
            itemObj.push(item)
            items.push(`[${item.name}](http://volc-wiki.brutsches.com/doku.php?id=${item.path})`)
        }
    })

    let embed = new Discord.MessageEmbed()
    .setTitle("Search Results")

    if(items.length < 2) {
        let item = itemObj[0]

        let singleItemEmbed = new Discord.MessageEmbed()
        .setTitle(item.name)
        .setURL(`http://volc-wiki.brutsches.com/doku.php?id=${item.path}`)
        .setDescription(item.description.replace(/\n/gi, " "))
        .setThumbnail(`http://volc-wiki.brutsches.com/lib/exe/fetch.php?media=${item.imagePath}`)

        return message.channel.send(singleItemEmbed)
    }else if (items.length < 10) {
        embed.addField("\u200B", item.join("\n"))
        return message.channel.send(embed)
    }else {
        splitArray(recipes, 10).forEach(list => {
            embed.addField("\u200B", list.join("\u3000\u3000\u3000\u3000\r\n"), true)
        })
        return message.channel.send(embed)
    }
}

function search(searchTerm, body){
    let result = [];
    body.forEach(item => {
        if (item.name.toUpperCase().match(searchTerm.toUpperCase())) {
            result.push(item)
        }
    })

    if (!result[0]) {
        return null;
    } else return result;
}

function splitArray(arr, len) {
    var chunks = [], i = 0, n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, i += len));
    }
    return chunks;
}

exports.help = {
    name: "item",
    desc: "Look up an item on the wiki",
    aliases: [],
    permLvl: 0,
    hidden: false,
    category: "volc",
    usage: "item [search term]"
}