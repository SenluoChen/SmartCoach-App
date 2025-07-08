import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Portal,
  Text,
} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import { PostUser } from '@src/app/datasource/user.type';
import {
  useGetUserMutation,
  usePostUserMutation,
} from '@src/app/redux/api/userApi';
import CustomTextInput from '@src/components/input/CustomTextInput';
import CustomButton from '@src/components/input/button/PrimaryButton';
import colors from '@src/constant/colors';
import { RootStackParamList } from 'Main';
import { setUser } from '@src/app/redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@src/app/hooks';

interface FormErrors {
  birthdate?: string;
  firstName?: string;
  country?: string;
  lastName?: string;
  licenseNumber?: string;
  filename?: string;
  email?: string;
}

type FirstSignUpScreenProps = {
  route: RouteProp<RootStackParamList, 'FirstSignUpScreen'>;
};

const FirstSignUpScreen: React.FC<FirstSignUpScreenProps> = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const email = useAppSelector((state) => state.user.email)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<PostUser>({
    email: email,
    birthdate: '',
    firstName: '',
    lastName: '',
    country: '',
    licenseNumber: '',
    filename: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [step, setStep] = useState<number>(0);
  const [asset, setAsset] = useState<Asset | undefined>();
  const [image, setImage] = useState<boolean>(false);
  const [postUser] = usePostUserMutation();
  const [getUser] = useGetUserMutation();
  const dispatch = useAppDispatch();

  const listStepInscription = [
    {
      id: 'birthdate-step',
      title: 'Date de Naissance',
      description: 'Veuillez entrer votre date de naissance.',
      image: require('/assets/img/signUp/miamia_birhtdate.png'),
      data: 'birthdate',
      type: 'date',
    },
    {
      id: 'firstName-step',
      title: 'Prénom',
      description: 'Quelle est votre prénom ?',
      image: require('/assets/img/signUp/miamia_firstName.png'),
      data: 'firstName',
      type: 'string',
    },
    {
      id: 'lastName-step',
      title: 'Nom',
      description: 'Quelle est votre nom ?',
      image: require('/assets/img/signUp/miamia_firstName.png'),
      data: 'lastName',
      type: 'string',
    },
    {
      id: 'country-step',
      title: 'Pays',
      description: 'Quelle est votre pays de résidence ?',
      image: require('/assets/img/signUp/miamia_country.png'),
      data: 'country',
      type: 'country',
    },
    {
      id: 'licenseNumber-step',
      title: 'Numéro de license',
      description: 'Quelle est votre numéro de license ?',
      image: require('/assets/img/signUp/miamia_number.png'),
      data: 'licenseNumber',
      type: 'string',
    },
  ];

  const handleTextChange = (name: keyof FormData) => (text: string) => {
    setFormErrors({ ...formErrors, [name]: '' });
    setFormData({ ...formData, [name]: text });
  };

  function convertISOToDate(isoDate: string): string {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const handlePostUser = async () => {
    try {
      const birthdateFormatted = convertISOToDate(formData.birthdate);
      const result = await postUser({
        email: email,
        birthdate: birthdateFormatted,
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
        licenseNumber: formData.licenseNumber,
        filename: asset?.fileName ?? '',
      }).unwrap();
      return result;
    } catch (error: any) {
      console.log(error);
    }
  };

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response?.assets) {
        setAsset(response.assets[0]);
      }
    });
  };

  const getBlob = async (fileUri: string) => {
    const resp = await fetch(fileUri);
    if (!resp.ok) {
      throw new Error('Network response was not ok.');
    }
    const imageBody = await resp.blob();
    return imageBody;
  };

  const uploadImageToAWS = async () => {
    try {
      setIsLoading(true);
      const result = await handlePostUser();
      
      if (result?.uploadUrl === undefined) {
        throw 'Problem to post user profile';
      }
      if (asset?.uri === undefined) {
        throw 'Problem to post user profile';
      }
      const imageBody = await getBlob(asset?.uri);

      const resultFetch = await fetch(result?.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': imageBody.type,
        },
        body: imageBody,
      });
      if (!resultFetch.ok) {
        throw new Error('Failed to upload image to S3.');
      }
  
      const user = await getUser().unwrap();
      dispatch(setUser(user));
      navigation.navigate('Home');
    } catch (error: any) {
      Alert.alert('Upload Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {image ? (
          <View style={styles.uploadContainer}>
            <Text style={styles.profilePictureText}>
              Choisissez votre image de profil :
            </Text>
            {asset?.uri ? (
              <Image style={styles.image} source={{ uri: asset?.uri }} />
            ) : (
              <Image
                style={styles.image}
                source={require('/assets/img/default_profile_picture.png')}
              />
            )}
            <CustomButton
              paddingTop={10}
              buttonText="Sélèctionner une image"
              onPress={selectImage}
              color="black"
              fontColor="white"
            />
            <CustomButton
              paddingTop={10}
              buttonText="Finaliser mon profil"
              onPress={uploadImageToAWS}
              color={'green'}
              fontColor="white"
            />
          </View>
        ) : (
          <>
            <Text variant="titleLarge">Information utilisateur</Text>
            <Text style={styles.description}>
              {listStepInscription[step].description}
            </Text>
            <View style={styles.form}>
              {listStepInscription[step].type === 'string' ||
              listStepInscription[step].type === 'string300' ||
              listStepInscription[step].type === 'country' ? (
                <CustomTextInput
                  maxLength={
                    listStepInscription[step].type === 'string300' ? 300 : 60
                  }
                  id={listStepInscription[step].id}
                  text={
                    formData[listStepInscription[step].data as keyof PostUser]
                  }
                  setText={handleTextChange(
                    listStepInscription[step].data as keyof FormData
                  )}
                  multiline={
                    listStepInscription[step].type === 'string300'
                      ? true
                      : false
                  }
                  placeholder={listStepInscription[step].title}
                  error={
                    formErrors[listStepInscription[step].data as keyof PostUser]
                  }
                  color="black"
                />
              ) : (
                <>
                  <DatePicker
                    mode="date"
                    date={
                      formData[listStepInscription[step].data as keyof PostUser]
                        ? new Date(
                            formData[
                              listStepInscription[step].data as keyof PostUser
                            ]
                          )
                        : new Date()
                    }
                    onDateChange={(date) => {
                      setFormData({
                        ...formData,
                        [listStepInscription[step].data as keyof PostUser]:
                          date,
                      });
                    }}
                  />
                </>
              )}
              <View style={styles.buttonContainer}>
                <View style={styles.flex1}>
                  {step > 0 && (
                    <CustomButton
                      paddingTop={10}
                      buttonText="Précédent"
                      onPress={() => setStep(step - 1)}
                      color={colors.primary}
                      fontColor="white"
                    />
                  )}
                </View>
                <View style={styles.flex1}>
                  {formData[
                    listStepInscription[step].data as keyof PostUser
                  ] !== '' && (
                    <CustomButton
                      paddingTop={10}
                      buttonText={
                        step < Object.keys(listStepInscription).length - 1
                          ? 'Suivant'
                          : 'Fini'
                      }
                      onPress={() => {
                        step < Object.keys(listStepInscription).length - 1
                          ? setStep(step + 1)
                          : setImage(true);
                      }}
                      color={colors.primary}
                      fontColor="white"
                    />
                  )}
                </View>
              </View>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
      {image === false && (
        <View style={styles.imageContainer}>
          <Image
            style={styles.logo}
            source={
              image
                ? require('/assets/img/ants_image.png')
                : listStepInscription[step].image
            }
          />
        </View>
      )}
      {isLoading && (
        <Portal>
          <View style={styles.portal}>
            <ActivityIndicator size={70} color={colors.white} />
            <Text style={styles.textPortal}>Prise en compte du profile</Text>
          </View>
        </Portal>
      )}
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
  uploadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
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
  buttonContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  flex1: {
    flex: 1,
    marginHorizontal: 5,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 30,
    borderRadius: 150,
  },
  profilePictureText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  portal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  textPortal: {
    color: colors.white,
    paddingTop: 15,
    fontSize: 15,
    fontWeight: '800',
  },
});

export default FirstSignUpScreen;
