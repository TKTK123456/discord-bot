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
export default {
  data: new Collection()
  .set('name', 'setprefix')
  .set('description', 'Set a new prefix for the bot'),
  async execute(message) {
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
}