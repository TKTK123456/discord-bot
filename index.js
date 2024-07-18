import { Client, GatewayIntentBits, Collection, Events, Activity, SlashCommandBuilder, Partials } from 'discord.js';
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildWebhooks,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User],
});
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})


client.login(process.env.token)