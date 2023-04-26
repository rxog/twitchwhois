/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ImageBackground,
  Text,
  StyleSheet,
} from 'react-native';
import Twitch from '@/utils/Twitch';
import {TwitchTopGameStreams} from 'src/types/TwitchData';
import Icon from '@/components/Icon';
import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import Divider from '@/components/Divider';
import {colors} from '@/assets/styles';
import Headline from '@/components/Headline';
import Button from '@/components/Button';
import Loading from '@/components/Loading';

export default function TrendingPage({
  navigation,
}: {
  navigation: NavigationProp<any>;
}): JSX.Element {
  const [games, setGames] = React.useState<TwitchTopGameStreams[]>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const getData = React.useCallback(() => {
    Twitch.topGameStreams()
      .then(data => {
        if (data) {
          setGames(data);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getData();

      return () => {
        setIsLoading(true);
      };
    }, [getData]),
  );

  if (isLoading) {
    return <Loading />;
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      paddingBottom: 100,
    },
    headline: {
      padding: 10,
      textAlign: 'center',
      backgroundColor: colors.background,
    },
  });

  return (
    <FlatList
      refreshControl={
        <RefreshControl
          progressViewOffset={50}
          refreshing={refreshing}
          colors={[colors.primary, colors.secondary, colors.tertiary]}
          progressBackgroundColor={colors.background}
          onRefresh={() => {
            setRefreshing(true);
            getData();
          }}
        />
      }
      data={games || []}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <Headline style={styles.headline}>Trending</Headline>
      }
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll={true}
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
              <Headline style={{textAlign: 'center'}}>{item.name}</Headline>
              <Divider color={colors.tertiary} />
              {item.streams?.map(stream => (
                <View key={stream.id} style={{marginVertical: 5}}>
                  <Button
                    color={colors.primaryContainer}
                    textColor={colors.onPrimaryContainer}
                    style={{alignSelf: 'stretch'}}
                    onPress={() => {
                      setIsLoading(true);
                      Twitch.getAllData(stream.user_login)
                        .then(profile =>
                          navigation.navigate('Profile', {
                            profile,
                          }),
                        )
                        .finally(() => setIsLoading(false));
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
                      <Icon from="ionicons" name="eye" /> {stream.viewer_count}{' '}
                      espectadores
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
        </View>
      )}
    />
  );
}
