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
      padding: 12,
      borderRadius: 10,
      overflow: 'hidden',
      elevation: 3,
    },
    text: {color: colors.text, fontSize: 12},
    muted: {color: colors.muted},
    icon: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'flex-end',
      right: -85,
      top: -35,
    },
    username: {
      fontWeight: 'bold',
      fontSize: 30,
      color,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 5,
    },
    btn: {
      width: 35,
      height: 35,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
    },
  });

  return (
    <View style={styles.main}>
      <View>
        <View style={styles.icon}>
          <Icon
            from="materialIcons"
            color={colors.background}
            name={icon}
            size={145}
          />
        </View>
        <Text style={styles.username}>{item.userName}</Text>
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
          style={styles.btn}
          color={colors.onErrorContainer}
          elevation={1}
          onPress={async () => {
            Alert.alert(
              `Apagar @${item.userName}?`,
              'Essa ação não pode ser desfeita.',
              [
                {
                  text: 'Cancelar',
                  style: 'cancel',
                },
                {
                  text: 'Apagar',
                  onPress: () => {
                    dispatch(MonitorActions.remove(item.userName));
                  },
                },
              ],
            );
          }}>
          <Icon from="octicons" name="trash" size={16} color={colors.onError} />
        </Button>
        <Button
          style={styles.btn}
          color={colors.inversePrimary}
          elevation={1}
          onPress={async () => {
            if (item.isMonitoring) {
              dispatch(MonitorActions.update({...item, isMonitoring: false}));
              return;
            }
            dispatch(MonitorActions.update({...item, isMonitoring: true}));
          }}>
          <Icon name="play-pause" size={16} color={colors.primary} />
        </Button>
      </View>
    </View>
  );
}
