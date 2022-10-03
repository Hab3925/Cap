module.exports.run = async (client, message, args, prefix, con) => {
    message.channel.send(`Logs can be found here\`\`\`C:\\Users\\%USERNAME%\\AppData\\LocalLow\\Volcanoid\\Volcanoids\\Player.log\`\`\` and here are crash logs and dump files \`\`\`C:\\Users\\%USERNAME%\\AppData\\Local\\Temp\\Volcanoid\\Volcanoids\\Crashes\\CRASH NAME\`\`\` and the saves are located here \`\`\`C:\\Users\\%USERNAME%\\AppData\\LocalLow\\Volcanoid\\Volcanoids\\Saves\`\`\``)
}
exports.help = {
    name: "log",
    desc: "shows how to get the logs from the game.",
    aliases: [],
    permLvl: 0,
    hidden: false,
    category: "volc",
    usage: "log"
}