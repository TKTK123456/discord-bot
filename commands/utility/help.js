import {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  Activity,
  SlashCommandBuilder,
  Partials,
  PermissionsBitField,
  RoleFlagsBitField,
  RoleManager,
} from "discord.js";
//import dotenv from "dotenv"
import fs from "node:fs";
import path from "node:path";
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
//dotenv.config()
client.login(process.env.token)
export const name = 'help';
  export const discription = `Command list`;
export async function execute(message) {
  const commands = client.commands
  console.log(commands)
  //message.reply(`Commands: ${commands.join(', ')}`);
}