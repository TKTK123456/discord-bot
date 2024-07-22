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
client.login(process.env.token)
const __dirname = path.resolve();
export default async function getPrefixs() {
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
export async function getBotAdminRoles() {
  let roles = fs
    .readFileSync(`${__dirname}/botAdminRoles.txt`, "utf-8")
    .split("\n");
  for (const guilds of client.guilds.cache.values()) {
    if (!roles.find((p) => p.startsWith(guilds.id))) {
      fs.appendFileSync(`${__dirname}/botAdminRoles.txt`, `${guilds.id}: None\n`);
    }
  }
  roles = fs.readFileSync(`${__dirname}/botAdminRoles.txt`, "utf-8").split("\n");
  return roles;
}