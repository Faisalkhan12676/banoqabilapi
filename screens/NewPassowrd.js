import {StyleSheet, Text, View, Alert, Modal} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {TextInput, HelperText, Button} from 'react-native-paper';
import {color} from '../components/Colors';
import axios from 'axios';
import {BASE_URL} from '../config';
import {useNavigation, StackActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const NewPassowrd = ({route, navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [textDisbaled, setTextDisbaled] = useState(false);
  const {username} = route.params;
  console.log('username', username);
  return (
    <>
      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
        }}
        onSubmit={(values, {resetForm}) => {
          setTextDisbaled(true);
          console.log(values);
          console.log('username', username);
          axios
            .post(`${BASE_URL}/Auth/ChangeForgottenPassword`, {
              password: values.password,
              username: username,
            })
            .then(res => {
              console.log(res);
              setModalVisible(true);
            })
            .catch(err => {
              console.log(err);
            });

          resetForm();
        }}
        validationSchema={Yup.object().shape({
          //passowrd and cinfirmed pass
          password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
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
              }}>
              Enter Your New Password
            </Text>
            <TextInput
              disabled={textDisbaled}
              style={styles.input}
              mode="flat"
              activeUnderlineColor={color.primary}
              label="Password"
              onChangeText={handleChange('password')}
              value={values.password}
            />
            <HelperText
              type="error"
              visible={errors.password && touched.password}>
              {errors.password}
            </HelperText>

            <TextInput
              disabled={textDisbaled}
              style={styles.input}
              mode="flat"
              activeUnderlineColor={color.primary}
              label="Confirm Password"
              onChangeText={handleChange('confirmPassword')}
              value={values.confirmPassword}
            />
            <HelperText
              type="error"
              visible={errors.confirmPassword && touched.confirmPassword}>
              {errors.confirmPassword}
            </HelperText>

            <Button
              mode="contained"
              color={color.primary}
              onPress={handleSubmit}>
              Submit
            </Button>
          </View>
        )}
      </Formik>
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
            <Icon
              name="checkmark-circle-outline"
              size={40}
              color={color.primary}
            />
            <Text style={styles.modalText}>
              You Have Successfully Updated Your Password.
            </Text>
            <Button
              color={color.primary}
              onPress={() => {
                setModalVisible(!modalVisible);
                navigation.dispatch(StackActions.replace('Login'));
              }}>
              Ok
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default NewPassowrd;

const styles = StyleSheet.create({
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
