import React from 'react';
import {FlatList, Text, View, StyleSheet, Dimensions} from 'react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import {isFuture, format, formatDistanceToNow, formatRFC3339} from 'date-fns';
import {Schedule as ScheduleData} from 'src/types/TwitchData';
import {ptBR} from 'date-fns/locale';
import {Pressable} from 'react-native';
import {colorAlpha, colors} from '@/assets/styles';

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  vacation: {
    padding: 20,
    backgroundColor: colors.backgroundVariant,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  vacationText: {
    color: colors.muted,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  schedule: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    color: colors.muted,
    fontWeight: 'bold',
  },
  scheduleContent: {
    gap: 20,
    paddingHorizontal: 20,
  },
  scheduleItemContainer: {
    backgroundColor: colors.backgroundVariant,
    borderRadius: 20,
    overflow: 'hidden',
  },
  scheduleItemBotton: {
    width: width * 0.8 - 20,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flex: 1,
  },
  scheduleItemContent: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.primary,
    flexWrap: 'nowrap',
    padding: 10,
    paddingRight: 5,
    maxWidth: 55,
    width: 55,
  },
  scheduleItemDay: {
    color: colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
  },
  scheduleItemMonth: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: 16,
  },
  scheduleItemInfo: {
    padding: 10,
    flexWrap: 'nowrap',
    justifyContent: 'center',
    flex: 1,
  },
  scheduleItemInfoTitle: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 18,
  },
  scheduleItemInfoCategory: {
    color: colors.primary,
    fontSize: 14,
  },
  scheduleItemInfoDate: {
    color: colors.muted,
    fontSize: 12,
  },
});

export default function Schedule({data}: {data: ScheduleData}) {
  if (data.vacation) {
    //const start = Date.parse(data.vacation.start_time);
    const end = Date.parse(data.vacation.end_time);
    if (isFuture(end)) {
      return (
        <View style={styles.vacation}>
          <Text style={styles.vacationText}>
            {data.broadcaster_name} está de férias e volta em{' '}
            {formatDistanceToNow(end, {
              locale: ptBR,
            })}
            .
          </Text>
        </View>
      );
    }
  }
  return (
    <View>
      <Text style={styles.schedule}>
        A próxima transmissão será{' '}
        {format(Date.parse(data.segments[0].start_time), 'PPPPp', {
          locale: ptBR,
        })}
        .
      </Text>
      <FlatList
        data={data.segments}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.scheduleContent}
        snapToOffsets={[...Array(data.segments.length)].map((_x, i) => {
          const offset = i * (width * 0.8);
          return offset;
        })}
        snapToAlignment="start"
        scrollEventThrottle={16}
        decelerationRate="fast"
        renderItem={({item}) => {
          const start = item.start_time && Date.parse(item.start_time);
          const end = item.end_time && Date.parse(item.end_time);
          return (
            <View style={styles.scheduleItemContainer}>
              <Pressable
                style={styles.scheduleItemBotton}
                android_ripple={{
                  color: colorAlpha(colors.light, 0.1),
                }}
                onPress={() => {
                  AddCalendarEvent.presentEventCreatingDialog({
                    startDate: start
                      ? formatRFC3339(start, {fractionDigits: 3})
                      : undefined,
                    endDate: end
                      ? formatRFC3339(end, {fractionDigits: 3})
                      : undefined,
                    title: `Live: ${data.broadcaster_name}`,
                    notes: `${item.title} - ${item.category?.name}`,
                  })
                    .then(eventInfo => {
                      console.log(eventInfo);
                    })
                    .catch(error => {
                      console.log(error);
                    });
                }}>
                <View style={styles.scheduleItemContent}>
                  <Text style={styles.scheduleItemDay}>
                    {start && format(start, 'd', {locale: ptBR})}
                  </Text>
                  <Text style={styles.scheduleItemMonth}>
                    {start && format(start, 'MMM', {locale: ptBR})}
                  </Text>
                </View>
                <View style={styles.scheduleItemInfo}>
                  {item.title && (
                    <Text
                      style={styles.scheduleItemInfoTitle}
                      numberOfLines={1}>
                      {item.title}
                    </Text>
                  )}
                  {item.category?.name && (
                    <Text
                      style={styles.scheduleItemInfoCategory}
                      numberOfLines={1}>
                      {item.category.name}
                    </Text>
                  )}
                  <Text style={styles.scheduleItemInfoDate} numberOfLines={1}>
                    {start && format(start, 'HH:mm')}
                    {end && <> - {format(end, 'HH:mm')}</>}
                  </Text>
                </View>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}
