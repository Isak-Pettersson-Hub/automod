import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember, Interaction, MessageEmbed, User } from 'discord.js';

import Command from '../models/Command';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[] = ['ADMINISTRATOR'];
  public data = new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member in your server.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The target user to warn.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Why is this user being warned?')
        .setRequired(false)
        .setAutocomplete(true)
    );

  public async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason: string =
      interaction.options.getString('reason') ||
      `Warned by ${interaction.user.tag}: No reason was specified`;

    // Getting the guild memebr from user provided
    const member: GuildMember = await interaction.guild.members.fetch(user);

    // Check if user has higher priority than the subject
    if (
      member.permissions.bitfield >= interaction.member.permissions.bitfield
    ) {
      return interaction.reply({
        content: `You are unable to warn ${user} since they have a higher rank than you.`,
      });
    }

    (await user.createDM()).send(reason);

    await interaction.reply({
      content: `${user} has been warned!`,
    });
  }
}
