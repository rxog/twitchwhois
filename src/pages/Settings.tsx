/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ScrollView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Slider from '@react-native-community/slider';
import {actions} from '@/store/reducers/settings';
import {RootState} from '@/store';
import {
  Switch,
  Button,
  Text,
  List,
  Divider,
  MD3Colors,
} from 'react-native-paper';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);

  return (
    <ScrollView>
      <Divider />
      <List.Section>
        <List.Item
          title="Intervalo"
          left={props => <List.Icon {...props} icon="timer-outline" />}
        />
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 30,
            marginBottom: 20,
          }}>
          <Slider
            style={{
              flex: 1,
            }}
            step={5}
            value={settings.interval}
            minimumValue={5}
            maximumValue={60}
            onValueChange={async value => {
              dispatch(actions.setInterval(value));
            }}
            thumbTintColor={MD3Colors.secondary60}
            minimumTrackTintColor={MD3Colors.secondary50}
            maximumTrackTintColor={MD3Colors.secondary50}
          />
          <Text>{settings.interval} min.</Text>
        </View>
        <Divider />
        <List.Item
          title="Modo escuro"
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => (
            <Switch
              onValueChange={() => {
                dispatch(actions.toggleDarkMode());
              }}
              value={settings.dark}
            />
          )}
        />
        <Divider />
      </List.Section>
      <View style={{padding: 20}}>
        <Button
          mode="contained-tonal"
          onPress={() => {
            dispatch(actions.reset());
          }}>
          Resetar
        </Button>
      </View>
    </ScrollView>
  );
}
