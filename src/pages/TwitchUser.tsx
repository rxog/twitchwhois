/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Image,
  ImageBackground,
  RefreshControl,
  Vibration,
  Linking,
  ToastAndroid,
  Animated,
  ScrollView,
} from 'react-native';
import Twitch from '@/utils/TwitchAPI';
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
  Tooltip,
  TouchableRipple,
} from 'react-native-paper';
import addMinutes from 'date-fns/addMinutes';
import ResultBox from '@/components/ResultBox';
import LinearGradient from 'react-native-linear-gradient';
import Fonts from './Styles/Fonts';
import {capitalize, uniqBy} from 'lodash';
import Uptime from '@/utils/Uptime';
import {TwitchAllData} from '@/utils/types/TwitchData';
import BackgroundTask from '@/modules/BackgroundTask';
import RunBackgroundTask from '@/modules/RunBackgroundTask';
import TwitchVideos from '@/components/TwitchVideoClips';
import ThemeColors from './Styles/ThemeColors';
import TwitchSchedule from '@/components/Schedule';

export default function TwitchUserPage(props: NativeStackScreenProps<any>) {
  const dispatch = useDispatch();
  const store = useStore<RootState>();
  const {settings} = store.getState();
  const [userdata, setUserData] = useState<TwitchAllData | null>(null);
  const [streamUptime, setStreamUptime] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>();
  const [isAvailable, setIsAvailable] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const {colors, fonts} = useTheme();
  const navigation = props.navigation;
  const route = useRoute();
  const params: RouteParams = route.params as RouteParams;
  const username = params.username as string;
  const [backgroundSize, setBackgroundSize] = useState({width: 0, height: 0});
  const [scrollY, setScrollY] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const animatedBackButton = useRef(new Animated.Value(0)).current;
  const backButtonPosition = useCallback(
    () => (scrollY > backgroundSize.height ? 'top' : 'screen'),
    [scrollY, backgroundSize.height],
  );

  useMemo(() => {
    Animated.timing(animatedBackButton, {
      toValue: backButtonPosition() === 'screen' ? 0 : 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [backButtonPosition()]);

  const fetchUserData = () => {
    Twitch.getAllData(username)
      .then(async data => {
        if (data) {
          setUserData(data);
          if (data.stream && data.stream.thumbnail_url) {
            const started = new Date(data.stream?.started_at as string);
            setStreamUptime(Uptime(started));
            setBackgroundImage(
              data.stream.thumbnail_url.replace('{width}x{height}', '1280x720'),
            );
          } else if (data.offline_image_url) {
            setBackgroundImage(data.offline_image_url);
          } else {
            setBackgroundImage(data.profile_image_url);
          }
        } else {
          await Twitch.isAvailable(username).then(setIsAvailable);
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
              if (!BackgroundTask.isRunning) {
                RunBackgroundTask();
              }
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
      ref={scrollViewRef}
      scrollEventThrottle={16}
      onScroll={({nativeEvent: {contentOffset}}) => {
        setScrollY(contentOffset.y);
      }}
      stickyHeaderIndices={[1]}
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
        onLayout={event => {
          const {width, height} = event.nativeEvent.layout;
          setBackgroundSize({width, height});
        }}
        source={{
          uri: backgroundImage,
        }}
        style={{
          flex: 1,
          padding: 20,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 25,
        }}
        resizeMode="cover">
        <LinearGradient
          colors={[
            ThemeColors.Dark.colors.backdrop,
            ThemeColors.Dark.colors.primaryContainer,
          ]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <View>
          {userdata && userdata.hasOwnProperty('profile_image_url') && (
            <View
              style={{
                borderWidth: 6,
                borderColor: userdata.color?.length
                  ? userdata.color
                  : 'transparent',
                borderRadius: 100,
              }}>
              <Avatar.Image
                size={150}
                style={{backgroundColor: userdata.color}}
                source={{uri: userdata.profile_image_url}}
              />
            </View>
          )}
          {userdata &&
            userdata.stream &&
            userdata.stream.type &&
            !!userdata.stream.type.length && (
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
                  Linking.openURL(`https://www.twitch.tv/${username}`)
                }>
                {userdata.stream.type === 'live' ? 'AO VIVO' : 'RERUN'}
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
              },
            ]}>
            {userdata?.display_name}
          </Text>
          {userdata &&
            userdata.broadcaster_type &&
            userdata.broadcaster_type === 'partner' && (
              <Icon
                style={{
                  textShadowOffset: {width: 0, height: 0},
                  textShadowRadius: 20,
                  textShadowColor: colors.shadow,
                }}
                from="materialIcons"
                name="verified"
                size={36}
                color={MD3Colors.tertiary80}
              />
            )}
        </View>
        {userdata && userdata.login && !!userdata.login.length && (
          <Text
            variant="headlineSmall"
            style={[
              {
                color: MD3Colors.tertiary80,
                textAlign: 'center',
                paddingBottom: 10,
              },
            ]}>
            @{userdata.login}
          </Text>
        )}
        {userdata && userdata.description && !!userdata.description.length && (
          <Text
            variant="bodyMedium"
            numberOfLines={3}
            style={[
              {
                color: MD3Colors.neutralVariant99,
                textShadowOffset: {width: 1, height: 1},
                textShadowRadius: 5,
                textShadowColor: colors.shadow,
                textAlign: 'center',
                paddingHorizontal: 20,
              },
            ]}>
            {userdata.description}
          </Text>
        )}
      </ImageBackground>
      <Card
        mode="elevated"
        style={{
          marginTop: -10,
        }}>
        <Card.Content
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              gap: 8,
              flex: 1,
              flexDirection: 'row',
            }}>
            <Button
              mode="contained-tonal"
              onPress={() =>
                Linking.openURL(`https://www.twitch.tv/${username}`)
              }>
              Seguir
            </Button>
            {userdata?.broadcaster_type && (
              <Button
                mode="contained"
                onPress={() =>
                  Linking.openURL(`https://twitch.tv/subs/${username}`)
                }>
                Inscrever-se
              </Button>
            )}
          </View>
          <Animated.View
            style={[
              {
                borderRadius: 100,
                overflow: 'hidden',
                transform: [
                  {
                    rotate: animatedBackButton.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '90deg'],
                    }),
                  },
                ],
              },
            ]}>
            <TouchableRipple
              style={{
                padding: 10,
              }}
              onPress={() => {
                if (backButtonPosition() === 'top') {
                  scrollViewRef.current?.scrollTo({y: 0, x: 0, animated: true});
                  return;
                }

                navigation.canGoBack() && navigation.goBack();
              }}>
              <Text>
                <Icon from="materialIcons" name="arrow-back" size={20} />
              </Text>
            </TouchableRipple>
          </Animated.View>
        </Card.Content>
      </Card>
      <Text
        variant="headlineMedium"
        style={[
          Fonts.TwitchyTV,
          {
            margin: 10,
          },
        ]}>
        conta
      </Text>
      <List.Section>
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
        {userdata && userdata.id && (
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
        {userdata && userdata.login && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={Fonts.RobotoLight}
              title="Cor"
              description={userdata.color}
            />
          </>
        )}
        {userdata && userdata.channel && !!userdata.channel.follows && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={Fonts.RobotoLight}
              title="Seguidores"
              description={Number(userdata.channel.follows).toLocaleString(
                'pt-BR',
              )}
            />
          </>
        )}
        {userdata && userdata.created_at && !!userdata.created_at.length && (
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
        {userdata &&
          userdata.channel &&
          userdata.channel.broadcaster_language &&
          !!userdata.channel.broadcaster_language.length && (
            <>
              <Divider />
              <List.Item
                titleStyle={Fonts.RobotoRegular}
                descriptionStyle={Fonts.RobotoLight}
                title="Língua"
                description={ISO6391.getNativeName(
                  userdata.channel.broadcaster_language,
                )}
              />
            </>
          )}
        {userdata &&
          userdata.channel &&
          userdata.channel.title &&
          !!userdata.channel.title.length && (
            <>
              <Divider />
              <List.Item
                titleStyle={Fonts.RobotoRegular}
                descriptionStyle={Fonts.RobotoLight}
                title="Título"
                description={userdata.channel.title}
              />
            </>
          )}
        {userdata &&
          userdata.channel &&
          userdata.channel.game_name &&
          !!userdata.channel.game_name.length && (
            <>
              <Divider />
              <List.Item
                titleStyle={Fonts.RobotoRegular}
                descriptionStyle={Fonts.RobotoLight}
                title="Categoria"
                description={userdata.channel.game_name}
              />
            </>
          )}
        {userdata &&
          userdata.stream &&
          userdata.stream.started_at &&
          !!userdata.stream.started_at.length && (
            <>
              <Divider />
              <List.Item
                titleStyle={Fonts.RobotoRegular}
                descriptionStyle={Fonts.RobotoLight}
                title={
                  userdata.stream.type === 'live'
                    ? 'Ao vivo há'
                    : 'Reprisando há'
                }
                description={streamUptime}
              />
            </>
          )}
        {userdata && userdata.stream && userdata.stream.viewer_count && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={Fonts.RobotoLight}
              title="Espectadores"
              description={Number(userdata.stream.viewer_count).toLocaleString(
                'pt-br',
              )}
            />
          </>
        )}
        {userdata && userdata.stream && userdata.stream.is_mature && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={Fonts.RobotoLight}
              title="Público"
              description={userdata.stream.is_mature ? 'Adulto' : 'Livre'}
            />
          </>
        )}
        {userdata && userdata.badges && !!userdata.badges.length && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              title="Badges"
              description={() => {
                const mergedBadges = userdata.badges?.flatMap(badges => {
                  const uniqBadges = uniqBy(badges?.versions, 'title');
                  return uniqBadges.map(badge => (
                    <Tooltip
                      enterTouchDelay={100}
                      title={badge.title as string}
                      key={badge.id}>
                      <Image
                        source={{
                          uri: badge.image_url_2x,
                          width: 36,
                          height: 36,
                        }}
                      />
                    </Tooltip>
                  ));
                });
                return (
                  <View
                    style={{
                      gap: 10,
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 5,
                    }}>
                    {mergedBadges}
                  </View>
                );
              }}
            />
          </>
        )}
        {userdata && userdata.emotes && !!userdata.emotes.length && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
              title="Emotes"
              description={() => {
                const emotes = userdata.emotes?.map(emote => (
                  <Tooltip
                    enterTouchDelay={100}
                    title={emote.name as string}
                    key={emote.id}>
                    <Image
                      source={{
                        uri: emote.images?.url_2x,
                        width: 36,
                        height: 36,
                      }}
                    />
                  </Tooltip>
                ));
                return (
                  <View
                    style={{
                      gap: 10,
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 5,
                    }}>
                    {emotes}
                  </View>
                );
              }}
            />
          </>
        )}
        {userdata &&
          userdata.chatstate &&
          !!Object.entries(userdata.chatstate).some(([key, value]) => {
            return !!value && key;
          }) && (
            <>
              <Divider />
              <List.Item
                titleStyle={Fonts.RobotoRegular}
                descriptionStyle={{
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}
                title="Chat mode"
                description={() => {
                  const only_emotes = userdata.chatstate?.emote_mode && (
                    <Chip>Somente emotes</Chip>
                  );
                  const only_follows = userdata.chatstate?.follower_mode && (
                    <Chip>Somente seguidores</Chip>
                  );
                  const only_subs = userdata.chatstate?.subscriber_mode && (
                    <Chip>Somente inscritos</Chip>
                  );
                  const slow_mode = userdata.chatstate?.slow_mode && (
                    <Chip>Modo lento</Chip>
                  );
                  const unique_mode = userdata.chatstate?.unique_chat_mode && (
                    <Chip>Sem repetições</Chip>
                  );

                  return (
                    <View
                      style={{
                        marginVertical: 5,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: 5,
                      }}>
                      {only_emotes}
                      {only_follows}
                      {only_subs}
                      {slow_mode}
                      {unique_mode}
                    </View>
                  );
                }}
              />
            </>
          )}
        {userdata && userdata.chatstate && userdata.chatstate.emote_mode && (
          <>
            <Divider />
            <List.Item
              titleStyle={Fonts.RobotoRegular}
              descriptionStyle={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
              title="Somente emotes?"
              description="Sim"
            />
          </>
        )}
        {userdata &&
          userdata.channel &&
          userdata.channel.tags &&
          !!userdata.channel.tags.length && (
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
                description={() => (
                  <ChipList chips={userdata.channel?.tags || []} />
                )}
              />
            </>
          )}
      </List.Section>
      {userdata &&
        userdata.schedule &&
        !!userdata.schedule.segments?.length && (
          <TwitchSchedule data={userdata.schedule.segments} />
        )}
      {userdata && userdata.clips && (
        <TwitchVideos type="clips" userId={userdata.id as string} />
      )}
      {userdata && userdata.videos && (
        <TwitchVideos type="videos" userId={userdata.id as string} />
      )}
    </ScrollView>
  );
}

const ChipList = ({chips}: {chips: string[]}) => {
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
