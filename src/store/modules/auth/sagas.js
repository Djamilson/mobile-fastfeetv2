import {Alert} from 'react-native';

import {all, call, put, takeLatest} from 'redux-saga/effects';

import api from '~/_services/api';

import {signInFaileru, updateProfileSuccess} from '../user/actions';
import {signFailure, signInSuccess} from './actions';

export function* signIn({payload}) {
  const {email, password} = payload;

  try {
    const response = yield call(api.post, 'sessions', {
      email,
      password,
    });

    const {token, user} = response.data;

    api.defaults.headers.Authorization = ` Bearer ${token}`;

    yield put(signInSuccess(token, user));
  } catch (error) {
    const str = error.toString();
    const final = str.replace(/\D/g, '');

    if (final === '400') {
      Alert.alert(
        'Erro no login',
        'Não foi possível encontra um usuário, crie sua conta!',
      );
      yield put(signFailure());
      return;
    }

    if (final === '402') {
      Alert.alert(
        'Erro no login',
        'No momento esse usuário está desativado, entre em contato com o administrador!',
      );
      yield put(signFailure());
      return;
    }
    if (final === '403') {
      Alert.alert('Erro no login', 'Usuário não encontrado!');
      yield put(signFailure());
      return;
    }
    if (final === '404') {
      Alert.alert(
        'Erro no login',
        'Usúario ou senha incorreta, verifique seus dados!',
      );
      yield put(signFailure());
      return;
    }

    if (final === '429') {
      Alert.alert(
        'Erro no login',
        'Não foi possível conectar ao servidor, tente novamente!',
      );
      yield put(signFailure());
      return;
    }

    if (str === 'Error: Network Error') {
      Alert.alert(
        'Erro no login',
        'Não foi possível conectar ao servidor, tente novamente!',
      );

      yield put(signFailure());
      return;
    }

    Alert.alert('Erro no login', 'Não foi possível conectar, tente novamente!');
    yield put(signFailure());
  }
}

export function* acceptRegulationUp({payload}) {
  try {
    const {personId, newPrivacy} = payload;

    const resp = yield call(api.put, 'accept_regulation', {
      newPrivacy,
      person_id: personId,
    });

    const {user} = resp.data;

    yield put(updateProfileSuccess(user));

    if (newPrivacy === true) {
      Alert.alert('Sucesso', 'Termos aceitos com sucesso!');
      return;
    }

    Alert.alert('Sucesso', 'Os termos não foram aceitos!');
  } catch (error) {
    Alert.alert(
      'Error',
      'Não foi possível aceitar os termos, tente novamente!',
    );

    yield put(signInFaileru());
  }
}

export function setToken({payload}) {
  if (!payload) return;
  const {token} = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = ` Bearer ${token}`;
  }
}

export function* createImage({payload}) {
  try {
    const {data} = payload.data;

    const resp = yield call(api.post, 'files/mobile', data);

    yield put(updateProfileSuccess(resp.data.user));

    Alert.alert('Sucesso', 'Imagem inserida com sucesso!');
  } catch (error) {
    Alert.alert(
      'Falha ao tentar inserir a imagem',
      'Houve um erro ao tentar inserir a imagem,  tente novamente',
    );

    yield put(signInFaileru());
  }
}

export function* updateImage({payload}) {
  try {
    const {data} = payload.data;

    yield put(updateProfileSuccess(data.user));

    Alert.alert('Sucesso', 'Imagem atualizada com sucesso!');
  } catch (error) {
    Alert.alert(
      'Falha ao tentar atualizar a imagem',
      'Não foi possível alterar a imagem, tente novamente!',
    );

    yield put(signInFaileru());
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/ACCEPT_REGULATION', acceptRegulationUp),
  takeLatest('@auth/CREATE_IMAGE', createImage),
  takeLatest('@auth/UPDATE_IMAGE', updateImage),
]);
