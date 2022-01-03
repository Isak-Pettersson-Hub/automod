import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

import Command from '../models/Command';
import Song from '../services/music/Song';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[] = [];
  public data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Display the queued songs.');

  public async execute(interaction) {
    const guildMusicManager = this.app.queue.get(interaction.guild.id);
    const queue = guildMusicManager?.queue();

    if (!queue) return interaction.reply('There is no music queue currently.');

    interaction.reply({ embeds: [this.embed(queue)] });
  }

  public embed(queue: Song[]) {
    return new MessageEmbed().setTitle('Music Queue').setFields(
      queue.map((song, index) => ({
        name: `${index}. ${song.title}`,
        value: 'By: ' + song.description,
      }))
    );
  }
}
