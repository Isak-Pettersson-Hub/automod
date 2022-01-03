import { SlashCommandBuilder } from '@discordjs/builders';
import { Message, MessageEmbed, ReactionCollector, User } from 'discord.js';

import Command from '../models/Command';
import PageEmbed from '../utils/PageEmbed';
import { generatePages } from '../utils/PageEmbedGenerator';

export default class HelpCommand extends Command {
  public readonly userPermissions: string[] = ['ADMINISTRATOR'];
  public data = new SlashCommandBuilder()
    .setName('news')
    .setDescription('Kick a member from the server.');

  public async execute(interaction) {
    const news = await this.app.newsapi.getTopHeadlines({
      pageSize: 5,
      q: 'tesla',
    });

    const pages = generatePages(
      [
        {
          name: 'https://www.ufc.com/\nUFC.com: The Official Home of Ultimate Fighting Championship',
          value:
            'The official home of Ultimate Fighting Championship. Enjoy the latest breaking news, fights, behidn-the-scenes access and more.',
        },
        {
          name: 'https://www.instagram.com/ufc/\nUFC (@ufc) • Instagram photos and videos',
          value: `30.3m Followers, 830 Following, 24.6k Posts - See Instagram photos and videos from UFC (@ufc).`,
        },
        {
          name: 'https://www.instagram.com/ufc/\nUFC (@ufc) • Instagram photos and videos',
          value: `The Ultimate Fighting Championship (UFC) is an American mixed martial arts (MMA) promotion company based in Las Vegas, Nevada. The UFC is owned and operated ...`,
        },
        {
          name: 'https://ufcfightpass.com/\nUFC Fight Pass',
          value: `Unlock MORE of your inner combat sports fan with UFC Fight Pass! Fighting is what we live for. And no one brings you MORE live fights, new shows, and events ...`,
        },
        {
          name: 'https://www.ufc.com/events\nUFC Fight Cards, Watch Times, Live Stats',
          value:
            'Find the latest UFC event schedule, watch information, fight cards, start times, and broadcast details.',
        },
        {
          name: 'https://www.instagram.com/ufc/\nUFC Schedule 2021 | ESPN',
          value: `Ultimate Fighting Championship (UFC) has 12 upcoming event(s), with the next one to be held in UFC Apex, Las Vegas, Nevada, United States.`,
        },
        {
          name: 'https://www.espn.com/mma/fightcenter\nUFC Fight Night: Kattar vs. Chikadze | ESPN FightCenter',
          value: `Details about UFC Fight Night: Kattar vs. Chikadze including fighter profiles, schedule, and where to watch.`,
        },
        {
          name: 'https://www.foxsports.com/ufc/results\nUFC Fight Results | FOX Sports',
          value: `UFC Fight Night - Lewis vs. Daukas 2021:UFC Fight Results. Saturday, December 18 - Final Las Vegas, Nevada UFC Apex. Heavyweight - Title Match.`,
        },
      ],
      {
        title: 'Playing Black out Days (Slowed & Reverb)',
        description: 'https://www.youtube.com/watch?v=LgLU0NlmQZM',
        thumbnail:
          'https://cdn.dribbble.com/users/289158/screenshots/16037714/media/d2de0bfb56a63fbf7b2db9954128777e.jpg?compress=1&resize=800x600',
      }
    );

    const pageEmbed = new PageEmbed(pages, 60000);

    pageEmbed.init(interaction, this.client);
  }
}
