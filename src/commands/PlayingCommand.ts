import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

import Command from '../models/Command';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[] = [];
  public data = new SlashCommandBuilder()
    .setName('playing')
    .setDescription('Returns the API latency.');

  public async execute(interaction) {
    const guildMusicManager = this.app.queue.get(interaction.guild.id);

    if (!guildMusicManager.playing)
      return interaction.reply(
        'There is currently no song that is being played.'
      );

    const { artist, title, description, url, thumbnail, requestedBy } =
      guildMusicManager.playing;

    const embed = new MessageEmbed()
      .setTitle('Now Playing')
      .setDescription(`[${title}](${url})\n${description}`)
      .setThumbnail(thumbnail)
      .setFooter({
        text: `Requested by ${requestedBy.tag}`,
        iconURL: requestedBy.displayAvatarURL(),
      });

    interaction.reply({ embeds: [embed] });
  }
}
