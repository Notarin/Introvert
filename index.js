const Discord = require('discord.js');
const client = new Discord.Client();
const token = require("./token.json");
const config = require("./config.json");
const gifs = require("./gifs.json");
const ytdl = require('ytdl-core');
const axios = require("axios");
const git = require('simple-git');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.ws.on('INTERACTION_CREATE', async interaction => {
  const command = interaction.data.name.toLowerCase();
  const args = interaction.data.options;
  if (command === 'ping'){
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: "PONG!!!"
        }
      }
    })
  }
  if (command === 'say'){
    if (interaction.member.user.id == config.owner) {
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 3,
          data: {
            content: args[0].value
          }
        }
      })
    }
  }
  if (command === 'avatar'){
    client.users.fetch(args[0].value).then(function(result) {
      var mention = result;
      client.guilds.fetch(interaction.guild_id).then(function(result) {
        var guild = result;
        var author = interaction.member
        let embed = new Discord.MessageEmbed()
        .setColor(guild.me.displayColor)
        .setTitle(mention.tag)
        .setImage(mention.avatarURL({"size" : parseInt(args[1].value), "dynamic" : true}));
        client.api.interactions(interaction.id, interaction.token).callback.post({
          data: {
            type: 4,
            data: {
              embeds: [embed]
            }
          }
        });
      });
    });
  }
  if (command === 'gitpull'){
    if (interaction.member.user.id == config.owner) {
      git().pull();
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: "on it😎"
          }
        }
      });
    }
  }
  if (command === 'shutdown'){
    if (interaction.member.user.id == config.owner) {
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: "byebye..."
          }
        }
      })
      .then(function(result) {
        process.exit(0);
      });
    }
  }
});

client.on('message', msg => {
  if (msg.author.bot) {return;}
  if (!msg.content.startsWith(config.prefix)) {return;}
  var full = msg.content.substr(config.prefix.length);
  var command = full.substr(0,full.indexOf(' '));
  if (!full.includes(" ")) {var command  = full;}
  console.log(msg.content);
  var args = full.substr(full.indexOf(' ')+1);
  if (command == "ping") {
    msg.reply("Pong!");
    return;
  }
  if (msg.mentions.users.first() && gifs[command]) {
    var gif = gifs[command].ids[Math.floor(Math.random() * gifs[command].ids.length)];
    axios.get('https://api.giphy.com/v1/gifs/' + gif + '?api_key=D9cTxnp1jxQE6wW1RQVXDmoFpERehwXi')
      .then(response => {
        send = response.data.data.images.original.url;
        console.log("running");
        let embed = new Discord.MessageEmbed()
          .setAuthor(msg.author.username + gifs[command].verb + msg.mentions.users.first().username + "!!!", msg.author.avatarURL())
          .setColor(msg.guild.me.displayColor)
          .setImage(send);
        msg.channel.send(embed);
        return;
      })
      .catch(error => {
        console.log(error);
      });
    return;
  }
  if (msg.channel.id == config.reactchan && config.react) {
    msg.react('👍')
    .then(() => msg.react('👎'));
    return;
  }
  else {
    msg.reply("that doesnt seem quite right...🤔");
    return;
  }
});

client.login(token.token);
