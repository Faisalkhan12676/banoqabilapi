import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  Pressable,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {
  useDebugValue,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  List,
  TextInput,
  RadioButton,
  Divider,
  DataTable,
  Button,
  HelperText,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';

import {color} from '../components/Colors';
import * as Yup from 'yup';
import {Formik, useFormik} from 'formik';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import {BASE_URL} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions, useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Recaptcha from 'react-native-recaptcha-that-works';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import RNPickerSelect from 'react-native-picker-select';

const StudentRegistration = () => {
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const [Id, setId] = useState(null);
  const [image, setImage] = React.useState(null);
  const [ext, setExt] = React.useState(null);
  const [district, setDistrict] = useState([]);
  const [city, setCity] = useState([]);
  const [token, setToken] = useState(null);
  const [imgplaceholder, setImgplaceholder] = useState('Add Image');
  const [isloading, setIsLoading] = useState(true);
  const [isImg, setIsImg] = useState(false);
  const [validateImg, setValidateImg] = useState(false);
  const [isbtn, setIsbtn] = useState(false);
  const [loadArea, setLoadArea] = useState(false);
  const [degree, setDegree] = useState([]);

  // const size = 'normal';
  // const $recaptcha = useRef();
  // const handleOpenPress = useCallback(() => {
  //   $recaptcha.current.open();
  // }, []);
  // const handleClosePress = useCallback(() => {
  //   $recaptcha.current.close();
  // }, []);

  useEffect(() => {
    //GET USER ID FROM ASYNC STORAGE

    const getToken = async () => {
      try {
        const value = await AsyncStorage.getItem('@userlogininfo');
        if (value !== null) {
          // We have data!!
          const data = JSON.parse(value);
          setToken(data.token);
          console.log('TOKEN', data.token);

          const getStudent = async () => {
            await axios
              .get(`${BASE_URL}/Student/GetByUserIdWithRelationShip`, {
                headers: {Authorization: `Bearer ${data.token}`},
              })
              .then(res => {
                //get status
                console.log(res.data, 'IM FROM STUDENT REGISTRATION');
                navigate.dispatch(StackActions.replace('courses'));
              })
              .catch(err => {
                console.log(err + 'ERROR FROM STUDENT');
                if (err.response.status === 401) {
                  AsyncStorage.removeItem('@userlogininfo')
                    .then(() => {
                      dispatch({type: 'LOGOUT'});
                      Alert.alert('Session Expired', 'Please Login Again', [
                        {
                          text: 'OK',
                          onPress: () => {
                            AsyncStorage.clear();
                            navigate.dispatch(StackActions.replace('login'));
                          },
                        },
                      ]);
                    })
                    .catch(err => {
                      console.log(err);
                    });
                } else if (err.response.status === 500) {
                  setIsLoading(false);
                  console.log('ERROR 500');
                }
              });
          };
          getStudent();

          const getCity = async () => {
            await axios
              .get(`${BASE_URL}/City/GetAll`, {
                headers: {Authorization: `Bearer ${data.token}`},
              })
              .then(res => {
                // console.log(res.data);

                setCity(res.data);
                console.log(res.data + 'IM FROM CITY REGISTRATION');
              })
              .catch(err => {
                console.log(err);
              });
          };
          getCity();

          const getDegree = async () => {
            await axios
              .get(`${BASE_URL}/Degree/GetAll`, {
                headers: {Authorization: 'Bearer ' + data.token},
              })
              .then(res => {
                setDegree(res.data);
              })
              .catch(err => {
                console.log(err);
              });
          };
          getDegree();
        }
      } catch (error) {
        // Error retrieving data
      }
    };

    getToken();
  }, []);

  // const ImageHandle = () => {
  //   const options = {
  //     title: 'Select Avatar',
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //     mediaType: 'photo',
  //     includeBase64: true,
  //   };
  //   launchImageLibrary(options, response => {
  //     // Same code as in above section!
  //     // const {base64} = response.assets;
  //     //  console.log(base64);
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ');
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ');
  //     } else {
  //       const {type} = response.assets[0];
  //       const typeSplit = type.split('/');
  //       const {base64} = response.assets[0];
  //       setImgplaceholder('Image Added');
  //       setImage(base64);
  //       setExt(typeSplit[1]);
  //       setIsImg(true);
  //       setValidateImg(false);
  //     }
  //   });
  // };

  const handleArea = value => {
    console.log(value + 'ID');
    setLoadArea(true);
    axios
      .get(`${BASE_URL}/Area/GetByCityId?id=${value}`, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        setLoadArea(false);
        setDistrict(res.data);
        // console.log(res.data);
      })
      .catch(err => {
        console.log(err + 'FROM CITY POST');
      });
  };

  //modify designation array with custom key
  const areaarr = district.map((item, index) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const cityarr = city.map((item, index) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  //today date in string
  const today = new Date().toISOString().split('T')[0];

  //NEW FORM WORK
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const validation = Yup.object().shape({
    fatherName: Yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Father Name Is Required'),
    gender: Yup.string().required('Gender Is Required'),
    // cnic: Yup.string()
    //   .matches(
    //     /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/,
    //     'Invalid CNIC example: 12345-1234567-1',
    //   )
    //   .required('Required'),

    // dob: Yup.string().required('Date Of Birth Is Required'),
    // FatherOccupation: Yup.string().required('Father Occupation Is Required'),
    presentAddress: Yup.string().required('Postal Address Required'),
    cityId: Yup.string().required('City Is Required').nullable(),
    whatsappNumber: Yup.string().required('WhatsApp Number Is Required'),
    // otherNumber: Yup.string().required('Required'),
    areaId: Yup.string().required('Area Is Required').nullable(),
    // facebookAccount: Yup.string().required('Required'),
    // linkedinAccount: Yup.string().required('Required'),
    // instagramAccount: Yup.string().required('Required'),
    email: Yup.string().required('Email Is Required'),
    degreeId: Yup.string().required('Education Is Required').nullable(),
    image: Yup.string().required('Image Is Required'),
    // image: Yup.string().required('Required'),
  });

  //modify designation array with custom key
  const designationArray = degree.map((item, index) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  return (
    <>
      {isloading ? (
        <>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator animating={true} color={Colors.green400} />
          </View>
        </>
      ) : (
        <>
          <SafeAreaView>
            {Platform.OS === 'ios' ? (
              <ScrollView>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    marginLeft: 20,
                    marginTop: 20,
                    marginBottom: 20,
                    color: color.primary,
                  }}>
                  Registration
                </Text>
                {count === 0 ? (
                  <>
                    <Text style={{marginHorizontal: 20, marginVertical: 0}}>
                      Father Name
                    </Text>
                    <TextInput
                      style={{marginHorizontal: 20, marginVertical: 10}}
                      mode="flat"
                      placeholder="Father Name/Guardian Name"
                      name="fatherName"
                      onChangeText={handleChange('fatherName')}
                      value={values.fatherName}
                      onBlur={handleBlur('fatherName')}
                      activeUnderlineColor={color.primary}
                    />
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={touched.fatherName && errors.fatherName}>
                      {touched.fatherName && errors.fatherName}
                    </HelperText>

                    <Text style={{marginHorizontal: 20, marginVertical: 0}}>
                      Father Occupation
                    </Text>
                    <TextInput
                      style={{marginHorizontal: 20, marginVertical: 10}}
                      mode="flat"
                      placeholder="Father Occupation"
                      name="FatherOccupation"
                      onChangeText={handleChange('FatherOccupation')}
                      value={values.FatherOccupation}
                      onBlur={handleBlur('FatherOccupation')}
                      activeUnderlineColor={color.primary}
                    />
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={
                        touched.FatherOccupation && errors.FatherOccupation
                      }>
                      {touched.FatherOccupation && errors.FatherOccupation}
                    </HelperText>

                    <Text style={{marginHorizontal: 20, marginVertical: 0}}>
                      CNIC (optional)
                    </Text>
                    <TextInput
                      style={{marginHorizontal: 20, marginVertical: 10}}
                      mode="flat"
                      placeholder="CNIC (optional)"
                      name="cnic"
                      onChangeText={value => {
                        //in cnic add - automtic
                        const cnic = value
                          .replace(/\D/g, '')
                          .replace(/(\d{5})(\d{7})(\d{1})/, '$1-$2-$3');
                        setFieldValue('cnic', cnic);
                      }}
                      value={values.cnic}
                      onBlur={handleBlur('cnic')}
                      activeUnderlineColor={color.primary}
                    />
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={touched.cnic && errors.cnic}>
                      {touched.cnic && errors.cnic}
                    </HelperText>
                    <Text style={{marginHorizontal: 20, marginVertical: 0}}>
                      Upload Image
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        const options = {
                          title: 'Select Avatar',
                          storageOptions: {
                            skipBackup: true,
                            path: 'images',
                          },
                          mediaType: 'photo',
                          includeBase64: true,
                        };
                        launchImageLibrary(options, response => {
                          // Same code as in above section!
                          // const {base64} = response.assets;
                          //  console.log(base64);
                          if (response.didCancel) {
                            console.log('User cancelled image picker');
                          } else if (response.error) {
                            console.log('ImagePicker Error: ');
                          } else if (response.customButton) {
                            console.log('User tapped custom button: ');
                          } else {
                            const {type} = response.assets[0];
                            const typeSplit = type.split('/');
                            const {base64} = response.assets[0];
                            setImgplaceholder('Image Added');
                            setImage(base64);
                            setFieldValue('image', base64);
                            setExt(typeSplit[1]);
                            setFieldValue('ext', typeSplit[1]);
                            setIsImg(true);
                            setValidateImg(false);
                          }
                        });
                      }}>
                      <View
                        style={{
                          height: 50,
                          marginHorizontal: 20,
                          marginVertical: 10,
                          backgroundColor: '#eee',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 4,
                        }}>
                        <Text>{imgplaceholder}</Text>
                      </View>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {count === 1 ? (
                      <>
                        <View
                          style={{
                            marginVertical: 20,
                          }}>
                          <Text
                            style={{
                              marginHorizontal: 20,
                              fontSize: 18,
                              color: '#000',
                            }}>
                            Education/Qualification
                          </Text>
                          <RNPickerSelect
                            placeholder={{
                              label: 'Education Level',
                              value: null,
                            }}
                            items={designationArray}
                            onValueChange={value => {
                              setFieldValue('degreeId', value);
                            }}
                            value={values.degreeId}
                          />
                          <HelperText
                            type="error"
                            visible={touched.degreeId && errors.degreeId}>
                            {errors.degreeId}
                          </HelperText>
                        </View>
                        <Text
                          style={{
                            marginHorizontal: 20,
                            marginVertical: 0,
                          }}>
                          Gender
                        </Text>
                        <RadioButton.Group
                          onValueChange={handleChange('gender')}
                          value={values.gender}>
                          <RadioButton.Item
                            color={color.primary}
                            style={{marginHorizontal: 20}}
                            label="Male"
                            value="Male"
                          />
                          <RadioButton.Item
                            color={color.primary}
                            style={{marginHorizontal: 20}}
                            label="Female"
                            value="Female"
                          />
                        </RadioButton.Group>
                        <HelperText
                          type="error"
                          style={{marginHorizontal: 20}}
                          visible={touched.gender && errors.gender}>
                          {touched.gender && errors.gender}
                        </HelperText>

                        <View
                          style={{
                            flexDirection: 'row',
                            marginHorizontal: 35,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: '#000',
                              fontSize: 15,
                            }}>
                            Date of Birth
                          </Text>
                          <TouchableOpacity onPress={() => setOpen(true)}>
                            <TextInput
                              style={{width: '100%'}}
                              value={values.dob}
                              onBlur={handleBlur('dob')}
                              disabled={true}
                              placeholder="Date of Birth"
                            />
                          </TouchableOpacity>
                        </View>

                        <DatePicker
                          modal
                          open={open}
                          date={date}
                          //max date 2012-12-31
                          maximumDate={new Date(new Date('2012-12-31'))}
                          minimumDate={new Date(new Date('1940-01-01'))}
                          onConfirm={date => {
                            setOpen(false);
                            const dateString = date.toLocaleDateString();

                            setFieldValue('dob', dateString);
                          }}
                          mode="date"
                          onDateChange={date => {
                            setDate(date);
                            //date in string format
                            const dateString = date.toLocaleDateString();

                            setFieldValue('dob', dateString);
                          }}
                          onCancel={() => {
                            setOpen(false);
                          }}
                        />
                        <Text
                          style={{
                            marginHorizontal: 20,
                            marginVertical: 0,
                          }}>
                          Email
                        </Text>
                        <TextInput
                          style={{
                            marginHorizontal: 20,
                            marginVertical: 10,
                          }}
                          mode="flat"
                          placeholder="Email"
                          name="email"
                          onChangeText={handleChange('email')}
                          value={values.email}
                          onBlur={handleBlur('email')}
                          activeUnderlineColor={color.primary}
                        />
                        <HelperText
                          type="error"
                          style={{marginHorizontal: 20}}
                          visible={touched.email && errors.email}>
                          {touched.email && errors.email}
                        </HelperText>
                      </>
                    ) : (
                      <>
                        {count === 2 ? (
                          <>
                            <Text
                              style={{
                                marginHorizontal: 20,
                                marginVertical: 0,
                              }}>
                              WhatsApp
                            </Text>
                            <TextInput
                              style={{
                                marginHorizontal: 20,
                                marginVertical: 10,
                              }}
                              mode="flat"
                              placeholder="Whatsapp Number"
                              name="whatsappNumber"
                              onChangeText={handleChange('whatsappNumber')}
                              value={values.whatsappNumber}
                              onBlur={handleBlur('whatsappNumber')}
                              activeUnderlineColor={color.primary}
                            />
                            <HelperText
                              type="error"
                              style={{marginHorizontal: 20}}
                              visible={
                                touched.whatsappNumber && errors.whatsappNumber
                              }>
                              {touched.whatsappNumber && errors.whatsappNumber}
                            </HelperText>

                            <View>
                              <Text
                                style={{
                                  marginHorizontal: 20,
                                  fontSize: 18,
                                  color: '#000',
                                }}>
                                City
                              </Text>
                              <RNPickerSelect
                                onValueChange={(value, index) => {
                                  setFieldValue('cityId', value);
                                  handleArea(value);
                                }}
                                placeholder={{
                                  label: 'Select City',
                                  value: null,
                                }}
                                items={cityarr}
                                value={values.cityId}
                              />
                              <HelperText
                                type="error"
                                style={{marginHorizontal: 20}}
                                visible={touched.cityId && errors.cityId}>
                                {touched.cityId && errors.cityId}
                              </HelperText>
                            </View>

                            <View>
                              <Text
                                style={{
                                  marginHorizontal: 20,
                                  fontSize: 18,
                                  color: '#000',
                                }}>
                                Area
                                {loadArea ? (
                                  <>
                                    {/* <ActivityIndicator size={20} color={color.primary} /> */}
                                  </>
                                ) : (
                                  ''
                                )}
                              </Text>
                              <RNPickerSelect
                                onValueChange={(value, index) => {
                                  setFieldValue('areaId', value);
                                }}
                                placeholder={{
                                  label: 'Select Area',
                                  value: null,
                                }}
                                items={areaarr}
                                value={values.areaId}
                                disabled={loadArea}
                              />
                              <HelperText
                                type="error"
                                style={{marginHorizontal: 20}}
                                visible={touched.areaId && errors.areaId}>
                                {touched.areaId && errors.areaId}
                              </HelperText>
                            </View>
                            <Text
                              style={{
                                marginHorizontal: 20,
                                marginVertical: 0,
                              }}>
                              Postal Address
                            </Text>
                            <TextInput
                              style={{
                                marginHorizontal: 20,
                                marginVertical: 10,
                              }}
                              mode="flat"
                              placeholder="Postal Address"
                              name="presentAddress"
                              onChangeText={handleChange('presentAddress')}
                              value={values.presentAddress}
                              onBlur={handleBlur('presentAddress')}
                              activeUnderlineColor={color.primary}
                            />
                            <HelperText
                              type="error"
                              style={{marginHorizontal: 20}}
                              visible={
                                touched.presentAddress && errors.presentAddress
                              }>
                              {touched.presentAddress && errors.presentAddress}
                            </HelperText>
                            <Text
                              style={{
                                marginHorizontal: 20,
                                marginVertical: 0,
                              }}>
                              Facebook Account
                            </Text>
                            <TextInput
                              style={styles.input}
                              mode="flat"
                              placeholder="Facebook Account"
                              name="facebookAccount"
                              onChangeText={handleChange('facebookAccount')}
                              value={values.facebookAccount}
                              onBlur={handleBlur('facebookAccount')}
                              activeUnderlineColor={color.primary}
                            />
                            <HelperText
                              type="error"
                              style={{marginHorizontal: 20}}
                              visible={
                                touched.facebookAccount &&
                                errors.facebookAccount
                              }>
                              {touched.facebookAccount &&
                                errors.facebookAccount}
                            </HelperText>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginHorizontal: 20,
                    marginVertical: 10,
                  }}>
                  {count === 0 ? (
                    <>
                      <Button
                        onPress={() => {
                          setCount(count - 1);
                        }}
                        color={color.card}
                        disabled={count === 0}></Button>
                    </>
                  ) : (
                    <Button
                      onPress={() => {
                        setCount(count - 1);
                      }}
                      color={color.card}
                      disabled={count === 0}>
                      Previous
                    </Button>
                  )}
                  {count === 2 ? (
                    <>
                      <Button
                        loading={isbtn}
                        disabled={isbtn}
                        mode="contained"
                        style={{
                          backgroundColor: color.primary,
                        }}
                        onPress={handleSubmit}>
                        Submit
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onPress={() => {
                          setCount(count + 1);
                        }}
                        color={color.primary}
                        disabled={count === 2}>
                        Next
                      </Button>
                    </>
                  )}
                </View>
              </ScrollView>
            ) : (
              <View
                style={{
                  width: '100%',
                  marginVertical: 20,
                  alignItems: 'center',
                }}>
                <ScrollView style={{width: '90%'}}>
                  <TextInput
                    style={{marginHorizontal: 20, marginVertical: 10}}
                    mode="flat"
                    placeholder="Father Name/Guardian Name"
                    name="fatherName"
                    onChangeText={handleChange('fatherName')}
                    value={values.fatherName}
                    onBlur={handleBlur('fatherName')}
                    activeUnderlineColor={color.primary}
                  />
                  <HelperText
                    type="error"
                    style={{marginHorizontal: 20}}
                    visible={touched.fatherName && errors.fatherName}>
                    {touched.fatherName && errors.fatherName}
                  </HelperText>

                  <TextInput
                    style={{marginHorizontal: 20, marginVertical: 10}}
                    mode="flat"
                    placeholder="Father Occupation"
                    name="FatherOccupation"
                    onChangeText={handleChange('FatherOccupation')}
                    value={values.FatherOccupation}
                    onBlur={handleBlur('FatherOccupation')}
                    activeUnderlineColor={color.primary}
                  />
                  <HelperText
                    type="error"
                    style={{marginHorizontal: 20}}
                    visible={
                      touched.FatherOccupation && errors.FatherOccupation
                    }>
                    {touched.FatherOccupation && errors.FatherOccupation}
                  </HelperText>

                  <View
                    style={{
                      marginVertical: 20,
                    }}>
                    <Text
                      style={{
                        marginHorizontal: 20,
                        fontSize: 18,
                        color: '#000',
                      }}>
                      Education/Qualification
                    </Text>
                    <RNPickerSelect
                      placeholder={{
                        label: 'Education Level',
                        value: null,
                      }}
                      items={designationArray}
                      onValueChange={value => {
                        setFieldValue('degreeId', value);
                      }}
                      value={values.degreeId}
                    />
                    <HelperText
                      type="error"
                      visible={touched.degreeId && errors.degreeId}>
                      {errors.degreeId}
                    </HelperText>
                  </View>

                  <TextInput
                    style={{marginHorizontal: 20, marginVertical: 10}}
                    mode="flat"
                    placeholder="Whatsapp Number"
                    name="whatsappNumber"
                    onChangeText={handleChange('whatsappNumber')}
                    value={values.whatsappNumber}
                    onBlur={handleBlur('whatsappNumber')}
                    activeUnderlineColor={color.primary}
                  />
                  <HelperText
                    type="error"
                    style={{marginHorizontal: 20}}
                    visible={touched.whatsappNumber && errors.whatsappNumber}>
                    {touched.whatsappNumber && errors.whatsappNumber}
                  </HelperText>

                  <TextInput
                    style={{marginHorizontal: 20, marginVertical: 10}}
                    mode="flat"
                    placeholder="Email"
                    name="email"
                    onChangeText={handleChange('email')}
                    value={values.email}
                    onBlur={handleBlur('email')}
                    activeUnderlineColor={color.primary}
                  />
                  <HelperText
                    type="error"
                    style={{marginHorizontal: 20}}
                    visible={touched.email && errors.email}>
                    {touched.email && errors.email}
                  </HelperText>

                  <RadioButton.Group
                    onValueChange={handleChange('gender')}
                    value={values.gender}>
                    <RadioButton.Item
                      color={color.primary}
                      style={{marginHorizontal: 20}}
                      label="Male"
                      value="Male"
                    />
                    <RadioButton.Item
                      color={color.primary}
                      style={{marginHorizontal: 20}}
                      label="Female"
                      value="Female"
                    />
                  </RadioButton.Group>
                  <HelperText
                    type="error"
                    style={{marginHorizontal: 20}}
                    visible={touched.gender && errors.gender}>
                    {touched.gender && errors.gender}
                  </HelperText>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginHorizontal: 25,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        marginRight: 100,
                        color: '#000',
                        fontSize: 15,
                      }}>
                      Date of Birth
                    </Text>
                    <TouchableOpacity onPress={() => setOpen(true)}>
                      <TextInput
                        style={{width: '100%'}}
                        value={values.dob}
                        onBlur={handleBlur('dob')}
                        disabled={true}
                        placeholder="Date of Birth"
                      />
                    </TouchableOpacity>
                  </View>

                  <HelperText
                    type="error"
                    style={{marginHorizontal: 20}}
                    visible={touched.dob && errors.dob}>
                    {touched.dob && errors.dob}
                  </HelperText>

                  <DatePicker
                    modal
                    open={open}
                    date={date}
                    //max date 2012-12-31
                    maximumDate={new Date(new Date('2012-12-31'))}
                    minimumDate={new Date(new Date('1940-01-01'))}
                    onConfirm={date => {
                      setOpen(false);
                      const dateString = date.toLocaleDateString();

                      setFieldValue('dob', dateString);
                    }}
                    mode="date"
                    onDateChange={date => {
                      setDate(date);
                      //date in string format
                      const dateString = date.toLocaleDateString();

                      setFieldValue('dob', dateString);
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      const options = {
                        title: 'Select Avatar',
                        storageOptions: {
                          skipBackup: true,
                          path: 'images',
                        },
                        mediaType: 'photo',
                        includeBase64: true,
                      };
                      launchImageLibrary(options, response => {
                        // Same code as in above section!
                        // const {base64} = response.assets;
                        //  console.log(base64);
                        if (response.didCancel) {
                          console.log('User cancelled image picker');
                        } else if (response.error) {
                          console.log('ImagePicker Error: ');
                        } else if (response.customButton) {
                          console.log('User tapped custom button: ');
                        } else {
                          const {type} = response.assets[0];
                          const typeSplit = type.split('/');
                          const {base64} = response.assets[0];
                          setImgplaceholder('Image Added');
                          setImage(base64);
                          setFieldValue('image', base64);
                          setExt(typeSplit[1]);
                          setFieldValue('ext', typeSplit[1]);
                          setIsImg(true);
                          setValidateImg(false);
                        }
                      });
                    }}>
                    <View
                      style={{
                        height: 50,
                        marginHorizontal: 20,
                        marginVertical: 10,
                        backgroundColor: '#eee',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 4,
                      }}>
                      <Text>{imgplaceholder}</Text>
                    </View>
                  </TouchableOpacity>
                  <HelperText
                    type="error"
                    style={{marginHorizontal: 20}}
                    visible={touched.image && errors.image}>
                    {touched.image && errors.image}
                  </HelperText>

                  <View>
                    <Text
                      style={{
                        marginHorizontal: 20,
                        fontSize: 18,
                        color: '#000',
                      }}>
                      City
                    </Text>
                    <RNPickerSelect
                      onValueChange={(value, index) => {
                        setFieldValue('cityId', value);
                        handleArea(value);
                      }}
                      placeholder={{
                        label: 'Select City',
                        value: null,
                      }}
                      items={cityarr}
                      value={values.cityId}
                    />
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={touched.cityId && errors.cityId}>
                      {touched.cityId && errors.cityId}
                    </HelperText>
                  </View>

                  <View>
                    <Text
                      style={{
                        marginHorizontal: 20,
                        fontSize: 18,
                        color: '#000',
                      }}>
                      Area
                      {loadArea ? (
                        <>
                          {/* <ActivityIndicator size={20} color={color.primary} /> */}
                        </>
                      ) : (
                        ''
                      )}
                    </Text>
                    <RNPickerSelect
                      onValueChange={(value, index) => {
                        setFieldValue('areaId', value);
                      }}
                      placeholder={{
                        label: 'Select Area',
                        value: null,
                      }}
                      items={areaarr}
                      value={values.areaId}
                      disabled={loadArea}
                    />
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={touched.areaId && errors.areaId}>
                      {touched.areaId && errors.areaId}
                    </HelperText>
                  </View>

                  <TextInput
                    style={{marginHorizontal: 20, marginVertical: 10}}
                    mode="flat"
                    placeholder="CNIC (optional)"
                    name="cnic"
                    onChangeText={value => {
                      //in cnic add - automtic
                      const cnic = value
                        .replace(/\D/g, '')
                        .replace(/(\d{5})(\d{7})(\d{1})/, '$1-$2-$3');
                      setFieldValue('cnic', cnic);
                    }}
                    value={values.cnic}
                    onBlur={handleBlur('cnic')}
                    activeUnderlineColor={color.primary}
                  />
                  <HelperText
                    type="error"
                    style={{marginHorizontal: 20}}
                    visible={touched.cnic && errors.cnic}>
                    {touched.cnic && errors.cnic}
                  </HelperText>

                  <TextInput
                    style={{marginHorizontal: 20, marginVertical: 10}}
                    mode="flat"
                    placeholder="Postal Address"
                    name="presentAddress"
                    onChangeText={handleChange('presentAddress')}
                    value={values.presentAddress}
                    onBlur={handleBlur('presentAddress')}
                    activeUnderlineColor={color.primary}
                  />
                  <HelperText
                    type="error"
                    style={{marginHorizontal: 20}}
                    visible={touched.presentAddress && errors.presentAddress}>
                    {touched.presentAddress && errors.presentAddress}
                  </HelperText>

                  <TextInput
                    style={styles.input}
                    mode="flat"
                    placeholder="Facebook Account"
                    name="facebookAccount"
                    onChangeText={handleChange('facebookAccount')}
                    value={values.facebookAccount}
                    onBlur={handleBlur('facebookAccount')}
                    activeUnderlineColor={color.primary}
                  />
                  <HelperText
                    type="error"
                    style={{marginHorizontal: 20}}
                    visible={touched.facebookAccount && errors.facebookAccount}>
                    {touched.facebookAccount && errors.facebookAccount}
                  </HelperText>

                  <View>
                    <Button
                      loading={isbtn}
                      disabled={isbtn}
                      mode="contained"
                      style={{
                        backgroundColor: color.primary,
                        marginHorizontal: 10,
                        marginVertical: 15,
                      }}
                      onPress={handleSubmit}>
                      Submit
                    </Button>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}>
                      <Button
                        mode="text"
                        color={color.primary}
                        style={{
                          marginHorizontal: 10,
                          marginVertical: 15,
                        }}
                        onPress={resetForm}>
                        Clear
                      </Button>
                    </View>
                  </View>
                </ScrollView>
              </View>
            )}
          </SafeAreaView>
        </>
      )}
    </>
  );
};

export default StudentRegistration;

const styles = StyleSheet.create({
  input: {
    marginHorizontal: 20,
    marginVertical: 10,
    height: 65,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,

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
