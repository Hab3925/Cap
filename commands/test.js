module.exports.run = async (client, message, args, prefix, con, table, permLvl, GSTable) => {
    const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === '188762891137056769';
    const collector = message.createReactionCollector(filter, {
        time: 15000
    });
    collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
    collector.on('end', collected => console.log(`Collected ${collected.size} items`));
}

exports.help = {
    name: "test",
    desc: "test",
    aliases: ['t'],
    permLvl: 6,
    hidden: true,
    category: "dev",
    usage: "top secret"
}