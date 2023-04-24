/* eslint-disable react/no-unstable-nested-components */
import React, {useMemo} from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import {RootState} from '@/store';
import {useSelector} from 'react-redux';
import Icon from '@/components/Icon';
import {sortBy} from 'lodash';
import MonitorItem from '@/components/MonitorItem';
import {colors} from '@/assets/styles';
import Headline from '@/components/Headline';
import StatusBar from '@/components/StatusBar';

export default function MonitorPage() {
  const monitor = useSelector((state: RootState) => state.monitor);

  const results = useMemo(() => {
    const sorted = sortBy(monitor, 'userName');
    return sorted;
  }, [monitor]);

  const styles = StyleSheet.create({
    headerComponent: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      backgroundColor: colors.secondaryContainer,
      borderBottomColor: colors.surfaceDisabled,
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginBottom: 10,
      padding: 10,
    },
    headerItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      color: colors.text,
    },
    main: {
      backgroundColor: colors.background,
      flex: 1,
    },
    headline: {
      padding: 20,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.main}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Headline style={styles.headline}>Monitor</Headline>
      <FlatList
        data={results}
        keyExtractor={item => item.userName}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={() => (
          <View style={styles.headerComponent}>
            <View style={styles.headerItem}>
              <Text style={styles.text}>Disponível: </Text>
              <Icon
                from="materialIcons"
                name="mood"
                size={30}
                color={colors.success}
              />
            </View>
            <View style={styles.headerItem}>
              <Text style={styles.text}>Indisponível: </Text>
              <Icon
                from="materialIcons"
                name="mood-bad"
                color={colors.error}
                size={30}
              />
            </View>
          </View>
        )}
        renderItem={({item}) => <MonitorItem item={item} />}
      />
    </View>
  );
}
