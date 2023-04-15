/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  ActivityIndicator,
  Button,
  Divider,
  Text,
  Title,
} from 'react-native-paper';
import {View, FlatList, RefreshControl, ImageBackground} from 'react-native';
import Twitch from '@/utils/TwitchAPI';
import {TwitchTopGameStreams} from '@/utils/types/TwitchData';
import Icon from '@/components/Icon';
import Fonts from './Styles/Fonts';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from '@react-navigation/native';
import ThemeColors from './Styles/ThemeColors';

export default function TrendingPage(): JSX.Element {
  const [games, setGames] = React.useState<TwitchTopGameStreams[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation<NavigationProp<any>>();

  const getData = React.useCallback(() => {
    Twitch.topGameStreams()
      .then(setGames)
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  }, []);

  React.useEffect(() => {
    getData();
  }, [getData]);

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
      data={games}
      keyExtractor={game => game.id as string}
      renderItem={({item}) => (
        <ImageBackground
          source={{
            uri: item.box_art_url?.replace('{width}x{height}', '350x500'),
          }}
          style={{
            marginHorizontal: 10,
            marginBottom: 10,
            borderRadius: 10,
            overflow: 'hidden',
          }}
          resizeMode="cover">
          <View
            style={{
              backgroundColor: ThemeColors.Dark.colors.primaryContainer,
              opacity: 0.66,
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
          <View style={{flex: 1, padding: 10}}>
            <Title
              style={[
                {
                  textAlign: 'center',
                  textShadowColor: ThemeColors.Dark.colors.primaryContainer,
                  textShadowOffset: {height: 1, width: 1},
                  textShadowRadius: 10,
                  color: ThemeColors.Dark.colors.onPrimaryContainer,
                },
                Fonts.TwitchyTV,
              ]}>
              {item.name}
            </Title>
            <Divider
              style={{
                backgroundColor: ThemeColors.Dark.colors.primary,
              }}
            />
            {item.streams?.map(stream => (
              <View key={stream.id} style={{marginVertical: 5}}>
                <Button
                  buttonColor={ThemeColors.Dark.colors.inversePrimary}
                  textColor={ThemeColors.Dark.colors.onPrimaryContainer}
                  mode="contained"
                  onPress={() => {
                    navigation.navigate('twitchuser', {
                      username: stream.user_login as string,
                    });
                  }}>
                  @{stream.user_login}
                </Button>
                <View
                  style={{
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: ThemeColors.Dark.colors.primary,
                    }}>
                    <Icon from="ionicons" name="eye" /> {stream.viewer_count}{' '}
                    espectadores
                  </Text>
                  <Text
                    style={{
                      color: ThemeColors.Dark.colors.primary,
                    }}>
                    {stream.is_mature ? '+18' : 'Livre'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ImageBackground>
      )}
    />
  );
}
