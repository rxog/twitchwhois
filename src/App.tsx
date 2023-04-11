import React from 'react';
import {StatusBar} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import Navigation from './routes';
import {
  Provider,
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from 'react-native-paper';
import {
  NavigationContainer,
  NavigationContainerRef,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {Dark, Light} from './pages/Styles/ThemeColors';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';

const {LightTheme: NavLight, DarkTheme: NavDark} = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

function App(): JSX.Element {
  const navigationRef =
    React.useRef<NavigationContainerRef<Record<string, object | undefined>>>(
      null,
    );

  React.useEffect(() => {
    notifee.onBackgroundEvent(async ({type, detail}) => {
      const {notification, pressAction} = detail;
      if (type === EventType.PRESS) {
        const screen = pressAction?.id;

        if (screen) {
          navigationRef.current?.navigate(screen);
        }

        if (notification?.id && typeof notification.id === 'string') {
          await notifee.cancelNotification(notification?.id);
        }
      }
    });
  }, []);

  const dark = useSelector((state: RootState) => state.settings.dark);

  const Theme = dark
    ? {...MD3DarkTheme, ...Dark}
    : {...MD3LightTheme, ...Light};
  const NavTheme = dark ? NavDark : NavLight;

  return (
    <Provider theme={Theme}>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={NavTheme.colors.background}
      />
      <NavigationContainer
        ref={navigationRef}
        linking={{
          prefixes: ['twitchwhois://'],
          config: {
            screens: {
              monitor: 'monitor',
            },
          },
        }}
        theme={NavTheme}>
        <Navigation />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
