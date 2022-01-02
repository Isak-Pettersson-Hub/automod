import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

import Command from '../models/Command';

export default class SupportCommand extends Command {
  public readonly userPermissions: string[] = [];
  public data = new SlashCommandBuilder()
    .setName('support')
    .setDescription(
      'Get an invite to the support server or read the documentation.'
    );

  public async execute(interaction) {
    await interaction.reply({ embeds: [await this.embed(interaction)] });
  }

  public async embed(interaction): Promise<MessageEmbed> {
    return new MessageEmbed()
      .setTitle(`${this.client.user.username} | Support`)
      .setDescription(
        `Hello, ${interaction.user.username}. You may acquire a list of all the current commands available by using the \`help\` command. Here are some links that could be useful if you want additional information.`
      )
      .addFields([
        {
          name: 'Documentation',
          value:
            '[discord.js is a powerful Node.js  module that allows you to interact with the Discord API  very easily.](https://discord.js.org/#/docs/main/stable/class/Interaction)',
        },
        {
          name: 'Github Page',
          value: `[The ${this.client.user.username} source code is documented at Github.](https://github.com/isakpettersson/automod)`,
        },
      ]);
  }
}
