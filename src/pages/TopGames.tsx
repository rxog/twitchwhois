/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  ActivityIndicator,
  Divider,
  Headline,
  Text,
  Title,
  useTheme,
} from 'react-native-paper';
import {
  View,
  Pressable,
  FlatList,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import Twitch from '@/utils/TwitchAPI';
import {TwitchTopGameStreams} from '@/utils/types/TwitchData';
import Icon from '@/components/Icon';
import Fonts from './Styles/Fonts';
import {useNavigation} from '@react-navigation/native';

export default function TopGamesPage(): JSX.Element {
  const {colors} = useTheme();
  const navigation = useNavigation<any>();
  const [games, setGames] = React.useState<TwitchTopGameStreams[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const getData = () =>
    Twitch.topGameStreams()
      .then(setGames)
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });

  React.useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    );
  }

  return (
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            getData();
          }}
        />
      }
      style={{
        marginTop: 10,
      }}
      data={games}
      ListHeaderComponent={() => (
        <View
          style={{
            padding: 10,
          }}>
          <Headline
            style={[{textAlign: 'center', marginBottom: 10}, Fonts.TwitchyTV]}>
            Trending (top 10)
          </Headline>
          <Divider />
        </View>
      )}
      stickyHeaderHiddenOnScroll={true}
      keyExtractor={game => game.id as string}
      renderItem={({item}) => (
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            marginHorizontal: 10,
            backgroundColor: colors.primaryContainer,
            borderRadius: 10,
            overflow: 'hidden',
            flex: 1,
          }}>
          <ImageBackground
            source={{
              uri: item.box_art_url?.replace('{width}x{height}', '350x500'),
            }}
            style={{
              flex: 1,
            }}
            resizeMode="cover"
          />
          <View style={{flex: 2, padding: 10, gap: 4}}>
            <Title>{item.name}</Title>
            <Divider />
            {item.streams?.map(stream => (
              <Pressable
                onPress={() => {
                  navigation.navigate('twitchuser', {
                    username: stream.user_login as string,
                  });
                }}
                style={{
                  padding: 12,
                  borderRadius: 4,
                  backgroundColor: colors.onPrimary,
                }}
                key={stream.id}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text>{stream.user_name}</Text>
                  <Text>
                    {stream.viewer_count} <Icon from="ionicons" name="eye" />
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    />
  );
}
