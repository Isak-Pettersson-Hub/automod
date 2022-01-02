import { Intents } from 'discord.js';

import ApplicationClient from './ApplicationClient';
import Client from './models/Client';

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

// Concrete instantiation of application with client
const applicationClient = new ApplicationClient(client);

// Initialize application with discord client
applicationClient.init();
