module.exports.run = async (client, message, args) => {
    message.channel.send('Shutting down...')
    setTimeout(shutdown, 1000);
    function shutdown(){
        process.exit(1)
    }
    console.log(`Shutting down...`)
    
}

exports.help = {
    name: "shutdown",
    desc: "Shut down the bot",
    aliases: ['sd'],
    permLvl: 4,
    hidden: false,
    category: "dev",
    usage: "shutdown"
}