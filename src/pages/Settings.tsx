/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Slider from '@react-native-community/slider';
import {SettingsActions} from '@/store/Settings';
import {RootState} from '@/store';
import Divider from '@/components/Divider';
import Button from '@/components/Button';
import {colors} from '@/assets/styles';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);

  return (
    <ScrollView>
      <Divider />
      <View>
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
            onValueChange={value => {
              dispatch(SettingsActions.setInterval(value));
            }}
            thumbTintColor={colors.primary}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.primary}
          />
          <Text>{settings.interval} min.</Text>
        </View>
        <Divider />
      </View>
      <View style={{padding: 20}}>
        <Button
          onPress={() => {
            dispatch(SettingsActions.reset());
          }}>
          Resetar
        </Button>
      </View>
    </ScrollView>
  );
}
