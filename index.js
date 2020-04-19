const Discord = require('discord.js');
const client = new Discord.Client();
const token = require("./token.json")
const config = require("./config.json")

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (!msg.author.bot) {
    if (msg.channel.id === config.reactchan) {
  if (msg.content.startsWith(config.prefix)) {
    console.log("command received: " + msg.content);
    const emoji = message.guild.emojis.cache.find(emoji => emoji.name === '+1');
    console.log(emojii);
  }
  else (console.log("no response required"))
}
}});

client.login(token.token);
