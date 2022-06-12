import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Paragraph,
  TextInput,
  HelperText,
  DataTable,
  ActivityIndicator,
  Colors
} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import {BASE_URL} from '../config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-date-picker';

const ExperienceForm = () => {
  const [stdID, setStdId] = useState(null);
  const [designation, setDesignation] = useState([]);
  const [exp, setExp] = useState([]);
  const [Experience, setExperience] = useState([]);
  const [open, setOpen] = useState(false);
  const [openTwo, setOpenTwo] = useState(false);
  const [date, setDate] = useState(new Date());
  const [datetwo, setDateTwo] = useState(new Date());
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    const getStdId = async () => {
      await axios
        .get(`${BASE_URL}/Designation/GetAll`)
        .then(res => {
          setDesignation(res.data);
        })
        .catch(err => {
          console.log(err);
        });

      try {
        const value = await AsyncStorage.getItem('@studentId');
        if (value !== null) {
          // value previously stored
          await axios
            .get(
              `${BASE_URL}/StudentExperience/GetAllByStudentIdWithRelationShip?id=${value}`,
            )
            .then(res => {
              setExperience(res.data);
              setIsLoading(false);
            })
            .catch(err => {
              console.log(err);
            });
          setStdId(value);
          console.log(value);
        }
      } catch (e) {
        // error reading value
      }
    };
    getStdId();
  }, []);

  console.log(Experience);
  //modify designation array with custom key
  const designationArray = designation.map((item, index) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  //TEMP ARRAY FOR TESTING

  const [modalVisible, setModalVisible] = useState(false);
  //FORMIK

  const validation = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    designation: Yup.string().required('Designation is required'),
    companyName: Yup.string().required('Company Name is required'),
    workFrom: Yup.string().required('Work From is required'),
    workTo: Yup.string().required('Work To is required'),
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
            axios
              .delete(`${BASE_URL}/StudentExperience/Remove?id=${id}`)
              .then(res => {
                setExperience(res.data);
              })
              .catch(err => {
                console.log(err);
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <>
      {isloading ? (
        <>
         <ActivityIndicator animating={true} color={Colors.red800} />
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
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>Designation</DataTable.Title>
                <DataTable.Title>Company Name</DataTable.Title>
                <DataTable.Title>Work From</DataTable.Title>
                <DataTable.Title>Work To</DataTable.Title>
                <DataTable.Title>Is Present</DataTable.Title>
                <DataTable.Title>Action</DataTable.Title>
              </DataTable.Header>
              {Experience.map((item, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{item.name}</DataTable.Cell>
                  <DataTable.Cell>{item.designation}</DataTable.Cell>
                  <DataTable.Cell>{item.companyName}</DataTable.Cell>
                  <DataTable.Cell>{item.workFrom}</DataTable.Cell>
                  <DataTable.Cell>{item.workTo}</DataTable.Cell>
                  <DataTable.Cell>{item.isPresent}</DataTable.Cell>
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
                mode="contained"
                onPress={() => {
                  setModalVisible(true);
                }}>
                Add Experience
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
          <View style={{
              alignItems: 'flex-end',
            }}>
              <Icon name='close' size={25} onPress={() => setModalVisible(!modalVisible)} color="#000" />

            </View>
            <Text style={styles.modalText}>Experience</Text>
            <Formik
              initialValues={{
                name: '',
                designation: '',
                companyName: '',
                workFrom: '',
                workTo: '',
                isPresent: false,
              }}
              onSubmit={async (values, {resetForm}) => {
                setIsLoading(true);
                setModalVisible(false);
                resetForm();

               

                await axios
                  .post(`${BASE_URL}/StudentExperience/Add`, {
                    name: values.name,
                    studentId: stdID,
                    designationId: values.designation,
                    companyName: values.companyName,
                    workFrom: values.workFrom,
                    workTo: values.workTo,
                    isPresent: values.isPresent ? 'YES' : 'NO',
                  })
                  .then(res => {
                    console.log(res.data);
                    setExperience(res.data);
                    setIsLoading(false);
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
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <TextInput
                      label="name"
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      style={styles.name}
                    />
                    <HelperText
                      type="error"
                      visible={touched.name && errors.name}>
                      {errors.name}
                    </HelperText>

                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                        }}>
                        Designation
                      </Text>
                      <RNPickerSelect
                        onValueChange={(value, index) => {
                          setFieldValue('designation', value);
                        }}
                        placeholder={{
                          label: 'Select Designation',
                          value: null,
                        }}
                        items={designationArray}
                        value={values.designation}
                      />
                    </View>

                    <TextInput
                      label="company Name"
                      value={values.companyName}
                      onChangeText={handleChange('companyName')}
                      onBlur={handleBlur('companyName')}
                      style={styles.name}
                    />
                    <HelperText
                      type="error"
                      visible={touched.companyName && errors.companyName}>
                      {errors.companyName}
                    </HelperText>

                    <Text style={{marginRight: 100}}>Work From</Text>
                    <TouchableOpacity onPress={() => setOpen(true)}>
                      <TextInput
                        style={{width: '100%'}}
                        value={values.workFrom}
                        onBlur={handleBlur('workFrom')}
                        disabled={true}
                        placeholder="Select Date"
                      />
                    </TouchableOpacity>
                    <HelperText
                      type="error"
                      visible={touched.workFrom && errors.workFrom}>
                      {errors.workFrom}
                    </HelperText>

                    <DatePicker
                      modal
                      open={open}
                      date={date}
                      onConfirm={date => {
                        setDate(date);
                        const dateString = date.toLocaleDateString();
                        setFieldValue('workFrom', dateString);
                      }}
                      mode="date"
                      onDateChange={date => {
                        const dateString = date.toLocaleDateString();
                        setFieldValue('workFrom', dateString);
                        setDate(date);
                      }}
                      onCancel={() => {
                        setOpen(false);
                      }}
                    />

                    {values.isPresent ? (
                      <></>
                    ) : (
                      <>
                        <Text style={{marginRight: 100}}>Work To</Text>
                        <TouchableOpacity onPress={() => setOpenTwo(true)}>
                          <TextInput
                            style={{width: '100%'}}
                            value={values.workTo}
                            onBlur={handleBlur('workTo')}
                            disabled={true}
                            placeholder="Select Date"
                          />
                        </TouchableOpacity>
                        <HelperText
                          type="error"
                          visible={touched.workTo && errors.workTo}>
                          {errors.workTo}
                        </HelperText>
                        <DatePicker
                          modal
                          open={openTwo}
                          date={datetwo}
                          onConfirm={date => {
                            const dateString = date.toLocaleDateString();
                            setFieldValue('workTo', dateString);
                            setOpenTwo(false);
                          }}
                          mode="date"
                          minimumDate={date}
                          onDateChange={date => {
                            setDateTwo(datetwo);
                            const dateString = date.toLocaleDateString();

                            setFieldValue('workTo', dateString);
                          }}
                          onCancel={() => {
                            setOpenTwo(false);
                          }}
                        />
                      </>
                    )}

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 10,
                      }}>
                      <CheckBox
                        value={values.isPresent}
                        onValueChange={() => {
                          setFieldValue('isPresent', !values.isPresent);
                        }}
                      />
                      <Text>is Present</Text>
                    </View>

                    <Button mode="contained" onPress={handleSubmit}>
                      ADD EXPERIENCE
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

export default ExperienceForm;

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
