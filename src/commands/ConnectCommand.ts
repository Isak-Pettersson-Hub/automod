import { SlashCommandBuilder } from '@discordjs/builders';
import { VoiceChannel } from 'discord.js';

import Command from '../models/Command';
import GuildMusicManager from '../services/music/GuildMusicManager';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[] = [];
  public data = new SlashCommandBuilder()
    .setName('connect')
    .setDescription('Returns the API latency.')

    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to play the music in.')
        .setRequired(true)
        .addChannelType(2)
    );

  public async execute(interaction) {
    const voiceChannel: VoiceChannel =
      interaction.options.getChannel('channel');

    // Get the user permissions in the voice channel.
    const permissions = voiceChannel.permissionsFor(interaction.user);
    const requredPermission: any = ['CONNECT', 'SPEAK'];

    // Check if the user has the required permission to play music in voice channel.
    for (const permission of requredPermission) {
      if (!permissions.has(permission)) return;
    }

    // Get the server MusicQueue if it exists.
    let guildMusicManager = this.app.queue.get(interaction.guild.id);

    if (!guildMusicManager) {
      guildMusicManager = new GuildMusicManager(interaction.guild);
      this.app.queue.set(interaction.guild.id, guildMusicManager);
    }

    // Connect to voice channel.
    guildMusicManager.connect(voiceChannel);
    interaction.reply(`${this.client.user} has connected to ${voiceChannel}`);
  }
}
