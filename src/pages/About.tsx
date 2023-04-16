/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Divider, List, Text, useTheme} from 'react-native-paper';
import {View, StyleSheet, Pressable, ScrollView} from 'react-native';
import Fonts from './Styles/Fonts';
import Icon from '@/components/Icon';
import {Linking} from 'react-native';

export default function AboutPage(): JSX.Element {
  const {fonts} = useTheme();

  return (
    <ScrollView>
      <Divider />
      <List.AccordionGroup>
        <List.Accordion
          title="Motivação"
          id="motivacao"
          titleStyle={[fonts.headlineSmall, Fonts.RobotoBlack]}>
          <Divider />
          <View style={style.content}>
            <Text style={Fonts.RobotoRegular}>
              A motivação por trás do desenvolvimento do Twitch Who Is é
              simples: resolver um problema que o criador, Ronis Xogum,
              enfrentou pessoalmente ao tentar monitorar um nome de usuário
              desejado na plataforma Twitch. Como usuário da Twitch, Xogum
              encontrou dificuldades ao tentar encontrar um nome de usuário
              disponível para ser usado em sua conta. Ele precisou monitorar o
              nome por um tempo até que ele se tornasse disponível, o que o
              motivou a criar o aplicativo Twitch Who Is.
              {'\n\n'}O Twitch Who Is é um aplicativo criado por um usuário da
              Twitch, para usuários da Twitch, e a paixão de Xogum pela
              plataforma é evidente em seu trabalho. O objetivo final é ajudar
              os usuários da Twitch a encontrar e usar nomes de usuário
              desejados de maneira mais fácil e eficiente.
              {'\n\n'}O desenvolvimento do aplicativo foi realizado de forma
              independente, com Xogum assumindo todas as responsabilidades de
              design, programação e manutenção do aplicativo.
            </Text>
          </View>
        </List.Accordion>
        <Divider />
        <List.Accordion
          title="O que é?"
          id="o-que-e"
          titleStyle={[fonts.headlineSmall, Fonts.RobotoBlack]}>
          <Divider />
          <View style={style.content}>
            <Text style={Fonts.RobotoRegular}>
              Twitch Who Is é um aplicativo projetado para ajudar os usuários a
              verificar a disponibilidade de nomes de usuário na plataforma
              Twitch. Ele permite que os usuários insiram um nome de usuário
              desejado e, em seguida, verifiquem se esse nome já está em uso ou
              disponível para registro na plataforma. O aplicativo também
              oferece a opção de monitorar nomes de usuário indisponíveis e
              notificar o usuário quando o nome se torna disponível.{'\n\n'}Além
              disso, o Twitch Who Is oferece uma interface fácil de usar e
              recursos simples, como a exclusão de nomes de usuário da lista de
              monitoramento. Com esse aplicativo, os usuários podem facilmente
              descobrir se um nome de usuário está disponível ou não na Twitch
              e, assim, registrar um novo nome de usuário que melhor represente
              sua identidade na plataforma.
            </Text>
          </View>
        </List.Accordion>
        <Divider />
        <List.Accordion
          title="Como usar?"
          id="como-usar"
          titleStyle={[fonts.headlineSmall, Fonts.RobotoBlack]}>
          <Divider />
          <View style={style.content}>
            <Text style={Fonts.RobotoRegular}>
              Ao abrir o aplicativo, o usuário é levado diretamente para a tela
              de busca, onde pode inserir um nome de usuário desejado. Se o nome
              estiver em uso, os dados do usuário correspondente são exibidos na
              tela. Caso contrário, é verificada a disponibilidade do nome de
              usuário naquele momento, podendo ser{' '}
              <Text style={{fontWeight: 'bold'}}>DISPONÍVEL</Text> ou{' '}
              <Text style={{fontWeight: 'bold'}}>INDISPONÍVEL</Text>.{'\n\n'}
              Se o nome de usuário estiver disponível, o usuário pode clicar na
              tela de resultado e ser levado diretamente para a página da Twitch
              para registrar o nome. Caso contrário, se o nome estiver
              indisponível, o usuário pode manter pressionada a tela até que o
              nome de usuário seja adicionado à lista de monitoramento. Neste
              momento, o usuário é levado à tela de monitoramento, onde pode
              acompanhar o status dos nomes adicionados à lista.{'\n\n'}O
              aplicativo faz buscas periódicas para verificar a disponibilidade
              dos nomes na lista de monitoramento (o tempo pode ser configurado
              pelo usuário na aba Definições). Quando o aplicativo detecta que
              um nome de usuário se tornou disponível, o usuário recebe um
              alerta para que possa registrar o nome na Twitch.{'\n\n'}
              Para remover um nome de usuário da lista de monitoramento, basta
              arrastar o botão na tela para a esquerda até que o nome seja
              excluído da lista. O aplicativo não possui a opção de favoritos,
              mas apenas a opção de monitoramento de nomes de usuário
              indisponíveis.
            </Text>
          </View>
        </List.Accordion>
        <Divider />
      </List.AccordionGroup>
      <View style={{marginVertical: 40}}>
        <Text
          variant="bodyMedium"
          style={[
            {
              textAlign: 'center',
            },
            Fonts.TwitchyTV,
          ]}>
          Siga o Xogum nas redes:
        </Text>
        <View
          style={{
            marginVertical: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 20,
          }}>
          <Pressable
            style={[style.btn, {backgroundColor: '#1DA1F2'}]}
            onPress={() => Linking.openURL('https://twitter.com/xogumon')}>
            <Icon from="fontAwesome5" name="twitter" style={style.btnIcon} />
          </Pressable>
          <Pressable
            style={[style.btn, {backgroundColor: '#9146FF'}]}
            onPress={() => Linking.openURL('https://www.twitch.tv/xogum')}>
            <Icon from="fontAwesome5" name="twitch" style={style.btnIcon} />
          </Pressable>
          <Pressable
            style={[style.btn, {backgroundColor: '#FF0000'}]}
            onPress={() => Linking.openURL('https://www.youtube.com/@xogum')}>
            <Icon from="fontAwesome5" name="youtube" style={style.btnIcon} />
          </Pressable>
          <Pressable
            style={[style.btn, {backgroundColor: '#010101'}]}
            onPress={() => Linking.openURL('https://tiktok.com/@xogumon')}>
            <Icon from="fontAwesome5" name="tiktok" style={style.btnIcon} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  content: {
    padding: 20,
  },
  btn: {
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  btnIcon: {
    fontSize: 30,
    color: '#fff',
  },
});
