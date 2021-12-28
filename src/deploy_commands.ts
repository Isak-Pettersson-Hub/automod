/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
import { readdirSync } from 'fs';
import path from 'path';

import { REST } from '@discordjs/rest';

const commands = [];

const commandFiles = readdirSync(path.resolve(__dirname, 'commands')).filter(
  (file) => file.endsWith('.ts')
);

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  if (command.userPermissions) command.data.defaultPermission = false;
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

rest
  .put(
    `/applications/${process.env.CLIENT_ID}/guilds/${process.env.GUILD_ID}/commands`,
    {
      body: commands,
    }
  )
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
