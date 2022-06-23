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
          <>
            {Platform.OS === 'ios' ? (
              <>
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
              </>
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
          </>
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
