import React from 'react';
import {StatusBar} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import Navigation, {navigationRef} from './routes';
import {
  NavigationContainer,
  NavigationContainerRefWithCurrent,
} from '@react-navigation/native';
import {colors} from './assets/styles';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';

function App(): JSX.Element {
  useKeepAwake();

  React.useEffect(() => {
    notifee.onBackgroundEvent(async ({type, detail}) => {
      const {notification, pressAction} = detail;
      if (type === EventType.PRESS) {
        const screen = pressAction?.id;

        if (screen === 'monitor' && navigationRef.isReady()) {
          (navigationRef as NavigationContainerRefWithCurrent<any>).navigate(
            'List',
          );
        } else {
          console.log(screen);
        }

        if (notification?.id && typeof notification.id === 'string') {
          await notifee.cancelNotification(notification?.id);
        }
      }
    });
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={{
        prefixes: ['twitchwhois://'],
        config: {
          screens: {
            monitor: 'List',
          },
        },
      }}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={colors.background}
      />
      <Navigation />
    </NavigationContainer>
  );
}

export default App;
