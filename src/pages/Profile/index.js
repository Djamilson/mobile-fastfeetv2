import React, {useRef, useState, useEffect} from 'react';
import {Alert} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import IconCam from 'react-native-vector-icons/MaterialIcons';
import {useSelector, useDispatch} from 'react-redux';

import api from '~/_services/api';
import AvatarPreview from '~/components/Avatar';
import Background from '~/components/Background';
import {createImage, updateImage} from '~/store/modules/auth/actions';
import {updateProfileRequest} from '~/store/modules/user/actions';
import {fonts, colors} from '~/styles';

import Loading from './Loading';
import {
  Container,
  ContainerAvatar,
  Avatar,
  CardButton,
  ButtonSelect,
  Form,
  Label,
  FormInput,
  Separator,
  SubmitButton,
} from './styles';

export default function Profile() {
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.user.profile);
  const loading = useSelector((state) => state.user.loading);
  const [loadingImage, setLoadingImage] = useState(false);

  const emailRef = useRef();
  const prefixRef = useRef();
  const numberRef = useRef();

  const oldPasswordRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const {id: phone_id} = profile.person.phone;

  const [image, setImage] = useState({preview: '', file: ''});
  const [name, setName] = useState(profile.person.name);
  const [email, setEmail] = useState(profile.person.email);
  const [prefix, setPrefix] = useState(profile.person.phone.prefix);
  const [number, setNumber] = useState(profile.person.phone.number);

  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setOldPassword('');
    setPassword('');
    setConfirmPassword('');
  }, [profile]);

  function handleSubmit() {
    dispatch(
      updateProfileRequest({
        name,
        email,
        oldPassword,
        password,
        confirmPassword,
        phone: {phone_id, prefix, number},
      }),
    );
  }

  const imagePickerOptions = {
    title: 'Selecione uma foto',
    takePhotoButtonTitle: 'Tirar foto',
    chooseFromLibraryButtonTitle: 'Escolher da Galeria',
  };

  function handleSelectImage() {
    ImagePicker.showImagePicker(imagePickerOptions, async (upload) => {
      if (upload.didCancel) {
        return;
      }
      if (upload.error) {
        return;
      }
      if (upload.customButton) {
        return;
      }
      if (!upload.uri) {
        return;
      }
      const preview = {uri: `data:image/jpeg;base64, ${upload.data}`};

      // eslint-disable-next-line no-shadow
      let prefix;
      let ext;

      if (upload.fileName) {
        [prefix, ext] = upload.fileName.split('.');
        ext = ext.toLowerCase() === 'heic' ? 'jpg' : ext;
      } else {
        prefix = new Date().getTime();
        ext = 'jpg';
      }
      const file = {
        uri: upload.uri,
        type: upload.type,
        name: `${prefix}.${ext}`,
      };

      setImage({
        preview,
        file,
      });

      const data = new FormData();

      data.append('file', file);

      try {
        if (profile.avatar === null) {
          setLoadingImage(true);
          dispatch(createImage({data}));
          setLoadingImage(loading);
          return;
        }
        setLoadingImage(true);
        const avatar_id =
          profile.person.avatar === null ? '' : profile.person.avatar.id;
        data.append('id', avatar_id);

        const res = await api.put(`files/${avatar_id}`, data);
        dispatch(updateImage({data: res.data}));
        setLoadingImage(false);
      } catch (error) {
        setLoadingImage(false);
        Alert.alert(
          'Atenção!',
          `${error} Não foi possivel atualizar a imagem, tente novamente.`,
        );
      }
    });
  }

  return (
    <Background>
      <Container>
        <ContainerAvatar>
          {loadingImage === true && (
            <Loading loading={loadingImage}>
              Aguarde um momento, estamos redimensionando a imagem para vários
              tamanhos para melhorar a usabilidade em diferentes dispositivos...
              OBS: Para corrigir erro de posicionamento da imagem coloque o fone
              na horizontal ou vertical.
            </Loading>
          )}
          {loadingImage !== true && !image.preview && (
            <AvatarPreview data={profile} number={2.5} />
          )}
          {loadingImage !== true && !!image.preview && (
            <Avatar number={2.5} source={image.preview} />
          )}
        </ContainerAvatar>
        <CardButton>
          <ButtonSelect onPress={() => handleSelectImage()}>
            <IconCam
              name="photo-camera"
              size={fonts.extra_big}
              color={colors.white}
            />
          </ButtonSelect>
        </CardButton>

        <Form>
          <Label>Nome</Label>
          <FormInput
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Nome completo"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current.focus()}
            value={name}
            onChangeText={setName}
          />

          <Label>Email</Label>
          <FormInput
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Digite seu e-mail"
            ref={emailRef}
            returnKeyType="next"
            onSubmitEditing={() => prefixRef.current.focus()}
            value={email}
            onChangeText={setEmail}
          />

          <Label>Prefixo</Label>
          <FormInput
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Prefixo"
            ref={prefixRef}
            returnKeyType="next"
            onSubmitEditing={() => numberRef.current.focus()}
            value={prefix}
            onChangeText={setPrefix}
          />

          <Label>Fone</Label>
          <FormInput
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Fone"
            ref={numberRef}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={number}
            onChangeText={setNumber}
          />

          <Separator />

          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Sua senha atual"
            ref={oldPasswordRef}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
            value={oldPassword}
            onChangeText={setOldPassword}
          />

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
            Atualizar perfil
          </SubmitButton>
        </Form>
      </Container>
    </Background>
  );
}
