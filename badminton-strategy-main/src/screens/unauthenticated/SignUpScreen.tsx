import { NavigationProp, useNavigation } from '@react-navigation/native';
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
import colors from '../../constant/colors';
import { signUp } from 'aws-amplify/auth';
import { ActivityIndicator } from 'react-native-paper';
import CustomTextInput from '@src/components/input/CustomTextInput';
import CustomButton from '@src/components/input/button/PrimaryButton';
import { RootStackParamList } from 'Main';

type SignUpParameters = {
  password: string;
  email: string;
};

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function SignUpScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateField = (name: keyof FormData, value: string) => {
    switch (name) {
      case 'email':
        return value.includes('@') ? undefined : 'Adresse email invalide.';
      case 'confirmPassword':
        if (formData.confirmPassword !== formData.password) {
          return 'Les deux mot de passe ne sont pas similaire.';
        }
        return undefined;
      case 'password': {
        const hasNumber = /\d/.test(value);
        const hasLowercase = /[a-z]/.test(value);
        const hasUppercase = /[A-Z]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const isLongEnough = value.length >= 6;

        if (!isLongEnough) {
          return 'Le mot de passe est trop court.';
        }
        if (!hasNumber || !hasLowercase || !hasUppercase || !hasSpecialChar) {
          return 'Le mot de passe doit contenir au moins un chiffre, une minuscule, une majuscule et un caractère spécial.';
        }
        return undefined;
      }
      default:
        return undefined;
    }
  };

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

  async function handleSignUp({ email, password }: SignUpParameters) {
    try {
      setIsLoading(true);
      if (password) {
        const { nextStep } = await signUp({
          username : email,
          password,
          options: {
            userAttributes: {
              email,
            },
          },
        });
        if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
          navigation.navigate('ConfirmSignUpScreen', { username: email, password: password });
        }
      }
    } catch (error: any) {
      switch (error.name) {
        case 'UsernameExistsException':
          setFormErrors({
            ...formErrors,
            ['email']: 'Cette email est déjà utilisé.',
          });
          break;
        default:
          console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = () => {
    const errors = validateFormData(formData);
    if (Object.keys(errors).length === 0) {
      handleSignUp({
        email: formData['email'],
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
            <CustomTextInput
              id="confirmPassword"
              text={formData.confirmPassword}
              setText={handleTextChange('confirmPassword')}
              placeholder="Confirmation mot de passe"
              error={formErrors.confirmPassword}
              secureTextEntry
            />
            {isLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <CustomButton
                paddingTop={10}
                buttonText="S'inscrire"
                onPress={handleSubmit}
              />
            )}
            <View style={styles.divider} />
            <CustomButton
              paddingTop={10}
              buttonText="Se connecter"
              onPress={() => navigation.navigate('SignInScreen')}
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
    height: 100,
    width: 100,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
    marginVertical: 10,
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

export default SignUpScreen;
