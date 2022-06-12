import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {TextInput, HelperText} from 'react-native-paper';
import {Button} from 'react-native-paper';
import {Formik, useFormik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {color} from '../components/Colors';
import {BASE_URL} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import Recaptcha from 'react-native-recaptcha-that-works';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Recaptcha from 'react-native-recaptcha-that-works';
import Icon from 'react-native-vector-icons/MaterialIcons';
//6LfkbEMgAAAAAIkc9Cd-pls5ZspaVywaGQfgG4Dl Captha API Key
const validation = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const [isloading, setIsLoading] = useState(false);
  const [eye, setEye] = useState(true);
  const navigate = useNavigation();
  const dispatch = useDispatch();

  const loginstate = useSelector(state => state.LoginReducer.isLoggedIn);
  const [toast, setToast] = useState('');

  const size = 'normal';
  const $recaptcha = useRef();
  const handleOpenPress = useCallback(() => {
    $recaptcha.current.open();
  }, []);
  const handleClosePress = useCallback(() => {
    $recaptcha.current.close();
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={validation}
        onSubmit={(values, {resetForm}) => {
          setIsLoading(true);
          //remove spaces from values
          const username = values.username.trim();
          const password = values.password.trim();

          axios
            .post(`${BASE_URL}/Auth/login`, {
              username,
              password,
            })
            .then(res => {
              const data = JSON.stringify(res.data);
              try {
                AsyncStorage.setItem('@userlogininfo', data);
                console.log('data', data);
                dispatch({type: 'LOGIN'});
                if (loginstate) {
                  navigate.navigate('str');
                }
                resetForm();
              } catch (e) {
                // saving error
              }
            })
            .catch(err => {
              // console.log(err.data);
              console.log(err.response.data);
              setToast(err.response.data);
              setIsLoading(false);
            });
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.container}>
            <View style={styles.logo}>
              <Image
                source={require('../assets/Bano-Qabil-Logo-Green.png')}
                style={styles.img}
              />
            </View>

            <View>
              <TextInput
                label="Username"
                onChangeText={handleChange('username')}
                value={values.name}
                style={styles.input}
                mode="flat"
                onBlur={handleBlur('username')}
                activeUnderlineColor={color.primary}
              />
              <HelperText
                type="error"
                visible={errors.username && touched.username}>
                {errors.username}
              </HelperText>

              <TextInput
                label="Password"
                secureTextEntry={eye}
                value={values.password}
                mode="flat"
                onBlur={handleBlur('password')}
                onChangeText={handleChange('password')}
                activeUnderlineColor={color.primary}
                right={
                  <TextInput.Icon
                    name={eye ? 'eye-off' : 'eye'}
                    onPress={() => (eye ? setEye(false) : setEye(true))}
                  />
                }
                style={styles.input}
              />
              <HelperText
                style={{textAlign: 'left'}}
                type="error"
                visible={errors.password}>
                {errors.password}
              </HelperText>
              <TouchableOpacity onPress={()=>{
                navigate.navigate('ForgetScreen')
              }} style={{
                marginLeft: 10
              }}>
                <Text style={{color:'#000'}}>Forgot Your Password?</Text>
              </TouchableOpacity>
              <View>
                <Text style={{color: 'red', marginLeft: 10}}>{toast}</Text>
              </View>
             
              <Button
                loading={isloading}
                onPress={handleOpenPress}
                disabled={isloading}
                mode="contained"
                style={styles.button}>
                login
              </Button>
            </View>
            <TouchableOpacity onPress={() => navigate.navigate('Register')}>
              <Text
                style={{
                  color: '#000',
                }}>
                Don't Have Account?
              </Text>
            </TouchableOpacity>
            

            <Recaptcha
              ref={$recaptcha}
              lang="en"
              headerComponent={
                <SafeAreaView>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}>
                    <Icon
                      name="close"
                      size={30}
                      style={{marginRight: 10}}
                      onPress={handleClosePress}
                    />
                  </View>
                </SafeAreaView>
              }
              loadingComponent={
                <>
                  <ActivityIndicator color="green" />
                  <Text style={{color: '#fff'}}>Loading reCaptcha...</Text>
                </>
              }
              siteKey="6LfkbEMgAAAAAIkc9Cd-pls5ZspaVywaGQfgG4Dl"
              baseUrl="http://127.0.0.1"
              size={size}
              theme="light"
              onError={err => {
                alert('SOMETHING WENT WRONG');
                // console.warn(err);
              }}
              onExpire={() => alert('TOKEN EXPIRED')}
              onVerify={token => {
                axios
                  .post(`${BASE_URL}/Auth/Recaptcha?token=${token}`)
                  .then(res => {
                    if (res.data === true) {
                      handleSubmit();
                    } else {
                      alert('Verification failed');
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }}
            />
          </View>
        )}
      </Formik>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  input: {
    width: 300,
    height: 65,
    marginLeft: 10,
  },
  button: {
    width: 300,
    margin: 10,
    backgroundColor: color.primary,
    color: '#fff',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  logo: {
    width: 200,
    height: 200,
  },
});


