import { Client } from 'discord.js';

module.exports = {
  name: 'ready',
  once: true,
  process: async (client: Client) => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user?.setActivity({
      name: 'Bohemian Rhapsody',
      type: 'LISTENING',
      url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    });
  },
};
