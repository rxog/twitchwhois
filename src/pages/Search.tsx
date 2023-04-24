import React from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  Vibration,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import slugify from '@sindresorhus/slugify';
import {MonitorActions} from '@/store/Monitor';
import {Store} from '@/store';
import axios from 'axios';
import {ToastAndroid} from 'react-native';
import {
  NavigationProp,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import {colors} from '@/assets/styles';
import Icon from '@/components/Icon';
import StatusBar from '@/components/StatusBar';

export default function Home({navigation}: {navigation: NavigationProp<any>}) {
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState<any>();
  const isFocused = useIsFocused();

  useFocusEffect(() => {
    if (query && !isFocused) {
      setQuery('');
    }
  });

  const getProfile = async (username: string) => {
    setProfile(null);
    setLoading(true);

    try {
      const {data} = await axios.get(
        `https://twitchwhois-backend.vercel.app/api/getalldata/${username}`,
      );
      if (data) {
        setProfile(data);
      } else {
        throw new TypeError('Usuário não encontrado!');
      }
    } catch (err) {
      const {status} = await axios.get(
        `https://passport.twitch.tv/usernames/${username}`,
        {
          validateStatus: () => true,
        },
      );
      setProfile({
        statusName: status,
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (profile) {
      if (profile.hasOwnProperty('statusName')) {
        const username = query;
        Vibration.vibrate();
        setQuery('');
        switch (profile.statusName) {
          case 200:
            return Alert.alert(
              'Nome indisponível!',
              `@${username} encontra-se indisponivel no momento, mas pode tornar-se disponivel novamente em algum tempo.`,
              [
                {
                  text: 'Monitorar',
                  onPress: () => {
                    Store.dispatch(
                      MonitorActions.update({
                        userName: username,
                        isAvailable: false,
                        lastCheckedAt: new Date().toISOString(),
                      }),
                    );
                    ToastAndroid.show(
                      `@${username} foi adicionado a lista de monitoramento.`,
                      ToastAndroid.LONG,
                    );
                  },
                },
                {
                  text: 'Ok',
                },
              ],
            );
          case 204:
            return Alert.alert(
              'Nome disponível!',
              `@${query} encontra-se disponivel, registre-o agora mesmo.`,
              [
                {
                  text: 'Ir para a Twitch',
                  onPress: () => {
                    Linking.openURL('https://www.twitch.tv/');
                  },
                },
                {
                  text: 'Ok',
                },
              ],
            );
          default:
            return Alert.alert(
              'Erro não esperado!',
              'Tente novamente mais tarde.',
            );
        }
      }
      navigation.navigate('Profile', {profile});
    }
    return () => {
      setProfile(null);
      setLoading(false);
    };
  }, [navigation, query, profile]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic">
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
      <LinearGradient
        colors={[colors.primary, colors.secondary, colors.primary]}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.appTitle}>@ Who Is</Text>
      <View style={styles.searchContent}>
        <Icon
          from="materialIcons"
          name="search"
          size={30}
          color={colors.secondary}
          style={styles.searchIcon}
        />
        <TextInput
          value={query}
          onChangeText={text => {
            setQuery(
              slugify(text, {
                separator: '',
                preserveCharacters: ['_'],
              }),
            );
          }}
          placeholder="Procurar"
          onSubmitEditing={() => {
            if (query.length >= 3 && query.length <= 30) {
              getProfile(query);
            }
          }}
          returnKeyType="search"
          autoCapitalize="none"
          autoComplete="username-new"
          autoCorrect={false}
          editable={!loading}
          enablesReturnKeyAutomatically={true}
          placeholderTextColor={colors.secondary}
          style={styles.searchInput}
        />
        {loading && (
          <ActivityIndicator
            size="large"
            color={colors.secondary}
            style={styles.searchLoading}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  searchInput: {
    flexGrow: 1,
    paddingVertical: 20,
    lineHeight: 24,
    fontSize: 24,
    color: colors.primary,
  },
  searchIcon: {
    paddingHorizontal: 10,
  },
  searchContent: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    marginVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
  },
  searchLoading: {
    paddingHorizontal: 10,
  },
  appTitle: {
    textAlign: 'center',
    fontFamily: 'TwitchyTV',
    fontSize: 38,
    color: colors.background,
  },
});
