/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
import { readdirSync } from 'fs';
import path from 'path';

import { Intents } from 'discord.js';

import Client from './models/Client';
import Command from './models/Command';
import Observer from './models/Observer';

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Registering event handlers

const eventFiles = readdirSync(path.resolve(__dirname, './observers')).filter(
  (file) => file.endsWith('.ts')
);

eventFiles.forEach(async (file) => {
  const module = await import(`./observers/${file}`);

  const observer: Observer = new module.default();

  if (observer.once) {
    client.once(observer.event, (...args) => observer.update(client, ...args));
  } else {
    client.on(observer.event, (...args) => observer.update(client, ...args));
  }
});

const commandFiles = readdirSync(path.resolve(__dirname, './commands')).filter(
  (file) => file.endsWith('.ts')
);

for (const file of commandFiles) {
  const module = require(`./commands/${file}`);

  const command: Command = new module.default(client);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);

  if (command.userPermissions) command.data.setDefaultPermission(false);
}

client.on('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  await guild.commands
    .set(Array.from(client.commands.values()).map((command) => command.data))
    .then(async (command) => {
      function getRoles(commandName: string) {
        const permissions = Array.from(client.commands.values()).find(
          (command) => command.data.name === commandName
        ).userPermissions;

        if (!permissions) return null;

        return guild.roles.cache.filter(
          (role) => role.permissions.has(permissions) && !role.managed
        );
      }
      const fullPermissions = command.reduce((accumulator, role) => {
        const roles = getRoles(role.name);
        if (!roles) return accumulator;

        const permissions = roles.reduce((accumulator, role) => {
          return [
            ...accumulator,
            {
              id: role.id,
              type: 'ROLE',
              permission: true,
            },
          ];
        }, []);

        return [
          ...accumulator,
          {
            id: role.id,
            permissions,
          },
        ];
      }, []);
      await guild.commands.permissions.set({
        fullPermissions: fullPermissions,
      });
    });
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);
