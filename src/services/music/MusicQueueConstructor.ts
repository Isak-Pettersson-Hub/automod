import { getVoiceConnection, VoiceConnection } from '@discordjs/voice';
import { TextChannel, VoiceChannel } from 'discord.js';

import Song from './Song';

export default class MusicQueueConstructor {
  private voiceChannel: VoiceChannel;
  private textChannel: TextChannel;
  private songs: Song[];

  public constructor(voiceChannel: VoiceChannel, textChannel: TextChannel) {
    this.voiceChannel = voiceChannel;
    this.textChannel = textChannel;
    this.songs = [];
  }

  public get connection(): VoiceConnection {
    return getVoiceConnection(this.voiceChannel.guild.id);
  }

  public enqueue(song: Song) {
    this.songs.push(song);
  }

  public dequeue(): Song {
    return this.songs.shift();
  }

  public get queue(): Song[] {
    return this.songs;
  }
}
