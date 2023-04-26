import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TwitchData} from './TwitchData';

export type RootStackParamList = {
  Search: any;
  Profile: RouteParams;
  Top10: any;
  List: any;
};

export type SearchScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Search'
>;
export type ProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Profile'
>;
export type Top10ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Top10'
>;
export type ListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'List'
>;

export type RouteParams = {
  username: string;
  profile: TwitchData;
  uri: string;
};
