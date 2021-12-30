import { SlashCommandBuilder } from '@discordjs/builders';

import Client from './Client';

export default abstract class Command {
  public abstract readonly userPermissions: string[];
  public abstract data: SlashCommandBuilder;
  public abstract execute(client: Client, interaction): void;
}
