import React from 'react';
import {formatDistanceToNow} from 'date-fns';
import {
  Text,
  View,
  Dimensions,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Image,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {uniqBy, capitalize} from 'lodash';
import axios from 'axios';
import Divider from './Divider';
import {ptBR} from 'date-fns/locale';
import {colorAlpha, colors, sizes} from '@/assets/styles';
import {VideoOrClip} from 'src/types/TwitchData';

const {width} = Dimensions.get('window');

export default function VideoList({
  userId,
  type,
}: {
  userId: string;
  type: string;
}) {
  const [endReached, setEndReached] = React.useState(false);
  const [, setIsLoading] = React.useState(false);
  const [cursor, setCursor] = React.useState('');
  const [data, setData] = React.useState<VideoOrClip[]>();
  const listRef = React.useRef(null);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://twitchwhois-backend.vercel.app/api/${type}/${userId}/${cursor}`,
      );

      if (response && response.data && response.data.hasOwnProperty('data')) {
        setCursor(response.data.pagination.cursor);
        setData(prevData => {
          if (Array.isArray(prevData)) {
            return [...prevData, ...response.data.data];
          } else {
            return response.data.data;
          }
        });
      } else {
        setEndReached(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, type, userId]);

  const styles = {
    main: {
      borderRadius: 12,
      overflow: 'hidden' as ViewStyle['overflow'],
      backgroundColor: colors.backgroundVariant,
      height: 240,
      width: width * 0.8 - 20,
    },
    thumb: {
      flex: 1,
      width: '100%',
      backgroundColor: colors.background,
    },
    content: {padding: 12},
    title: {
      color: colors.text,
      fontWeight: 'bold' as TextStyle['fontWeight'],
      fontSize: sizes.bodySmall,
    },
    description: {color: colors.muted},
    metadata: {color: colors.muted, fontSize: 10},
    flat: {
      gap: 20,
      paddingHorizontal: 20,
    },
  };

  return (
    <FlatList
      ref={listRef}
      data={uniqBy(data, 'id')}
      renderItem={({item}) => {
        const isLive = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${item.user_login}-480x272.jpg`;
        const thumb404 = String(item.thumbnail_url).includes(
          '_404/404_processing_',
        );
        const imageSource = thumb404
          ? isLive
          : item.thumbnail_url.replace('%{width}x%{height}', '480x272');
        return (
          <View style={styles.main}>
            <Image
              source={{uri: imageSource}}
              fadeDuration={1000}
              style={styles.thumb}
            />
            <View style={styles.content}>
              {item.title && (
                <Text numberOfLines={1} style={styles.title}>
                  {item.title}
                </Text>
              )}
              {item.description && (
                <Text style={styles.description}>{item.description}</Text>
              )}
              {item.created_at && (
                <>
                  <Divider />
                  <Text style={styles.metadata}>
                    {capitalize(
                      formatDistanceToNow(
                        Date.parse(item.published_at || item.created_at),
                        {
                          locale: ptBR,
                          addSuffix: true,
                        },
                      ),
                    )}{' '}
                    - {Number(item.view_count).toLocaleString('pt-BR')}{' '}
                    visualizações
                  </Text>
                </>
              )}
            </View>
            <Pressable
              onPress={() => Linking.openURL(item.url)}
              style={StyleSheet.absoluteFill}
              android_ripple={{
                color: colorAlpha(colors.light, 0.1),
              }}
            />
          </View>
        );
      }}
      snapToOffsets={[...Array(data?.length)].map((_x, i) => {
        const offset = i * (width * 0.8);
        return offset;
      })}
      keyExtractor={item => String(item.id)}
      snapToAlignment="start"
      scrollEventThrottle={16}
      decelerationRate="fast"
      onEndReachedThreshold={0.1}
      onEndReached={() => {
        if (!endReached) {
          fetchData();
        }
      }}
      showsHorizontalScrollIndicator={false}
      horizontal
      contentContainerStyle={styles.flat}
    />
  );
}
