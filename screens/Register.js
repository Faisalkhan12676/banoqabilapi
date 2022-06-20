import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  Alert,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  TextInput,
  HelperText,
  ActivityIndicator,
  Checkbox,
} from 'react-native-paper';
import {Button} from 'react-native-paper';
import {Formik, useFormik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {color} from '../components/Colors';
import {BASE_URL} from '../config';
import {useDispatch} from 'react-redux';
import Recaptcha from 'react-native-recaptcha-that-works';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AlertIcon from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';



const validation = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  //validation for phone
  email: Yup.string()
    .min(11, 'Phone number must be 11 digits')
    .max(11, 'Phone number must be 12 digits')
    .required('Phone number is required'),
});

const Register = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [eye, setEye] = useState(true);
  const [err, setErr] = useState('');
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const [isdisabled, setIsdisabled] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [btnMsg,setbtnMsg] = useState("Register");

  useEffect(()=>{

    if(Platform.OS === "android"){
      const getAllVersions = async () => {
        axios
          .get(`${BASE_URL}/Setting/GetAll`)
          .then(res => {
            const {version} = res.data[0];
            console.log(version);
            const currentVersion = DeviceInfo.getVersion();
            if (currentVersion !== version) {
              Alert.alert(
                'Update',
                'New version available',
                [
                  {
                    text: 'Update',
                    onPress: () =>
                      Linking.openURL(
                        'https://play.google.com/store/apps/details?id=com.banoQabil',
                      ),
                  },
                ],
                {cancelable: false},
              );
            }
          })
          .catch(err => {
            console.log(err);
          });
      };
  
      getAllVersions();
    }
  },[])

  //img sourse
  const imgSourse = require('../assets/logo2.png');

  return (
    <>
      <View style={styles.container}>
        <View style={styles.form}>
          <View style={styles.logo}>
            <Image
              source={require('../assets/Bano-Qabil-Logo-Green.png')}
              style={styles.img}
            />
          </View>
          <Formik
            onSubmit={async (values, {resetForm}) => {
              setIsdisabled(true);
              setbtnMsg("Loading...")
              //remove spaces from values
              const name = values.name.trim();
              const username = values.username.trim();
              const password = values.password.trim();
              const email = values.email.trim();
              const number = email.slice(1);
              const number1 = '+92' + number;

              // setIsLoading(true);
              await axios
                .post(`${BASE_URL}/Auth/register`, {
                  name,
                  username,
                  email: number1,
                  password,
                  role: null,
                })
                .then(res => {
                  //SMS WORK
                  //  console.log(res.data);
                  axios
                    .post(
                      `https://sms.montymobile.com/API/SendBulkSMS`,
                      {
                        source: 'Alkhidmat',
                        destination: [`${number1}`],
                        text: 'Thank you for registering with Bano Qabil.',
                      },
                      {
                        headers: {
                          Authorization: 'Basic SW5ub3ZhZG9yOkZjNGhpNWNr',
                        },
                      },
                    )
                    .then(res => {
                      console.log('SMS RESPONSE', res);
                    })
                    .catch(err => {
                      console.log(err);
                    });

                  //SMS WORK
                  setIsLoading(false);
                  setIsdisabled(false);
                  // console.log(res.data);
                  const data = JSON.stringify(res.data);
                  try {
                    AsyncStorage.setItem('@userlogininfo', data);
                    // console.log('data', data);

                    setModalVisible(true);
                  } catch (e) {
                    // saving error
                  }
                })
                .catch(err => {
                  setErr(err.response.data);
                  setIsdisabled(false);
                });
            }}
            initialValues={{
              name: '',
              username: '',
              email: '',
              password: '',
            }}
            validationSchema={validation}>
            {({handleChange, handleBlur, handleSubmit, values, errors}) => (
              <>
                <View style={styles.form}>
                  <TextInput
                    disabled={isdisabled}
                    label="Name"
                    onChangeText={handleChange('name')}
                    value={values.name}
                    style={styles.input}
                    mode="flat"
                    onBlur={handleBlur('name')}
                    activeUnderlineColor={color.primary}
                  />
                  <HelperText type="error" visible={errors.name}>
                    {errors.name}
                  </HelperText>
                  <TextInput
                    disabled={isdisabled}
                    onChangeText={handleChange('username')}
                    label="Username"
                    value={values.username}
                    style={styles.input}
                    mode="flat"
                    onBlur={handleBlur('username')}
                    activeUnderlineColor={color.primary}
                  />
                  <HelperText type="error" visible={errors.username}>
                    {errors.username || err}
                  </HelperText>
                  {/* <HelperText type='error'>{err}</HelperText> */}

                  <TextInput
                    disabled={isdisabled}
                    onChangeText={handleChange('email')}
                    label="Mobile Number"
                    value={values.email}
                    style={styles.input}
                    mode="flat"
                    onBlur={handleBlur('email')}
                    activeUnderlineColor={color.primary}
                  />
                  <HelperText type="error" visible={errors.email}>
                    {errors.email}
                  </HelperText>
                  <TextInput
                    disabled={isdisabled}
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
                  <HelperText type="error" visible={errors.password}>
                    {errors.password}
                  </HelperText>
                  <View style={{
                    flexDirection:"row",
                    justifyContent:'flex-start',
                    alignItems:'center',
                    width:'100%'
                  }}>
                    <Checkbox
                    status={isChecked ? 'checked' : 'unchecked'}
                    onPress={()=>{
                      if(isChecked){
                        setIsChecked(false);
                        setIsdisabled(true);
                        setbtnMsg("Register");
                      }else if(!isChecked){
                        setIsChecked(true);
                        setIsdisabled(false);
                        setbtnMsg("Register");
                      }
                    }}
                    />
                    <Text style={{
                      maxWidth:270
                    }}>
                      You'll Receive SMS And Email From banoqabil.pk To Share
                      Updates With You.
                    </Text>
                  </View>
                  <Button
                    loading={isloading}
                    onPress={handleSubmit}
                    disabled={isdisabled}
                    mode="contained"
                    style={styles.buttonr}>
                    {btnMsg}
                  </Button>

                  <TouchableOpacity onPress={() => navigate.navigate('Login')}>
                    <Text style={{textAlign: 'center', color: '#000'}}>
                      Already Have Account?
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        marginRight: 10,
                      }}>
                      A Project Of
                    </Text>
                    <View
                      style={{
                        width: 80,
                        height: 80,
                      }}>
                      <Image
                        source={imgSourse}
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </View>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#000',
                      marginBottom: 30,
                    }}>
                    For More Info:{' '}
                    <Text
                      style={{
                        color: 'blue',
                      }}>
                      https://banoqabil.pk/
                    </Text>
                  </Text>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <AlertIcon
              name="checkmark-circle-outline"
              size={40}
              color={color.primary}
            />
            <Text style={styles.modalText}>
              You Have Signed Up Successfully.
            </Text>
            <Button
              color={color.primary}
              onPress={() => {
                setModalVisible(!modalVisible);
                if (modalVisible) {
                  dispatch({type: 'LOGIN'});
                }
              }}>
              Ok
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Register;

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
    padding: 0,
  },
  buttonr: {
    width: 300,
    margin: 10,
    backgroundColor: color.primary,
  },
  img: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
  logo: {
    width: 300,
    height: 150,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
