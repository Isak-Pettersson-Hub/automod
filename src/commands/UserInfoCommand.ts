import { SlashCommandBuilder } from '@discordjs/builders';
import {
  GuildMember,
  Message,
  MessageEmbed,
  Permissions,
  User,
} from 'discord.js';

import { permissions } from '../config.json';
import Command from '../models/Command';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[] = [];
  public data = new SlashCommandBuilder()
    .setName('user')
    .setDescription(
      'Get information about a user. Avatar, age, permissions and ID.'
    )
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('The target user to get information about.')
        .setRequired(true)
    );

  public async execute(interaction) {
    const user: User = interaction.options.getUser('target');
    const member: GuildMember = await this.client.guilds.cache
      .get(interaction.guildId)
      .members.fetch(user.id);
    await interaction.reply({ embeds: [await this.embed(member)] });
  }

  public capitailize(s: string) {
    return s.toLowerCase().replace(/\b./g, function (a) {
      return a.toUpperCase();
    });
  }

  public async embed(guildMember: GuildMember): Promise<MessageEmbed> {
    return new MessageEmbed()
      .setAuthor({
        name: guildMember.user.tag,
        iconURL: guildMember.user.displayAvatarURL(),
      })
      .setDescription(`${guildMember.user}`)
      .addField(
        '__Joined__',
        `${guildMember.joinedAt.toUTCString()} (Coordinated Universal Time)`
      )
      .addField(
        '__Registered__',
        `${guildMember.user.createdAt.toUTCString()} (Coordinated Universal Time)`
      )
      .addField(
        `__Roles__ [${guildMember.roles.cache.size}]`,
        guildMember.roles.cache.map((role) => role).join(', ')
      )
      .addField(
        `__Permissions__ [${
          permissions.filter((permission: any) =>
            guildMember.permissions.has(permission)
          ).length
        }]`,
        permissions
          .filter((permission: any) => guildMember.permissions.has(permission))
          .map((permission) => permission.replace(/_/gi, ' '))
          .map((permission) => this.capitailize(permission))
          .join(', ')
      )

      .setFooter(`ID: ${guildMember.user.id}`)
      .setTimestamp();
  }
}
