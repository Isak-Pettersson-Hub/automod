import { MessageEmbed } from 'discord.js';

import Observer from '../models/Observer';

export default class ReadyObserver extends Observer {
  public readonly event: string = 'guildMemberAdd';
  public readonly once: boolean = false;

  public async update(member) {
    (await member.user.createDM()).send({
      content: `Hello and welcome to the Hollow's Discord Server! \nPlease take a moment to review the rules in ${await this.client.channels.fetch(
        '923567688201170995'
      )} and don't forget to assign yourself a role in ${await this.client.channels.fetch(
        '923567425260228628'
      )} as you cannot use the text or voice channels until you do, if you have any further rquestions, simply message this bot back to send a mod mail to the server staff!`,
      embeds: [await this.embed()],
    });
  }

  public async embed() {
    return new MessageEmbed()
      .setTitle('Guild Information')
      .setDescription(
        'You cound add some information fere for huild members to view!'
      )
      .addField(
        'Message Formatting',
        'Checkout this link for more details on formatting message embeds: [https://discordjs.guide/popular-topics/embeds.html#embed-preview](https://discordjs.guide/popular-topics/embeds.html#embed-preview).'
      )
      .addField(
        'Setting up Slash Commands',
        'Check out the README for this bot on Automod for help setting up slash commands: [https://github.com/isakpettersson/automod](https://github.com/isakpettersson/automod)'
      );
  }
}
