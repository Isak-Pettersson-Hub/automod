import Observer from '../models/Observer';

export default class ReadyObserver extends Observer {
  public readonly event: string = 'ready';
  public readonly once: boolean = true;

  public update() {
    this.client.user.setActivity(`Hacking NASA with HTML`, {
      type: 'STREAMING',
      url: 'https://www.youtube.com/watch?v=iik25wqIuFo',
    });
  }
}
