/* eslint-disable @typescript-eslint/no-var-requires */
import { readdirSync } from 'fs';
import path from 'path';

import { REST } from '@discordjs/rest';

import { clientId, guildId, token } from './config.json';

const commands = [];

const commandFiles = readdirSync(path.resolve(__dirname, 'commands')).filter(
  (file) => file.endsWith('.ts')
);

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  if (command.userPermissions) command.data.defaultPermission = false;
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest
  .put(`/applications/${clientId}/guilds/${guildId}/commands`, {
    body: commands,
  })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
