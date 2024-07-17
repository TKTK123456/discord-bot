import { Client, GatewayIntentBits, Collection, Events, Activity, SlashCommandBuilder, Partials, PermissionsBitField, PermissionOverwrites, PartialGroupDMChannel } from 'discord.js';
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
export default async function evilCommands() {
  client.login(process.env.token)
  console.log(`Evil commands loaded`)
}
client.on('messageCreate', (message) => {
  if (message.guild !== null&&message.guildId!=="1222327428366729337") return
  if (message.author.id !== '1072828308376539168') return
  console.log(`It's in the control guild/in a dm and by the owner!`)
})