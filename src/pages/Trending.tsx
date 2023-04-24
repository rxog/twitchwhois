/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ImageBackground,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import Twitch from '@/utils/Twitch';
import {TwitchTopGameStreams} from 'src/types/TwitchData';
import Icon from '@/components/Icon';
import {NavigationProp} from '@react-navigation/native';
import Divider from '@/components/Divider';
import {colors} from '@/assets/styles';
import Headline from '@/components/Headline';
import Button from '@/components/Button';

export default function TrendingPage({
  navigation,
}: {
  navigation: NavigationProp<any>;
}): JSX.Element {
  const [games, setGames] = React.useState<TwitchTopGameStreams[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

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
        color={colors.primary}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      />
    );
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      paddingBottom: 100,
    },
    headline: {
      padding: 20,
      textAlign: 'center',
      backgroundColor: colors.background,
    },
  });

  return (
    <View>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={[colors.primary, colors.secondary, colors.tertiary]}
            progressBackgroundColor={colors.background}
            onRefresh={() => {
              setRefreshing(true);
              getData();
            }}
          />
        }
        data={games}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <Headline style={styles.headline}>Trending</Headline>
        }
        stickyHeaderIndices={[0]}
        keyExtractor={game => game.id as string}
        renderItem={({item}) => (
          <View>
            <ImageBackground
              source={{
                uri: item.box_art_url.replace('{width}x{height}', '188x250'),
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
                  backgroundColor: colors.primaryContainer,
                  opacity: 0.66,
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
              />
              <View style={{flex: 1, padding: 10}}>
                <Headline>{item.name}</Headline>
                <Divider />
                {item.streams?.map(stream => (
                  <View key={stream.id} style={{marginVertical: 5}}>
                    <Button
                      color={colors.primaryContainer}
                      textColor={colors.onPrimaryContainer}
                      style={{alignSelf: 'stretch'}}
                      onPress={() => {
                        navigation.navigate('twitchuser', {
                          username: stream.user_login,
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
                          color: colors.primary,
                        }}>
                        <Icon from="ionicons" name="eye" />{' '}
                        {stream.viewer_count} espectadores
                      </Text>
                      <Text
                        style={{
                          color: colors.primary,
                        }}>
                        {stream.is_mature ? '+18' : 'Livre'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ImageBackground>
            <Divider />
          </View>
        )}
      />
    </View>
  );
}
