/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
import { readdirSync } from 'fs';
import path from 'path';

import { AudioPlayer, createAudioPlayer } from '@discordjs/voice';

import Client from './models/Client';
import Command from './models/Command';
import Observer from './models/Observer';
import NewsService from './services/NewsService';
import MusicQueue from './services/music/MusicQueue';

export default class ApplicationClient {
  private client: Client;
  private newsApi: NewsService = NewsService.getInstance();

  // Public services and API's
  public newsapi: NewsService = NewsService.getInstance();
  public queue: MusicQueue;

  public constructor(client: Client) {
    this.queue = new MusicQueue();
    this.client = client;
  }

  public init() {
    this.loadObservers();
    this.loadCommands();

    return this.client.login(process.env.TOKEN);
  }

  public loadObservers(): void {
    const eventFiles = readdirSync(
      path.resolve(__dirname, './observers')
    ).filter((file) => file.endsWith('.ts'));

    eventFiles.forEach(async (file) => {
      const module = await import(`./observers/${file}`);

      const observer: Observer = new module.default(this, this.client);

      if (observer.once) {
        this.client.once(observer.event, (...args) => observer.update(...args));
      } else {
        this.client.on(observer.event, (...args) => observer.update(...args));
      }
    });
  }
  public loadCommands(): void {
    const commandFiles = readdirSync(
      path.resolve(__dirname, './commands')
    ).filter((file) => file.endsWith('.ts'));

    for (const file of commandFiles) {
      const module = require(`./commands/${file}`);

      const command: Command = new module.default(this, this.client);

      // Set a new item in the Collection
      // With the key as the command name and the value as the exported module
      this.client.commands.set(command.data.name, command);

      if (command.userPermissions) command.data.setDefaultPermission(false);
    }
  }
}
