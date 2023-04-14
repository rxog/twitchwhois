/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useMemo} from 'react';
import {View, FlatList, StyleSheet, Alert} from 'react-native';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import {RootState} from '@/store';
import {actions} from '@/store/reducers/results';
import {useSelector, useDispatch} from 'react-redux';
import {Button, Card, Divider, Text, useTheme} from 'react-native-paper';
import isBefore from 'date-fns/isBefore';
import capitalize from 'lodash/capitalize';
import Icon from '@/components/Icon';
import {sortBy} from 'lodash';
import Layout from '@/components/Layout';

export default function MonitorPage() {
  const {colors} = useTheme();

  const dispatch = useDispatch();
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
    <Layout title="monitor">
      <FlatList
        data={results}
        keyExtractor={item => item.username}
        ListHeaderComponent={() => (
          <View style={style.headerComponent}>
            <View style={style.Available}>
              <Text>Disponível: </Text>
              <Icon
                from="materialIcons"
                name="mood"
                size={30}
                color="#66bb6a"
              />
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
        renderItem={({item}) => {
          return (
            <Card
              style={{
                marginHorizontal: 10,
                marginBottom: 10,
              }}>
              <Card.Content>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    color={item.status ? '#66bb6a' : '#f44336'}
                    from="materialIcons"
                    name={item.status ? 'mood' : 'mood-bad'}
                    size={40}
                  />
                  <Text
                    variant="displayMedium"
                    style={[
                      {
                        fontWeight: 'bold',
                        marginTop: -5,
                        color: colors.primary,
                      },
                    ]}>
                    {item.username}
                  </Text>
                </View>
                <Divider style={{marginVertical: 10}} />
                <Text variant="bodySmall">
                  Última checagem:{'\n'}
                  {capitalize(
                    format(
                      Date.parse(item.lastCheck as string),
                      'EEEE, dd/MM/yyyy HH:mm:ss',
                      {
                        locale: ptBR,
                      },
                    ),
                  )}
                  {'\n\n'}
                  Próxima checagem:{'\n'}
                  {item.running
                    ? isBefore(Date.parse(item.nextCheck as string), Date.now())
                      ? 'Em instantes'
                      : capitalize(
                          format(
                            Date.parse(item.nextCheck as string),
                            'EEEE, dd/MM/yyyy HH:mm:ss',
                            {
                              locale: ptBR,
                            },
                          ),
                        )
                    : 'Parado'}
                </Text>
                <Divider style={{marginTop: 10}} />
              </Card.Content>
              <Card.Actions>
                <Button
                  mode="elevated"
                  textColor={colors.error}
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
                    item.running
                      ? colors.primaryContainer
                      : colors.surfaceDisabled
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
        }}
      />
    </Layout>
  );
}
