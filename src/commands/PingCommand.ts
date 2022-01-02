import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

import Command from '../models/Command';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[] = [];
  public data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Returns the API latency.');

  public async execute(interaction) {
    await interaction.reply('Pinging ...');
    await interaction.editReply({
      content: null,
      embeds: [await this.embed(Date.now() - interaction.createdTimestamp)],
    });
  }

  public async embed(ping: number): Promise<MessageEmbed> {
    return new MessageEmbed()
      .setTitle('Pong!')
      .addField('Discord API Latency: ', `${this.client.ws.ping} ms`)
      .addField('Command Processing Time: ', `${ping} ms`)
      .setTimestamp();
  }
}
