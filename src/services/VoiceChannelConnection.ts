/* eslint-disable @typescript-eslint/no-explicit-any */
import { getVoiceConnection } from '@discordjs/voice';
import { joinVoiceChannel, VoiceConnection } from '@discordjs/voice';
import { VoiceChannel } from 'discord.js';

export default class VoiceChannelConnection {
  private channel: VoiceChannel & any;

  public constructor(channel: VoiceChannel) {
    this.channel = channel;
  }

  public connect(): VoiceConnection {
    return joinVoiceChannel({
      channelId: this.channel.id,
      guildId: this.channel.guild.id,
      adapterCreator: this.channel.guild.voiceAdapterCreator,
    });
  }
  public disconnect(): boolean {
    return this.connection().disconnect();
  }

  public destroy() {
    this.connection().destroy();
  }

  public connection(): VoiceConnection {
    return getVoiceConnection(this.channel.guild.id);
  }
}
