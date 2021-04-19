import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.ScrollView`
  padding: 0 30px ${Platform.OS === 'android' ? 100 : 40}px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 10px;
`;

export const SignOutButton = styled.TouchableOpacity`
  margin-top: 10px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0 24px;
  text-align: left;
`;

export const UserAvatarButton = styled.View`
  position: relative;
  margin-top: 20px;
`;

export const UpdateProfileImageButton = styled(RectButton)`
  height: 76px;
  width: 76px;
  border-radius: 38px;
  justify-content: center;
  align-items: center;
  position: absolute;
  padding: 5px;
  bottom: 0;
  right: 45px;
  align-self: flex-end;
  background: #ff9000;
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;
