import React, {useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import PropTypes from 'prop-types';

import logo from '~/assets/fastfeet-logo.png';
import Background from '~/components/Background';
import {signInRequest} from '~/store/modules/auth/actions';

import {
  Container,
  Form,
  Label,
  FormInput,
  SubmitButton,
  LogoImg,
  ResetPasswordLink,
  ResetPasswordLinkText,
} from './styles';

export default function SignIn({navigation}) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const [email, setEmail] = useState('');

  const passwordRef = useRef();
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    dispatch(signInRequest(email, password));
  }

  return (
    <Background>
      <Container>
        <LogoImg source={logo} />
        <Form>
          <Label>Email</Label>
          <FormInput
            icon="mail-outline"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Digite seu e-mail"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
            value={email}
            onChangeText={setEmail}
          />

          <Label>Sua senha</Label>

          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Sua senha secreta"
            ref={passwordRef}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={password}
            onChangeText={setPassword}
          />

          <SubmitButton loading={loading} onPress={handleSubmit}>
            Entrar no sistema
          </SubmitButton>
        </Form>

        <ResetPasswordLink
          onPress={() => navigation.navigate('ForgetFormEmail')}>
          <ResetPasswordLinkText>Esqueceu a senha? </ResetPasswordLinkText>
        </ResetPasswordLink>
      </Container>
    </Background>
  );
}

SignIn.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
