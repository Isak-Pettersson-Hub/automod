import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember, Interaction, MessageEmbed, User } from 'discord.js';

import Command from '../models/Command';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[] = ['ADMINISTRATOR'];
  public data = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The target user to ban.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Why is this user being banned?')
        .setRequired(false)
        .setAutocomplete(true)
    );

  public async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason: string =
      interaction.options.getString('reason') ||
      `Ban by ${interaction.user.tag}: No reason was specified`;

    // Getting the guild memebr from user provided
    const member: GuildMember = await interaction.guild.members.fetch(user);

    // Check if user has higher priority than the subject
    if (
      member.permissions.bitfield >= interaction.member.permissions.bitfield
    ) {
      return interaction.reply({
        content: `You are unable to kick ${user} since they have a higher rank than you.`,
      });
    }

    (await user.createDM()).send('You have been banned');
    interaction.guild.members.ban(user);

    await interaction.reply({
      content: `${user} has been banned!`,
    });
  }
}
