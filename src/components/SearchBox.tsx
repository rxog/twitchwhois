import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  Searchbar,
  SearchbarProps,
  Snackbar,
  Portal,
  useTheme,
} from 'react-native-paper';
import {useNetInfo} from '@react-native-community/netinfo';
import Username from '@/utils/Username';

interface SearchBoxProps extends Omit<SearchbarProps, 'value'> {
  value?: string;
  onSubmit: (query: string) => void;
}

export default function SearchBox({
  value = '',
  ...props
}: SearchBoxProps): JSX.Element {
  const {colors} = useTheme();
  const [searchQuery, setSearchQuery] = React.useState(value);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState<string | null>(null);
  const searchBox = React.useRef<any>(null);
  const netInfo = useNetInfo();

  useFocusEffect(() => {
    if (searchQuery && isLoading) {
      setSearchQuery('');
      setIsLoading(false);
    }
  });

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

  return (
    <>
      <Searchbar
        {...props}
        value={searchQuery}
        onChangeText={onChangeText}
        placeholder="Pesquisar"
        autoCapitalize="none"
        autoComplete="username"
        autoCorrect={false}
        loading={isLoading}
        editable={!isLoading}
        onSubmitEditing={onSubmit}
        onIconPress={onSubmit}
        inputStyle={
          !!hasError && {
            color: colors.error,
          }
        }
        onFocus={() => setHasError(null)}
        ref={searchBox}
      />
      <Portal>
        <Snackbar
          visible={!!hasError}
          onDismiss={() => setHasError(null)}
          action={{
            label: 'OK',
            onPress: () => {
              searchBox.current.focus();
            },
          }}>
          {hasError}
        </Snackbar>
      </Portal>
    </>
  );
}
