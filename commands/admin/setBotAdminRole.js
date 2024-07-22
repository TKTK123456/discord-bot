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
const __dirname = path.resolve();
export const name = 'setbotadminrole';
  export const discription = `Set's the bot admin role`;
export async function execute(message) {
  const botAdminRoles = await getBotAdminRoles();
  const prefixList = await getPrefixs()
    if (message.member.permissions.has("Administrator")||message.member.roles.cache.get(botAdminRoles.find((r) => r.startsWith(message.guild.id)).split(": ")[1])) {
      const newRole = message.content.split(" ")[1].replace("<@&", "").replace(">", "");
      if (newRole) { 
        const roleLocationInList = botAdminRoles.findIndex((p) =>
          p.startsWith(message.guild.id),
        );
        botAdminRoles[roleLocationInList] = `${message.guild.id}: ${newRole}`;
        fs.writeFileSync(`${__dirname}/botAdminRoles.txt`, botAdminRoles.join("\n"));
        message.reply(`Bot admin role set to <@&${newRole}>`);
      } else {
        message.reply("Please provide a new bot admin role");
      }
    } else {
      message.repy("You do not have permission to use this command");
    }
}