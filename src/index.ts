import { Intents } from 'discord.js';

import ApplicationClient from './ApplicationClient';
import Client from './models/Client';

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Concrete instantiation of application with client
const applicationClient = new ApplicationClient(client);

// Initialize application with discord client
applicationClient.init();
