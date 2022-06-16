import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Alert,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Image,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Paragraph,
  TextInput,
  HelperText,
  DataTable,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import {Field, Formik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNPickerSelect from 'react-native-picker-select';
import CheckBox from '@react-native-community/checkbox';
import {color} from '../components/Colors';
import {StackActions, useNavigation} from '@react-navigation/native';
import Info from 'react-native-vector-icons/MaterialIcons';
import Logout from '../components/Logout';
import {useDispatch} from 'react-redux';
import AlertIcon from 'react-native-vector-icons/Ionicons';

const AdmissionForm = () => {
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const [stdID, setStdId] = useState(null);
  const [course, setCourse] = useState([]);
  const [token, setToken] = useState(null);
  const [getcourse, setGetCourse] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [description, setDescription] = useState('');
  const [isChecked, setIsChecked] = useState([]);

  const handlelogout = () => {
    //remove only login information
    AsyncStorage.removeItem('@userlogininfo')
      .then(() => {
        dispatch({type: 'LOGOUT'});
        navigate.navigate('Login');
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    //get login token from asyncstorage
    const getToken = async () => {
      try {
        const value = await AsyncStorage.getItem('@userlogininfo');
        if (value !== null) {
          // We have data!!
          const data = JSON.parse(value);
          setToken(data.token);

          await axios
            .get(`${BASE_URL}/StudentAdmissionDetail/GetAllCourse`, {
              headers: {Authorization: 'Bearer ' + data.token},
            })
            .then(res => {
              setGetCourse(res.data);
              console.log(res.data + 'res.data');
              const x = res.data.filter(e => e.active === 'True').map(e => e);
              setIsChecked(x);
              if (x.length > 0) {
                navigate.dispatch(StackActions.replace('TabNavigator'));
              }

              setIsLoading(false);
            })
            .catch(err => {
              console.log(err);
              console.log('ERROR COURSEALL');
            });

          axios
            .get(`${BASE_URL}/Course/GetAll`, {
              headers: {Authorization: 'Bearer ' + data.token},
            })
            .then(res => {
              setCourse(res.data);
              console.log('COURSE  RESPONSE');
            })
            .catch(err => {
              console.log('ERROR COURSE');
            });
        }
      } catch (error) {
        // Error retrieving data
      }
    };
    getToken();
  }, []);

  const validation = Yup.object().shape({});

  return (
    <>
      {isloading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating={true} color={Colors.green400} />
        </View>
      ) : (
        <>
          <SafeAreaView>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: 20,
                  paddingVertical: 40,
                }}>
                <Text style={styles.modalText}>I Want To Become.</Text>

                <Formik
                  initialValues={{
                    checked: [],
                  }}
                  onSubmit={async (values, {resetForm}) => {
                    console.log(values.checked);
                    resetForm();
                    await axios
                      .post(
                        `${BASE_URL}/StudentAdmissionDetail/AddRangeMulti`,
                        values.checked,
                        {
                          headers: {
                            Authorization: 'Bearer ' + token,
                          },
                        },
                      )
                      .then(res => {
                        console.log(res.data);
                        console.log('COURSE ADDED');
                        //show alert success
                        setModalVisible2(true);
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }}
                  validationSchema={validation}>
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    setFieldValue,
                  }) => (
                    <>
                      {/* SELCET ONLY 1 CHECK BOX */}

                      <DataTable>
                        <DataTable.Header>
                          {/* <DataTable.Title>Course Name</DataTable.Title> */}
                        </DataTable.Header>
                        {course.map((item, i) => (
                          <>
                            <DataTable.Row
                              key={i}
                              style={{
                                justifyContent: 'flex-start',
                              }}>
                              <CheckBox
                                tintColor="#000"
                                onTintColor="#000"
                                onCheckColor="#000"
                                style={{
                                  marginTop: 13,
                                }}
                                value={values.checked.some(
                                  e => e.courseId === item.id,
                                )}
                                checked={values.checked.some(
                                  e => e.courseId === item.id,
                                )}
                                onValueChange={() => {
                                  //uncheck
                                  if (
                                    values.checked.some(
                                      e => e.courseId === item.id,
                                    )
                                  ) {
                                    setFieldValue(
                                      'checked',
                                      values.checked.filter(
                                        (e, i) => e.courseId !== item.id,
                                      ),
                                    );
                                  } else {
                                    //check
                                    setFieldValue('checked', [
                                      ...values.checked,
                                      {
                                        studentId: parseInt(stdID),
                                        courseId: item.id,
                                      },
                                    ]);
                                  }
                                }}
                              />
                              <TouchableOpacity
                                onPress={() => {
                                  setModalVisible(true);
                                  setDescription(item.description);
                                }}>
                                <Text
                                  style={{
                                    marginTop: 15,
                                    width: '100%',
                                    color: '#000',
                                  }}>
                                  {item.name}
                                </Text>
                              </TouchableOpacity>
                            </DataTable.Row>
                          </>
                        ))}

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
                              <Text
                                style={{
                                  fontSize: 20,
                                  textAlign: 'center',
                                  fontWeight: 'bold',
                                }}>
                                Description
                              </Text>

                              <ScrollView
                                style={{
                                  width: '100%',
                                  height: 450,
                                  marginVertical: 10,
                                }}>
                                <Text
                                  style={{
                                    fontSize: 15,
                                    textTransform: 'capitalize',
                                  }}>
                                  {description}
                                </Text>
                              </ScrollView>

                              <Button
                                style={{
                                  backgroundColor: color.primary,
                                }}
                                mode="contained"
                                onPress={() => setModalVisible(!modalVisible)}>
                                Close
                              </Button>
                            </View>
                          </View>
                        </Modal>

                        <Modal
                          animationType="fade"
                          transparent={true}
                          visible={modalVisible2}
                          onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible2(!modalVisible2);
                          }}>
                          <View style={styles.centeredView}>
                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingHorizontal: 25,
                                paddingVertical: 15,
                                backgroundColor: '#fff',
                                borderRadius: 10,
                              }}>
                              <AlertIcon
                                name="checkmark-circle-outline"
                                size={40}
                                color={color.primary}
                              />
                              <Text style={styles.modalText}>
                                Registration Has Been Completed
                              </Text>

                              <Button
                                color={color.primary}
                                onPress={() => {
                                  setModalVisible2(!modalVisible2);
                                  if (modalVisible2) {
                                    navigate.replace('TabNavigator');
                                  }
                                }}>
                                Ok
                              </Button>
                            </View>
                          </View>
                        </Modal>
                      </DataTable>
                      <View>
                        <Text
                          style={{
                            color: 'red',
                            marginVertical: 10,
                            textAlign: 'center',
                          }}>
                          {values.checked.length > 3
                            ? 'Choose Only 3 Courses'
                            : ''}
                        </Text>
                        <Button
                          style={{
                            backgroundColor: color.primary,
                          }}
                          disabled={
                            values.checked.length > 3 ||
                            values.checked.length < 1
                              ? true
                              : false
                          }
                          mode="contained"
                          onPress={handleSubmit}>
                          Submit
                        </Button>
                      </View>
                    </>
                  )}
                </Formik>
              </View>
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  );
};

export default AdmissionForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
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
    justifyContent: 'center',

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
    backgroundColor: color.primary,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
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
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

{
  /* <>
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
      onPress={() => navigate.navigate('details')}>
      <Info name="person" color={color.primary} size={30} />
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => navigate.navigate('admitCard')}>
      <Info name="info" color={color.primary} size={30} />
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        marginLeft: 10,
      }}
      onPress={handlelogout}>
      <Logout />
    </TouchableOpacity>
  </View>
</View>
<View
  style={{
    flex: 1,
    width: '100%',
    alignItems: 'center',
  }}>
  <View
    style={{
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 120,
    }}>
    <Text
      style={{
        color: 'green',
        fontSize: 18,
        marginBottom: 50,
        textAlign: 'center',
      }}>
      You Have Already Applied For Courses
    </Text>
    <Text style={styles.modalText}>Course Preferences</Text>

    {isChecked.map(e => (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <CheckBox value={true} />
          <Text>{e.name}</Text>
        </View>
      </>
    ))}
    <Button
      mode="contained"
      style={{
        marginTop: 50,
      }}
      onPress={() => {
        navigate.navigate('TabNavigator');
      }}
      color={color.primary}>
      Go Back
    </Button>
  </View>
</View>
</> */
}
