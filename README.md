# automod

Discord bot


import { SlashCommandBuilder } from '@discordjs/builders';
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
} from '@discordjs/voice';
import { Guild, MessageEmbed, Permissions, VoiceChannel } from 'discord.js';
import play from 'play-dl';
import ytSearch from 'yt-search';
import ytdl from 'ytdl-core';

import Command from '../models/Command';
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
    )
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
    const query: string = interaction.options.getString('query');

    // Get the user permissions in the voice channel.
    const permissions = voiceChannel.permissionsFor(interaction.user);
    const requredPermission: any = ['CONNECT', 'SPEAK'];

    // Check if the user has the required permission to play music in voice channel.
    for (const permission of requredPermission) {
      if (!permissions.has(permission)) return;
    }

    // Get the server MusicQueue if it exists.
    const server_queue = this.app.queue.get(interaction.guild.id);

    const song = new Song();

    // Check if query is a Youtube video link.
    if (query.startsWith('https') && play.yt_validate(query) === 'video') {
      // YouTube Video Url.

      const song_info = await (await play.video_info(query)).video_details;

      song.title = song_info.title;
      song.url = song_info.url;
    } else {
      // YouTube search.
      const video_finder = async (query) => {
        const videoResult = await ytSearch(query);
        return videoResult.videos.length >= 1 ? videoResult.videos[0] : null;
      };

      const video = await video_finder(query);

      // If there is a video.
      if (video) {
        song.title = video.title;
        song.url = video.url;
      } else {
        throw Error('No videos found.');
      }
    }

    // If there is no server queue for the guild.
    if (!server_queue) {
      const queue_contructor = new GuildMusicManager(
        voiceChannel,
        interaction.channel
      );
      this.app.queue.set(interaction.guild.id, queue_contructor);

      // Enqueue the song to the guild music queue constructor.
      this.app.queue.get(interaction.guild.id).enqueue(song);

      try {
        // Creating a voice connection is simple.
        joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        videoPlayer(
          interaction.guild,
          queue_contructor.dequeue(),
          this.app.queue
        );
      } catch (error) {
        // Delete the entry in the music queue.
        this.app.queue.delete(interaction.guild.id);
        throw error;
      }
    } else {
      server_queue.enqueue(song);
    }
  }
}

const videoPlayer = async (guild: Guild, song: Song, queue: MusicQueue) => {
  const song_queue = queue.get(guild.id);

  if (!song) {
    song_queue.connection.destroy();
    queue.delete(guild.id);
    return;
  }

  const { stream, type } = await play.stream(song.url);
  const resource = createAudioResource(stream, {
    inputType: type,
  });

  const player = createAudioPlayer();
  player.play(resource);

  song_queue.connection.subscribe(player);

  player.on(AudioPlayerStatus.Idle, () => {
    videoPlayer(guild, song_queue.dequeue(), queue);
  });
};
