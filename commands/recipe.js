module.exports.run = async (client, message, args) => {
    let searchTerm = args.join(' ')
    const superagent = require('superagent')
    const Discord = require('discord.js')

    if (!searchTerm) return message.channel.send("Seems you forgot to include a searchterm!")
    let msg = await message.channel.send('Searching...')
    let { body } = await superagent.get('https://wiki.volcanoids.com/pages.json')

    let searchResult = search(searchTerm, body)

    if (!searchResult) return msg.edit("Nothing on the wiki matched your search!")
    msg.delete()

    let recipes = []
    searchResult.forEach(item => {
        recipes.push(`[${item.name}](https://wiki.volcanoids.com/doku.php?id=${item.path})`)
    })
        
    let embed = new Discord.MessageEmbed()
    .setTitle("Search Results")

    if (recipes.length < 2){
        let recipe = searchResult[0]

        let singleItemEmbed = new Discord.MessageEmbed()
        .setTitle(recipe.name)
        .setURL(`https://wiki.volcanoids.com/doku.php?id=${recipe.path}`)
        .setDescription(recipe.description.replace(/\n/gi, " "))
        .addField("Required Items:", `-\u3000${fixIndent(recipe.requiredItems.join("\r\n-\u3000"))}`, true)
        .addField("Crafted in:", `-\u3000${fixIndent(recipe.craftedIn.join("\r\n-\u3000"))}`, true)
        .addField("Required Upgrades:", `-\u3000${fixIndent(recipe.requiredUpgrades.join("\r\n-\u3000"))}`, true)
        .setThumbnail(`https://wiki.volcanoids.com/lib/exe/fetch.php?media=${recipe.imagePath}`)

        return message.channel.send(singleItemEmbed)
    }
    else if(recipes.length < 10){
        embed.addField("\u200B", recipes.join("\n"))
        return message.channel.send(embed)
    } else {
        splitArray(recipes, 5).forEach(list => {
            embed.addField("\u200B", list.join("\u3000\u3000\u3000\u3000\r\n"), true)
        })
        return message.channel.send(embed)
    }
}

function search(searchTerm, body){
    let result = [];
    let exactMatch = new RegExp(`^${searchTerm.toUpperCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "gi")
    let searchRegex = new RegExp(`${searchTerm.toUpperCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, "gi")

    for (let i = 0; i < body.length; i++){
        if (body[i].type != "recipe") continue
        if (body[i].name.toUpperCase().match(exactMatch)) {
            result = []
            result.push(body[i])
            break
        } else if (body[i].name.toUpperCase().match(searchRegex)) {
            result.push(body[i])
        }
    }

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

function fixIndent(string){
    let output = ""

    let words = string.split(" ")
    let wordLen = 0
    words.forEach(word => {
        wordLen += word.length + 1
        if (wordLen > 25){
            output += `\r\n\u00A0\u00A0\u3000${word}`
        }else {
            output += word + " "
        }
    })

    return output
}

exports.help = {
    name: "recipe",
    desc: "Look up a recipe on the wiki",
    aliases: [],
    permLvl: 0,
    hidden: false,
    category: "volc",
    usage: "recipe [search term]"
}