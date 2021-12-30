import Client from '../models/Client';
import Observer from '../models/Observer';

export default class ReadyObserver extends Observer {
  public readonly event: string = 'ready';
  public readonly once: boolean = true;

  public update(client: Client) {
    client.user.setActivity(`automod@1.0.1`, {
      type: 'STREAMING',
      url: 'https://www.twitch.tv/bugha',
    });
  }
}
