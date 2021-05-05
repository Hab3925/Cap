const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {
  const moddingJSON = require("../storage/modding.json");
  if (!args[0]) {
    message.channel.send(
      `Learning to Mod? Check out the Modding Guide and FAQ! \nOur Modding Guide is at https://modding.melodicalbuild.me \nOur in Discord FAQ is found here! <#831103119252520960>`
    );
  } else {

    var needle = args[0].toLowerCase();
    var foundEntries = [];

    moddingJSON.data.forEach((dataEntry) => {
      dataEntry.searchTerms.forEach((haystackElement) => {
        var lowercaseHaystack = haystackElement.toLowerCase();

        if (lowercaseHaystack == needle || lowercaseHaystack.includes(needle)) {
          foundEntries.push(dataEntry);
        }
      });
    });

    let embed = new Discord.MessageEmbed()
    .setTitle("Search Results:")
      .setTimestamp()
      .setFooter(
        "Friendly Coggo",
        client.user.avatarURL({ format: "png", size: 2048 })
      );

    let count = 0;

    if (foundEntries.length > 0) {
      embed.setColor("#0cc20f");
      foundEntries.forEach((element) => {
        if(count != 5) {
            embed.addField(`${element.id}:`, moddingJSON.baseURL + element.url);
            count++;
        }
      });
    } else {
      embed.setColor("#b80000");
      embed.addField(
        "Search Results:",
        "Your Search Term was not found, Try again!"
      );
    }

    message.channel.send(embed);
  }
};

exports.help = {
  name: "modding",
  desc: "Open the Modding FAQ",
  aliases: ["mod"],
  permLvl: 0,
  hidden: true,
  category: "volc",
  usage: "modding <guide name>",
};
