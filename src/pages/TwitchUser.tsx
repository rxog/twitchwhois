/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  ImageBackground,
  RefreshControl,
  Vibration,
  Linking,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import TwitchAPI from '@/utils/TwitchAPI';
import ptBR from 'date-fns/locale/pt-BR';
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import Icon from '@/components/Icon';
import {actions} from '@/store/reducers/results';
import {useRoute} from '@react-navigation/native';
import {useDispatch, useStore} from 'react-redux';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RouteParams} from '@/utils/types/RouteParams';
import {RootState} from '../store';
import ISO6391 from 'iso-639-1';
import {
  Avatar,
  Badge,
  Card,
  Button,
  useTheme,
  List,
  Divider,
  Chip,
  Text,
  ActivityIndicator,
  MD3Colors,
} from 'react-native-paper';
import addMinutes from 'date-fns/addMinutes';
import ResultBox from '@/components/ResultBox';
import LinearGradient from 'react-native-linear-gradient';
import Fonts from './Styles/Fonts';
import {capitalize} from 'lodash';
import Uptime from '@/utils/Uptime';

export default function TwitchUserPage(props: NativeStackScreenProps<any>) {
  const dispatch = useDispatch();
  const store = useStore<RootState>();
  const {settings} = store.getState();
  const [userdata, setUserData] = useState<any>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>();
  const [isAvailable, setIsAvailable] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const {colors, fonts} = useTheme();
  const navigation = props.navigation;
  const route = useRoute();
  const params: RouteParams = route.params as RouteParams;
  const username = params.username as string;

  const fetchUserData = async () => {
    return await TwitchAPI.getAllData(username)
      .then(async data => {
        if (data) {
          setUserData(data);
          if (data.thumbnail_url) {
            setBackgroundImage(
              data.thumbnail_url.replace('{width}x{height}', '1280x720'),
            );
          } else if (data.offline_image_url) {
            setBackgroundImage(data.offline_image_url);
          } else {
            setBackgroundImage(data.profile_image_url);
          }
        } else {
          await TwitchAPI.isAvailable(username).then(setIsAvailable);
        }
      })
      .finally(() => {
        setRefreshing(false);
        setLoading(false);
      });
  };

  useLayoutEffect(() => {
    if (!username || userdata) {
      return;
    }
    fetchUserData();
  }, [username]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    );
  }

  if (!userdata && isAvailable !== null) {
    Vibration.vibrate();
    const now = new Date();
    switch (isAvailable) {
      case -1:
        return (
          <ResultBox
            onPress={() => {
              navigation.goBack();
            }}
            backgroundColor="#f44336"
            textColor={MD3Colors.neutral100}
            textHeader={username}
            textBody="está indisponível!"
            textBottom="Infelizmente a Twitch não permite mais nomes de usuário como este, tente outro que atenda os requisitos: mais de 3 caracteres, sem espaços ou tranços."
          />
        );
      case 0:
        return (
          <ResultBox
            textHeader={username}
            textBody="está indisponível!"
            textBottom="Pressione a tela para rastrear a disponibilidade"
            textColor={MD3Colors.neutral100}
            backgroundColor="#f44336"
            onPress={() =>
              ToastAndroid.show(
                'Mantenha a tela pressionada',
                ToastAndroid.SHORT,
              )
            }
            onLongPress={async () => {
              dispatch(
                actions.saveResult({
                  username,
                  running: true,
                  status: isAvailable,
                  lastCheck: now.toISOString(),
                  nextCheck: addMinutes(now, settings.interval).toISOString(),
                }),
              );
              navigation.goBack();
              navigation.navigate('monitor');
            }}
          />
        );
      case 1:
        return (
          <ResultBox
            onPress={() => {
              navigation.goBack();
              Linking.openURL('https://www.twitch.tv/login');
            }}
            backgroundColor="#66bb6a"
            textColor={MD3Colors.neutral100}
            textHeader={username}
            textBody="está disponível!"
            textBottom="Clique para registrar (abre o navegador padrão)"
          />
        );
    }
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchUserData();
          }}
        />
      }>
      <ImageBackground
        source={{
          uri: backgroundImage,
        }}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        resizeMode="cover">
        <LinearGradient
          colors={['transparent', '#000']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <View style={{marginTop: 15}}>
          {userdata && userdata.hasOwnProperty('profile_image_url') && (
            <Avatar.Image
              size={150}
              source={{uri: userdata.profile_image_url}}
            />
          )}
          {userdata && userdata.hasOwnProperty('started_at') && (
            <Badge
              size={30}
              style={{
                position: 'absolute',
                right: -10,
                top: 10,
                color: '#fff',
                backgroundColor: '#f44336',
              }}
              onPress={() =>
                Linking.openURL(`https://m.twitch.tv/${username}`)
              }>
              {userdata.type && userdata.type === 'live' ? 'AO VIVO' : 'RERUN'}
            </Badge>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}>
          <Text
            style={[
              fonts.displayMedium,
              {
                color: MD3Colors.tertiary99,
                fontWeight: 'bold',
                textShadowOffset: {width: 2, height: 2},
                textShadowRadius: 5,
                textShadowColor: colors.shadow,
                transform: [
                  {
                    translateY: -1,
                  },
                ],
              },
            ]}>
            {userdata.display_name}
          </Text>
          {userdata.broadcaster_type === 'partner' && (
            <Icon
              style={{
                textShadowOffset: {width: 0, height: 0},
                textShadowRadius: 20,
                textShadowColor: colors.shadow,
              }}
              from="materialIcons"
              name="verified"
              size={36}
              color={MD3Colors.tertiary90}
            />
          )}
        </View>
        <Text
          style={[
            fonts.bodyMedium,
            {
              color: '#ccc',
              textShadowOffset: {width: 2, height: 2},
              textShadowRadius: 5,
              textShadowColor: colors.shadow,
              textAlign: 'center',
              marginBottom: 15,
              paddingHorizontal: 20,
            },
          ]}>
          {userdata?.description}
        </Text>
      </ImageBackground>
      <Card style={{borderRadius: 0, paddingHorizontal: 10}}>
        <Card.Actions
          style={{
            flexDirection: 'row',
            gap: 5,
          }}>
          <Button
            onPress={() =>
              Linking.openURL(`https://www.twitch.tv/${username}`)
            }>
            Seguir
          </Button>
          {userdata.broadcaster_type && (
            <Button
              onPress={() =>
                Linking.openURL(`https://twitch.tv/subs/${username}`)
              }>
              Inscrever-se
            </Button>
          )}
        </Card.Actions>
      </Card>
      <List.Section>
        <List.Subheader style={Fonts.RobotoRegular}>
          Informações da conta
        </List.Subheader>
        {userdata && userdata.hasOwnProperty('broadcaster_type') && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={Fonts.RobotoLight}
              title="Tipo"
              description={
                userdata.broadcaster_type === 'partner'
                  ? 'Parceira'
                  : userdata.broadcaster_type === 'affiliate'
                  ? 'Afiliada'
                  : 'Normal'
              }
            />
          </>
        )}
        {userdata && userdata.hasOwnProperty('id') && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={Fonts.RobotoLight}
              title="ID"
              description={userdata.id}
            />
          </>
        )}
        {userdata && userdata.hasOwnProperty('follows') && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={Fonts.RobotoLight}
              title="Seguidores"
              description={Number(userdata.follows).toLocaleString('pt-BR')}
            />
          </>
        )}
        {userdata && userdata.hasOwnProperty('created_at') && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={Fonts.RobotoLight}
              title="Idade"
              description={capitalize(
                formatDistanceToNow(Date.parse(userdata.created_at), {
                  locale: ptBR,
                }),
              )}
            />
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={Fonts.RobotoLight}
              title="Criada em"
              description={capitalize(
                format(
                  Date.parse(userdata.created_at),
                  'EEE, dd/MM/yyyy HH:mm:ss',
                  {
                    locale: ptBR,
                  },
                ),
              )}
            />
          </>
        )}
        {userdata && userdata.hasOwnProperty('broadcaster_language') && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={Fonts.RobotoLight}
              title="Língua"
              description={ISO6391.getNativeName(userdata.broadcaster_language)}
            />
          </>
        )}
        {userdata && userdata.hasOwnProperty('title') && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={Fonts.RobotoLight}
              title="Título"
              description={userdata.title}
            />
          </>
        )}
        {userdata && userdata.hasOwnProperty('game_name') && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={Fonts.RobotoLight}
              title="Categoria"
              description={userdata.game_name}
            />
          </>
        )}
        {userdata && userdata.hasOwnProperty('started_at') && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={Fonts.RobotoLight}
              title={userdata.type === 'live' ? 'Ao vivo há' : 'Reprisando há'}
              description={Uptime(new Date(userdata.started_at))}
            />
          </>
        )}
        {userdata && userdata.hasOwnProperty('viewer_count') && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={Fonts.RobotoLight}
              title="Espectadores"
              description={Number(userdata.viewer_count).toLocaleString(
                'pt-br',
              )}
            />
          </>
        )}
        {userdata && userdata.hasOwnProperty('is_mature') && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={Fonts.RobotoLight}
              title="Público"
              description={userdata.is_mature ? 'Adulto' : 'Livre'}
            />
          </>
        )}
        {userdata && userdata.hasOwnProperty('tags') && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
              title="Tags"
              description={() => <ChipList chips={userdata.tags} />}
            />
          </>
        )}
      </List.Section>
      <Divider />
    </ScrollView>
  );
}

const ChipList = ({chips}: {chips: React.ReactElement[]}) => {
  return (
    <View
      style={{
        marginVertical: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
      }}>
      {chips.map((chip, index) => (
        <Chip key={`chip-${index + 1}`}>{chip}</Chip>
      ))}
    </View>
  );
};
