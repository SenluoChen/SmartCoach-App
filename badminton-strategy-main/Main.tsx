import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from './src/app/hooks';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConfirmSignUpScreen from './src/screens/unauthenticated/ConfirmSignUpScreen';
import FirstSignUpScreen from './src/screens/unauthenticated/FirstSignUpScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import SignInScreen from './src/screens/unauthenticated/SignInScreen';
import SignUpScreen from './src/screens/unauthenticated/SignUpScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeTabStack from './src/stack/HomeTabStack';
import MatchSingleScreen from '@src/screens/Main/MatchSingleScreen';
import MatchDoubleScreen from '@src/screens/Main/MatchDoubleScreen';
import { HistoryHit, Match } from '@src/app/datasource/match.type';
import AnalyzeMatchResultScreen from '@src/screens/Main/AnalyzeMatchResultScreen';

export type RootStackParamList = {
  SignInScreen: undefined;
  SignUpScreen: undefined;
  ConfirmSignUpScreen: { username: string; password: string; };
  FirstSignUpScreen: undefined;
  LoadingScreen: undefined;
  Home: undefined;
  MatchSingle: undefined;
  MatchDouble: {
    player1: string;
    player2: string;
    opponent1: string;
    opponent2: string;
  };
  AnalyzeMatchResult: undefined;
};

export const Stack = createNativeStackNavigator<RootStackParamList>();

function Main(): React.JSX.Element {
  const authenticated = useAppSelector((state) => state.user.authenticated);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={'LoadingScreen'}
          screenOptions={{ headerShown: false }}
        >
          {authenticated ? (
            <>
              <Stack.Group>
                <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
                <Stack.Screen
                  name="FirstSignUpScreen"
                  component={FirstSignUpScreen}
                />
                <Stack.Screen name="Home">
                  {() => <HomeTabStack />}
                </Stack.Screen>
                <Stack.Screen
                  name="MatchSingle"
                  component={MatchSingleScreen}
                />
                <Stack.Screen
                  name="MatchDouble"
                  component={MatchDoubleScreen}
                />
                <Stack.Screen
                  name="AnalyzeMatchResult"
                  component={AnalyzeMatchResultScreen}
                />
              </Stack.Group>
            </>
          ) : (
            <Stack.Group>
              <Stack.Screen name="SignInScreen" component={SignInScreen} />
              <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
              <Stack.Screen
                name="ConfirmSignUpScreen"
                component={ConfirmSignUpScreen}
              />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default Main;
