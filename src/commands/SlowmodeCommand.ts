import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember, Interaction, MessageEmbed, User } from 'discord.js';

import Command from '../models/Command';

export default class SlowmodeCommand extends Command {
  public readonly userPermissions: string[] = ['ADMINISTRATOR'];
  public data = new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode in a channel.')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to slow down.')
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('seconds')
        .setDescription('Time in seconds')
        .setRequired(true)
    );

  public async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const seconds = interaction.options.getInteger('seconds');

    await channel.setRateLimitPerUser(seconds, 'reason');
    await interaction.reply('Command is under construction!');
  }
}
