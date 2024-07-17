import { Client, GatewayIntentBits, Collection, Events, Activity, SlashCommandBuilder, Partials } from 'discord.js';
import evilCommands from './evil-commands.js';
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildWebhooks,
  ],
  partials: [Partials.Channel, Partials.Message],
});
const ep = `.`;
const controlGuild = '1222327428366729337';
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})
let evilCommandsLoaded = false
client.on('messageCreate', (message) => {
  if (evilCommandsLoaded) return
  if (message.guild !== null&&message.guildId!=="1222327428366729337") return
  if (message.author.id !== '1072828308376539168') return
  if (message.content.startsWith(`${ep}evil`)) {
  evilCommands()
  evilCommandsLoaded = true
  message.reply(`Evil commands loaded!`)
  }
})


client.login(process.env.token)