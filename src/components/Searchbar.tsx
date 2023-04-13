/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {TextInput, TextInputProps, View, Pressable} from 'react-native';
import {Snackbar, Portal, useTheme} from 'react-native-paper';
import {useNetInfo} from '@react-native-community/netinfo';
import Username from '@/utils/Username';
import Icon from './Icon';

interface SearchbarProps extends Omit<TextInputProps, 'value'> {
  value?: string;
  onSubmit: (query: string) => void;
}

export default function Searchbar({
  value = '',
  ...props
}: SearchbarProps): JSX.Element {
  const {colors} = useTheme();
  const [searchQuery, setSearchQuery] = React.useState(value);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState<string | null>(null);
  const searchInput = React.useRef<TextInput>(null);
  const netInfo = useNetInfo();

  useFocusEffect(
    React.useCallback(() => {
      if (searchQuery && isLoading) {
        setSearchQuery('');
        setIsLoading(false);
      }
    }, [isLoading, searchQuery]),
  );

  React.useLayoutEffect(() => {
    searchInput.current?.focus();
  }, [searchInput]);

  const onChangeText = React.useCallback((text: string) => {
    setSearchQuery(Username.parse(text));
  }, []);

  const onSubmit = () => {
    if (!netInfo.isInternetReachable) {
      setHasError('Sem conexão com internet!');
      return;
    }
    if (Username.isValid(searchQuery)) {
      setHasError(null);
      setIsLoading(true);
      props.onSubmit?.(searchQuery);
    } else {
      setHasError('Usuário inválido!');
    }
  };

  const textInputColor = hasError ? colors.error : colors.onSecondaryContainer;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: hasError
          ? colors.errorContainer
          : colors.secondaryContainer,
        borderRadius: 25,
      }}>
      <TextInput
        {...props}
        value={searchQuery}
        onChangeText={onChangeText}
        placeholder="Pesquisar"
        autoCapitalize="none"
        autoComplete="username"
        autoCorrect={false}
        editable={!isLoading}
        onSubmitEditing={onSubmit}
        placeholderTextColor={textInputColor}
        selectTextOnFocus={true}
        returnKeyType="search"
        style={[
          {
            flex: 1,
            alignSelf: 'stretch',
            fontSize: 18,
            color: textInputColor,
            paddingLeft: 45,
          },
        ]}
        onFocus={() => setHasError(null)}
        ref={searchInput}
      />
      <Pressable
        style={{
          overflow: 'hidden',
          borderRadius: 100,
          position: 'absolute',
          left: 10,
        }}
        onPress={onSubmit}>
        <Icon
          from="materialIcons"
          name="search"
          color={textInputColor}
          size={30}
        />
      </Pressable>
      {searchQuery && (
        <Pressable
          style={{
            overflow: 'hidden',
            borderRadius: 100,
            position: 'absolute',
            right: 10,
          }}
          onPress={() => {
            searchInput.current?.clear();
            searchInput.current?.focus();
            setSearchQuery('');
          }}>
          <Icon
            from="materialIcons"
            name="clear"
            color={colors.surfaceDisabled}
            size={30}
          />
        </Pressable>
      )}
      <Portal>
        <Snackbar
          visible={!!hasError}
          onDismiss={() => setHasError(null)}
          action={{
            label: 'OK',
            onPress: () => {
              searchInput.current?.focus();
            },
          }}>
          {hasError}
        </Snackbar>
      </Portal>
    </View>
  );
}
