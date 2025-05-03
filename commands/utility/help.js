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
  EmbedBuilder,
} from "discord.js";
//import dotenv from "dotenv"
import fs from "node:fs";
import path from "node:path";
import getPrefixs, { getBotAdminRoles } from "../../getCommandStuff.js"
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
const __dirname = path.resolve();
client.login(process.env.token)
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
const thisFilePath = path.join(__dirname, "commands/utility/help.js")

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    if (filePath !== thisFilePath) {
    const command = await import(filePath); 
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("name" in command && "discription" in command) {
      client.commands.set(command.name, command.discription);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "name" or "execute" property.`,
      );
    }
    } else {
      client.commands.set('help', 'Command list')
    }
  }
}
export const name = 'help';
  export const discription = `Command list`;
export async function execute(message) {
  const botAdminRoles = await getBotAdminRoles();
  const commands = []
    client.commands.forEach((command, key) => {
    commands.push(`${key[0].toUpperCase()}${key.slice(1)} - ${command}`);
  })
  const commandList = commands.join("\n");
  message.channel.send(`Command list:\n${commandList}`);
}