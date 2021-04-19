import styled from 'styled-components/native';
import { Platform, FlatList } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { RectButton } from 'react-native-gesture-handler';
import { ProviderAppointment } from './index';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  padding-top: ${Platform.OS === 'ios' ? getStatusBarHeight() + 24 : 24}px;
  background: #28262e;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled.Text`
  color: #f4ebe8;
  font-size: 20px;
  font-family: 'RobotoSlab-Regular';
  line-height: 28px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 10px;
`;

export const AppointmentList = styled(
  FlatList as new () => FlatList<ProviderAppointment>,
)`
  padding: 32px 24px 16px;
`;

export const AppointmentContainer = styled.View`
  background: #3e3b47;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
`;

export const AppointmentAvatar = styled.Image`
  width: 72px;
  height: 72px;
  border-radius: 36px;
`;

export const AppointmentInfo = styled.View`
  flex: 1;
  margin-left: 20px;
`;

export const AppointmentName = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #f4ede8;
`;

export const AppointmentMeta = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

export const AppointmentMetaText = styled.Text`
  margin-left: 8px;
  color: #999591;
  font-family: 'RobotoSlab-Regular';
`;

export const EmptyAppointments = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const EmptyAppointmentsTitle = styled.Text`
  text-align: center;
  font-family: 'RobotoSlab-Medium';
  color: #ff9000;
  font-size: 40px;
`;

export const EmptyAppointmentsText = styled.Text`
  text-align: center;
  color: #ccc;
  margin: 0 50px;
  font-family: 'RobotoSlab-Regular';
  font-size: 18px;
`;
