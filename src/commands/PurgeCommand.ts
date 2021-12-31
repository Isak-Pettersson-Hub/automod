/* eslint-disable @typescript-eslint/no-var-requires */
import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember, Interaction, MessageEmbed, User } from 'discord.js';

const wait = require('util').promisify(setTimeout);

import Command from '../models/Command';

export default class PurgeCommand extends Command {
  public readonly userPermissions: string[] = ['ADMINISTRATOR'];
  public data = new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete messages in the channel.')
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('The amount of messages to clear from channel.')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to clear.')
        .setRequired(false)
    );

  public async execute(interaction) {
    const channel =
      interaction.options.getChannel('channel') || interaction.channel;
    const amount = interaction.options.getInteger('amount');

    await interaction.deferReply();

    for (let i = 0; i < amount; i++) {
      await channel.bulkDelete(1);
    }
  }
}
