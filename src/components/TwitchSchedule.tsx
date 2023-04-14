/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {FlatList, View, Dimensions} from 'react-native';
import {Divider, Text, Card} from 'react-native-paper';
import {Segment} from '@/utils/types/TwitchData';
import format from 'date-fns/format';
import Fonts from '@/pages/Styles/Fonts';

export default function TwitchSchedule({data}: {data: Segment[]}) {
  if (!Array.isArray(data)) {
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
        Agenda
      </Text>
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
                  <Text variant="headlineSmall">{item.title}</Text>
                )}
                {item.category && (
                  <Text variant="bodyMedium">- {item.category?.name}</Text>
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
    </View>
  );
}
