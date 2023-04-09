import axios, {AxiosInstance} from 'axios';
import {merge} from 'lodash';
import {CLIENT_ID, CLIENT_SECRET} from '@env';

type TokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

type UserData = {
  broadcaster_type?: string;
  created_at?: string;
  description?: string;
  display_name?: string;
  id?: string;
  login?: string;
  offline_image_url?: string;
  profile_image_url?: string;
  type?: string;
  view_count?: number;
};

type ChannelData = {
  follows?: number;
  broadcaster_id?: string;
  broadcaster_login?: string;
  broadcaster_name?: string;
  broadcaster_language?: string;
  game_id?: string;
  game_name?: string;
  title?: string;
  delay?: number;
  tags?: string[];
};

type StreamData = {
  id?: string;
  user_id?: string;
  user_login?: string;
  user_name?: string;
  game_id?: string;
  game_name?: string;
  type?: string;
  title?: string;
  tags?: string[];
  viewer_count?: number;
  started_at?: string;
  language?: string;
  thumbnail_url?: string;
  tag_ids?: string[];
  is_mature?: boolean;
};

interface AllUserData extends UserData, ChannelData, StreamData {}

class TwitchAPI {
  private readonly API_HELIX: AxiosInstance;
  private token: string | null = null;
  private tokenExpirationTime: number | null = null;

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {
    this.API_HELIX = axios.create({
      baseURL: 'https://api.twitch.tv/helix/',
      headers: {
        'Client-Id': clientId,
      },
    });
  }

  private async getToken(): Promise<string | null> {
    try {
      if (this.token !== null && this.tokenExpirationTime !== null) {
        // Check if the token is still valid
        const now = Date.now();
        if (now < this.tokenExpirationTime) {
          return this.token;
        }
      }

      const response = await axios.post<TokenResponse>(
        'https://id.twitch.tv/oauth2/token',
        null,
        {
          params: {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'client_credentials',
          },
        },
      );

      this.token = response.data.access_token;
      this.tokenExpirationTime = Date.now() + response.data.expires_in * 1000;

      return this.token;
    } catch (err) {
      return null;
    }
  }

  public async getUser(username: string): Promise<UserData | null> {
    try {
      const token = await this.getToken();

      const response = await this.API_HELIX.get('users', {
        params: {login: username},
        headers: {Authorization: `Bearer ${token}`},
      });

      return response.data.data[0] ?? null;
    } catch (err) {
      return null;
    }
  }

  public async getFollows(userId: string): Promise<number | null> {
    try {
      const token = await this.getToken();
      const response = await this.API_HELIX.get('users/follows', {
        params: {
          to_id: userId,
          first: 1,
        },
        headers: {Authorization: `Bearer ${token}`},
      });

      return response.data.total ?? null;
    } catch (err) {
      return null;
    }
  }

  public async getChannel(userId: string): Promise<ChannelData | null> {
    try {
      const token = await this.getToken();
      const response = await this.API_HELIX.get('channels', {
        params: {broadcaster_id: userId},
        headers: {Authorization: `Bearer ${token}`},
      });
      const follows = await this.getFollows(userId);
      if (follows) {
        return merge(response.data.data[0], {follows});
      }

      return response.data.data[0] ?? null;
    } catch (err) {
      return null;
    }
  }

  public async getStream(userId: string): Promise<StreamData | null> {
    try {
      const token = await this.getToken();
      const response = await this.API_HELIX.get('streams', {
        params: {user_id: userId},
        headers: {Authorization: `Bearer ${token}`},
      });

      return response.data.data[0] ?? null;
    } catch (err) {
      return null;
    }
  }

  public async getAllData(username: string): Promise<AllUserData | null> {
    try {
      const userdata = await this.getUser(username);
      if (!userdata || !userdata.id) {
        throw new TypeError('Não foi possivel encontrar este usuário');
      }
      delete userdata.type;
      const channeldata = await this.getChannel(userdata.id);
      if (!channeldata) {
        return userdata;
      }
      const streamdata = await this.getStream(userdata.id);
      if (!streamdata) {
        return merge(userdata, channeldata);
      }
      delete streamdata.id;
      return merge(channeldata, streamdata, userdata);
    } catch (err) {
      return null;
    }
  }

  public async isAvailable(
    username: string,
    signal?: AbortSignal,
  ): Promise<number> {
    try {
      const result = await axios.get(
        `https://passport.twitch.tv/usernames/${username}`,
        {
          validateStatus: () => true,
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

export default new TwitchAPI(CLIENT_ID, CLIENT_SECRET);
