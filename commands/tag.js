exports.run = async (client, message, args) => {
    message.delete()
    const devs = ["188762891137056769"];
    if(!~devs.indexOf(message.author.id)) {
        message.channel.send('Who are you fooling?')
        const times = x => f => {
            if (x > 0) {
              f()
              times (x - 1) (f)
            }
          }
          times (args[1]) (() => message.channel.send(message.author).then(msg => msg.delete({timeout:2000})));  
      return;
    }
    message.delete()
    const times = x => f => {
        if (x > 0) {
          f()
          times (x - 1) (f)
        }
      }
      
    times (args[1]) (() => message.channel.send(args[0]).then(msg => msg.delete({timeout:2000})));
}
exports.help = {
  name: "tag",
  desc: "tag someone... a lot",
  aliases: [],
  permLvl: 6,
  hidden: false,
  category: "dev",
  usage: "tag [@user]"
}