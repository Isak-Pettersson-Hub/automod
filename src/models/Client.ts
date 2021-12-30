import Discord, { Collection } from 'discord.js';

export default class Client extends Discord.Client {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public commands = new Collection<any, any>();
}
