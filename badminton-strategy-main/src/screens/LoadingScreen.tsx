import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import { StyleSheet, ImageBackground, Alert } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { useAppDispatch, useAppSelector } from '@src/app/hooks';
import { useGetUserMutation } from '@src/app/redux/api/userApi';
import {
  setAuthenticated,
  setUser,
  logout,
} from '@src/app/redux/slices/userSlice';
import colors from '@src/constant/colors';
import { RootStackParamList } from 'Main';
import { useGetMatchesMutation } from '@src/app/redux/api/matchApi';
import { setMatches } from '@src/app/redux/slices/matchSlice';

type LoadingScreen = {
  route: RouteProp<RootStackParamList, 'LoadingScreen'>;
};

const LoadingScreen: React.FC<LoadingScreen> = ({ route }) => {
  const [getUser] = useGetUserMutation();
  const [getMatches] = useGetMatchesMutation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const fetchInitialAppData = useCallback(async () => {
    try {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      if (idToken) {
        dispatch(setAuthenticated(true));
        const user = await getUser().unwrap();
        const matches = await getMatches().unwrap();
        dispatch(setMatches(matches.matches));
        if (user === null) {
          navigation.navigate('FirstSignUpScreen');
        } else {
          dispatch(setUser(user));
          navigation.navigate('Home');
        }
      } else {
        dispatch(logout());
      }
    } catch (e) {
      dispatch(logout());
      signOut();
      console.log(e);
      Alert.alert('Erreur', 'Une erreur est arrivé');
    }
  }, [dispatch, getUser, navigation]);

  useEffect(() => {
    fetchInitialAppData();
  }, [fetchInitialAppData]);
  return (
    <ImageBackground
      source={require('/assets/img/background_loading.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <ActivityIndicator animating={true} size={'large'} color={colors.white} />
      <Text style={styles.title}>Chargement</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingBottom: 100,
  },
  title: {
    padding: 10,
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 30,
  },
});

export default LoadingScreen;
