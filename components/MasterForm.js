import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  TextInput,
  ActivityIndicator,
  Colors,
  HelperText,
} from 'react-native-paper';
import {color} from './Colors';
import {useNavigation} from '@react-navigation/native';
import Info from 'react-native-vector-icons/MaterialIcons';
import Logout from './Logout';
import DocumentPickerHandle from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {BASE_URL} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

const MasterForm = () => {
  const [alreadyadded, setAlreadyAdded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isloading, setIsLoading] = useState(true);
  useEffect(() => {
    const getAwards = async () => {
      const value = await AsyncStorage.getItem('@userlogininfo');
      if (value !== null) {
        const data = JSON.parse(value);
        axios
          .get(`${BASE_URL}/Master/GetAllByUserIdWithRelationShip`, {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          })
          .then(res => {
            if (res.data.length > 0) {
              setAlreadyAdded(true);
              setIsLoading(false);
              //alert with icon
              setModalVisible(true);
            } else {
              setIsLoading(false);
              console.log('not added');
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    };
    getAwards();
  }, []);

  const navigation = useNavigation();

  const [fileLoading, setFileLoading] = React.useState(false);
  const validation = Yup.object().shape({
    university: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),

    subject: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    lastAcademicScore: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    // file: Yup.string().required('Required'),
  });

  const dispatch = useDispatch();
  const handlelogout = () => {
    //remove only login information
    AsyncStorage.removeItem('@userlogininfo')
      .then(() => {
        dispatch({type: 'LOGOUT'});
        navigation.navigate('Login');
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <>
      {isloading ? (
        <>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="small" color={color.primary} />
          </View>
        </>
      ) : (
        <>
          {alreadyadded ? (
            <>
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
                      You Have Already Applied.
                    </Text>
                    <Button
                      color={color.primary}
                      onPress={() => {
                        setModalVisible(!modalVisible);
                        if (alreadyadded) {
                          navigation.navigate('TabNavigator');
                        }
                      }}>
                      Ok
                    </Button>
                  </View>
                </View>
              </Modal>
            </>
          ) : (
            <>
              <View style={styles.header}>
                <View
                  style={{
                    height: 70,
                    width: 150,
                  }}>
                  <Image
                    source={require('../assets/Bano-Qabil-Logo-Green.png')}
                    style={styles.logo}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('details')}>
                    <Info name="person" color={color.primary} size={30} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('admitCard')}>
                    <Info name="info" color={color.primary} size={30} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handlelogout}
                    style={{
                      marginLeft: 10,
                    }}>
                    <Logout />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView
                style={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: '#fff',
                  paddingVertical: 30,
                }}>
                <View
                  style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      textAlign: 'center',
                    }}>
                    Masters{' '}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      textAlign: 'center',
                    }}>
                    Scholarship
                  </Text>
                  <View
                    style={{
                      marginHorizontal: 20,
                    }}>
                    <Formik
                      initialValues={{
                        university: '',
                        subject: '',
                        lastAcademicScore: '',
                        file: '',
                        ext: '',
                      }}
                      validationSchema={validation}
                      onSubmit={(values, {resetForm}) => {
                        const {
                          university,
                          subject,
                          lastAcademicScore,
                          file,
                          ext,
                        } = values;
                        const postData = async () => {
                          //async storage
                          try {
                            const value = await AsyncStorage.getItem(
                              '@userlogininfo',
                            );

                            if (value !== null) {
                              // We have data!!
                              const data = JSON.parse(value);
                              console.log(data.userid);
                              axios
                                .post(
                                  `${BASE_URL}/Master/Add`,
                                  {
                                    university: university,
                                    subject: subject,
                                    lastAcademicScore: lastAcademicScore,
                                    userId: data.userid,
                                  },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${data.token}`,
                                    },
                                  },
                                )
                                .then(res => {
                                  console.log(res.data + 'DATA POSTED');
                                  const {id} = res.data[0];
                                  console.log(id);

                                  axios
                                    .post(
                                      `${BASE_URL}/Master/AddDocument`,
                                      {
                                        id: id,
                                        image: "PDF",
                                        ext: "EXT",
                                        userId: data.userid,
                                      },
                                      {
                                        headers: {
                                          Authorization: `Bearer ${data.token}`,
                                        },
                                      },
                                    )
                                    .then(res => {
                                      console.log(res.data + 'PDF POSTED');
                                      navigation.navigate('TabNavigator');
                                      resetForm();
                                    })
                                    .catch(err => {
                                      console.log(err);
                                    });
                                })
                                .catch(err => {
                                  console.log(err);
                                });
                            }
                          } catch (error) {
                            console.log(error);
                          }
                        };
                        postData();
                      }}>
                      {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        setFieldValue,
                        touched,
                        errors,
                      }) => (
                        <>
                          <TextInput
                            style={styles.input}
                            label="University"
                            onChangeText={handleChange('university')}
                            onBlur={handleBlur('university')}
                            value={values.university}
                            activeUnderlineColor={color.primary}
                          />
                          <HelperText
                            type="error"
                            style={{marginHorizontal: 20}}
                            visible={touched.university && errors.university}>
                            {touched.university && errors.university}
                          </HelperText>
                          <TextInput
                            style={styles.input}
                            label="Subject"
                            onChangeText={handleChange('subject')}
                            onBlur={handleBlur('subject')}
                            value={values.subject}
                            activeUnderlineColor={color.primary}
                          />
                          <HelperText
                            type="error"
                            style={{marginHorizontal: 20}}
                            visible={touched.subject && errors.subject}>
                            {touched.subject && errors.subject}
                          </HelperText>
                          <TextInput
                            style={styles.input}
                            label="Last Academic Score"
                            onChangeText={handleChange('lastAcademicScore')}
                            onBlur={handleBlur('lastAcademicScore')}
                            value={values.lastAcademicScore}
                            activeUnderlineColor={color.primary}
                          />
                          <HelperText
                            type="error"
                            style={{marginHorizontal: 20}}
                            visible={
                              touched.lastAcademicScore &&
                              errors.lastAcademicScore
                            }>
                            {touched.lastAcademicScore &&
                              errors.lastAcademicScore}
                          </HelperText>

                          <TouchableOpacity
                            onPress={() => {
                              DocumentPickerHandle.pick({
                                type: [DocumentPickerHandle.types.pdf],
                              }).then(res => {
                                const fileName = res[0].uri;
                                //type split by /;
                                // console.log(res);
                                const type = res[0].type.split('/');
                                // console.log(type[1]);
                                setFieldValue('ext', type[1]);

                                RNFetchBlob.fs
                                  .readStream(fileName, 'base64', 4095)
                                  .then(stream => {
                                    stream.open();
                                    stream.onData(chunk => {
                                      let base64 = `${chunk}`;
                                      // console.log(base64);
                                      setFieldValue('file', base64);
                                      setFileLoading(true);
                                    });
                                    stream.onEnd(e => {
                                      console.log('END' + e);
                                      setFileLoading(false);
                                    });
                                  });
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
                              {fileLoading ? (
                                <ActivityIndicator size="small" color="black" />
                              ) : (
                                <Text
                                  style={{
                                    fontSize: 15,
                                  }}>
                                  Select File
                                </Text>
                              )}
                            </View>
                          </TouchableOpacity>
                          <HelperText
                            type="error"
                            style={{marginHorizontal: 20}}
                            visible={touched.file && errors.file}>
                            {touched.file && errors.file}
                          </HelperText>
                          <Button
                            onPress={handleSubmit}
                            mode="contained"
                            style={{
                              marginHorizontal: 20,
                              marginVertical: 10,
                              backgroundColor: color.primary,
                            }}>
                            SAVE
                          </Button>
                        </>
                      )}
                    </Formik>
                  </View>
                </View>
              </ScrollView>
            </>
          )}
        </>
      )}
    </>
  );
};

export default MasterForm;

// const styles = StyleSheet.create({
//   input: {
//     marginVertical: 10,
//     marginHorizontal: 20,
//   },
// });
const styles = StyleSheet.create({
  header: {
    backgroundColor: color.light,
    height: 70,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 140,
    backgroundColor: color.primary,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderColor: color.divider,
    borderWidth: 2.5,
  },
  clr: {
    color: '#fff',
    textAlign: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  input: {
    marginVertical: 10,
    marginHorizontal: 20,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
