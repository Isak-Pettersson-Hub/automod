/* eslint-disable @typescript-eslint/no-var-requires */
import { WalletImportFormatError } from '@bitauth/libauth';
import { SlashCommandBuilder } from '@discordjs/builders';

import Command from '../models/Command';

const wait = require('util').promisify(setTimeout);

export default class PurgeCommand extends Command {
  public readonly userPermissions: string[] = ['ADMINISTRATOR'];
  public data = new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete messages in the channel.')
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('The amount of messages to clear from channel.')
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

    await channel.bulkDelete(amount);

    await interaction.reply(`Removed ${amount} of messages from ${channel}`);
    await wait(2000);
    interaction.deleteReply();
  }
}
