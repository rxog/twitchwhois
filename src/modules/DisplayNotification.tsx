import notifee, {
  AndroidVisibility,
  AndroidImportance,
} from '@notifee/react-native';

export default async function displayNotification(username: string) {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'app-monitor',
    name: 'Notificações do monitor',
    visibility: AndroidVisibility.PUBLIC,
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });

  await notifee.displayNotification({
    title: 'Nome disponível!',
    body: `<b>${username}</b> está disponível na Twitch!`,
    android: {
      channelId,
      pressAction: {
        id: 'monitor',
        launchActivity: 'com.twitchwhois.MainActivity',
      },
    },
  });
}
