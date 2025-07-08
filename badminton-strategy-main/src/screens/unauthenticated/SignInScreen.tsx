import { NavigationProp, useNavigation } from '@react-navigation/native';
import { REACT_APP_USER_POOL_ID, REACT_APP_CLIENT_ID } from '@env';
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { SignInInput, signIn } from 'aws-amplify/auth';
import { useAppDispatch } from '@src/app/hooks';
import { setAuthenticated, setEmail } from '@src/app/redux/slices/userSlice';
import CustomTextInput from '@src/components/input/CustomTextInput';
import CustomButton from '@src/components/input/button/PrimaryButton';
import colors from '@src/constant/colors';
import { RootStackParamList } from 'Main';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function SignInScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateField = (name: keyof FormData, value: string) => 
    value.length === 0 ? 'Ce champ doit être rempli' : undefined
  ;

  const validateFormData = (data: FormData): FormErrors => {
    const errors: FormErrors = {};
    Object.keys(data).forEach((key) => {
      const fieldName = key as keyof FormData;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        errors[fieldName] = error;
      }
    });
    return errors;
  };

  async function handleSignIn({ username, password }: SignInInput) {
    try {
      setIsLoading(true);
      const { nextStep } = await signIn({ username, password });
      if (nextStep.signInStep === 'CONFIRM_SIGN_UP' && password) {
        navigation.navigate('ConfirmSignUpScreen', { username, password });
      } else {
        dispatch(setEmail(username));
        dispatch(setAuthenticated(true));
      }
    } catch (error) {
      console.log('error signing in', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async () => {
    const errors = validateFormData(formData);
    if (Object.keys(errors).length === 0) {
      await handleSignIn({
        username: formData['email'],
        password: formData['password'],
      });
    } else {
      setFormErrors(errors);
    }
  };

  const handleTextChange = (name: keyof FormData) => (text: string) => {
    setFormErrors({ ...formErrors, [name]: '' });
    setFormData({ ...formData, [name]: text });
  };

  return (
    <ImageBackground
      source={require('../../../assets/img/background_signIn.png')}
      resizeMode="cover"
      style={styles.imageBackground}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.overlay}></View>
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require('../../../assets/logo/logo_title.png')}
          />
          <View style={styles.form}>
            <CustomTextInput
              id="email"
              text={formData.email}
              setText={handleTextChange('email')}
              placeholder="Email"
              error={formErrors.email}
            />
            <CustomTextInput
              id="password"
              text={formData.password}
              setText={handleTextChange('password')}
              placeholder="Mot de passe"
              error={formErrors.password}
              secureTextEntry
            />
            {isLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <CustomButton
                paddingTop={10}
                buttonText="Se connecter"
                onPress={handleSubmit}
              />
            )}
            <View style={{ paddingTop: 5 }}>
              <Button mode="text" onPress={() => console.log('Pressed')}>
                <Text
                  style={{
                    textDecorationLine: 'underline',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  {REACT_APP_USER_POOL_ID}
                </Text>
              </Button>
            </View>
            <View style={styles.divider} />
            <CustomButton
              paddingTop={10}
              buttonText="S'inscrire"
              onPress={() => navigation.navigate('SignUpScreen')}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  form: {
    paddingHorizontal: 50,
    flex: 1,
    width: '100%',
  },
  imageBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  logo: {
    height: 250,
    width: 250,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
    marginBottom: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.20)',
  },
  keyboardAvoidingView: {
    backgroundColor: 'transparent',
    width: '100%',
    flex: 1,
  },
});

export default SignInScreen;
