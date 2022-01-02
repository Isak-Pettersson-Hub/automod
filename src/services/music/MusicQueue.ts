import MusicQueueConstructor from './MusicQueueConstructor';

export default class MusicQueue {
  private map: Map<string, MusicQueueConstructor>;

  public constructor() {
    this.map = new Map<string, MusicQueueConstructor>();
  }

  /**
   *
   * @description Delete entry in the MusicQueue.
   * @param id of the guild.
   */
  public delete(id: string) {
    this.map.delete(id);
  }

  /**
   *
   * @param id of the guild.
   * @param musicQueueConstructor
   */
  public set(id: string, musicQueueConstructor: MusicQueueConstructor) {
    this.map.set(id, musicQueueConstructor);
  }

  /**
   *
   * @param id of the guild.
   * @returns the MusicQueueConstructor mapped to the guild id.
   */
  public get(id: string) {
    return this.map.get(id);
  }
}
