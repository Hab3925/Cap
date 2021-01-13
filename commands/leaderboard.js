module.exports.run = async (client, message, args) => {
    message.channel.send(`You can find the leaderboard at <https://thecaptain.ga/leaderboard?id=${message.guild.id}> !`)
}

exports.help = {
    name: "leaderboard",
    desc: "Get a link to the leaderboard! ",
    aliases: ['l', 'levels', 'lb'],
    permLvl: 0,
    hidden: false,
    category: "rank",
    usage: "leaderboard"
}