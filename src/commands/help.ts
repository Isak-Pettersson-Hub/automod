import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  userPermissions: ['BAN_MEMBERS'],
  execute: async (interaction) => {
    interaction.reply({ content: 'hello world!' });
  },
};
