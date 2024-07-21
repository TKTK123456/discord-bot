import {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  Activity,
  SlashCommandBuilder,
  Partials,
  PermissionsBitField,
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
async function editArrayItem(array, index, newItem) {
  const Array = array
  Array[index] = newItem;
  return Array;
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
  if (
    message.content.toLowerCase().startsWith(`${prefix[1]}setprefix`) ||
    message.content.toLowerCase().startsWith(`${prefix[1]} setprefix`)
  ) {
    if (message.member.permissions.has("Administrator")) {
      const newPrefix = message.content.split(" ")[1];
      if (newPrefix) {
        const prefixLocationInList = prefixList.findIndex((p) =>
          p.startsWith(message.guild.id),
        );
        prefixList[prefixLocationInList] = `${message.guild.id}: ${newPrefix}`;
        fs.writeFileSync(`${__dirname}/prefixs.txt`, prefixList.join("\n"));
        message.reply(`Prefix set to ${newPrefix}`);
        getPrefixs();
      } else {
        message.reply("Please provide a new prefix");
      }
    } else {
      message.reply("You do not have permission to use this command");
    }
  }
});

client.login(process.env.token);
