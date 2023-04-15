/* eslint-disable react/no-unstable-nested-components */
import React, {useMemo} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {RootState} from '@/store';
import {useSelector} from 'react-redux';
import {Text, useTheme} from 'react-native-paper';
import Icon from '@/components/Icon';
import {sortBy} from 'lodash';
import MonitorItem from '@/components/MonitorItem';

export default function MonitorPage() {
  const {colors} = useTheme();
  const reduxData = useSelector((state: RootState) => state.results);

  const results = useMemo(() => {
    const sorted = sortBy(reduxData, 'username');
    return sorted;
  }, [reduxData]);

  const style = StyleSheet.create({
    headerComponent: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      backgroundColor: colors.secondaryContainer,
      borderBottomColor: colors.surfaceDisabled,
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginBottom: 10,
      padding: 10,
    },
    Available: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    NotAvailable: {flexDirection: 'row', alignItems: 'center'},
  });

  return (
    <FlatList
      data={results}
      keyExtractor={item => item.username}
      ListHeaderComponent={() => (
        <View style={style.headerComponent}>
          <View style={style.Available}>
            <Text>Disponível: </Text>
            <Icon from="materialIcons" name="mood" size={30} color="#66bb6a" />
          </View>
          <View style={style.NotAvailable}>
            <Text>Indisponível: </Text>
            <Icon
              from="materialIcons"
              name="mood-bad"
              color="#f44336"
              size={30}
            />
          </View>
        </View>
      )}
      renderItem={({item}) => <MonitorItem item={item} />}
    />
  );
}
