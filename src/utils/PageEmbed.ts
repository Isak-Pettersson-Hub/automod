import {
  Client,
  Message,
  MessageEmbed,
  ReactionCollector,
  User,
} from 'discord.js';

interface Field {
  name: string;
  value: string;
}

export default class PageEmbed {
  private currentPage = 0;
  private client: Client;
  private embeds: MessageEmbed[];
  private timeout: number;
  private message: Message;
  private collector: ReactionCollector;

  public constructor(embeds: MessageEmbed[], timeout: number) {
    this.embeds = embeds.map((embed, index) =>
      embed.setFooter(`Page ${index + 1}/${embeds.length}`)
    );
    this.timeout = timeout;
  }

  public async init(interaction, client) {
    this.client = client;
    await interaction.reply({ embeds: [this.embeds[this.currentPage]] });
    this.message = await interaction.fetchReply();

    if (this.embeds.length > 1) {
      await this.message.react('⏮️');
      await this.message.react('◀️');
      await this.message.react('▶️');
      await this.message.react('⏭️');
      await this.message.react('🗑️');

      // Initialize collector
      this.collector = this.message.createReactionCollector({
        filter: this.filter,
        time: this.timeout,
      });

      // Attaching event handlers
      this.collector.on('collect', (reaction, user) =>
        this.onCollectHandler(reaction, user)
      );

      this.collector.on('end', (collected) => this.onEndHandler(collected));
    }
  }

  private loadCurrentPage() {
    this.message.edit({ embeds: [this.embeds[this.currentPage]] });
  }

  private delete() {
    this.collector.stop();
    this.message.delete();
  }

  private updateCurrentPageState(reaction: any) {
    if (reaction.emoji.name == '⏮️') {
      this.currentPage = 0;
      this.loadCurrentPage();
    }
    if (reaction.emoji.name == '⏭️') {
      this.currentPage = this.embeds.length - 1;
      this.loadCurrentPage();
    }
    if (reaction.emoji.name == '◀️' && this.currentPage != 0) {
      this.currentPage -= 1;
      this.loadCurrentPage();
    }

    if (
      reaction.emoji.name == '▶️' &&
      this.currentPage != this.embeds.length - 1
    ) {
      this.currentPage += 1;
      this.loadCurrentPage();
    }

    if (reaction.emoji.name == '🗑️') {
      this.delete();
    }
  }

  private filter(reaction, user): boolean {
    return (
      ['⏮️', '◀️', '▶️', '⏭️', '🗑️'].includes(reaction.emoji.name) &&
      user.id != this.client.user.id
    );
  }

  private onCollectHandler(reaction: any, user: User) {
    this.updateCurrentPageState(reaction);
    reaction.users.remove(user.id);
    console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
  }

  private onEndHandler(collected) {
    console.log(`Collected ${collected.size} items`);
  }
}
