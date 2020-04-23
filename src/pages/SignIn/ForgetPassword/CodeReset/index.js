import React, {useRef, useEffect, useState} from 'react';
import {Alert} from 'react-native';

import PropTypes from 'prop-types';

import AsyncStorage from '@react-native-community/async-storage';

import api from '~/_services/api';
import logo from '~/assets/fastfeet-logo.png';
import Background from '~/components/Background';
import Loading from '~/components/Loading';
import Message from '~/pages/SignIn/ForgetPassword/Message';

import {
  Container,
  Form,
  FormInput,
  SignLink,
  SignLinkText,
  Name,
  SubmitButton,
  LogoImg,
} from './styles';

export default function CodeReset({navigation, route}) {
  const {email} = route.params;
  const code_active_Ref = useRef();
  const [code_active, setCode_active] = useState('');

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    async function loadToken() {
      try {
        setLoading(true);
        const res = await api.get(`mobile/forget_password`, {
          params: {
            email,
          },
        });

        setToken(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);

        const str = error.toString();
        const final = str.replace(/\D/g, '');

        if (final === '400') {
          Alert.alert(
            'Erro na validação do código',
            'Não foi possível encontra um usuário, crie sua conta!',
          );
          return;
        }

        if (final === '401') {
          Alert.alert(
            'Erro na validação do código',
            'Esse token não existe, crie um novo token!',
          );
          return;
        }

        if (final === '402') {
          Alert.alert(
            'Erro na validação do código',
            'Token expirado, gere um novo token!',
          );
          return;
        }

        Alert.alert(
          'Error',
          'Gere um novo código de ativação, tente novamente!',
        );
      }
    }

    loadToken();
  }, [email]);

  function handlerSignIn() {
    navigation.navigate('SignIn');
  }

  const deleteEmailStorage = async () => {
    await AsyncStorage.removeItem('@fastfeetforgetpassword');
  };

  async function newCodeActive() {
    deleteEmailStorage();
    navigation.navigate('ForgetFormEmail');
  }

  async function handleValidateCodeReset() {
    setLoading(true);
    if (code_active === token.code_active) {
      setLoading(false);
      navigation.navigate('ForgetNewPassword', {token});

      Alert.alert('Sucesso', `Agora redefina sua senha!`);
      return;
    }

    setLoading(false);

    Alert.alert(
      'Atenção! ',
      `Código de validação está incorreto, tente novamente, ou crie novo código!`,
    );
  }

  return (
    <Background>
      <Container>
        {loading && <Loading loading={loading}>Carregando ...</Loading>}
        <Message nameIcon="exclamation-triangle" email={email} />
        <LogoImg source={logo} />
        <Name>Valida o código de redefinição de senha</Name>
        <Form>
          <FormInput
            icon="lock-outline"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Código de redefinição de senha"
            ref={code_active_Ref}
            returnKeyType="send"
            onSubmitEditing={handleValidateCodeReset}
            value={code_active}
            onChangeText={setCode_active}
          />

          <SubmitButton loading={false} onPress={handleValidateCodeReset}>
            Validar código
          </SubmitButton>
        </Form>
        <SignLink onPress={newCodeActive}>
          <SignLinkText>Novo código de redefinição de senha</SignLinkText>
        </SignLink>

        <SignLink onPress={handlerSignIn}>
          <SignLinkText>Já tenho conta</SignLinkText>
        </SignLink>
      </Container>
    </Background>
  );
}

CodeReset.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      email: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
