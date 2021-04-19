import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { format, parseISO, addHours } from 'date-fns';
import api from '../../services/api';

import noProfileImage from '../../assets/default.png';

import {
  Container,
  Header,
  HeaderTitle,
  BackButton,
  AppointmentContainer,
  AppointmentAvatar,
  AppointmentInfo,
  AppointmentName,
  AppointmentList,
  AppointmentMeta,
  AppointmentMetaText,
  EmptyAppointments,
  EmptyAppointmentsTitle,
  EmptyAppointmentsText,
} from './styles';

interface Appointment {
  id: string;
  provider_id: string;
  date: string;
}

interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

export interface ProviderAppointment {
  appointment: Appointment;
  provider: Provider;
}

const MyAppointments: React.FC = () => {
  const [providerAppointment, setProviderAppointment] = useState<
    ProviderAppointment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);

  const navigation = useNavigation();

  useEffect(() => {
    api.get('appointments').then(response => {
      setAppointments(response.data);
    });

    api
      .get('providers')
      .then(response => {
        setProviders(response.data);
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  const findProvider = useCallback(
    (id: string): Provider => {
      const findIndex = providers.findIndex(provider => provider.id === id);

      return providers[findIndex];
    },
    [providers],
  );

  const appoitmentDate = useCallback((date: string): string => {
    const appointmentDate = parseISO(date);
    const dateFormatted = format(
      addHours(appointmentDate, 3),
      "'Dia' dd/MM 'ás' HH'h'",
    );

    return dateFormatted;
  }, []);

  const setList = useCallback(() => {
    const providerAppointmentsList: ProviderAppointment[] = appointments.map(
      appointmentItem => {
        return {
          appointment: {
            id: appointmentItem.id,
            provider_id: appointmentItem.provider_id,
            date: appointmentItem.date,
          },
          provider: {
            id: findProvider(appointmentItem.provider_id).id,
            name: findProvider(appointmentItem.provider_id).name,
            avatar_url: findProvider(appointmentItem.provider_id).avatar_url,
          },
        };
      },
    );

    setProviderAppointment(providerAppointmentsList);
  }, [findProvider, appointments]);

  useEffect(() => {
    if (appointments.length >= 1 && providers.length >= 1) {
      setList();
    }
  }, [setList, appointments, providers]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  return (
    <>
      <Container>
        <Header>
          <BackButton onPress={handleGoBack}>
            <Icon name="chevron-left" size={30} color="#999591" />
          </BackButton>
          <HeaderTitle>Meus agendamentos</HeaderTitle>
        </Header>
        {providerAppointment.length < 1 && !loading && (
          <EmptyAppointments>
            <EmptyAppointmentsTitle>Ooops...</EmptyAppointmentsTitle>
            <EmptyAppointmentsText>
              Parece que você ainda não fez nenhum agendamento!
            </EmptyAppointmentsText>
          </EmptyAppointments>
        )}
        <AppointmentList
          data={providerAppointment}
          keyExtractor={providerAppointmentItem =>
            providerAppointmentItem.appointment.id
          }
          renderItem={({ item: providerAppointmentItem }) => (
            <AppointmentContainer>
              {providerAppointmentItem.provider.avatar_url ? (
                <AppointmentAvatar
                  source={{ uri: providerAppointmentItem.provider.avatar_url }}
                />
              ) : (
                <AppointmentAvatar source={noProfileImage} />
              )}

              <AppointmentInfo>
                <AppointmentName>
                  {providerAppointmentItem.provider.name}
                </AppointmentName>
                <AppointmentMeta>
                  <AppointmentMetaText>
                    {appoitmentDate(providerAppointmentItem.appointment.date)}
                  </AppointmentMetaText>
                </AppointmentMeta>
              </AppointmentInfo>
            </AppointmentContainer>
          )}
        />
      </Container>
    </>
  );
};

export default MyAppointments;
