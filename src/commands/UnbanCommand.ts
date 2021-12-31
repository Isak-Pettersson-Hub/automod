import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember, Interaction, MessageEmbed, User } from 'discord.js';

import Command from '../models/Command';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[] = [];
  public data = new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Ban a member from the server.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The target user to ban.')
        .setRequired(true)
    );

  public async execute(interaction) {
    const user = interaction.options.getUser('user');
    interaction.guild.members.unban(user);

    await interaction.reply({
      content: `${user} has been unbanned.`,
    });
  }
}
