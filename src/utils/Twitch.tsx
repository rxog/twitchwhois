import axios, {AxiosInstance} from 'axios';
import {
  TwitchData,
  TwitchTopGameStreams,
  TwitchTopGames,
} from '../types/TwitchData';
import {getUserAgentSync} from 'react-native-device-info';

export default class Twitch {
  static readonly API: AxiosInstance = axios.create({
    baseURL: 'https://twitchwhois-backend.vercel.app/api/',
  });

  static async getAllData(username: string): Promise<TwitchData | null> {
    try {
      const twitchUser = await this.API.get(`getalldata/${username}`);
      return twitchUser.data;
    } catch (err) {
      return null;
    }
  }

  static async topGames(): Promise<TwitchTopGames[] | null> {
    try {
      const response = await this.API.get('topgames/10');
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async topGameStreams(): Promise<TwitchTopGameStreams[] | null> {
    try {
      const response = await this.API.get('topgamestreams/5');
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async getStreams(game_id: string): Promise<any> {
    try {
      const response = await this.API.get(`topgames/${game_id}`);
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async isAvailable(
    username: string,
    signal?: AbortSignal,
  ): Promise<number> {
    try {
      const result = await axios.get(
        `https://passport.twitch.tv/usernames/${username}`,
        {
          validateStatus: () => true,
          headers: {
            'User-Agent': getUserAgentSync(),
          },
          signal,
        },
      );
      switch (result.status) {
        case 200:
          return 0;
        case 204:
          return 1;
        default:
          throw new TypeError('Não foi dessa vez!');
      }
    } catch (err) {
      return -1;
    }
  }
}
