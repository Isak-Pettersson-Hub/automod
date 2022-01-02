import { Guild } from 'discord.js';

import Observer from '../models/Observer';

export default class ReadyObserver extends Observer {
  public readonly event: string = 'ready';
  public readonly once: boolean = true;

  public fetchGuildRoles(guild: Guild, commandName: string) {
    const permissions = Array.from(this.client.commands.values()).find(
      (command) => command.data.name === commandName
    ).userPermissions;

    if (!permissions) return null;

    return guild.roles.cache.filter(
      (role) => role.permissions.has(permissions) && !role.managed
    );
  }

  public async update() {
    const guild = this.client.guilds.cache.get(process.env.GUILD_ID);
    await guild.commands
      .set(
        Array.from(this.client.commands.values()).map((command) => command.data)
      )
      .then(async (command) => {
        const fullPermissions = command.reduce((accumulator, role) => {
          const roles = this.fetchGuildRoles(guild, role.name);
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
