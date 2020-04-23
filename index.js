const Discord = require('discord.js');
const client = new Discord.Client();
const token = require("./token.json")
const config = require("./config.json")

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (!msg.author.bot) {
    if (msg.content.startsWith(config.prefix + "say ")) {
      if (msg.author.id == "432380402238357516"){
      var say = msg.content.replace(config.prefix + "say ","");
      msg.delete();
      msg.channel.send(say);}
      else {msg.reply("no")}
    }
    if (msg.channel.id === config.reactchan) {
  if (msg.content.startsWith(config.prefix)) {
    console.log("Message received: " + msg.content);
    msg.react('👍')
    .then(() => msg.react('👎'));
  }
  else (console.log("no react required"))
}
}});

client.login(token.token);
