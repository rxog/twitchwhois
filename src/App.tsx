import React from 'react';
import {StatusBar} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import Navigation, {navigationRef} from './routes';
import {
  NavigationContainer,
  NavigationContainerRefWithCurrent,
} from '@react-navigation/native';
import {colors} from './assets/styles';

function App(): JSX.Element {
  React.useEffect(() => {
    notifee.onBackgroundEvent(async ({type, detail}) => {
      const {notification, pressAction} = detail;
      if (type === EventType.PRESS) {
        const screen = pressAction?.id;

        if (screen && navigationRef.isReady()) {
          (navigationRef as NavigationContainerRefWithCurrent<any>).navigate(
            screen,
          );
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
            monitor: 'monitor',
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
