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
  if (command === 'update'){
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
            content: config.shutdownmessage
          }
        }
      })
      .then(function(result) {
        process.exit(0);
      });
    }
  }
  if (command === 'userinfo'){
    Promise.all([
      client.users.fetch(args[0].value),
      client.guilds.fetch(interaction.guild_id)
    ])
    .then(function (responses) {
      var user = responses[0]
      var guild = responses[1]
      Promise.all([
        user.avatarURL(),
        guild.members.fetch(args[0].value)
      ])
      .then(function (responses) {
        var avatar = responses[0]
        var member = responses[1]
        let embed = new Discord.MessageEmbed()
        .setTitle("User info")
        .setDescription("Here's everything I found on the user!")
        .setColor(member.displayColor)
        .setFooter("User Info from " + client.user.username)
        .setThumbnail(avatar)
        .setAuthor(user.username, avatar)
        .addField("Avatar id", user.avatar, true)
        .addField("User id", user.id, true)
        .addField("Username", user.username, true)
        .addField("Discriminator", user.discriminator, true)
        .addField("Is Bot?", user.bot, true)
        .addField("Create Date", user.createdAt, true)
        .addField("User Locale", user.locale, true)
        .addField("Current Status", user.presence.status, true)
        .addField("Left server?", member.deleted, true)
        .addField("Nickname", member.displayName, true)
        .addField("Join Date", member.joinedAt, true)
        .addField("Managable by bot?", member.manageable, true)
        .addField("Permissions", member.permissions.toArray(), true)
        .addField("Boosting Since", member.premiumSince, true)
        client.api.interactions(interaction.id, interaction.token).callback.post({
          data: {
            type: 4,
            data: {
              embeds: [embed]
            }
          }
        })
      })
    })
  }
  if (command == 'serverinfo') {
    client.guilds.fetch(interaction.guild_id)
    .then(function (response) {
      var guild = response;
      guild.members.fetch(interaction.member.user.id)
      .then(function (response) {
        var member = response;
        let embed = new Discord.MessageEmbed()
        .setTitle("Server info")
        .setDescription("Here's everything I found on the Server!")
        .setColor(member.displayColor)
        .setFooter("Server Info from " + client.user.username)
        .setAuthor(guild.name)
        .addField("Creation Date", guild.createdAt, true)
        .addField("Server Description", guild.description, true)
        .addField("Filter Level", guild.explicitContentFilter, true)
        .addField("Server ID", guild.id, true)
        .addField("Is Large?", guild.large, true)
        .addField("Maximum Members", guild.maximumMembers, true)
        .addField("Member Count", guild.memberCount, true)
        .addField("MFA Level", guild.mfaLevel, true)
        .addField("Server Name", guild.name, true)
        .addField("Server Owner", guild.owner, true)
        .addField("Partnered?", guild.partnered, true)
        .addField("Server Locale", guild.preferredLocale, true)
        .addField("Sever Boosts", guild.premiumSubscriptionCount, true)
        .addField("Boost Tier", guild.premiumTier, true)
        .addField("Server Region", guild.region, true)
        .addField("Vanity URL", guild.vanityURLCode, true)
        .addField("Verification Level", guild.verificationLevel, true)
        .addField("Verified", guild.verified, true)
        client.api.interactions(interaction.id, interaction.token).callback.post({
          data: {
            type: 4,
            data: {
              embeds: [embed]
            }
          }
        })
      })
    })
  }
});

client.on('message', msg => {
  if (msg.author.bot) {return;}
  var full = msg.content.substr(config.prefix.length);
  var command = full.substr(0,full.indexOf(' '));
  if (!full.includes(" ")) {var command  = full;}
  console.log(msg.content);
  var args = full.substr(full.indexOf(' ')+1);
  if (msg.channel.id == config.infinchan) {
    msg.channel.messages.fetch({ limit: 2 }).then(messages => {
      if (parseInt(messages.array()[1].content) + 1 != msg.content) {
        msg.delete({ timeout: 100 })
      }
    })
  }
  if (!msg.content.startsWith(config.prefix)) {return;}
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
