const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    await message.delete()
    const deleteCount = parseInt(args[0], 10)
    if (!deleteCount || deleteCount < 1 || deleteCount > 100) return message.reply("Please provide a number between 1 and 100 for the number of messages to delete")

    message.channel.bulkDelete(deleteCount, true)
        .catch(error => message.reply(`Couldn't delete messages because of: \n${error}`));
}

exports.help = {
    name: "delete",
    desc: "bulk delete messages",
    aliases: ["clear","purge"],
    permLvl: 1,
    hidden: false,
    category: "admin",
    usage: "delete [number of messages to delete]"
}