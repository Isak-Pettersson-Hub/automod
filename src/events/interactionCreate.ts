import Client from '../lib/Client';

module.exports = {
  name: 'interactionCreate',
  once: false,
  process: async (client: Client, interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    if (interaction.memberPermissions.has(command.userPermissions || []))
      return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  },
};
