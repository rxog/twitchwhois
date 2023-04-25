/* eslint-disable react-native/no-inline-styles */
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
import Button from '@/components/Button';

export default function MonitorPage({navigation}: {navigation: any}) {
  const monitor = useSelector((state: RootState) => state.monitor);

  const results = useMemo(() => {
    const sorted = sortBy(monitor, 'userName');
    return sorted;
  }, [monitor]);

  const styles = StyleSheet.create({
    headerComponent: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      backgroundColor: colors.backgroundVariant,
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
      padding: 10,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.main}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <FlatList
        data={results}
        keyExtractor={item => item.userName}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll={true}
        contentContainerStyle={{paddingBottom: 100}}
        ListEmptyComponent={
          <View
            style={{
              padding: 20,
              margin: 20,
              marginVertical: 10,
              backgroundColor: colors.backgroundVariant,
              borderRadius: 10,
            }}>
            <Text style={{color: colors.text}}>
              Você atualmente não está monitorando nenhum nome de usuário.
            </Text>
            <Button
              style={{marginTop: 10}}
              onPress={() => navigation.navigate('Search')}>
              Que tal adicionar alguns?
            </Button>
          </View>
        }
        ListHeaderComponent={
          <View>
            <Headline style={styles.headline}>Monitor</Headline>
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
          </View>
        }
        renderItem={({item}) => <MonitorItem item={item} />}
      />
    </View>
  );
}
