import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import CheckBox from '@react-native-community/checkbox';
import {BASE_URL} from '../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {color} from './Colors';
import Info from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import Logout from './Logout';
import {Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from './Header';

const SelectedCourses = () => {
  const [isChecked, setIsChecked] = useState([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();
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
      <SafeAreaView>
        <Header />
        <View
          style={{
            height:"100%",
            flexDirection: 'column',
            justifyContent: 'center',
            marginHorizontal: 20,
          }}>
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

          {/* GO BACK BUTTON */}
          <Button
            style={{
              marginTop: 20,
              marginBottom: 20,
            }}
            mode="flat"
            color={color.primary}
            onPress={() => navigation.navigate('home')}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SelectedCourses;

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
    backgroundColor: '#fff',
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
});
