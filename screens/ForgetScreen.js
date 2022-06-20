import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {TextInput, HelperText, Button, RadioButton} from 'react-native-paper';
import {color} from '../components/Colors';
import {useNavigation, StackActions} from '@react-navigation/native';
import axios from 'axios';
import {BASE_URL} from '../config';

const ForgetScreen = () => {
  const [disbleText, setDisbleText] = useState(false);
  const [code, setCode] = useState('');
  const navigation = useNavigation();
  const [usernameErr, setUsernameErr] = useState('');
  const [username, setUsername] = useState('');
  const [isloading, setIsLoading] = useState(false);

  const handleCode = () => {
    console.log('code', code);
    axios
      .post(`${BASE_URL}/Auth/OtpVarification`, {
        username: username,
        otp: parseInt(code),
      })
      .then(res => {
        console.log(res.data, 'OTP RESPONSE');
        //replace screen with payload
        if (res.data === true) {
          navigation.dispatch(
            StackActions.replace('NewPassword', {
              username: username,
            }),
          );
        } else if (res.data === false) {
          //Show Alert that code is wrong
          Alert.alert('Wrong Code', 'Please try again', [{text: 'OK'}]);
          console.log(res, 'FROM ELSE IF');
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          type: '',
        }}
        onSubmit={(values, {resetForm}) => {
          setIsLoading(true);
          console.log(values);
          setUsername(values.username);
          axios
            .post(`${BASE_URL}/Auth/ForgotPassword`, {
              username: values.username,
              type: values.type,
            })
            .then(res => {
              if (res.status === 200) {
                //show alert
                Alert.alert(
                  'Bano Qabil',
                  'Your 6 Digit Verification Code Has Been Sent To Your Email ',
                  [{text: 'OK'}],
                  {cancelable: false},
                );
                console.log('RESPONSE', res);
                setUsernameErr('');
                setDisbleText(true);
                setIsLoading(false);
              }
            })
            .catch(err => {
              if (err.response.status === 500) {
                console.log(err.response);
                setUsernameErr(err.response.data);
                setDisbleText(false);
                setIsLoading(false);
              }
            });
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().required('Username is required'),
          type: Yup.string().required('Type is required'),
        })}>
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
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
              }}>
              Forget Password
            </Text>
            <TextInput
              style={styles.input}
              mode="flat"
              activeUnderlineColor={color.primary}
              label="Username"
              onChangeText={handleChange('username')}
              value={values.username}
              disabled={disbleText}
            />
            <HelperText
              type="error"
              visible={errors.username && touched.username}>
              {errors.username}
            </HelperText>
            {disbleText ? (
              <></>
            ) : (
              <>
                <HelperText
                  style={{
                    color: 'red',
                  }}>
                  {usernameErr}
                </HelperText>
                <HelperText>
                  Please Enter Your Username We will send You 6 Digit
                  Verification Code
                </HelperText>
                <HelperText
                  style={{
                    fontWeight: 'bold',
                  }}>
                  Please Select Varification type
                </HelperText>
                <RadioButton.Group
                  onValueChange={value => {
                    setFieldValue('type', value);
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <RadioButton.Item
                      color={color.primary}
                      position="leading"
                      disabled={isloading}
                      label="Text Message"
                      value="phone"
                      status={values.type === 'phone' ? 'checked' : 'unchecked'}
                    />

                    <RadioButton.Item
                      color={color.primary}
                      position="leading"
                      disabled={isloading}
                      label="Email"
                      value="email"
                      status={values.type === 'email' ? 'checked' : 'unchecked'}
                    />
                  </View>
                </RadioButton.Group>
              </>
            )}

            <HelperText type="error" visible={errors.type && touched.type}>
              {errors.type}
            </HelperText>
            {disbleText ? (
              <>
                <TextInput
                  mode="flat"
                  activeUnderlineColor={color.primary}
                  label="Enter Code"
                  onChangeText={text => setCode(text)}
                  value={code}
                />
                <HelperText
                  style={{
                    marginVertical: 10,
                  }}>
                  Please Enter Your 6 Digit Verification Code You Just Received
                  From Alkhidmat
                </HelperText>
                <Button
                  mode="contained"
                  color={color.primary}
                  disabled={code.length < 6 || code.length > 6}
                  style={styles.button}
                  onPress={handleCode}>
                  Re-Confirm
                </Button>
              </>
            ) : (
              <>
                <Button
                  loading={isloading}
                  disabled={isloading}
                  mode="contained"
                  color={color.primary}
                  style={styles.button}
                  onPress={handleSubmit}>
                  Confirm
                </Button>
              </>
            )}
          </View>
        )}
      </Formik>
    </>
  );
};

export default ForgetScreen;

const styles = StyleSheet.create({});
