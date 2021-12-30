/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
import { readdirSync } from 'fs';
import path from 'path';

import Client from './models/Client';
import Command from './models/Command';
import Observer from './models/Observer';

export default class App {
  private client: Client;

  public constructor(client: Client) {
    this.client = client;
  }

  public async init(...args: any[]) {
    await this.loadObservers();
    await this.loadCommands();

    return this.client.login(process.env.TOKEN);
  }

  public loadObservers(): void {
    const eventFiles = readdirSync(path.resolve(__dirname, './events')).filter(
      (file) => file.endsWith('.ts')
    );

    eventFiles.forEach(async (file) => {
      const module = await import(`./events/${file}`);

      const observer: Observer = new module.default();

      if (observer.once) {
        this.client.once(observer.event, (...args) =>
          observer.update(this.client, ...args)
        );
      } else {
        this.client.on(observer.event, (...args) =>
          observer.update(this.client, ...args)
        );
      }
    });
  }
  public loadCommands(): void {
    const commandFiles = readdirSync(
      path.resolve(__dirname, './commands')
    ).filter((file) => file.endsWith('.ts'));

    for (const file of commandFiles) {
      const module = require(`./commands/${file}`);

      const command: Command = new module.default(this.client);
      // Set a new item in the Collection
      // With the key as the command name and the value as the exported module
      this.client.commands.set(command.data.name, command);

      if (command.userPermissions) command.data.setDefaultPermission(false);
    }
  }
  public getRoles(guild, commandName: string) {
    const permissions = Array.from(this.client.commands.values()).find(
      (command: any) => command.data.name === commandName
    ).userPermissions;

    if (!permissions) return null;

    return guild.roles.cache.filter(
      (role) => role.permissions.has(permissions) && !role.managed
    );
  }

  public async loadPermissions() {
    const guild = this.client.guilds.cache.get(process.env.GUILD_ID);
    await guild.commands
      .set(
        Array.from(this.client.commands.values()).map((command) => command.data)
      )
      .then(async (command) => {
        const fullPermissions = command.reduce((accumulator, role) => {
          const roles = this.getRoles(guild, role.name);
          if (!roles) return accumulator;

          const permissions = roles.reduce((accumulator, role) => {
            return [
              ...accumulator,
              {
                id: role.id,
                type: 'ROLE',
                permission: true,
              },
            ];
          }, []);

          return [
            ...accumulator,
            {
              id: role.id,
              permissions,
            },
          ];
        }, []);
        await guild.commands.permissions.set({
          fullPermissions: fullPermissions,
        });
      });
  }
}
