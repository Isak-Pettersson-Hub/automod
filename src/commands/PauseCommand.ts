import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

import Command from '../models/Command';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[] = [];
  public data = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Display the queued songs.');

  public async execute(interaction) {
    const guildMusicManager = this.app.queue.get(interaction.guild.id);

    guildMusicManager.pause();
  }
}
