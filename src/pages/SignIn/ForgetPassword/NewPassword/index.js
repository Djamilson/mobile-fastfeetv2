import React, {useRef, useState, useEffect} from 'react';
import {Alert} from 'react-native';

import PropTypes from 'prop-types';

import AsyncStorage from '@react-native-community/async-storage';

import api from '~/_services/api';
import logo from '~/assets/fastfeet-logo.png';
import Background from '~/components/Background';
import Loading from '~/components/Loading';

import {
  Container,
  Title,
  Separator,
  Form,
  SignLink,
  SignLinkText,
  FormInput,
  SubmitButton,
  LogoImg,
} from './styles';

export default function NewPassword({navigation, route}) {
  const {token} = route.params;
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setPassword('');
    setConfirmPassword('');
  }, []);

  const deleteEmailStorage = async () => {
    await AsyncStorage.removeItem('@fastfeetforgetpassword');
  };

  async function handleSubmit() {
    setLoading(true);
    await api
      .put(`forget/new_password`, {
        data: {
          password,
          confirmPassword,
          token,
        },
      })
      .then(() => {
        setLoading(false);
        Alert.alert(
          'Sucesso',
          `Senha redefinida com sucesso, acesse sua conta no Fastfeet!`,
        );

        deleteEmailStorage();

        navigation.navigate('SignIn');
      })
      .catch((error) => {
        setLoading(false);

        const str = error.toString();
        const final = str.replace(/\D/g, '');
        if (final === '400') {
          Alert.alert('Error', 'As senhas não conferem, tente novamente!');
          return;
        }

        if (final === '401' || final === '403') {
          Alert.alert('Error', 'Esse token não existe, crei um novo token!');
          return;
        }

        if (final === '404') {
          Alert.alert(
            'Error',
            'Token inválido, já foi usado, crie novo Token!',
          );
          return;
        }

        Alert.alert(
          'Error! ',
          `Não foi possível redefinir a senha, tente novamente!`,
        );
      });
  }

  function handlerSignIn() {
    navigation.navigate('SignIn');
  }

  return (
    <Background>
      <Container>
        {loading && <Loading loading={loading}>Carregando ...</Loading>}
        <LogoImg source={logo} />

        <Title>Redefina a senha</Title>
        <Form>
          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Sua nova senha"
            ref={passwordRef}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current.focus()}
            value={password}
            onChangeText={setPassword}
          />

          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Confirmação de senha"
            ref={confirmPasswordRef}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Separator />

          <SubmitButton loading={loading} onPress={handleSubmit}>
            Atualizar senha
          </SubmitButton>
        </Form>

        <SignLink onPress={handlerSignIn}>
          <SignLinkText>Já tenho conta</SignLinkText>
        </SignLink>
      </Container>
    </Background>
  );
}

NewPassword.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
