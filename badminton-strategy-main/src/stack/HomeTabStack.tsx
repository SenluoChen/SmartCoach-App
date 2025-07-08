import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/FontAwesome';
import ProfileScreen from '@src/screens/Main/ProfileScreen';
import PublicationScreen from '@src/screens/Main/PublicationScreen';
import { Text } from 'react-native-paper';
import MatchSetupScreen from '@src/screens/Main/MatchSetupScreen';

export type HomeStackParamList = {
  Dashboard: undefined;
  MatchSetup: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<HomeStackParamList>();

function HomeTabStack(): React.JSX.Element {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'MatchSetup') {
            iconName = 'plus';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return (
            <Entypo name={iconName ?? 'add-circle'} size={size} color={color} />
          );
        },
        tabBarLabel: () => {
          let label;

          if (route.name === 'Dashboard') {
            label = 'Accueil';
          } else if (route.name === 'MatchSetup') {
            label = 'Match';
          } else if (route.name === 'Profile') {
            label = 'Profil';
          }

          return (
            <Text>{label}</Text>
          );
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Dashboard"
        options={{ tabBarBadge: 2 }}
        component={PublicationScreen}
      />
      <Tab.Screen
        name="MatchSetup"
        component={MatchSetupScreen}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default HomeTabStack;
