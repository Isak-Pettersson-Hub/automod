export default class Song {
  private _url: string;
  private _title: string;

  public constructor(url?: string, title?: string) {
    this._title = title;
    this._url = url;
  }

  public get title() {
    return this._title;
  }

  public set title(title: string) {
    this._title = title;
  }

  public get url() {
    return this._url;
  }

  public set url(url: string) {
    this._url = url;
  }
}
