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
const __dirname = path.resolve();
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}
async function getPrefixs() {
  let prefixs = fs
    .readFileSync(`${__dirname}/prefixs.txt`, "utf-8")
    .split("\n");
  for (const guilds of client.guilds.cache.values()) {
    if (!prefixs.find((p) => p.startsWith(guilds.id))) {
      fs.appendFileSync(`${__dirname}/prefixs.txt`, `${guilds.id}: $\n`);
    }
  }
  prefixs = fs.readFileSync(`${__dirname}/prefixs.txt`, "utf-8").split("\n");
  return prefixs;
}
let prefixList;
client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  prefixList = await getPrefixs();
  
});
client.on("messageCreate", (message) => {
  const prefix = prefixList
    .find((p) => p.startsWith(message.guild.id))
    .split(": ");
  if (message.content.startsWith(prefix[1])) {
    const args = message.content.slice(prefix[1].length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (!command) return;
    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply("There was an error trying to execute that command!");
    }
  }
});

client.login(process.env.token);
