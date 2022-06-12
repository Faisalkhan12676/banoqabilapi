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

const EducationForm = () => {
  const [stdID, setStdId] = useState(null);
  const [degree, setDegree] = useState([]);
  const [education, setEducation] = useState([]);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    


    const getStdId = async () => {
      try {
        const value = await AsyncStorage.getItem('@userlogininfo');
        if (value !== null) {
          // value previously stored
          const data = JSON.parse(value);
          setStdId(data);
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

          await axios
            .get(
              `${BASE_URL}/StudentEducation/GetAllByStudentIdWithRelationShip`,
              {
                headers: {Authorization: 'Bearer ' + data.token},
              },
            )
            .then(res => {
              setEducation(res.data);
              setIsLoading(false);
            })
            .catch(err => {
              console.log(err);
            });
        }
      } catch (e) {
        // error reading value
      }
    };
    getStdId();


    
  }, []);

  //modify designation array with custom key
  const designationArray = degree.map((item, index) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const [modalVisible, setModalVisible] = useState(false);
  //FORMIK
  const validation = Yup.object().shape({
    year: Yup.string().required('Year is required'),
    schoolCollageUni: Yup.string().required(
      'School/Collage/University is required',
    ),
    degreeId: Yup.string().required('Degree is required').nullable(true),
  });

  const handleDelete = id => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            const handleD = async () => {
              try {
                const value = await AsyncStorage.getItem('@userlogininfo');
                if (value !== null) {
                  const data = JSON.parse(value);

                  axios
                    .delete(`${BASE_URL}/StudentEducation/Remove?id=${id}`, {
                      headers: {Authorization: 'Bearer ' + data.token},
                    })
                    .then(res => {
                      setEducation(res.data);
                    })
                    .catch(err => {
                      console.log(err);
                    });
                }
              } catch {}
            };
            handleD();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

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
          <View
            style={{
              position: 'relative',
              height: '100%',
              width: '100%',
              backgroundColor: '#fff',
            }}>
            {/* create table with full width */}

            <DataTable>
              <DataTable.Header>
                <DataTable.Title>So.</DataTable.Title>
                <DataTable.Title>School/Collage/University</DataTable.Title>
                <DataTable.Title>Year</DataTable.Title>
                <DataTable.Title>Level</DataTable.Title>
                <DataTable.Title>Action</DataTable.Title>
              </DataTable.Header>
              {education.map((item, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{index + 1}</DataTable.Cell>
                  <DataTable.Cell>{item.schoolCollageUni}</DataTable.Cell>
                  <DataTable.Cell>{item.year}</DataTable.Cell>
                  <DataTable.Cell>{item.degrees}</DataTable.Cell>
                  <DataTable.Cell>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Icon
                        name="delete-circle-outline"
                        color="#eee"
                        size={30}
                      />
                    </TouchableOpacity>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>

            <View
              style={{
                width: '100%',
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Button
                style={{
                  backgroundColor: color.primary,
                }}
                mode="contained"
                onPress={() => {
                  setModalVisible(true);
                }}>
                Add Education
              </Button>
            </View>
          </View>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                alignItems: 'flex-end',
              }}>
              <Icon
                name="close"
                size={25}
                onPress={() => setModalVisible(!modalVisible)}
                color="#000"
              />
            </View>
            <Text style={styles.modalText}>Education</Text>

            <Formik
              initialValues={{
                year: '',
                schoolCollageUni: '',
                degreeId: '',
                //student:'',
              }}
              onSubmit={async (values, {resetForm}) => {
                setIsLoading(true);
                setModalVisible(false);
                resetForm();

                const postedu = async () => {
                  try {
                    const value = await AsyncStorage.getItem('@userlogininfo');
                    if (value !== null) {
                      const data = JSON.parse(value);
                       axios
                        .post(
                          `${BASE_URL}/StudentEducation/Add`,
                          {
                            year: values.year,
                            schoolCollageUni: values.schoolCollageUni,
                            degreeId: values.degreeId,
                            userId:0
                          },
                          {
                            headers: {Authorization: 'Bearer ' + data.token},
                          },
                        )
                        .then(res => {
                          console.log(res.data);
                          setIsLoading(false);
                          console.log('POSTED');
                          const getedu = async () => {
                            try {
                              const value = await AsyncStorage.getItem('@userlogininfo');
                              if (value !== null) {
                                const data = JSON.parse(value);
                                axios.get(`${BASE_URL}/StudentEducation/GetAllByStudentIdWithRelationShip`,{
                                  headers: {Authorization: 'Bearer ' + data.token},
                                }).then((res)=>{
                                  setEducation(res.data);
                                }).catch((err)=>{
                                  console.log(err)
                                })

                              }
                            } catch {
                              console.log('ERR');
                            }
                          };
                          getedu();
                        })
                        .catch(err => {
                          console.log(err);
                          console.log('ERROR FROM POST CATCH');
                          setIsLoading(false);
                        });
                    }
                  } catch {
                    console.log('ERROR+');
                  }
                };

                postedu();
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
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                      {/* <Text style={{marginRight: 100}}>Year</Text> */}
                      <TouchableOpacity
                        onPress={() => setOpen(true)}
                        style={{width: '100%'}}>
                        <TextInput
                          style={{width: '100%'}}
                          value={values.year}
                          onBlur={handleBlur('year')}
                          disabled={true}
                          placeholder="Year"
                        />
                      </TouchableOpacity>
                      <HelperText
                        type="error"
                        style={{marginHorizontal: 20}}
                        visible={touched.year && errors.year}>
                        {touched.year && errors.year}
                      </HelperText>
                    </View>

                    <DatePicker
                      modal
                      open={open}
                      date={date}
                      onConfirm={date => {
                        setOpen(false);
                        const dateString = date.toLocaleDateString();

                        setFieldValue('year', dateString);
                      }}
                      mode="date"
                      onDateChange={date => {
                        //date in string format
                        const dateString = date.toLocaleDateString();

                        setFieldValue('year', dateString);
                      }}
                      onCancel={() => {
                        setOpen(false);
                      }}
                    />

                    <TextInput
                      label="School/College/University"
                      value={values.schoolCollageUni}
                      onChangeText={handleChange('schoolCollageUni')}
                      onBlur={handleBlur('schoolCollageUni')}
                      style={styles.name}
                    />
                    <HelperText
                      type="error"
                      visible={
                        touched.schoolCollageUni && errors.schoolCollageUni
                      }>
                      {errors.schoolCollageUni}
                    </HelperText>

                    <View
                      style={{
                        marginVertical: 20,
                      }}>
                      <Text
                        style={{
                          marginHorizontal: 15,
                        }}>
                        Education Level
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

                    <Button mode="contained" onPress={handleSubmit}>
                      ADD Education
                    </Button>
                  </ScrollView>
                </>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EducationForm;

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
