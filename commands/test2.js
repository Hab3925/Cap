module.exports.run = async (client, message, args, perfix, con, table) => {
    let msg = await client.guilds.cache.get("444244464903651348").channels.cache.get("444940488903098368").messages.fetch("984582515996131338")
    
    msg.edit(`Good Morning/Afternoon/Evening guys... The Mod Team just used our ban hammers on hundreds of bots <:CogBan:801114883307077704>

So as usual, if anyone DMs you regarding any of these classics (free Nitro, NFTs, CS:GO skins or the Steam account accidentally reported bs):
    
    1. Don't click any links
    2. Send them this GIF on behalf of me: <https://tenor.com/view/monkey-animal-middle-finger-gif-13156624>
    3. Report and block them
    4. Send the mod team a DM so we can ban them
    
TLDR: stupid bot attack - don't click on any links in your DMs - block them and send the mod team their name in DMs - thanks!`)
    
    //let participants = msg.reactions.cache.users.cache
    //participants.forEach(element => {

    //});
}

exports.help = {
    name: "test2",
    desc: "test",
    aliases: ['t2'],
    permLvl: 5,
    hidden: false,
    category: "dev",
    usage: "top secret"
}