import React, { useRef, useCallback } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import * as ImagePicker from 'react-native-image-picker';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';
import noProfileImage from '../../assets/default.png';

import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
  UpdateProfileImageButton,
  SignOutButton,
  Header,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser, signOut } = useAuth();
  const [responseImage, setResponseImage] = React.useState<any>(null);

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const formRef = useRef<FormHandles>(null);

  const navigation = useNavigation();

  const handleUpdateUser = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .email('Digite um e-mail válido')
            .required('E-mail obrigatório'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val: string) => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val: string) => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
              old_password,
              password,
              password_confirmation,
            }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        Alert.alert('Perfil atualizado com sucesso!');

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente.',
        );
      }
    },
    [navigation, updateUser],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleLogout = useCallback(() => {
    signOut();
  }, [signOut]);

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 1920,
        maxWidth: 1080,
      },
      responseImg => {
        if (responseImg.uri) {
          setResponseImage(responseImg);
          const data = new FormData();

          data.append('avatar', {
            type: 'image/jpeg',
            name: `${user.id}.jpg`,
            uri: responseImg.uri,
          });

          api.patch('/users/avatar', data).then(apiResponse => {
            updateUser(apiResponse.data);
          });
        }
      },
    );
  }, [updateUser, user.id]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <Container>
          <Header>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={30} color="#999591" />
            </BackButton>
            <SignOutButton onPress={handleLogout}>
              <Icon name="log-out" size={30} color="#999591" />
            </SignOutButton>
          </Header>

          <UserAvatarButton>
            {user.avatar_url ? (
              <UserAvatar source={{ uri: user.avatar_url }} />
            ) : (
              <UserAvatar source={noProfileImage} />
            )}
            <UpdateProfileImageButton onPress={handleUpdateAvatar}>
              <Icon name="upload" size={30} color="#000" />
            </UpdateProfileImageButton>
          </UserAvatarButton>

          <View>
            <Title>Meu perfil</Title>
          </View>

          <Form initialData={user} ref={formRef} onSubmit={handleUpdateUser}>
            <Input
              autoCapitalize="words"
              name="name"
              icon="user"
              placeholder="Nome"
              returnKeyType="next"
              onSubmitEditing={() => {
                emailInputRef.current?.focus();
              }}
            />
            <Input
              ref={emailInputRef}
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              name="email"
              icon="mail"
              placeholder="E-mail"
              returnKeyType="next"
              onSubmitEditing={() => {
                oldPasswordInputRef.current?.focus();
              }}
            />
            <Input
              ref={oldPasswordInputRef}
              secureTextEntry
              name="old_password"
              icon="lock"
              placeholder="Senha atual"
              textContentType="newPassword"
              containerStyle={{ marginTop: 16 }}
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
            />
            <Input
              ref={passwordInputRef}
              secureTextEntry
              name="password"
              icon="lock"
              placeholder="Nova senha"
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => {
                confirmPasswordInputRef.current?.focus();
              }}
            />
            <Input
              ref={confirmPasswordInputRef}
              secureTextEntry
              name="password_confirmation"
              icon="lock"
              placeholder="Confirmar nova senha"
              textContentType="newPassword"
              returnKeyType="send"
              onSubmitEditing={() => {
                formRef.current?.submitForm();
              }}
            />

            <Button
              onPress={() => {
                formRef.current?.submitForm();
              }}
            >
              Confirmar mudanças
            </Button>
          </Form>
        </Container>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
