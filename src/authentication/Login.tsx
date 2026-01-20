import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import { Button, Text, Checkbox } from 'react-native-paper';
import { SelectCountry } from 'react-native-element-dropdown';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthStackParamList, useAuth } from '../../App';
import { login } from '../services/auth'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastService } from '../utils/ToastService';
import Loader from '../components/Loader';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { I18nManager } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';


const local_data = [
  {
    value: '1',
    lable: 'EN',
    image: { uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg' },
  },
  {
    value: '2',
    lable: 'AE',
    image: { uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg' },
  },
];

// ------------------------------------------------------------------
// Validation schema
// ------------------------------------------------------------------
const LoginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  captcha: Yup.string().required('Required'),
});
type LoginNav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
const Login: React.FC = () => {
  const navigation = useNavigation<LoginNav>();
  const { setLoggedIn } = useAuth();
  const [checked, setChecked] = useState(false);
  const [country, setCountry] = useState('1');
  const [savedEmail, setSavedEmail] = useState('');
  const [savedPassword, setSavedPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();


  useEffect(() => {
    const loadCredentials = async () => {
      const email = await AsyncStorage.getItem('email');
      const password = await AsyncStorage.getItem('password');
      if (email && password) {
        setSavedEmail(email);
        setSavedPassword(password);
        formik.setValues({ email, password, captcha: '' }); // Optional
        setChecked(true);
      }
    };
    loadCredentials();
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem('appLanguage');
      if (savedLang) {
        setCountry(savedLang === 'ar' ? '2' : '1');
        await i18n.changeLanguage(savedLang);
      }
    };
    loadLanguage();
  }, []);


  const formik = useFormik({
    initialValues: { email: savedEmail, password: savedPassword, captcha: '' },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting, setErrors, setFieldError }) => {
      setLoading(true);
      try {
        if (captcha != values.captcha) {
          setFieldError('captcha', 'Captcha does not match');
          generateCaptcha();
          return;
        }
        setSubmitting(true);
        const response = await login({
          username: values.email,
          password: values.password,
          // captcha: values.captcha,
        });
        console.log('login response', response);

        // if backend succeeds, mark app as logged‑in
        if (checked) {
          await AsyncStorage.multiSet([
            ['email', values.email],
            ['password', values.password],
          ]);
        }
        else {
          await AsyncStorage.multiRemove(['email', 'password']);

        }
        setLoggedIn(true);
      } catch (e: any) {
        console.error('Login failed', e);

        if (e.response) {
          // API responded with an error status
          const status = e.response.status;

          if (status === 400 || status === 401 || status === 403) {
            // Wrong email/password
            setFieldError('password', 'Invalid credentials');
            ToastService.error('Invalid credentials', 'Please try again');
          } else if (status === 500) {
            // Server issue
            ToastService.error('Server error', 'Something went wrong on our side. Please try later.');
          } else {
            // Other response errors
            ToastService.error('Error', e.response.data?.message || 'Unexpected error occurred');
          }
        } else if (e.request) {
          // No response at all (network error, timeout, etc.)
          ToastService.error('Network error', 'Unable to reach server. Please check your connection.');
        } else {
          // Something else happened
          ToastService.error('Error', e.message || 'Unexpected error occurred');
        }
      } finally {
        setSubmitting(false);
        setLoading(false);

      }
    },
  });

  const toggleSecureEntry = () => {
    setSecureText(!secureText);
  };

  const generateCaptcha = () => {
    const newCaptcha = Math.floor(100000 + Math.random() * 900000).toString();
    setCaptcha(newCaptcha);
  };

  const changeLanguage = async (lang: 'en' | 'ar') => {
    await AsyncStorage.setItem('appLanguage', lang); // persist
    await i18n.changeLanguage(lang);                 // switch immediately
  };

  // if (loading) return <Loader />;

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ImageBackground source={require('../../assets/images/loginbottom-img.png')} style={styles.loginBottomImg} />
      {!loading ? (<ScrollView style={styles.container}>

        {/* Country selector (outside Formik) */}
        <SelectCountry
          style={styles.countryDropdown}
          selectedTextStyle={styles.selectedTextContry}
          placeholderStyle={styles.placeholderCountry}
          imageStyle={styles.imageCountry}
          iconStyle={styles.iconCountry}
          maxHeight={200}
          value={country}
          data={local_data}
          valueField="value"
          labelField="lable"
          imageField="image"
          placeholder="Select country"
          containerStyle={styles.dropdownList}
          activeColor="#333333"
          onChange={e => {
            setCountry(e.value);
            const lang = e.value === '2' ? 'ar' : 'en';
            changeLanguage(lang);
          }}
        />

        {/* Main form */}
        <View style={styles.innerContainer}>
          <ImageBackground source={require('../../assets/images/logo.png')} style={styles.logoImage} />
          <Text variant="headlineMedium" style={styles.title}>{t('login.title')}</Text>

          {/* Email */}
          <View style={styles.formViewGroup}>
            <TextInput
              style={styles.formInput}
              placeholder={t('login.email')}
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
              value={formik.values.email}
            />
            <ImageBackground source={require('../../assets/images/email-icon.png')} style={styles.formInputIcon} />
            {formik.touched.email && formik.errors.email && <Text style={styles.errorMessage}>{formik.errors.email}</Text>}
          </View>

          {/* Password */}
          <View style={styles.formViewGroup}>
            <TextInput
              style={styles.formInput}
              placeholder={t('login.password')}
              placeholderTextColor="#aaa"
              secureTextEntry={secureText}
              onChangeText={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              value={formik.values.password}
            />
            <ImageBackground source={require('../../assets/images/password-icon.png')} style={styles.formInputIcon} />
            <TouchableOpacity onPress={toggleSecureEntry} style={styles.passwordIcon}>
              <Icon name={secureText ? 'eye-off' : 'eye'} size={20} color="#ffffff" />
            </TouchableOpacity>
            {formik.touched.password && formik.errors.password && <Text style={styles.errorMessage}>{formik.errors.password}</Text>}
          </View>

          <Text style={styles.forgotLink}>{t('login.forgot_password')}</Text>

          {/* Captcha */}
          <View style={styles.formViewGroup}>
            <TextInput
              style={styles.formInput}
              placeholder={t('login.enter_captcha')}
              placeholderTextColor="#aaa"
              onChangeText={formik.handleChange('captcha')}
              onBlur={formik.handleBlur('captcha')}
              value={formik.values.captcha}
            />
            <Button style={styles.refreshBt} onPress={() => generateCaptcha()}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#fff', position: 'relative', top: -2, fontSize: 12, height: 20, }}> {captcha}
                  <Image style={{ width: 20, height: 14, marginLeft: 6 }} source={require('../../assets/images/refresh-icon.png')} />
                </Text>
              </View>
            </Button>
            <ImageBackground source={require('../../assets/images/captcha-icon.png')} style={styles.formInputIcon} />
            {formik.touched.captcha && formik.errors.captcha && <Text style={styles.errorMessage}>{formik.errors.captcha}</Text>}
          </View>

          {/* Save Password */}
          <View style={styles.cboxStyle}>
            <Checkbox
              color="#fff"
              uncheckedColor="#fff"
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => setChecked(!checked)}
            />
            <Text style={styles.cboxlabel}> {t('login.remember_me')} </Text>
          </View>

          {/* Submit */}
          <Button mode="contained" style={styles.primaryBt} onPress={() => formik.handleSubmit()}>
            {t('login.submit')}
          </Button>

        </View>
        {/* <Button mode="contained" style={styles.primaryBt} onPress={() => navigation.navigate('AddVehicle')}>
          add vehicle
        </Button> */}




      </ScrollView>) : (<Loader />)}



    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    // justifyContent: 'flex-start',
    marginTop: 30,
    paddingHorizontal: 20,
  },

  logoImage: {
    marginHorizontal: 'auto',
    marginTop: 0,
    width: 250,
    height: 54,
    justifyContent: 'space-between',

  },

  innerContainer: {
    position: 'relative',
    zIndex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },

  title: {
    fontSize: 16,
    // fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 30,
    marginBottom: 15,
    color: '#fff',
    paddingLeft: 10,
    fontFamily: 'Poppins-Bold',
  },

  formViewGroup: {
    marginBottom: 15,
  },

  formInput: {
    height: 45,
    borderColor: '#ddd',
    borderRadius: 40,
    paddingRight: 20,
    paddingLeft: 50,
    marginTop: 0,
    fontSize: 14,
    fontWeight: 400,
    color: '#fff',
    backgroundColor: '#1C1C1C'
  },

  formInputIcon: {
    width: 16,
    height: 16,
    position: 'absolute',
    top: 14,
    left: 20,
  },
  forgotLink: {
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'right',
    marginBottom: 20,
    color: '#fff',
  },

  passwordIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,

    height: 40,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  errorMessage: {
    color: '#FFACAC',
    marginTop: 2,
    marginBottom: 5,
    fontSize: 13,
    fontWeight: 400,
  },

  cboxStyle: {
    position: 'relative',
    marginTop: 0,
    marginBottom: 15,
  },

  cboxlabel: {
    color: '#fff',
    position: 'absolute',
    left: 40,
    top: 7,
    fontSize: 13,
  },

  loginBottomImg: {
    position: 'absolute',
    width: '100%',
    height: 170,
    bottom: 0,
    resizeMode: 'cover',

  },

  primaryBt: {
    borderRadius: 40,
  },

  refreshBt: {
    width: 105,
    backgroundColor: '#02152D',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#fff',
    borderRadius: 40,
    height: 33,

    position: 'absolute',
    right: 6,
    top: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },


  // Select

  countryDropdown: {
    width: 90,
    marginBottom: 20,
    marginHorizontal: 10,
    height: 30,
    backgroundColor: '#000000',
    borderRadius: 30,
    color: '#fff',
    paddingHorizontal: 12,
    alignSelf: 'flex-end'



  },
  imageCountry: {
    width: 16,
    height: 16,
    color: '#fff',
  },
  placeholderCountry: {
    fontSize: 14,
    color: '#fff',
  },
  selectedTextContry: {
    fontSize: 12,
    marginLeft: 8,
    color: '#fff',


  },
  iconCountry: {
    width: 13,
    height: 13,
    backgroundColor: '#000',

  },
  inputSearchCountry: {
    height: 40,
    fontSize: 16,
    backgroundColor: '#000',

  },

  dropdownList: {
    backgroundColor: '#000',
    color: '#fff',
    borderColor: '#000',
    borderRadius: 4,

  },
});
