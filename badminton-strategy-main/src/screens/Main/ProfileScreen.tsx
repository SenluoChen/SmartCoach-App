import { RouteProp } from '@react-navigation/native';
import {
  StyleSheet,
  Image,
  View,
  useWindowDimensions,
  Text,
} from 'react-native';
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@src/app/hooks';
import SecondaryButton from '@src/components/input/button/SecondaryButton';
import colors from '@src/constant/colors';
import { HomeStackParamList } from '@src/stack/HomeTabStack';
import { signOut } from 'aws-amplify/auth';
import { useGetMatchesMutation } from '@src/app/redux/api/matchApi';
import { setMatches } from '@src/app/redux/slices/matchSlice';
import { useDispatch } from 'react-redux';
import { logoutAll } from '@src/app/actions';
import { AppDispatch } from '@src/app/store';

type LoadingScreen = {
  route: RouteProp<HomeStackParamList, 'Profile'>;
};

const ProfileScreen: React.FC<LoadingScreen> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector((state) => state.user);

  const handleLogout = async () => {
    dispatch(logoutAll());
    await signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerProfile}>
        <View style={styles.profileImageContainer}>
          <Image
            style={styles.profileImage}
            source={{
              uri: user.imageUrl,
            }}
          />
        </View>
        <View style={styles.secondaryInformation}>
          <Text style={styles.name}>{user.firstName}</Text>
          <Text style={styles.subtitle}>
            {user.country} | {user.licenseNumber}
          </Text>
        </View>
      </View>
      <View style={styles.settingContainer}>
        <SecondaryButton
          paddingTop={10}
          buttonText="Paramètre"
          onPress={() => console.log('test')}
          color="white"
          fontColor="black"
          mode="outlined"
        />
        <SecondaryButton
          paddingTop={10}
          buttonText="Deconnexion"
          onPress={handleLogout}
          color="black"
          fontColor="white"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
    paddingTop: 20,
  },
  headerProfile: {
    flexDirection: 'row',
  },
  profileImageContainer: {
    flex: 3,
    alignItems: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'grey',
  },
  secondaryInformation: {
    flex: 5,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  descriptionContainer: {
    paddingTop: 10,
    flexDirection: 'column',
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    fontWeight: '500',
    fontSize: 17,
    color: 'grey',
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  data: {
    flex: 1,
    alignItems: 'center',
  },
  dataValue: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  dataLabel: {
    fontWeight: '300',
    fontSize: 15,
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  tabContainer: {
    flex: 1,
    paddingTop: 10,
    width: '100%',
  },
});

export default ProfileScreen;
