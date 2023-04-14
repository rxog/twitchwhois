/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {Dimensions, FlatList, Linking, View} from 'react-native';
import {Card, Divider, Text} from 'react-native-paper';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import axios from 'axios';
import capitalize from 'lodash/capitalize';
import Fonts from '@/pages/Styles/Fonts';
import ptBR from 'date-fns/locale/pt-BR';
import {uniqBy} from 'lodash';

const WINDOW_WIDTH = Dimensions.get('window').width;
const THUMBNAIL_WIDTH = WINDOW_WIDTH * 0.8 - 20;

type TwitchVideosProps = {
  type: 'videos' | 'clips';
  userId: string;
  title?: string;
};

type Pagination = {
  prev: string | null;
  next: string | null;
};

export default function TwitchVideos({
  type,
  userId,
  title = type,
}: TwitchVideosProps) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [endReached, setEndReached] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    next: null,
    prev: null,
  });
  const [listWidth, setListWidth] = useState(0);
  const [_scrollOffset, setScrollOffset] = useState(0);
  const listRef = useRef<FlatList<any>>(null);

  const fetchData = useCallback(async () => {
    try {
      const api = 'https://twitchwhois-backend.vercel.app/api';
      const response = await axios.get(
        `${api}/${type}/${userId}/${pagination.next ?? ''}`,
      );

      if (response && response.data && response.data.hasOwnProperty('data')) {
        setData(prevData => [...prevData, ...response.data.data]);
        setPagination(prevPagination => ({
          prev: prevPagination.next,
          next: response.data.pagination.cursor,
        }));
      } else {
        setEndReached(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.next, type, userId]);

  useEffect(() => {
    if (isLoading) {
      fetchData();
    }
  }, [fetchData, isLoading, pagination.next]);

  const handleOnEndReached = useCallback(() => {
    if (!isLoading && !endReached) {
      setIsLoading(true);
    }
  }, [isLoading, endReached]);

  useEffect(() => {
    if (listWidth > 0) {
      const threshold = 300;
      const thresholdPixels = listWidth - threshold;
      listRef.current?.setNativeProps({onEndReachedThreshold: thresholdPixels});
    }
  }, [listWidth]);

  return (
    <>
      <Divider />
      <Text
        variant="headlineMedium"
        style={[
          Fonts.TwitchyTV,
          {
            marginTop: 20,
            marginHorizontal: 10,
          },
        ]}>
        {title}
      </Text>
      <View
        onLayout={event => {
          const {width} = event.nativeEvent.layout;
          setListWidth(width);
        }}>
        <FlatList
          ref={listRef}
          data={uniqBy(data, 'id')}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToOffsets={[...Array(data.length)].map((_x, i) => {
            const offset = i * (WINDOW_WIDTH * 0.8 - 40) + (i - 1) * 40;
            return offset;
          })}
          onScroll={event => {
            const {contentOffset} = event.nativeEvent;
            setScrollOffset(contentOffset.x);
          }}
          keyExtractor={item => `${item.id}-${Date.now()}`}
          snapToAlignment="start"
          scrollEventThrottle={16}
          decelerationRate="fast"
          onEndReached={handleOnEndReached}
          renderItem={({item}) => {
            const isLive = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${item.user_login}-480x272.jpg`;
            const thumb404 = String(item.thumbnail_url).includes(
              '_404/404_processing_',
            );
            const imageSource = thumb404
              ? isLive
              : item.thumbnail_url.replace('%{width}x%{height}', '480x272');
            return (
              <Card
                onPress={() => Linking.openURL(item.url)}
                style={{
                  marginHorizontal: 10,
                  width: THUMBNAIL_WIDTH,
                }}>
                <Card.Cover
                  source={{
                    uri: imageSource,
                  }}
                />
                <Card.Content>
                  <Text
                    numberOfLines={1}
                    variant="bodyMedium"
                    ellipsizeMode="tail"
                    style={{marginTop: 10}}>
                    {item.title}
                  </Text>
                  <Divider />
                  <Text variant="bodySmall">
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
                </Card.Content>
              </Card>
            );
          }}
          style={{
            marginVertical: 20,
          }}
        />
      </View>
    </>
  );
}
