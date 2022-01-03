import { User } from 'discord.js';
export default class Song {
  public readonly title: string;
  public readonly url: string;
  public readonly thumbnail: string;
  public readonly description: string;
  public readonly artist: string;
  public requestedBy: User;

  public constructor(options: SongOptions) {
    this.title = options.title;
    this.url = options.url;
    this.thumbnail = options.thumbnail;
    this.description = options.description;
    this.artist = options.artist;
    this.requestedBy = options.user;
  }
}

interface SongOptions {
  title: string;
  url: string;
  user?: User;
  thumbnail?: string;
  description?: string;
  artist?: string;
}
