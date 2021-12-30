import Observer from '../models/Observer';

export default class ReadyObserver extends Observer {
  public readonly event: string = 'ready';
  public readonly once: boolean = true;

  public update(...args: any[]) {
    this.client.user.setActivity(`automod@1.0.1`, {
      type: 'STREAMING',
      url: 'https://www.youtube.com/watch?v=iik25wqIuFo',
    });
  }
}
