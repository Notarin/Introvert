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
    if (!full.includes(" ")) {var command  = full;}
    console.log(command);
    var args = full.substr(full.indexOf(' ')+1);
    if (command == "say" && msg.author.id == config.owner) {
      msg.delete();
      msg.channel.send(args);
      return;
    }
    if (command == "join") {
    msg.member.voice.channel.join();
    ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', { filter : 'audioonly' });
    return;
    }
    if (msg.channel.id == config.reactchan && config.react) {
      msg.react('👍')
      .then(() => msg.react('👎'));
      return;
    }
    else {
      msg.reply("that doesnt seem to be a command🤔");
      return;
    }
  }
});
client.login(token.token);
