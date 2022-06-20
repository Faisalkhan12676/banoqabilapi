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
import Close from 'react-native-vector-icons/Ionicons';
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
//   import AdmissionForm from './AdmissionForm';
import CheckBox from '@react-native-community/checkbox';
import {BASE_URL} from '../config';
import axios from 'axios';

const Header = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const imgSourse = require('../assets/logo2.png');
  const [isnotified, setIsNotified] = useState(false);
  const [isNotified, setNotified] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const getToken = async () => {
      try {
        const value = await AsyncStorage.getItem('@userlogininfo');
        if (value !== null) {
          // We have data!!
          const data = JSON.parse(value);

          //getnotification
          axios
            .post(
              `${BASE_URL}/Notification_log/GetByStudentIdWithRelationShip?id=${data.userid}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${data.token}`,
                },
              },
            )
            .then(res => {
              if (res.status === 200) {
                if (res.data.app === 1) {
                  setIsNotified(true);
                  setNotification(res.data);
                  console.log(res.data);
                } else {
                  setIsNotified(false);
                }
              }
            })
            .catch(err => {
              if (err.response.status === 500) {
                setNotified(false);
              }
              console.log(err);
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

  const handlenotify = async () => {
    const value = await AsyncStorage.getItem('@userlogininfo');
    if (value !== null) {
      // We have data!!
      const data = JSON.parse(value);

      axios
        .post(
          `${BASE_URL}/Notification_log/Update`,
          {
            id: notification.id,
            studentId: data.userid,
            email: '',
            web: '',
            app: 'app',
            sms: '',
          },
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          },
        )
        .then(res => {
          console.log(res);
          setIsNotified(false);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <View style={styles.header}>
        <View
          style={{
            height: 60,
            width: 100,
          }}>
          <Image
            source={require('../assets/Bano-Qabil-Logo-Green.png')}
            style={styles.logo}
          />
        </View>
        <View
          style={{
            height: 60,
            width: 100,
          }}>
          <Image
            source={imgSourse}
            style={{
              height: '100%',
              width: '100%',
              resizeMode: 'contain',
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('details')}>
            <Info name="person" color={color.primary} size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('admitCard')}>
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

      {isnotified ? (
        <>
          <TouchableOpacity onPress={handlenotify}>
            <View
              style={{
                height: 35,
                width: '100%',
                backgroundColor: 'red',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  marginHorizontal: 10,
                }}>
                {notification.notification}
              </Text>
              <Icon name="close" size={25} style={{marginRight:8}} color="white" />
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
//<ion-icon name="close-outline"></ion-icon>
export default Header;

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
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
