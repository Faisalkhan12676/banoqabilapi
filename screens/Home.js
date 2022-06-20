import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Paper from 'react-native-vector-icons/Ionicons';
import Cap from 'react-native-vector-icons/FontAwesome';
import Award from 'react-native-vector-icons/MaterialCommunityIcons';
import ProjectIcon from 'react-native-vector-icons/FontAwesome5';
import Slider from '../components/Swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {color} from '../components/Colors';
import {useNavigation} from '@react-navigation/native';
import Logout from '../components/Logout';
import {useDispatch} from 'react-redux';
import Info from 'react-native-vector-icons/MaterialIcons';
import AdmissionForm from './AdmissionForm';
import CheckBox from '@react-native-community/checkbox';
import {BASE_URL} from '../config';
import axios from 'axios';
import Header from '../components/Header';
import {SafeAreaView} from 'react-native-safe-area-context';

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const imgSourse = require('../assets/logo2.png');

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
  const [getcourse, setGetCourse] = useState([]);
  const [isChecked, setIsChecked] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const value = await AsyncStorage.getItem('@userlogininfo');
        if (value !== null) {
          // We have data!!
          const data = JSON.parse(value);

          await axios
            .get(`${BASE_URL}/StudentAdmissionDetail/GetAllCourse`, {
              headers: {Authorization: 'Bearer ' + data.token},
            })
            .then(res => {
              // setGetCourse(res.data);
              console.log(res.data + 'ALL COURSES');
              const x = res.data.filter(e => e.active === 'True').map(e => e);
              setIsChecked(x);
              setIsLoading(false);
            })
            .catch(err => {
              console.log(err);
              console.log('ERROR COURSEALL');
            });
        }
      } catch (error) {
        // Error retrieving data
      }
    };
    getToken();
  }, []);

  return (
    <>
      {/* HEADER */}
      <SafeAreaView>
        
        <ScrollView
          style={{
            backgroundColor: '#fff',
          }}>
            <Header />
          <Slider />

          <View style={styles.container}>
            {/* <ion-icon name="alert-circle-outline"></ion-icon> */}

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.navigate('selectedCourses')}>
              <View style={styles.card}>
                <Paper name="cog-outline" size={60} style={styles.clr} />
                <Text style={styles.clr}>Preferences</Text>
              </View>
            </TouchableOpacity>

            {/* <View>
            <Text
              style={{
                color: color.primary,
                fontSize: 15,
                marginBottom: 5,
                textAlign: 'center',
              }}>
              You Have Already Selected Preferences
            </Text>
           

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
          </View> */}

            {/* <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('awards')}>
            <View style={styles.card}>
              <Award name="trophy-award" size={50} style={styles.clr} />
              <Text style={styles.clr}>Nimatullah Khan Talent Awards</Text>
            </View>
          </TouchableOpacity> */}

            {/* <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('masterpage')}>
            <View style={styles.card}>
              <Icon name="book" size={50} style={styles.clr} />
              <Text style={styles.clr}>Masters </Text>
              <Text style={styles.clr}>Scholarship</Text>
            </View>
          </TouchableOpacity> */}

            {/* <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('fyp')}>
            <View style={styles.card}>
              <ProjectIcon
                name="project-diagram"
                size={32}
                style={styles.clr}
              />
              <Text style={styles.clr}>FYP Funding</Text>
            </View>
          </TouchableOpacity> */}

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.navigate('admitCard')}>
              <View style={styles.card}>
                <Info name="person" size={38} style={styles.clr} />
                <View>
                  <Text style={styles.clr}>Admit Card</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.navigate('exam')}>
              <View style={styles.card}>
                <Paper name="copy-outline" size={38} style={styles.clr} />
                <Text style={styles.clr}>Demo Exam</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '90%',
                height: 50,
                backgroundColor: '#ef233c',
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
              }}>
              {/* <ProjectIcon name="fa-3" size={60} style={styles.clr} /> */}
              <Text style={styles.clr}>
                Test will be conducted on 3rd of July 2022{' '}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Home;

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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    flex: 1,
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
    paddingHorizontal: 10,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
