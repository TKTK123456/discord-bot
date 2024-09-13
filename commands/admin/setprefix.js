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
import dotenv from "dotenv"
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
dotenv.config()
const __dirname = path.resolve();
  export const name = 'setprefix';
  export const discription = `Set's the prefix for the bot`;
export async function execute(message) {
  const botAdminRoles = await getBotAdminRoles();
  const prefixList = await getPrefixs()
    if (message.member.permissions.has("Administrator")||message.member.roles.cache.get(botAdminRoles.find((r) => r.startsWith(message.guild.id)).split(": ")[1])) {
      const newPrefix = message.content.split(" ")[1];
      if (newPrefix) {
        const prefixLocationInList = prefixList.findIndex((p) =>
          p.startsWith(message.guild.id),
        );
        prefixList[prefixLocationInList] = `${message.guild.id}: ${newPrefix}`;
        fs.writeFileSync(`${__dirname}/prefixs.txt`, prefixList.join("\n"));
        message.reply(`Prefix set to ${newPrefix}`);
      } else {
        message.reply("Please provide a new prefix");
      }
    } else {
      message.reply("You do not have permission to use this command");
    }
  }