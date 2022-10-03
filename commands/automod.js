const { Action } = require("../typescript/classes");
const { ActionTypes } = require("../typescript/enums");

module.exports.run = async (client, message, args) => {
  const Discord = require("discord.js");

  let bannedWords = client.automod.get(message.guild.id);

  if (!args[0]) {
    if (!bannedWords)
      return message.channel.send(
        `Im not automoderating any words in this server yet! Start auto moderating word with this command: \`${exports.help.usage}\``
      );
    if (!bannedWords[0])
      return message.channel.send(
        `Im not automoderating any words in this server yet! Start auto moderating word with this command: \`${exports.help.usage}\``
      );
    let embed = new Discord.MessageEmbed()
      .setTimestamp()
      .setTitle("Banned words")
      .setDescription(`\`\`\`${bannedWords.join(" | ")}\`\`\``)
      .setColor("#D21A1A");
    return message.channel.send(embed);
  }
  if (args[0] == "delete") {
    if (!args[1])
      return message.channel.send(
        `You didn't tell me what word to delete! \`Usage: ${exports.help.usage}\``
      );
    if (!client.automod.has(message.guild.id))
      return message.channel.send(`I am not automoderating that word here!`);
    if (!client.automod.get(message.guild.id).includes(args[1].toLowerCase()))
      return message.channel.send(`I am not automoderating that word here!`);

    let array = client.automod.get(message.guild.id);
    let i = 0;
    array.forEach((element) => {
      if (element == args[1]) {
        array.splice(i, 1);
      }
      i++;
    });
    client.automod.set(message.guild.id, array);
    client
      .fetchCustomAutoModerationFilters(message.guild.id, 500)
      .forEach((i) => {
        i.trigger_metadata.keyword_filter.forEach((j) => {
          if (j == args[1]) {
            let array = [];
            i.trigger_metadata.keyword_filter.forEach((z) => {
              array.push(z);
            });
            let index = array.indexOf(j);
            array.splice(index, 1);

            client.modifyCustomAutoModerationFilter(message.guild.id, i.id, {
              trigger_metadata: {
                keyword_filter: array,
              },
            });
          }
        });
      });

    return message.channel.send(
      `Successfully deleted "${args[1]}" from the banned words list.`
    );
  }
  if (client.automod.has(message.guild.id)) {
    if (client.automod.get(message.guild.id).includes(args[0].toLowerCase()))
      return message.channel.send(
        `I am already automoderating that word here!`
      );
    let array = client.automod.get(message.guild.id);
    array.push(args[0].toLowerCase());
    client.automod.set(message.guild.id, array);
    let found = false;
    client
      .fetchCustomAutoModerationFilters(message.guild.id, 500)
      .forEach((i) => {
        if (i.name == "Captain Rules") {
          found = true;
          i.trigger_metadata.keyword_filter.forEach((j) => {
            let array = [];
            i.trigger_metadata.keyword_filter.forEach((z) => {
              array.push(z);
            });
            array.push(args[0]);

            client.modifyCustomAutoModerationFilter(message.guild.id, i.id, {
              trigger_metadata: {
                keyword_filter: array,
              },
            });
          });
        }
      });

    if (!found) {
      let array = [];
      client.automod.get(message.guild.id).forEach((i) => {
        array.push(i);
      });
      let actionArray = [];
      actionArray.push(new Action(ActionTypes.BLOCK_MESSAGE));

      client.createCustomAutoModerationFilter(
        message.guild.id,
        "Captain Rules",
        array,
        actionArray,
        true
      );
    }

    message.channel.send(
      `The word "${args[0].toLowerCase()}" will now be automoderated`
    );
  } else {
    client.automod.set(message.guild.id, [args[0].toLowerCase()]);
    let found = false;
    client
      .fetchCustomAutoModerationFilters(message.guild.id, 500)
      .forEach((i) => {
        if (i.name == "Captain Rules") {
          found = true;
          i.trigger_metadata.keyword_filter.forEach((j) => {
            let array = [];
            i.trigger_metadata.keyword_filter.forEach((z) => {
              array.push(z);
            });
            array.push(args[0]);

            client.modifyCustomAutoModerationFilter(message.guild.id, i.id, {
              trigger_metadata: {
                keyword_filter: array,
              },
            });
          });
        }
      });

    if (!found) {
      let array = [];
      client.automod.get(message.guild.id).forEach((i) => {
        array.push(i);
      });
      let actionArray = [];
      actionArray.push(new Action(ActionTypes.BLOCK_MESSAGE));

      client.createCustomAutoModerationFilter(
        message.guild.id,
        "Captain Rules",
        array,
        actionArray,
        true
      );
    }

    message.channel.send(
      `The word "${args[0].toLowerCase()}" will now be automoderated`
    );
  }
};

exports.help = {
  name: "automod",
  desc: "Make the bot delete messages containing certain words.",
  aliases: ["am"],
  permLvl: 1,
  hidden: false,
  category: "admin",
  usage: "automod [word] / automod delete [word]",
};
