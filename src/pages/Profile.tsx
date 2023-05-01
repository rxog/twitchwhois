/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import ISO6391 from 'iso-639-1';
import {format, formatDistanceToNowStrict} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import ImageColors from 'react-native-image-colors';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  Text,
  View,
  ImageBackground,
  ScrollView,
  Image,
  Linking,
  FlatList,
  ColorValue,
} from 'react-native';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Headline from '@/components/Headline';
import Divider from '@/components/Divider';
import Button from '@/components/Button';
import React from 'react';
import VideoList from '@/components/VideoList';
import Popover from '@/components/Popover';
import {orderBy} from 'lodash';
import Schedule from '@/components/Schedule';
import {colorAlpha, colors} from '@/assets/styles';
import Icon from '@/components/Icon';
import {useFocusEffect} from '@react-navigation/native';
import {ProfileScreenProps} from 'src/types/Navigation';
import {AndroidImageColors} from 'react-native-image-colors/lib/typescript/types';
import StatusBar from '@/components/StatusBar';
import Loading from '@/components/Loading';
import Avatar from '@/components/Avatar';
import Hyperlink from 'react-native-hyperlink';

const DataField = ({
  title,
  description,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
}) => {
  if (!title || !description) {
    return null;
  }

  return (
    <View>
      <Text style={{color: colors.secondary, fontWeight: 'bold', fontSize: 16}}>
        {title}
      </Text>
      {typeof description === 'string' ? (
        <Hyperlink
          onPress={(url, _text) =>
            Linking.canOpenURL(url).then(open => open && Linking.openURL(url))
          }>
          <Text
            style={{color: colors.primary, fontWeight: 'normal', fontSize: 14}}>
            {description}
          </Text>
        </Hyperlink>
      ) : (
        description
      )}
      <Divider />
    </View>
  );
};

