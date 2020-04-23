const Discord = require('discord.js');
const client = new Discord.Client();
const token = require("./token.json")
const config = require("./config.json")

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author.bot) {return;}
  if (msg.content.startsWith(config.prefix)) {
    var full = msg.content.substr(config.prefix.length);
    var command = full.substr(0,full.indexOf(' '));
    console.log(command);
    var args = full.substr(full.indexOf(' ')+1);
    if (command == "say" && msg.author.id == config.owner) {
      msg.delete();
      msg.channel.send(args);
    }
    if (msg.channel.id == config.reactchan && config.react) {
      msg.react('👍')
      .then(() => msg.react('👎'));
    }
    else {
      msg.reply("that doesnt seem to be a command🤔")
    }
  }
});
client.login(token.token);
