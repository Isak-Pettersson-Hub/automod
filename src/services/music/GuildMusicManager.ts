/* eslint-disable @typescript-eslint/no-explicit-any */
import { getVoiceConnection, VoiceConnection } from '@discordjs/voice';
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { VoiceChannel } from 'discord.js';
import play from 'play-dl';

import Song from './Song';

export default class GuildMusicManager {
  private player: AudioPlayer;
  private channel: VoiceChannel & any;
  private musicQueue: Song[];
  public playing: Song;

  public constructor(channel: VoiceChannel & any) {
    this.player = createAudioPlayer();
    this.musicQueue = [];
    this.channel = channel;
  }

  public queue() {
    return this.musicQueue;
  }

  public async load() {
    this.playing = this.musicQueue.shift();

    if (!this.playing) return this.destroy();

    const { stream, type } = await play.stream(this.playing.url);

    const resource = createAudioResource(stream, {
      inputType: type,
    });

    this.player.play(resource);

    this.connection.subscribe(this.player);

    this.player.on(AudioPlayerStatus.Idle, () => {
      this.musicQueue.shift();
      this.load();
    });
  }

  public async play(song: Song) {
    if (!this.connection) await this.connect(this.channel);

    this.musicQueue.push(song);

    if (!this.playing) {
      await this.load();
    }

    console.log(this.queue());
  }

  public async pause() {
    this.player.pause();
  }

  public async unpause() {
    this.player.unpause();
  }

  public async connect(voiceChannel: any) {
    this.channel = voiceChannel;

    const connection = joinVoiceChannel({
      channelId: this.channel.id,
      guildId: this.channel.guild.id,
      adapterCreator: this.channel.guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log('connection establisheed');
    });

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      console.log('connection disconnected');
    });

    connection.on(VoiceConnectionStatus.Destroyed, () => {
      console.log('connection destoryed');
    });
  }

  public get connection(): VoiceConnection {
    return getVoiceConnection(this.channel.guild.id);
  }

  public destroy() {
    this.connection.destroy();
  }
}
