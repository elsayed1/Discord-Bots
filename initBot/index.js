const Discord = require('discord.js');
const discordTTS = require('discord-tts');

let hasTracker = false;
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const prefix = '!';

const endTracking = (msg, trackedPerson) => {
  const broadcast = client.voice.createBroadcast();
  const channelId = msg.member.voice.channelID;
  const channel = client.channels.cache.get(channelId);
  channel.join().then((connection) => {
    broadcast.play(discordTTS.getVoiceStream(`Speaking in this point has ended ${trackedPerson.username}  skip or set another tracker`));
    const dispatcher = connection.play(broadcast);
  });
  hasTracker = false;
};

client.on('message', (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const delimPos = msg.content.indexOf(' ');
  if (delimPos <= 0) {
    msg.reply("There was an error with that command, I'm sorry");
    return;
  }

  const messageContent = msg.content.split(' ').filter(Boolean);
  const command = messageContent[0].slice(prefix.length);
  const trackedPerson = msg.mentions.users.first();
  const timeInMinutes = messageContent[2];

  if (command === 'timeTrack') {
    if (!msg.member.voice.channelID) return msg.reply('you have to be in a room to set a tracker');

    if (hasTracker) return msg.reply('theres a tracker already you need to stop it or wait till its end ');
    try {
      const tracker = setTimeout(() => {
        endTracking(msg, trackedPerson);
      }, +timeInMinutes * 60 * 1000);
      hasTracker = true;
    } catch (err) {
      msg.reply("There was an error with that command, I'm sorry");
      console.log(err);
    }
  }

  // tts(msg.member.voice.channel,msg)
  // msg.member.voice.channel.join()
});

// client.on('ready', async () => {
//   console.log('im online');
//   client.user.setActivity(`${prefix}help`, { type: 'PLAYING' });
//   client.channels.cache.get('870484177173217301').join();
// });

// client.on("voiceStateUpdate", async (oldState,newState) => {
//     if(newState.id === client.user.id ) {
//       if(!newState.voiceChannel) {
//         client.channels.cache.get('870484177173217301').join()
//       }
//     }
//   })

client.login(process.env.Token);
