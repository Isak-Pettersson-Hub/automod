import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

import Command from '../models/Command';
import Song from '../services/music/Song';
import PageEmbed from '../utils/PageEmbed';
import { generatePages } from '../utils/PageEmbedGenerator';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[] = [];
  public data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Display the queued songs.');

  public async execute(interaction) {
    const guildMusicManager = this.app.queue.get(interaction.guild.id);
    const queue = guildMusicManager?.queue();

    const current = queue.shift();

    if (!queue) return interaction.reply('There is no music queue currently.');

    const pages = generatePages(
      queue
        ? queue.map((song, index) => ({
            name: `${index + 1}. ${song.title} by ${song.artist}`,
            value: song.description,
          }))
        : [],
      {
        thumbnail: current.thumbnail,
        description: `**Playing:${current.title} by ${current.artist}**\n${current.description}`,
        title: 'Music Queue',
        chunkSize: 4,
      }
    );
    console.log(pages);

    //

    new PageEmbed(pages, 60000).init(interaction, this.client);
  }
}
