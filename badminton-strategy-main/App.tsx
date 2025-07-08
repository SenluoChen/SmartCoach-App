import { REACT_APP_USER_POOL_ID, REACT_APP_CLIENT_ID } from '@env';
import React from 'react';
import { Amplify, type ResourcesConfig } from 'aws-amplify';
import { defaultStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import Main from './Main';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const authConfig: ResourcesConfig['Auth'] = {
  Cognito: {
    userPoolId: REACT_APP_USER_POOL_ID,
    userPoolClientId: REACT_APP_CLIENT_ID,
  },
};

Amplify.configure({
  Auth: authConfig,
});

cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider>
          <Main />
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
