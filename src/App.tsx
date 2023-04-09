import React from 'react';
import {StatusBar} from 'react-native';
import Navigation from './routes';
import {
  Provider as PaperProvider,
  MD3DarkTheme as DarkTheme,
  MD3LightTheme as LightTheme,
  adaptNavigationTheme,
} from 'react-native-paper';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';

const {LightTheme: NavLightTheme, DarkTheme: NavDarkTheme} =
  adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
    materialDark: DarkTheme,
    materialLight: LightTheme,
  });

function App(): JSX.Element {
  const dark = useSelector((state: RootState) => state.settings.dark);

  const Theme = dark ? DarkTheme : LightTheme;
  const NavTheme = dark ? NavDarkTheme : NavLightTheme;

  return (
    <PaperProvider theme={Theme}>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={Theme.colors.background}
      />
      <NavigationContainer
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
    </PaperProvider>
  );
}

export default App;
