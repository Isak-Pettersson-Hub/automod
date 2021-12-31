import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember, Interaction, MessageEmbed, User } from 'discord.js';

import Command from '../models/Command';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[] = ['ADMINISTRATOR'];
  public data = new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server.')
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('The target member to kick.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Why is this user being kicked?')
        .setRequired(false)
        .setAutocomplete(true)
    );

  public async execute(interaction) {
    const member = interaction.options.getMember('member');
    const reason: string =
      interaction.options.getString('reason') ||
      `Kicked by ${interaction.user.tag}: No reason was specified`;

    if (
      member.permissions.bitfield >= interaction.member.permissions.bitfield
    ) {
      return interaction.reply({
        content: `You are unable to kick ${member.user} since they have a higher rank than you.`,
      });
    }

    (await member.user.createDM()).send('You have been kicked.');
    member.kick(reason);

    interaction.reply({ content: `${member.user} has been kicked!` });
  }
}