export default function Profile({navigation, route}: ProfileScreenProps) {
  const [_isSticky, setIsSticky] = React.useState(false);
  const [coverProps, setCoverProps] = React.useState<AndroidImageColors>();
  const [coverHeight, setCoverHeight] = React.useState(0);
  const [profileColor, setProfileColor] = React.useState<ColorValue>();

  const profile = route.params.profile;
  const createdAt = Date.parse(profile.created_at);
  const coverImage = (
    profile.stream?.thumbnail_url ||
    profile.offline_image_url ||
    profile.profile_image_url
  ).replace('{width}x{height}', '1280x720');

  let accountType;
  switch (profile.broadcaster_type) {
    case 'partner':
      accountType = 'Parceira';
      break;
    case 'affiliate':
      accountType = 'Afiliada';
      break;
  }

  React.useEffect(() => {
    if (coverImage) {
      ImageColors.getColors(coverImage, {
        fallback: colors.primary,
      }).then(results => {
        if (results.platform === 'android') {
          setCoverProps(results);
        }
      });
    }
  }, [coverImage]);

  React.useEffect(() => {
    if (coverProps) {
      setProfileColor(profile.color || coverProps.lightVibrant);
    }
  }, [coverProps, profile?.color]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setCoverProps(undefined);
        setCoverHeight(0);
        setProfileColor(undefined);
        if (navigation.canGoBack()) {
          navigation.pop();
        }
      };
    }, [navigation]),
  );

  if (!profileColor) {
    return <Loading />;
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingBottom: 100,
        backgroundColor: colors.background,
        flexGrow: 1,
      }}
      stickyHeaderIndices={[1]}
      onScroll={event => {
        const offset = event.nativeEvent.contentOffset;
        const stickyOffset = coverHeight;
        setIsSticky(offset.y > stickyOffset);
      }}>
      <ImageBackground
        source={{uri: coverImage}}
        resizeMode="cover"
        onLayout={event => setCoverHeight(event.nativeEvent.layout.height)}>
        <LinearGradient
          colors={[colorAlpha(colors.dark, 0.1), colorAlpha(colors.dark, 0.8)]}
          locations={[0.1, 0.8]}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}>
            <Avatar
              source={profile.profile_image_url}
              size={150}
              borderColor={profileColor}
              borderWidth={6}
              isLive={!!profile.stream}
            />
            <Text
              style={{
                color: colors.text,
                fontSize: 28,
                fontWeight: 'bold',
                textShadowOffset: {
                  height: 2,
                  width: 2,
                },
                textShadowRadius: 2,
                textShadowColor: colors.dark,
              }}>
              {profile.display_name}
              {profile.broadcaster_type === 'partner' && (
                <>
                  {' '}
                  <Icon
                    from="materialIcons"
                    name="verified"
                    size={20}
                    color={colors.primary}
                  />
                </>
              )}
            </Text>
            <Text
              style={{
                color: colors.primary,
                fontSize: 14,
                textShadowOffset: {
                  height: 2,
                  width: 2,
                },
                textShadowRadius: 2,
                textShadowColor: colors.dark,
              }}>
              @{profile.login}
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
      <View>
        <StatusBar hidden={true} backgroundColor={colors.backgroundVariant} />
        <Animated.View
          style={[
            {
              borderBottomRightRadius: 12,
              borderBottomLeftRadius: 12,
              flexDirection: 'row',
              backgroundColor: colors.backgroundVariant,
              elevation: 4,
              padding: 20,
              gap: 20,
            },
          ]}>
          <Button
            onPress={() =>
              Linking.openURL(`https://www.twitch.tv/${profile.login}`)
            }
            icon={({pressed, color, size}) => {
              return (
                <Icon
                  from="materialIcons"
                  name={pressed ? 'favorite' : 'favorite-outline'}
                  size={size}
                  color={color}
                />
              );
            }}>
            Seguir
          </Button>
          {accountType && (
            <Button
              textColor={colors.background}
              color={colors.primary}
              onPress={() =>
                Linking.openURL(`https://www.twitch.tv/subs/${profile.login}`)
              }
              icon={({pressed, color, size}) => {
                return (
                  <Icon
                    from="materialIcons"
                    name={pressed ? 'star' : 'star-outline'}
                    size={size}
                    color={color}
                  />
                );
              }}>
              Inscrever-se
            </Button>
          )}
        </Animated.View>
      </View>
      <View
        style={{
          padding: 20,
        }}>
        <Headline>Conta {accountType}</Headline>
        <Divider />
        {profile.soundtrack && (
          <DataField
            title="Ouvindo"
            description={
              profile.soundtrack.track.title +
              ' - ' +
              profile.soundtrack.track.artists
                .map(artist => artist.name)
                .join(', ')
            }
          />
        )}
        <DataField title="Descrição" description={profile.description} />
        <DataField title="ID" description={profile.id} />
        {profile.color && (
          <DataField
            title="Cor do nick"
            description={
              <Button
                color={profile.color}
                style={{marginTop: 5}}
                radius={25}
                onPress={() => {
                  Clipboard.setString(profile.color);
                }}>
                {profile.color}
              </Button>
            }
          />
        )}
        <DataField
          title="Criada em"
          description={`${format(createdAt, 'PPP', {
            locale: ptBR,
          })} (há ${formatDistanceToNowStrict(createdAt, {
            locale: ptBR,
            roundingMethod: 'floor',
          })})`}
        />
        <DataField
          title="Seguidores"
          description={Number(profile.channel.follows).toLocaleString('pt-BR')}
        />
        <DataField title="Título" description={profile.channel.title} />
        <DataField
          title="Nome do Jogo/Categoria"
          description={profile.channel.game_name}
        />
        <DataField
          title="ID do Jogo/Categoria"
          description={profile.channel.game_id}
        />
        <DataField
          title="Língua"
          description={ISO6391.getNativeName(
            profile.channel.broadcaster_language,
          )}
        />
        <DataField
          title="Chat"
          description={
            Object.values(profile.chatstate).some(value => value === true) && (
              <View style={{marginTop: 5, marginHorizontal: -20}}>
                <FlatList
                  data={Object.entries(profile.chatstate).reduce<string[]>(
                    (acc, values) => {
                      const [key, value] = values;
                      if (value === true) {
                        acc.push(key);
                      }
                      return acc;
                    },
                    [],
                  )}
                  keyExtractor={chat => chat}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: 5,
                    paddingHorizontal: 20,
                  }}
                  renderItem={({item: chat}) => {
                    switch (chat) {
                      case 'slow_mode':
                        return (
                          <Button
                            color={colors.primary}
                            textColor={colors.backgroundVariant}
                            radius={20}
                            textSize={12}>
                            Modo lento
                          </Button>
                        );
                      case 'follower_mode':
                        return (
                          <Button
                            color={colors.primary}
                            textColor={colors.backgroundVariant}
                            radius={20}
                            textSize={12}>
                            Somente seguidores
                          </Button>
                        );
                      case 'subscriber_mode':
                        return (
                          <Button
                            color={colors.primary}
                            textColor={colors.backgroundVariant}
                            radius={20}
                            textSize={12}>
                            Somente inscritos
                          </Button>
                        );
                      case 'emote_mode':
                        return (
                          <Button
                            color={colors.primary}
                            textColor={colors.backgroundVariant}
                            radius={20}
                            textSize={12}>
                            Somente emotes
                          </Button>
                        );
                      case 'unique_chat_mode':
                        return (
                          <Button
                            color={colors.primary}
                            textColor={colors.backgroundVariant}
                            radius={20}
                            textSize={12}>
                            Sem repetições
                          </Button>
                        );
                      default:
                        return null;
                    }
                  }}
                />
              </View>
            )
          }
        />
        <DataField
          title="Tags"
          description={
            profile.channel.tags &&
            !!profile.channel.tags.length && (
              <View style={{marginTop: 5, marginHorizontal: -20}}>
                <FlatList
                  data={profile.channel.tags}
                  keyExtractor={tag => tag}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: 5,
                    paddingHorizontal: 20,
                  }}
                  renderItem={({item: tag}) => (
                    <Button
                      color={colors.primary}
                      textColor={colors.backgroundVariant}
                      radius={20}
                      textSize={12}>
                      {tag}
                    </Button>
                  )}
                />
              </View>
            )
          }
        />
        {profile.stream && (
          <View>
            <DataField
              title={
                profile.stream?.type === 'live'
                  ? 'Ao vivo'
                  : profile.stream?.type === 'rerun' && 'Retransmitindo'
              }
              description={`${Number(
                profile.stream?.viewer_count,
              ).toLocaleString('pt-BR')} espectadores`}
            />
            <DataField
              title="Publico"
              description={profile.stream?.is_mature ? '+18' : 'Livre'}
            />
          </View>
        )}
        {profile.emotes && !!profile.emotes.length && (
          <View>
            <Headline>Emotes</Headline>
            <Divider />
            <View
              style={{
                marginHorizontal: -20,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
              }}>
              {orderBy(profile.emotes, ['emote_type', 'name'], 'desc').map(
                emote => {
                  return (
                    <Popover
                      key={emote.id}
                      content={
                        <View onLayout={() => Clipboard.setString(emote.name)}>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              color: colors.dark,
                            }}>
                            {emote.name}
                          </Text>
                          <Divider />
                          <Text
                            style={{
                              color: colors.dark,
                            }}>
                            {emote.emote_type === 'subscriptions'
                              ? `Inscrito (Tier ${Number(emote.tier) / 1000})`
                              : emote.emote_type === 'bitstier'
                              ? 'Bits'
                              : 'Seguidor'}
                          </Text>
                        </View>
                      }>
                      <Image
                        source={{uri: emote.images.url_2x}}
                        style={{height: 44, width: 44}}
                      />
                    </Popover>
                  );
                },
              )}
            </View>
            <Divider />
          </View>
        )}
        {profile.badges && !!profile.badges.length && (
          <View>
            <Headline>Badges</Headline>
            <Divider />
            <View
              style={{
                marginHorizontal: -20,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
              }}>
              {profile.badges.map(badges =>
                orderBy(badges.versions, o => +o.id).map(badge => {
                  return (
                    <Popover
                      content={
                        <Text
                          style={{
                            color: colors.dark,
                          }}>
                          {badge.title}
                        </Text>
                      }
                      key={badge.id}>
                      <Image
                        source={{uri: badge.image_url_2x}}
                        style={{height: 38, width: 38}}
                      />
                    </Popover>
                  );
                }),
              )}
            </View>
            <Divider />
          </View>
        )}
        {profile.clips && (
          <View>
            <Headline>Clips</Headline>
            <Divider />
            <View
              style={{
                marginHorizontal: -20,
              }}>
              <VideoList userId={profile.id} type="clips" />
            </View>
            <Divider />
          </View>
        )}
        {profile.videos && (
          <View>
            <Headline>Vídeos</Headline>
            <Divider />
            <View
              style={{
                marginHorizontal: -20,
              }}>
              <VideoList userId={profile.id} type="videos" />
            </View>
            <Divider />
          </View>
        )}
        {profile.schedule && (
          <View>
            <Headline>Agenda</Headline>
            <Divider />
            <View
              style={{
                marginHorizontal: -20,
              }}>
              <Schedule data={profile.schedule} />
            </View>
            <Divider />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
