import { SlashCommandBuilder } from '@discordjs/builders';
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
} from '@discordjs/voice';
import { GuildMember, VoiceChannel } from 'discord.js';
import play from 'play-dl';
import ytSearch from 'yt-search';

import Command from '../models/Command';
import YoutubeSearchAdapter from '../services/YoutubeSearchService';
import GuildMusicManager from '../services/music/GuildMusicManager';
import MusicQueue from '../services/music/MusicQueue';
import Song from '../services/music/Song';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[] = [];
  public data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Returns the API latency.')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('URL of the song.')
        .setRequired(true)
    );
  public async execute(interaction) {
    const member: GuildMember = interaction.member;
    const voiceChannel: any = await member.voice.channel.fetch();
    const query: string = interaction.options.getString('query');

    // Get the song.
    const youtubeSearchAdapter = new YoutubeSearchAdapter();

    let song: Song;

    if (query.startsWith('https') && play.yt_validate(query) === 'video') {
      song = await youtubeSearchAdapter.youtubeByUrl(query);
    } else {
      song = await youtubeSearchAdapter.youtubeSearch(query);
    }

    // Get the server MusicQueue if it exists.
    let guildMusicManager = this.app.queue.get(interaction.guild.id);

    if (!guildMusicManager) {
      guildMusicManager = new GuildMusicManager(voiceChannel);
      this.app.queue.set(interaction.guild.id, guildMusicManager);
    }

    guildMusicManager.play(song);
  }
}
