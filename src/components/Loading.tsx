import React from 'react';
import {StyleSheet, View} from 'react-native';
import {PacmanIndicator} from 'react-native-indicators';
import {colors} from '@/assets/styles';

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class Loading extends React.PureComponent {
  render() {
    return (
      <View style={styles.loading}>
        <PacmanIndicator color={colors.primary} size={100} />
      </View>
    );
  }
}
