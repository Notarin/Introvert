const Discord = require('discord.js');
const client = new Discord.Client();
const token = require("./token.json")
const config = require("./config.json")

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  console.log(msg.content.startsWith(config.prefix));
  console.log(config.prefix);
  if (msg.content.startsWith(config.prefix)) {
    msg.reply('Pong!');
  }
});

client.login(token.token);
