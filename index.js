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
  ChannelType,
} from "discord.js";
import fs from "node:fs";
import path from "node:path";
import url from "url";
import getPrefixs, { getBotAdminRoles } from "./getCommandStuff.js"
import repl from "repl";
import http from "http";
import open from "open";
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
const __dirname = path.resolve();
client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("name" in command && "execute" in command) {
      client.commands.set(command.name, command.execute);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "name" or "execute" property.`,
      );
    }
  }
}
let prefixList;
let botAdminRoles;
client.on("ready", async () => {
  prefixList = await getPrefixs();
  botAdminRoles = await getBotAdminRoles();
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type !== ChannelType.DM) {
  const prefix = prefixList
    .find((p) => p.startsWith(message.guild.id))
    .split(": ");
  if (message.content.toLowerCase().startsWith(prefix[1])) {
    const args = message.content.slice(prefix[1].length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = message.client.commands.get(commandName);
    if (!command) return;
    try {
      await command(message);
      if (commandName === 'setprefix') {
        prefixList = await getPrefixs();
      }
      if (commandName === 'setbotadminrole') {
        botAdminRoles = await getBotAdminRoles();
      }
    } catch (error) {
      console.error(error);
      message.reply("There was an error trying to execute that command!");
    }
  }
  } else {
    const prefix = '$'
    if (message.content.toLowerCase().startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = message.client.commands.get(commandName);
      if (!command) return;
      if (commandName === 'setprefix'||commandName === 'setbotadminrole') {
        return
      }
      try {
        await command(message);
      } catch (error) {
        console.error(error);
        message.reply("There was an error trying to execute that command!");
      }
    }
  }
});
client.login(process.env.token);
const r = repl.start('$ ');
r.context.client = client;
async function test() {
  try{
  await open('https://sindresorhus.com', {app: {name: 'google chrome', arguments: ['--incognito']}});
  } catch(err) {
    console.log(err);
  }
}
test()