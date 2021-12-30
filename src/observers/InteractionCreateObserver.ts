import Client from '../models/Client';
import Observer from '../models/Observer';

export default class ReadyObserver extends Observer {
  public readonly event: string = 'interactionCreate';
  public readonly once: boolean = false;

  public async update(client: Client, interaction) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(client, interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  }
}
