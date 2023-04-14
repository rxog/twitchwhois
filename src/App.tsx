import React from 'react';
import {Linking, StatusBar} from 'react-native';
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
  useNavigationContainerRef,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainerRefWithCurrent,
} from '@react-navigation/native';
import {Dark, Light} from './pages/Styles/ThemeColors';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';

const LayoutDarkTheme = {...MD3DarkTheme, ...Dark};
const LayoutLightTheme = {...MD3LightTheme, ...Light};

const {LightTheme: NavLight, DarkTheme: NavDark} = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialLight: LayoutLightTheme,
  materialDark: LayoutDarkTheme,
});

function App(): JSX.Element {
  const navigationRef = useNavigationContainerRef();

  React.useEffect(() => {
    notifee.onBackgroundEvent(async ({type, detail}) => {
      const {notification, pressAction} = detail;
      if (type === EventType.PRESS) {
        const screen = pressAction?.id;

        if (screen === 'go-twitch') {
          Linking.openURL('https://twitch.tv/');
        } else if (screen && navigationRef.current) {
          (
            navigationRef.current as NavigationContainerRefWithCurrent<any>
          ).navigate(screen);
        }

        if (notification?.id && typeof notification.id === 'string') {
          await notifee.cancelNotification(notification?.id);
        }
      }
    });
  }, [navigationRef]);

  const dark = useSelector((state: RootState) => state.settings.dark);

  const NavTheme = dark ? NavDark : NavLight;
  const Theme = dark ? LayoutDarkTheme : LayoutLightTheme;

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
