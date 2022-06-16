import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Button,
  DataTable,
  ActivityIndicator,
  Colors,
  Modal,
  Portal,
  Provider,
  TextInput,
  RadioButton,
  HelperText,
} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../config';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {StackActions, useNavigation} from '@react-navigation/native';
import {color} from '../components/Colors';
import {useDispatch} from 'react-redux';

const ChangePassword = () => {
  const [toast, setToast] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigation();
  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 20,
        }}>
        <Formik
          initialValues={{
            oldPassword: '',
            password: '',
            confirmPassword: '',
          }}
          onSubmit={async (values, {resetForm}) => {
            console.log(values);
            try {
              const token = await AsyncStorage.getItem('@userlogininfo');
              if (token !== null) {
                const user = JSON.parse(token);
                console.log('user', user);
                const {oldPassword, password, confirmPassword} = values;
                const data = {
                  oldPassword: oldPassword,
                  password: password,
                  confirmPassword: confirmPassword,
                  id: user.userid,
                };
                axios
                  .post(`${BASE_URL}/Auth/ChangePassword`, data, {
                    headers: {
                      Authorization: `Bearer ${user.token}`,
                    },
                  })
                  .then(res => {
                    console.log(res.status);
                    //destroy token

                    //navigate to login
                    //show alert on press navigate to login
                    Alert.alert(
                      'Bano Qabil',
                      'Password changed successfully',
                      [
                        {
                          text: 'OK',
                          onPress: () => {
                            AsyncStorage.removeItem('@userlogininfo')
                              .then(() => {
                                dispatch({type: 'LOGOUT'});
                                navigate.navigate('Login');
                              })
                              .catch(err => {
                                console.log(err);
                              });
                          },
                        },
                      ],
                      {cancelable: false},
                    );

                    resetForm();
                  })
                  .catch(err => {
                    console.log(err.response.data, 'LINE 60');
                    //show msg
                    setToast(err.response.data);
                  });
              }
            } catch (err) {
              console.log(err);
            }
          }}
          validationSchema={Yup.object().shape({
            //passowrd and cinfirmed pass
            password: Yup.string()
              .min(6, 'Old Password must be at least 6 characters')
              .required('Password is required'),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref('password'), null], 'Passwords must match')
              .required('Confirm Password is required'),
            oldPassword: Yup.string().required('Password is required'),
          })}>
          {({handleChange, handleSubmit, values, errors, touched}) => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                padding: 20,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: color.primary,
                  marginBottom: 20,
                  textAlign: 'center',
                }}>
                Change Password
              </Text>
              <TextInput
                label="Old Password"
                onChangeText={handleChange('oldPassword')}
                value={values.oldPassword}
                style={styles.input}
                error={touched.oldPassword && errors.oldPassword}
                activeUnderlineColor={color.primary}
              />
              <HelperText
                type="error"
                visible={touched.oldPassword && errors.oldPassword}>
                {errors.oldPassword}
                {toast}
              </HelperText>

              <TextInput
                label="New Password"
                value={values.password}
                onChangeText={handleChange('password')}
                error={touched.password && errors.password}
                style={{width: '100%', marginVertical: 10}}
                activeUnderlineColor={color.primary}
              />
              <HelperText
                type="error"
                visible={touched.password && errors.password}>
                {errors.password}
              </HelperText>

              <TextInput
                label="Confirm Password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                error={touched.confirmPassword && errors.confirmPassword}
                style={{width: '100%', marginVertical: 10}}
                activeUnderlineColor={color.primary}
              />
              <HelperText
                type="error"
                visible={touched.confirmPassword && errors.confirmPassword}>
                {errors.confirmPassword}
              </HelperText>
              <Button
                color={color.primary}
                mode="contained"
                onPress={handleSubmit}
                style={{marginTop: 20}}>
                Change Password
              </Button>
            </View>
          )}
        </Formik>
      </View>
    </>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({});
