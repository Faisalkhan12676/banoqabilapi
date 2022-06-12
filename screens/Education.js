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
  KeyboardAvoidingView,

} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Paragraph,
  TextInput,
  HelperText,
  DataTable,
  RadioButton,
  ActivityIndicator,
  Colors,
  Checkbox,
} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import {BASE_URL} from '../config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import {color} from '../components/Colors';
import {string} from 'yup';
import {StackActions, useNavigation} from '@react-navigation/native';
import AlertIcon from 'react-native-vector-icons/Ionicons';

const Education = () => {
  const navigate = useNavigation();
  const [degree, setDegree] = useState([]);
  const [isloading2, setIsLoading2] = useState(true);
  const [token, setToken] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    const getStdId = async () => {
      try {
        const value = await AsyncStorage.getItem('@userlogininfo');
        if (value !== null) {
          // value previously stored
          const data = JSON.parse(value);
          console.log(data);
          axios
            .get(
              `${BASE_URL}/StudentEducation/GetAllByStudentIdWithRelationShip`,
              {
                headers: {
                  Authorization: `Bearer ${data.token}`,
                },
              },
            )
            .then(res => {
              console.log('ALREADY ADDED EDU');
              const {data} = res;
              if (data.length === 0) {
                console.log('IF BLOCK');
                const getdegree = async () => {
                  const value = await AsyncStorage.getItem('@userlogininfo');
                  if (value !== null) {
                    // value previously stored
                    const data = JSON.parse(value);
                    axios
                      .get(`${BASE_URL}/Degree/GetAll`, {
                        headers: {Authorization: 'Bearer ' + data.token},
                      })
                      .then(res => {
                        setDegree(res.data);
                        setIsLoading2(false);
                        console.log('degree', res.data);
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }
                }
                getdegree();
               
              } else {
                navigate.dispatch(StackActions.replace('TabNavigator'));
              }
              // navigate.dispatch(StackActions.replace('Course'));
            })
            .catch(err => {
              console.log('ERROR LOG SHOW REGSTERED PAGE');
            });
        }
      } catch (e) {
        // error reading value
      }
    };
    getStdId();
  }, []);

  return (
    <>
      {isloading2 ? (
        <>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
            }}>
            <ActivityIndicator size="small" color={color.primary} />
          </View>
        </>
      ) : (
        <>
          <KeyboardAvoidingView>
            <ScrollView>
              <Formik
                initialValues={{
                  addmissionDetails: [
                    {
                      year: '',
                      schoolCollageUni: '',
                      degreeId: '',
                      isChecked: false,
                      label: 'School',
                      isDisabled: true,
                    },
                    {
                      year: '',
                      schoolCollageUni: '',
                      degreeId: '',
                      isChecked: false,
                      label: 'College',
                      isDisabled: true,
                    },
                    {
                      year: '',
                      schoolCollageUni: '',
                      degreeId: '',
                      isChecked: false,
                      label: 'University',
                      isDisabled: true,
                    },
                  ],
                }}
                onSubmit={values => {
                  console.log(values.addmissionDetails);
                  const postEdu = async () => {
                    try {
                      const value = await AsyncStorage.getItem(
                        '@userlogininfo',
                      );
                      if (value !== null) {
                        const {addmissionDetails} = values;
                        const data = JSON.parse(value);

                        addmissionDetails.map(e => {
                          if (e.isChecked) {
                            axios
                              .post(
                                `${BASE_URL}/StudentEducation/Add`,
                                {
                                  year: e.year,
                                  schoolCollageUni: e.schoolCollageUni,
                                  degreeId: e.degreeId,
                                  userId: 0,
                                },
                                {
                                  headers: {
                                    Authorization: 'Bearer ' + data.token,
                                  },
                                },
                              )
                              .then(res => {
                                console.log(res.data);
                                setModalVisible(true);
                              })
                              .catch(err => {
                                console.log(err);
                              });
                          }
                        });
                      }
                    } catch {
                      console.log('CATCH ERROR');
                    }
                  };
                  postEdu();
                }}
                // validationSchema={validation}
              >
                {({
                  values,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                  errors,
                  touched,
                  isValid,
                  dirty,
                  isSubmitting,
                  handleBlur,
                }) => (
                  <>
                    {degree.map((item, index) => (
                      <View
                        key={index}
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <View
                          key={index}
                          style={{
                            marginVertical: 10,

                            width: '95%',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginHorizontal: 50,
                            }}>
                            <Checkbox
                              status={
                                values.addmissionDetails[index].isChecked
                                  ? 'checked'
                                  : 'unchecked'
                              }
                              onPress={() => {
                                setFieldValue(
                                  'addmissionDetails[' + index + '].isChecked',
                                  !values.addmissionDetails[index].isChecked,
                                );
                                setFieldValue(
                                  'addmissionDetails[' + index + '].degreeId',
                                  item.id,
                                );
                                setFieldValue(
                                  'addmissionDetails[' + index + '].isDisabled',
                                  !values.addmissionDetails[index].isDisabled,
                                );
                              }}
                            />
                            <Text>{item.name}</Text>
                          </View>
                          <View
                            style={{
                              marginHorizontal: 50,
                            }}>
                            <TextInput
                              disabled={
                                values.addmissionDetails[index].isDisabled
                              }
                              label="Year"
                              value={values.addmissionDetails[index].year}
                              onChangeText={handleChange(
                                'addmissionDetails[' + index + '].year',
                              )}
                              mode="flat"
                              style={{marginTop: 10}}
                              keyboardType="number-pad"
                              activeUnderlineColor={color.primary}
                            />
                            <TextInput
                              disabled={
                                values.addmissionDetails[index].isDisabled
                              }
                              label={values.addmissionDetails[index].label}
                              value={
                                values.addmissionDetails[index].schoolCollageUni
                              }
                              onChangeText={handleChange(
                                'addmissionDetails[' +
                                  index +
                                  '].schoolCollageUni',
                              )}
                              onBlur={handleBlur(
                                'addmissionDetails[' +
                                  index +
                                  '].schoolCollageUni',
                              )}
                              mode="flat"
                              style={{marginTop: 10}}
                              activeUnderlineColor={color.primary}
                            />
                          </View>
                        </View>
                      </View>
                    ))}

                    <Button
                      disabled={
                        values.addmissionDetails.length != 0 ? false : true
                      }
                      style={{
                        marginHorizontal: 50,

                        marginVertical: 10,
                        backgroundColor: color.primary,
                      }}
                      mode="contained"
                      onPress={handleSubmit}>
                      Submit
                    </Button>
                  </>
                )}
              </Formik>
            </ScrollView>
          </KeyboardAvoidingView>
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
                    <AlertIcon name='checkmark-circle-outline' size={40} color={color.primary} />
                    <Text style={styles.modalText}>
                      Registration Successful
                    </Text>
                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: 16,
                        color: color.primary,
                      }}>
                      Thank You.
                    </Text>
                   <Button 
                   color={color.primary}
                   onPress={() => {
                      setModalVisible(!modalVisible);
                      if(modalVisible){
                        navigate.dispatch(
                          StackActions.replace('TabNavigator'),
                        );
                      }
                   }}
                   >
                     Ok
                   </Button>
                  </View>
                </View>
              </Modal>
        </>
      )}
    </>
  );
};

export default Education;

const styles = StyleSheet.create({
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
