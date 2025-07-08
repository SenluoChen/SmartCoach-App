import { RouteProp } from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { confirmSignUp, resendSignUpCode, signIn } from 'aws-amplify/auth';
import { Text } from 'react-native-paper';
import { setAuthenticated, setEmail } from '../../app/redux/slices/userSlice';
import { useAppDispatch } from '../../app/hooks';
import { RootStackParamList } from '../../../Main';
import CustomTextInput from '@src/components/input/CustomTextInput';
import CustomButton from '@src/components/input/button/PrimaryButton';
import colors from '@src/constant/colors';

interface FormData {
  code: string;
}

interface FormErrors {
  code?: string;
}

type ConfirmSignUpScreenProps = {
  route: RouteProp<RootStackParamList, 'ConfirmSignUpScreen'>;
};

const ConfirmSignUpScreen: React.FC<ConfirmSignUpScreenProps> = ({ route }) => {
  const dispatch = useAppDispatch();
  const { username, password } = route.params;
  const [formData, setFormData] = useState<FormData>({
    code: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  async function handleConfirmSignUp(code: string) {
    try {
      if (code) {
        await confirmSignUp({
          username,
          confirmationCode: code,
        });
        await signIn({
          username: username,
          password: password
        })
        dispatch(setEmail(username));
        dispatch(setAuthenticated(true));
      }
    } catch (error: any) {
      switch (error.name) {
        case 'UsernameExistsException':
          setFormErrors({
            ...formErrors,
            ['code']: 'Cette email est déjà utilisé.',
          });
          break;
        default:
          console.log(error);
      }
    }
  }

  async function handleResendCode() {
    try {
      await resendSignUpCode({
        username,
      });
    } catch (error: any) {
      setFormErrors({
        ...formErrors,
        ['code']: "Une  erreur est survenue lors de l'envoie du code",
      });
    }
  }

  const handleSubmit = () => {
    if (formData.code.length <= 0) {
      setFormErrors({
        ...formErrors,
        ['code']: 'Vous devez completer ce champ.',
      });
    } else {
      handleConfirmSignUp(formData.code);
    }
  };

  const handleTextChange = (name: keyof FormData) => (text: string) => {
    setFormErrors({ ...formErrors, [name]: '' });
    setFormData({ ...formData, [name]: text });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text variant="titleLarge">Confirmation d'inscription</Text>
        <Text style={styles.description}>
          Vous avez recu un code à l'adresse {username}, veuillez le rentrer
          ci-dessous.
        </Text>
        <View style={styles.form}>
          <CustomTextInput
            id="code"
            text={formData.code}
            setText={handleTextChange('code')}
            placeholder="Code"
            error={formErrors.code}
            color="black"
            keyboardType="numeric"
          />
          <CustomButton
            paddingTop={10}
            buttonText="Confirmer"
            onPress={handleSubmit}
            color="black"
            fontColor="white"
          />
          <CustomButton
            paddingTop={10}
            buttonText="Renvoyer le code"
            onPress={handleResendCode}
            color={colors.primary}
            fontColor="white"
          />
        </View>
      </KeyboardAvoidingView>
      <View style={styles.imageContainer}>
        <Image
          style={styles.logo}
          source={require('../../../assets/img/code_ants.png')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: colors.white,
    padding: 20,
  },
  form: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  description: {
    paddingVertical: 5,
  },
  logo: {
    height: 300,
    width: 300,
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    backgroundColor: 'transparent',
    flex: 1,
  },
});

export default ConfirmSignUpScreen;
