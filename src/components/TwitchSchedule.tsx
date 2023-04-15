/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {FlatList, View, Dimensions} from 'react-native';
import {Divider, Text, Card} from 'react-native-paper';
import {Schedule, Segment} from '@/utils/types/TwitchData';
import format from 'date-fns/format';
import Fonts from '@/pages/Styles/Fonts';
import Icon from './Icon';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import ptBR from 'date-fns/locale/pt-BR';
import {useTheme} from 'react-native-paper';

function Segments({data}: {data: Segment[]}) {
  const {colors} = useTheme();

  return (
    <FlatList
      data={data}
      horizontal
      keyExtractor={item => item.id as string}
      renderItem={({item}) => {
        return (
          <Card
            style={{
              margin: 10,
              marginHorizontal: 10,
              maxWidth: Dimensions.get('window').width * 0.8 - 20,
            }}>
            <Card.Content>
              {item.title && (
                <Text variant="headlineSmall" numberOfLines={2}>
                  {item.title}
                </Text>
              )}
              {item.category && (
                <Text
                  variant="bodyMedium"
                  style={{color: colors.onSurfaceVariant}}>
                  - {item.category?.name}
                </Text>
              )}
              {item.start_time && (
                <Text>
                  Início:{' '}
                  {format(
                    Date.parse(item.start_time as string),
                    'dd/MM/yyyy - HH:mm:ss',
                  )}
                </Text>
              )}
              {item.end_time && (
                <Text>
                  Fim:{' '}
                  {format(
                    Date.parse(item.end_time as string),
                    'dd/MM/yyyy - HH:mm:ss',
                  )}
                </Text>
              )}
            </Card.Content>
          </Card>
        );
      }}
    />
  );
}

export default function TwitchSchedule({data}: {data: Schedule}) {
  if (!Array.isArray(data.segments)) {
    return <></>;
  }

  return (
    <View style={{marginBottom: 20}}>
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
        Agenda{' '}
        {!!data.vacation && (
          <>
            <Icon from="fontisto" name="beach-slipper" size={30} />
            <Text> de férias</Text>
          </>
        )}
      </Text>
      {data.vacation ? (
        <Text style={{paddingHorizontal: 10}}>
          Volta em{' '}
          {formatDistanceToNowStrict(Date.parse(data.vacation.end_time), {
            locale: ptBR,
          })}{' '}
          (
          {format(Date.parse(data.vacation.end_time), 'eee, PPP', {
            locale: ptBR,
          })}
          )
        </Text>
      ) : (
        <Segments data={data.segments} />
      )}
    </View>
  );
}
