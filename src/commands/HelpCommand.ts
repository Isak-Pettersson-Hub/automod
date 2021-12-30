import { SlashCommandBuilder } from '@discordjs/builders';

import Client from '../models/Client';
import Command from '../models/Command';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[];
  public data = new SlashCommandBuilder()
    .setName('help')
    .setDescription("Property 'name' does not exist on type 'Command'.");

  public async execute(client: Client, interaction) {
    await interaction.reply({ content: 'Testing command pattern' });
  }
}
