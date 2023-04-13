export interface TwitchAllData {
  id?: string;
  login?: string;
  display_name?: string;
  type?: string;
  broadcaster_type?: string;
  description?: string;
  profile_image_url?: string;
  offline_image_url?: string;
  view_count?: number;
  created_at?: string;
  color?: string;
  channel?: Channel;
  chatstate?: Chatstate[];
  stream?: Stream;
  soundtrack?: null;
  schedule?: null;
  badges?: Badge[];
  emotes?: Emote[];
  videos?: Video[];
  clips?: Clip[];
}

export interface Badge {
  set_id?: string;
  versions?: Version[];
}

export interface Version {
  id?: string;
  image_url_1x?: string;
  image_url_2x?: string;
  image_url_4x?: string;
  title?: string;
  description?: string;
  click_action?: string;
  click_url?: null | string;
}

export interface Channel {
  broadcaster_id?: string;
  broadcaster_login?: string;
  broadcaster_name?: string;
  broadcaster_language?: string;
  game_id?: string;
  game_name?: string;
  title?: string;
  delay?: number;
  tags?: string[];
  follows?: number;
}

export interface Chatstate {
  broadcaster_id?: string;
  slow_mode?: boolean;
  slow_mode_wait_time?: null;
  follower_mode?: boolean;
  follower_mode_duration?: number;
  subscriber_mode?: boolean;
  emote_mode?: boolean;
  unique_chat_mode?: boolean;
}

export interface Clip {
  id?: string;
  url?: string;
  embed_url?: string;
  broadcaster_id?: string;
  broadcaster_name?: string;
  creator_id?: string;
  creator_name?: string;
  video_id?: string;
  game_id?: string;
  language?: string;
  title?: string;
  view_count?: number;
  created_at?: string;
  thumbnail_url?: string;
  duration?: number;
  vod_offset?: null;
}

export interface Emote {
  id?: string;
  name?: string;
  images?: Images;
  tier?: string;
  emote_type?: string;
  emote_set_id?: string;
  format?: string[];
  scale?: string[];
  theme_mode?: string[];
}

export interface Images {
  url_1x?: string;
  url_2x?: string;
  url_4x?: string;
}

export interface Stream {
  id?: string;
  user_id?: string;
  user_login?: string;
  user_name?: string;
  game_id?: string;
  game_name?: string;
  type?: string;
  title?: string;
  viewer_count?: number;
  started_at?: string;
  language?: string;
  thumbnail_url?: string;
  tag_ids?: any[];
  tags?: string[];
  is_mature?: boolean;
}

export interface Video {
  id?: string;
  stream_id?: string;
  user_id?: string;
  user_login?: string;
  user_name?: string;
  title?: string;
  description?: string;
  created_at?: string;
  published_at?: string;
  url?: string;
  thumbnail_url?: string;
  viewable?: string;
  view_count?: number;
  language?: string;
  type?: string;
  duration?: string;
  muted_segments?: null;
}

export interface TwitchTopGames {
  id?: string;
  name?: string;
  box_art_url?: string;
  igdb_id?: string;
}

export interface TwitchTopGameStreams {
  id?: string;
  name?: string;
  box_art_url?: string;
  igdb_id?: string;
  streams?: Stream[];
}
