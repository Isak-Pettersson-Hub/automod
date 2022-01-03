import play from 'play-dl';
import ytSearch from 'yt-search';

import Song from './music/Song';

export default class YoutubeSearchAdapter {
  public async youtubeByUrl(url: string): Promise<Song> {
    const data = await play.video_info(url);

    return new Song({
      title: data.video_details.title,
      url: data.video_details.url,
      thumbnail: data.video_details.thumbnails[0].url,
      description: data.video_details.description,
      artist: data.video_details.channel.name,
    });
  }
  public async youtubeSearch(query: string): Promise<Song> {
    const data = await (await ytSearch(query)).videos[0];
    return new Song({
      title: data.title,
      url: data.url,
      thumbnail: data.thumbnail,
      description: data.description,
      artist: data.author.name,
    });
  }
}
