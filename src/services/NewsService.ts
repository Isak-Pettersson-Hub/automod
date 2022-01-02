/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
import NewsAPI from 'ts-newsapi';

export default class NewsService {
  // The field for storing the singleton instance should be
  // declared static.
  private static instance: NewsAPI;

  private constructor() {
    // Some initialization code, such as the actual
    // connection to a database server.
    // ...
  }

  // The static method that controls access to the singleton
  // instance.
  public static getInstance() {
    if (NewsService.instance == null) {
      NewsService.instance = new NewsAPI(process.env.NEWS_API_KEY);
    }

    return NewsService.instance;
  }

  // Finally, any singleton should define some business logic
  // which can be executed on its instance.
  public getSources = NewsService.instance.getSources;
  public getEverything = NewsService.instance.getEverything;
  public getTopHeadlines = NewsService.instance.getTopHeadlines;
}
