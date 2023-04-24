import React from 'react';
import Icon from './Icon';
import {Alert, StyleSheet, Text, View} from 'react-native';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import {useDispatch} from 'react-redux';
import {MonitorActions, MonitorItem as Item} from '@/store/Monitor';
import Divider from './Divider';
import {colors} from '@/assets/styles';
import Button from './Button';

export default function MonitorItem({item}: {item: Item}) {
  const dispatch = useDispatch();

  const color = item.isAvailable ? colors.success : colors.error;
  const icon = item.isAvailable ? 'mood' : 'mood-bad';
  const styles = StyleSheet.create({
    main: {
      marginHorizontal: 10,
      marginBottom: 10,
      backgroundColor: colors.backgroundVariant,
      padding: 20,
      borderRadius: 20,
    },
    text: {color: colors.text},
    muted: {color: colors.muted},
    iconName: {flexDirection: 'row', alignItems: 'center'},
    username: {
      fontWeight: 'bold',
      marginTop: -5,
      fontSize: 30,
      color,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 20,
    },
  });

  return (
    <View style={styles.main}>
      <View>
        <View style={styles.iconName}>
          <Icon from="materialIcons" color={color} name={icon} size={40} />
          <Text style={styles.username}>{item.userName}</Text>
        </View>
        <Divider />
        <Text style={styles.text}>
          Atualizado{' '}
          {format(Date.parse(item.lastCheckedAt as string), 'eee, PPPpp', {
            locale: ptBR,
          })}
        </Text>
        <Divider />
      </View>
      <View style={styles.actions}>
        {!item.isMonitoring && <Text style={styles.muted}>Parado</Text>}
        <Button
          onPress={async () => {
            Alert.alert(
              `Apagar @${item.userName}?`,
              'Essa ação não pode ser desfeita.',
              [
                {
                  text: 'Apagar',
                  onPress: () => {
                    dispatch(MonitorActions.remove(item.userName));
                  },
                },
                {
                  text: 'Cancelar',
                  style: 'cancel',
                },
              ],
            );
          }}>
          <Icon from="octicons" name="trash" size={20} />
        </Button>
        <Button
          onPress={async () => {
            if (item.isMonitoring) {
              dispatch(MonitorActions.update({...item, isMonitoring: false}));
              return;
            }
            dispatch(MonitorActions.update({...item, isMonitoring: true}));
          }}>
          <Icon name="play-pause" size={20} />
        </Button>
      </View>
    </View>
  );
}
