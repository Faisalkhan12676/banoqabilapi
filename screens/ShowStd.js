import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Button,
  DataTable,
  ActivityIndicator,
  Colors,
  Modal,
  Portal,
  Text,
  Provider,
  TextInput,
  RadioButton,
  HelperText,
  Avatar,
} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../config';
import {Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {color} from '../components/Colors';
import DatePicker from 'react-native-date-picker';
import RNPickerSelect from 'react-native-picker-select';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ShowStd = () => {
  const navigation = useNavigation();
  const [imgs, setImgs] = useState('');
  const [token, setToken] = useState('');
  const [visible, setVisible] = React.useState(false);
  const [data, setData] = useState([]);
  const [image, setImage] = React.useState(null);
  const [ext, setExt] = React.useState(null);
  const [imgplaceholder, setImgplaceholder] = useState('Add Image');

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [district, setDistrict] = useState([]);
  const [city, setCity] = useState([]);
  const [id, setId] = useState('');
  const [user, setUser] = useState([]);
  const [education, setEducation] = useState([]);

  useEffect(() => {
    const getstudent = async () => {
      const value = await AsyncStorage.getItem('@userlogininfo');
      if (value !== null) {
        const data = JSON.parse(value);
        setToken(data.token);




        axios
          .get(`${BASE_URL}/Student/GetByUserIdWithRelationShip`, {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          })
          .then(res => {
            console.log('DATA : ', res.data);
            const {student, user} = res.data;
            console.log(user.username);
            console.log(student.areaId);
            setData(student);
            setId(user.id);
            console.log(student);
            setUser(user);

            axios
              .get(`${BASE_URL}/Area/GetByCityId?id=${student.cityId}`, {
                headers: {Authorization: `Bearer ${token}`},
              })
              .then(res => {
                console.log(res.data, 'AREA');
                setDistrict(res.data);
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
          });



          axios
          .get(`${BASE_URL}/Student/GetImage`, {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          })
          .then(res => {
            console.log('IMAGES');
            const {image} = res.data;
            setImgs(image);
          })
          .catch(err => {
            console.log(err);
            console.log('ERROR');
          });


        await axios
          .get(`${BASE_URL}/City/GetAll`, {
            headers: {Authorization: `Bearer ${data.token}`},
          })
          .then(res => {
            // console.log(res.data);
            setCity(res.data);
          })
          .catch(err => {
            console.log(err);
          });

        await axios
          .get(
            `${BASE_URL}/StudentEducation/GetAllByStudentIdWithRelationShip`,
            {
              headers: {Authorization: `Bearer ${data.token}`},
            },
          )
          .then(res => {
            console.log(res.data, 'LINE 117');
            setEducation(res.data[0]);
          })
          .catch(err => {
            console.log(err);
          });



      }
    };

    getstudent();
    console.log(token);
  }, [visible]);

  const handleArea = value => {
    console.log(value + 'ID');
    axios
      .get(`${BASE_URL}/Area/GetByCityId?id=${value}`, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        setDistrict(res.data);
        // console.log(res.data);
      })
      .catch(err => {
        console.log(err + 'FROM CITY POST');
      });
  };

  const ImageHandle = () => {
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
        setExt(typeSplit[1]);
      }
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

  const today = new Date().toISOString().split('T')[0];

  console.log(id);
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.title}>
          <Avatar.Image size={70} source={{uri: imgs}}  />

            {/* <Button mode="contained" style={styles.button} onPress={showModal}>
              Edit
            </Button> */}
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => navigation.navigate('changepass')}>
              <Icon name="key" size={20} />
            </Button>
          </View>
          <Divider />
          <View style={styles.div}>
            <Text style={styles.headding}>Registration No</Text>
            <Text style={styles.text}>{user.username + user.id}</Text>
          </View>
          <Divider />
          <View style={styles.div}>
            <Text style={styles.headding}>Name</Text>
            <Text style={styles.text}>{data.user}</Text>
          </View>
          <Divider />

          <View style={styles.div}>
            <Text style={styles.headding}>Father Name</Text>
            <Text style={styles.text}>{data.fatherName}</Text>
          </View>
          <Divider />

          {/* <View style={styles.div}>
            <Text style={styles.headding}>CNIC</Text>
            <Text style={styles.text}>{data.cnic}</Text>
          </View>
          <Divider /> */}
          <View style={styles.div}>
            <Text style={styles.headding}>Gender</Text>
            <Text style={styles.text}>{data.gender}</Text>
          </View>
          <Divider />

          <View style={styles.div}>
            <Text style={styles.headding}>Present Address</Text>
            <Text style={styles.text}>{data.presentAddress}</Text>
          </View>
          <Divider />

          <View style={styles.div}>
            <Text style={styles.headding}>Date of Birh</Text>
            <Text style={styles.text}>{data.dob}</Text>
          </View>
          <Divider />

          {/* <View style={styles.div}>
            <Text style={styles.headding}>Phone</Text>
            <Text style={styles.text}>{data.otherNumber}</Text>
          </View>
          <Divider /> */}

          <View style={styles.div}>
            <Text style={styles.headding}>Father Occupation</Text>
            <Text style={styles.text}>{data.fatherOccupation}</Text>
          </View>
          <Divider />

          <View style={styles.div}>
            <Text style={styles.headding}>Whatsapp</Text>
            <Text style={styles.text}>{data.whatsappNumber}</Text>
          </View>
          <Divider />

          <View style={styles.div}>
            <Text style={styles.headding}>Facebook</Text>
            <Text style={styles.text}>{data.facebookAccount}</Text>
          </View>
          <Divider />

          {/* <View style={styles.div}>
            <Text style={styles.headding}>LinkedIn</Text>
            <Text style={styles.text}>{data.linkedinAccount}</Text>
          </View>
          <Divider /> */}

          {/* <View style={styles.div}>
            <Text style={styles.headding}>Instagram</Text>
            <Text style={styles.text}>{data.instagramAccount}</Text>
          </View>
          <Divider /> */}

          <View style={styles.div}>
            <Text style={styles.headding}>Enrollment Date</Text>
            <Text style={styles.text}>{data.enrollmentDate}</Text>
          </View>

          <View style={styles.div}>
            <Text style={styles.headding}>Education</Text>
            <Text style={styles.text}>{education.degrees}</Text>
          </View>
          <Divider />
        </View>
      </ScrollView>

      <Provider>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}>
            <Formik
              initialValues={{
                fatherName: '' || data.fatherName,
                gender: '' || data.gender,
                // cnic: '' || data.cnic,
                dob: '' || data.dob,
                fatherOccupation: '' || data.fatherOccupation,
                presentAddress: '' || data.presentAddress,
                cityId: '' || data.cityId,
                whatsappNumber: '' || data.whatsappNumber,
                // otherNumber: '' || data.otherNumber,
                areaId: '' || data.areaId,
                facebookAccount: '' || data.facebookAccount,
                // linkedinAccount: '' || data.linkedinAccount,
                // instagramAccount: '' || data.instagramAccount,
                email: '' || data.email,
                enrollmentDate: '' || data.enrollmentDate,
              }}
              onSubmit={(values, actions) => {
                console.log(token, 'token');

                console.log(token);
                console.log({
                  whatsappNumber: values.whatsappNumber, //
                  email: values.email, //
                  fatherName: values.fatherName, //
                  whatsappNumber: values.whatsappNumber, //
                  otherNumber: null, //
                  facebookAccount: values.facebookAccount, //
                  instagramAccount: null,
                  linkedinAccount: null,
                  presentAddress: values.presentAddress, //
                  cnic: values.cnic, //
                  enrollmentDate: data.enrollmentDate, //
                  gender: values.gender, //
                  cityId: values.cityId, //
                  fatherOccupation: values.fatherOccupation, //
                  dob: values.dob, //
                  email: values.email, //
                  active: 'string',
                  userId: 0, //
                  areaId: values.areaId, //
                });

                axios
                  .put(
                    `${BASE_URL}/Student/Update?id=${id}`,
                    {
                      whatsappNumber: values.whatsappNumber, //
                      email: values.email, //
                      fatherName: values.fatherName, //
                      whatsappNumber: values.whatsappNumber, //
                      otherNumber: null, //
                      facebookAccount: values.facebookAccount, //
                      instagramAccount: null,
                      linkedinAccount: null,
                      presentAddress: values.presentAddress, //
                      cnic: values.cnic, //
                      enrollmentDate: values.enrollmentDate, //
                      gender: values.gender, //
                      cityId: values.cityId, //
                      fatherOccupation: values.fatherOccupation, //
                      dob: values.dob, //
                      email: values.email, //
                      userId: 0, //
                      areaId: values.areaId, //
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  )
                  .then(res => {
                    console.log('DATA UPDATED');
                    //setAlert and Navigate to home
                    Alert.alert(
                      'Success',
                      'Data Updated Successfully',
                      [
                        {
                          text: 'OK',
                          onPress: () => {
                            navigation.navigate('TabNavigator');
                          },
                        },
                      ],
                      {cancelable: false},
                    );

                    navigation.navigate('TabNavigator');
                    axios.post(
                      `${BASE_URL}/Student/AddImage`,
                      {
                        image: image,
                        ext: ext,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      },
                    );

                    console.log(res.data);
                  })
                  .catch(err => {
                    console.log('DATA NOT UPDATED');
                  });
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                touched,
                setFieldValue,
                errors,
              }) => (
                <>
                  <View style={styles.modal}>
                    <ScrollView>
                      <Text style={styles.modalText}>
                        Edit Basic Information
                      </Text>

                      <TextInput
                        activeUnderlineColor={color.primary}
                        style={{marginHorizontal: 20, marginVertical: 10}}
                        mode="flat"
                        placeholder="fatherName"
                        name="fatherName"
                        onChangeText={handleChange('fatherName')}
                        onBlur={handleBlur('fatherName')}
                        value={values.fatherName}
                      />
                      <HelperText
                        type="error"
                        style={{marginHorizontal: 20}}
                        visible={touched.fatherName && errors.fatherName}>
                        {touched.fatherName && errors.fatherName}
                      </HelperText>
                      <TextInput
                        activeUnderlineColor={color.primary}
                        style={{marginHorizontal: 20, marginVertical: 10}}
                        mode="flat"
                        placeholder="Father Occupation"
                        name="fatherOccupation"
                        onChangeText={handleChange('fatherOccupation')}
                        value={values.fatherOccupation}
                        onBlur={handleBlur('fatherOccupation')}
                      />
                      <HelperText
                        type="error"
                        style={{marginHorizontal: 20}}
                        visible={
                          touched.fatherOccupation && errors.fatherOccupation
                        }>
                        {touched.fatherOccupation && errors.fatherOccupation}
                      </HelperText>

                      {/* <TextInput
                        style={{marginHorizontal: 20}}
                        mode="flat"
                        placeholder="otherNumber"
                        name="otherNumber"
                        onChangeText={handleChange('otherNumber')}
                        value={values.otherNumber}
                        onBlur={handleBlur('otherNumber')}
                      />
                      <HelperText
                        type="error"
                        style={{marginHorizontal: 20}}
                        visible={touched.otherNumber && errors.otherNumber}>
                        {touched.otherNumber && errors.otherNumber}
                      </HelperText> */}
                      <TouchableOpacity onPress={ImageHandle}>
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
                          <Text
                            style={{
                              fontSize: 15,
                            }}>
                            {imgplaceholder}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TextInput
                        activeUnderlineColor={color.primary}
                        style={{marginHorizontal: 20}}
                        mode="flat"
                        placeholder="email"
                        name="email"
                        onChangeText={handleChange('email')}
                        value={values.email}
                        onBlur={handleBlur('email')}
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
                            placeholder={data.dob}
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
                        />
                        <HelperText
                          type="error"
                          style={{marginHorizontal: 20}}
                          visible={touched.areaId && errors.areaId}>
                          {touched.areaId && errors.areaId}
                        </HelperText>
                      </View>

                      <TextInput
                        activeUnderlineColor={color.primary}
                        style={{marginHorizontal: 20, marginVertical: 10}}
                        mode="flat"
                        placeholder="CNIC"
                        name="cnic"
                        onChangeText={handleChange('cnic')}
                        value={values.cnic}
                        onBlur={handleBlur('cnic')}
                      />
                      <HelperText
                        type="error"
                        style={{marginHorizontal: 20}}
                        visible={touched.cnic && errors.cnic}>
                        {touched.cnic && errors.cnic}
                      </HelperText>

                      <TextInput
                        activeUnderlineColor={color.primary}
                        style={{marginHorizontal: 20, marginVertical: 10}}
                        mode="flat"
                        placeholder="Present Address"
                        name="presentAddress"
                        onChangeText={handleChange('presentAddress')}
                        value={values.presentAddress}
                        onBlur={handleBlur('presentAddress')}
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
                        activeUnderlineColor={color.primary}
                        style={{marginHorizontal: 20, marginVertical: 10}}
                        mode="flat"
                        placeholder="Whatsapp Number"
                        name="whatsappNumber"
                        onChangeText={handleChange('whatsappNumber')}
                        value={values.whatsappNumber}
                        onBlur={handleBlur('whatsappNumber')}
                      />
                      <HelperText
                        type="error"
                        style={{marginHorizontal: 20}}
                        visible={
                          touched.whatsappNumber && errors.whatsappNumber
                        }>
                        {touched.whatsappNumber && errors.whatsappNumber}
                      </HelperText>

                      <TextInput
                        activeUnderlineColor={color.primary}
                        style={{marginHorizontal: 20, marginVertical: 10}}
                        mode="flat"
                        placeholder="Facebook Account"
                        name="facebookAccount"
                        onChangeText={handleChange('facebookAccount')}
                        value={values.facebookAccount}
                        onBlur={handleBlur('facebookAccount')}
                      />
                      <HelperText
                        type="error"
                        style={{marginHorizontal: 20}}
                        visible={
                          touched.facebookAccount && errors.facebookAccount
                        }>
                        {touched.facebookAccount && errors.facebookAccount}
                      </HelperText>

                      {/* <TextInput
                        style={{marginHorizontal: 20, marginVertical: 10}}
                        mode="flat"
                        placeholder="Instagram Account"
                        name="instagramAccount"
                        onChangeText={handleChange('instagramAccount')}
                        value={values.instagramAccount}
                        onBlur={handleBlur('instagramAccount')}
                      />
                      <HelperText
                        type="error"
                        style={{marginHorizontal: 20}}
                        visible={
                          touched.instagramAccount && errors.instagramAccount
                        }>
                        {touched.instagramAccount && errors.instagramAccount}
                      </HelperText> */}

                      {/* <TextInput
                        style={{marginHorizontal: 20, marginVertical: 10}}
                        mode="flat"
                        placeholder="LinkedIn Account"
                        name="instagramAccount"
                        onChangeText={handleChange('linkedinAccount')}
                        value={values.linkedinAccount}
                        onBlur={handleBlur('linkedinAccount')}
                      />
                      <HelperText
                        type="error"
                        style={{marginHorizontal: 20}}
                        visible={
                          touched.linkedinAccount && errors.linkedinAccount
                        }>
                        {touched.linkedinAccount && errors.linkedinAccount}
                      </HelperText> */}

                      {/* SUBMIT BUTTON */}
                      <Button
                        style={{
                          marginHorizontal: 10,
                          backgroundColor: color.primary,
                        }}
                        mode="contained"
                        onPress={handleSubmit}>
                        Submit
                      </Button>
                    </ScrollView>
                  </View>
                </>
              )}
            </Formik>
          </Modal>
        </Portal>
      </Provider>
      </SafeAreaView>
    </>
  );
};

export default ShowStd;

const styles = StyleSheet.create({
  div: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headding: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  text: {
    fontSize: 20,
  },
  title: {
    padding: 20,
    fontSize: 20,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modal: {
    height: 500,
    paddingTop: 30,
  },
  button: {
    backgroundColor: color.primary,
  },
});
