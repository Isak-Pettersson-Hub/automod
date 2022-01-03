import { SlashCommandBuilder } from '@discordjs/builders';

import Command from '../models/Command';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[] = [];
  public data = new SlashCommandBuilder()
    .setName('unpause')
    .setDescription('Display the queued songs.');

  public async execute(interaction) {
    const guildMusicManager = this.app.queue.get(interaction.guild.id);

    guildMusicManager.unpause();
  }
}
