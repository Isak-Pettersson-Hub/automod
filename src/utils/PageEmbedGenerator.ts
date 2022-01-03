import { MessageEmbed } from 'discord.js';

export interface Options {
  title?: string;
  thumbnail?: string;
  description?: string;
  timestamp?: number | Date;
  timeout?: number;
  chunkSize?: number;
  color?: number;
}

export interface Field {
  name: string;
  value: string;
}

export function chunk(list, size) {
  const chunks = [];

  while (list.length) {
    chunks.push(list.splice(0, size));
  }

  return chunks;
}

export function generatePages(fields: Field[], options: Options) {
  const { chunkSize, title, thumbnail, description, timestamp, color } =
    options;

  const chunks = chunk(fields, chunkSize ? chunkSize : 5);

  const embeds = [];

  for (let i = 0; i < chunks.length; i++) {
    const embed = new MessageEmbed()
      .setTitle(title ? title : null)
      .setThumbnail(thumbnail ? thumbnail : null)
      .setTimestamp(timestamp)
      .setColor(color)
      .addFields(chunks[i]);

    if (description) {
      embed.setDescription(description);
    }

    embeds.push(embed);
  }

  return embeds;
}
