exports.run = (client, message, args) => {

    const devs = ["188762891137056769"];
    if(!~devs.indexOf(message.author.id)) {
      return;
    }
    if(!args[0])return message.channel.send('No commandname provided.')
    let cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));

    try{require(`./${cmd.help.name}.js`)}catch (e) {return message.channel.send('Thats neither a commandname, nor an alias for one...')}
    delete require.cache[require.resolve(`./${cmd.help.name}.js`)];

    client.loadcommand(cmd.help.name)
    message.reply(`The file **${cmd.help.name}.js** has been reloaded`);

  }; 

  exports.help = {
    name: "reload",
    desc: "reload a command",
    aliases: ['rl'],
    permLvl: 5,
    hidden: false,
    category: "dev",
    usage: "reload [commandfile]"
}