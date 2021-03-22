module.exports.run = async (client, message, args) => {
    // or, if you can't get the id:
    const mutedRole = message.guild.roles.cache.find(
        (role) => role.name === 'Muted'
    );

    // if there is no `Muted` role, send an error
    if (!mutedRole)
        return message.channel.send('There is no Muted role on this server, make a role and call it "Muted"');

    const target = message.mentions.members.first();
    target.roles.add(mutedRole);


}

exports.help = {
    name: "mute",
    desc: "Mute a user.",
    aliases: [""],
    permLvl: 1,
    hidden: false,
    category: "admin",
    usage: "mute [@user] (time)"
}