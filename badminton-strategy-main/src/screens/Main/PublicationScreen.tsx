import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {
  StyleSheet,
  Alert,
  BackHandler,
  Image,
  View,
  Pressable
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Appbar, Text } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '@src/app/hooks';
import colors from '@src/constant/colors';
import { HomeStackParamList } from '@src/stack/HomeTabStack';
import { useGetUserByUsernameMutation } from '@src/app/redux/api/userApi';
import Swiper from 'react-native-deck-swiper';
import { useGetMatchesMutation } from '@src/app/redux/api/matchApi';
import MatchList from '@src/components/list/MatchList';
import { Match } from '@src/app/datasource/match.type';
import { setMatch } from '@src/app/redux/slices/matchSlice';
import { RootStackParamList } from 'Main';

type LoadingScreen = {
  route: RouteProp<HomeStackParamList, 'Dashboard'>;
};

const PublicationScreen: React.FC<LoadingScreen> = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const user = useAppSelector((state) => state.user);
  const matches = useAppSelector(
    (state) => state.match.matches
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const homeNavigation = useNavigation<NavigationProp<HomeStackParamList>>();

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Restez ici!',
        'Êtes-vous sûr de vouloir quitter cette application?',
        [
          {
            text: 'Non',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'Oui', onPress: () => BackHandler.exitApp() },
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Pressable onPress={() => homeNavigation.navigate('Profile')}>
          <Image
            style={styles.profileImage}
            source={{
              uri: user.imageUrl,
            }}
          />
        </Pressable>
        <Appbar.Content title={user.firstName + ' ' + user.lastName} />
      </Appbar.Header>

      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator color={colors.primary} size={50} />
        </View>
      ) : matches.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            source={require('/assets/img/match/miamia_no_match.png')}
            style={{
              borderWidth: 1,
              justifyContent: 'center',
              width: 200,
              height: 200,
            }}
          />
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
            Pas de match
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <MatchList matches={matches} onSelect={(match) => {
            dispatch(setMatch(match));
            navigation.navigate('MatchSingle');
          }} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  header: {
    elevation: 10,
  },
  title: {
    padding: 10,
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 30,
  },
  logo: {
    width: 300,
    height: 300,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginHorizontal: 15,
  },
  publicationContainer: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent',
  },
});

export default PublicationScreen;
