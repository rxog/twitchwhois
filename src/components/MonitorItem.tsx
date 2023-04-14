/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Card,
  Divider,
  Text,
  useTheme,
} from 'react-native-paper';
import Icon from './Icon';
import {Alert, View} from 'react-native';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import isPast from 'date-fns/isPast';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import {useDispatch} from 'react-redux';
import {actions, ResultsState} from '@/store/reducers/results';

export default function MonitorItem({item}: {item: ResultsState}) {
  const dispatch = useDispatch();
  const {colors} = useTheme();

  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  useEffect(() => {
    const nextDate = Date.parse(item.nextCheck as string);

    const updateRemaining = () => {
      const isPastDate = isPast(nextDate);
      if (isPastDate) {
        clearInterval(intervalId);
        setTimeRemaining('instantes');
      } else {
        const formatTimeRemaining = formatDistanceToNowStrict(nextDate, {
          locale: ptBR,
        });
        setTimeRemaining(formatTimeRemaining);
      }
    };

    updateRemaining();

    const intervalId = setInterval(updateRemaining, 1000);

    return () => clearInterval(intervalId);
  }, [item.nextCheck]);

  if (timeRemaining === null) {
    return <ActivityIndicator />;
  }

  const color = item.status === 1 ? '#66bb6a' : '#f44336';
  const icon = item.status === 1 ? 'mood' : 'mood-bad';

  return (
    <Card
      style={{
        marginHorizontal: 10,
        marginBottom: 10,
      }}>
      <Card.Content>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon from="materialIcons" color={color} name={icon} size={40} />
          <Text
            variant="displayMedium"
            style={[
              {
                fontWeight: 'bold',
                marginTop: -5,
                color,
              },
            ]}>
            {item.username}
          </Text>
        </View>
        <Divider style={{marginVertical: 10}} />
        <Text variant="bodyMedium">
          Atualizado{' '}
          {format(Date.parse(item.lastCheck as string), 'eee, PPPpp', {
            locale: ptBR,
          })}
        </Text>
        <Divider style={{marginTop: 10}} />
      </Card.Content>
      <Card.Actions>
        <Text variant="bodySmall" style={{color: colors.onSurfaceDisabled}}>
          {item.running ? `Atualiza em ${timeRemaining}` : 'Parado'}
        </Text>
        <Button
          mode="elevated"
          textColor={colors.onErrorContainer}
          buttonColor={colors.errorContainer}
          onPress={async () => {
            Alert.alert(
              `Apagar @${item.username}?`,
              'Essa ação não pode ser desfeita.',
              [
                {
                  text: 'Apagar',
                  onPress: () => {
                    dispatch(actions.removeResult(item.username));
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
          mode="elevated"
          textColor={colors.onPrimaryContainer}
          buttonColor={
            item.running ? colors.primaryContainer : colors.surfaceDisabled
          }
          onPress={async () => {
            if (item.running) {
              dispatch(actions.saveResult({...item, running: false}));
              return;
            }
            dispatch(actions.saveResult({...item, running: true}));
          }}>
          <Icon name="play-pause" size={20} />
        </Button>
      </Card.Actions>
    </Card>
  );
}
