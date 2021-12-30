/* eslint-disable no-unused-vars */
import Client from './Client';

export default abstract class Observer {
  public abstract readonly event: string;
  public abstract readonly once: boolean;
  public abstract update(client: Client, ...args: any[]): void;
}
