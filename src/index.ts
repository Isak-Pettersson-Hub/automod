/* eslint-disable @typescript-eslint/no-var-requires */
// Import the necessary discord.js classes
require('dotenv').config();
import { readdirSync } from 'fs';
import path from 'path';

import { Intents } from 'discord.js';

import Client from './lib/Client';

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Registering event handlers

const eventFiles = readdirSync(path.resolve(__dirname, './events')).filter(
  (file) => file.endsWith('.ts')
);

eventFiles.forEach(async (file) => {
  const event = await import(`./events/${file}`);

  if (event.once) {
    client.once(event.name, (...args) => event.process(client, ...args));
  } else {
    client.on(event.name, (...args) => event.process(client, ...args));
  }
});

const commandFiles = readdirSync(path.resolve(__dirname, 'commands')).filter(
  (file) => file.endsWith('.ts')
);

const arrayOfCommands = [];
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);

  if (['MESSAGE', 'USER'].includes(command?.data.type))
    delete command.data.description;
  if (command.userPermissions) command.data.defaultPermission = false;

  arrayOfCommands.push(command);
}

client.on('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  await guild.commands
    .set(arrayOfCommands.map((command) => command.data))
    .then(async (command) => {
      function getRoles(commandName: string) {
        const permissions = arrayOfCommands.find(
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
