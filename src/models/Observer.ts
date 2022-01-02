/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import ApplicationClient from '../ApplicationClient';

import Client from './Client';

export default abstract class Observer {
  protected app: ApplicationClient;
  protected client: Client;

  public constructor(app: ApplicationClient, client: Client) {
    this.app = app;
    this.client = client;
  }
  public abstract readonly event: string;
  public abstract readonly once: boolean;
  public abstract update(...args: any[]): void;
}
