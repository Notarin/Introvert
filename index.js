const Discord = require('discord.js');
const client = new Discord.Client();
const token = require("./token.json");
const config = require("./config.json");
const ytdl = require('ytdl-core');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author.bot) {return;}
  if (!msg.content.startsWith(config.prefix)) {return;}
  var full = msg.content.substr(config.prefix.length);
  var command = full.substr(0,full.indexOf(' '));
  if (!full.includes(" ")) {var command  = full;}
  console.log(msg.content);
  var args = full.substr(full.indexOf(' ')+1);
  if (command == "say" && msg.author.id == config.owner) {
    msg.delete();
    msg.channel.send(args);
    return;
  }
  if (command == "play") {
    msg.member.voice.channel.join().then(connection =>{connection.play(ytdl(args));}).catch(err => console.log(err));
    return;
  }
  if (command == "fuckyou") {
    let embed = new Discord.MessageEmbed()
      .setTitle("FUCK YOU")
      .setColor(msg.guild.me.displayColor)
      .setFooter('sincerely ' + msg.author.username, msg.author.avatarURL())
      .setThumbnail(msg.mentions.users.first().avatarURL())
      .setAuthor('Dear ' + msg.mentions.users.first().username);
    console.log(embed);
    msg.channel.send(embed);
    return;
  }
  if (command == "av" || command == "avatar") {
    if (msg.mentions.users.first()) {
      var user = msg.mentions.users.first();
    }
    if (!msg.mentions.users.first()) {
      var user = msg.author
    }
    let embed = new Discord.MessageEmbed()
      .setTitle("AVATAR")
      .setColor(msg.guild.me.displayColor)
      .setImage(user.avatarURL({"size" : 4096}))
      .setAuthor(msg.author.tag, msg.author.avatarURL());
  msg.channel.send(embed);;
  return;
  }
  if (command == "ping") {
    msg.reply("Pong!");
    return;
  }
  if (command == "leave") {
    msg.member.voice.channel.leave();
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
});
client.login(token.token);
