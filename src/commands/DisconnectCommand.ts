import { SlashCommandBuilder } from '@discordjs/builders';
import { VoiceChannel } from 'discord.js';

import Command from '../models/Command';
import GuildMusicManager from '../services/music/GuildMusicManager';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[] = [];
  public data = new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Returns the API latency.');

  public async execute(interaction) {
    // Get the server MusicQueue if it exists.
    let guildMusicManager = this.app.queue.get(interaction.guild.id);

    if (!guildMusicManager) {
      guildMusicManager = new GuildMusicManager(interaction.guild);
      this.app.queue.set(interaction.guild.id, guildMusicManager);
    }

    guildMusicManager.destroy();

    // Connect to voice channel.
    interaction.reply(`${this.client.user} has disconnected.`);
  }
}
