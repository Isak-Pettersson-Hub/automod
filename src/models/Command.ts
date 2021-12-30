import { SlashCommandBuilder } from '@discordjs/builders';

import ApplicationClient from '../ApplicationClient';

import Client from './Client';

export default abstract class Command {
  protected app: ApplicationClient;
  protected client: Client;

  public constructor(app: ApplicationClient, client: Client) {
    this.app = app;
    this.client = client;
  }

  public abstract readonly userPermissions: string[];
  public abstract data: SlashCommandBuilder & any;

  public abstract execute(...args: any[]): void;
}
