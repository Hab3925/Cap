module.exports.run = async (client, message, args) => {
    message.channel.send(`Here is a link to a playlist with all the devdiaries on youtube! \nhttps://www.youtube.com/watch?v=19zJL_iIM0U&list=PLW0elFlCp2ZsQP3XXkzrTL8--GPQaVHDP`);
}

exports.help = {
    name: "diaries",
    desc: "get a playlist to the devdiaries on youtube",
    aliases: ["d"],
    permLvl: 0,
    hidden: false,
    category: "volc",
    usage: "diaries"
}