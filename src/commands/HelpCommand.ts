import { inlineCode, SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

import Command from '../models/Command';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[] = ['ADMINISTRATOR'];
  public data = new SlashCommandBuilder()
    .setName('help')
    .setDescription("Property 'name' does not exist on type 'Command'.");

  public async execute(interaction) {
    await interaction.reply({ embeds: [await this.embed()] });
  }

  public async embed(): Promise<MessageEmbed> {
    return new MessageEmbed()
      .setAuthor({
        name: `${this.client.user.username} - Help Center`,
        iconURL: this.client.user.displayAvatarURL(),
      })
      .setDescription(
        "Automod is a powerful utility & moderation bot for Hollow's Discord."
      )
      .addField(
        `All commands [${this.client.commands.size}]: `,
        this.client.commands.map((cmd) => inlineCode(cmd.data.name)).join(', ')
      )
      .addField(
        'Links: ',
        '[For more information on the bot visit the Github page.](https://github.com/isakpettersson/automod)'
      )
      .setFooter(
        `Use /help [command] for more information | Total Command - ${this.client.commands.size}`
      );
  }
}
