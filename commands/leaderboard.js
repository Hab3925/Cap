module.exports.run = async (client, message, args) => {
    message.channel.send('You can access a gloabal leaderboard at https://thecaptain.ga/leaderboard !')
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