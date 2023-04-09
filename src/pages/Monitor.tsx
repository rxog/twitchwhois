/* eslint-disable react-native/no-inline-styles */
import React, {useMemo} from 'react';
import {ToastAndroid, View, FlatList} from 'react-native';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import {RootState} from '@/store';
import {actions} from '@/store/reducers/results';
import Draggable from '@/components/Draggable';
import {useSelector, useDispatch} from 'react-redux';
import {Divider, Text, TouchableRipple, useTheme} from 'react-native-paper';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import isBefore from 'date-fns/isBefore';
import capitalize from 'lodash/capitalize';
import Icon from '@/components/Icon';

export default function MonitorPage() {
  const {colors, fonts} = useTheme();
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const reduxData = useSelector((state: RootState) => state);

  const {results} = useMemo(() => {
    return reduxData;
  }, [reduxData]);

  const running = results.filter(result => result.running).length;

  useFocusEffect(() => {
    navigation.setOptions({
      tabBarBadge: running > 0 ? running : null,
    });
  });

  if (results && results.length) {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingHorizontal: 10,
            paddingTop: 20,
            gap: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text>Disponível: </Text>
            <Icon from="materialIcons" name="mood" size={30} color="#66bb6a" />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>Indisponível: </Text>
            <Icon
              from="materialIcons"
              name="mood-bad"
              color="#f44336"
              size={30}
            />
          </View>
        </View>
        <FlatList
          style={{marginTop: 10}}
          data={results}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  marginHorizontal: 10,
                  borderRadius: 10,
                  marginVertical: 5,
                  flexWrap: 'wrap',
                  borderColor: colors.surfaceVariant,
                  borderWidth: 1,
                }}>
                <View
                  style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    position: 'absolute',
                    backgroundColor: colors.secondaryContainer,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="delete-forever"
                    size={40}
                    color={colors.onSecondaryContainer}
                  />
                </View>
                <Draggable
                  style={{
                    flexDirection: 'row',
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}
                  direction="left"
                  onLeft={async () => {
                    dispatch(actions.removeResult(item.username));
                  }}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: colors.secondaryContainer,
                      paddingHorizontal: 10,
                      paddingBottom: 10,
                    }}>
                    <Text
                      style={[
                        fonts.displayMedium,
                        {
                          fontWeight: 'bold',
                          color: colors.onSecondaryContainer,
                        },
                      ]}>
                      {item.username}
                    </Text>
                    <Divider />
                    <Text
                      style={[
                        fonts.bodyMedium,
                        {
                          color: colors.secondary,
                        },
                      ]}>
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
                    </Text>
                    <Text
                      style={[
                        fonts.bodyMedium,
                        {
                          color: colors.secondary,
                        },
                      ]}>
                      Próxima checagem:{'\n'}
                      {item.running
                        ? isBefore(
                            Date.parse(item.nextCheck as string),
                            Date.now(),
                          )
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
                  </View>
                  <TouchableRipple
                    style={{
                      paddingHorizontal: 10,
                      backgroundColor: item.status ? '#66bb6a' : '#f44336',
                      borderLeftColor: colors.surfaceVariant,
                      borderLeftWidth: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onLongPress={async () => {
                      if (item.running) {
                        dispatch(actions.saveResult({...item, running: false}));
                        ToastAndroid.show('Parando...', ToastAndroid.SHORT);
                        return;
                      }
                      ToastAndroid.show('Iniciando...', ToastAndroid.SHORT);
                      dispatch(actions.saveResult({...item, running: true}));
                    }}
                    onPress={e => e}
                    rippleColor="rgba(0, 0, 0, .32)">
                    <Icon
                      from="materialIcons"
                      name={item.status ? 'mood' : 'mood-bad'}
                      size={34}
                    />
                  </TouchableRipple>
                </Draggable>
              </View>
            );
          }}
        />
      </View>
    );
  } else {
    return <React.Fragment />;
  }
}
