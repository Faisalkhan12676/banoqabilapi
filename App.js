import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import TabNavigator from './screens/TabNavigator';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './screens/Login';
import Register from './screens/Register';
import StudentRegistration from './screens/StudentRegistration';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import EducationForm from './screens/EducationForm';
import Howtoapply from './screens/Howtoapply';
import ShowStd from './screens/ShowStd';
import SplashSCreen from './screens/SplashScreen';
import AdminCard from './screens/AdminCard';
import AdmissionForm from './screens/AdmissionForm';
import ExamScreen from './screens/ExamScreen';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import Education from './screens/Education';
import MasterForm from './components/MasterForm';
import Awards from './components/Awards';
// import Fyp from './components/fyp';
import ShortFilms from './components/ShortFilms';
import Fyp from './components/Fyp';
import ForgetScreen from './screens/ForgetScreen';
import NewPassowrd from './screens/NewPassowrd';
import SelectedCourses from './components/SelectedCourses';
import ChangePassword from './screens/ChangePassword';



const stack = createNativeStackNavigator();

const App = () => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  // const authState = useSelector(state => state.LoginReducer.isLoggedIn);
  // console.log(authState);]
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    // ASYNC STORAGE
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@userlogininfo');
        if (value !== null) {
          // value previously stored
          setAuth(true);
        }
      } catch (e) {
        // error reading value
      }
    };
    getData();

    setTimeout(() => {
      setSplash(false);
    }, 3000);
  }, []);

  const loginstate = useSelector(state => state.LoginReducer.isLoggedIn);

  return (
    <>
      <NavigationContainer>
        <stack.Navigator screenOptions={{headerShown: false}}>
          {loginstate || auth ? (
            <>
              {splash ? (
                <stack.Screen name="SplashScreen" component={SplashSCreen} />
              ) : (
                <>
                  <stack.Screen name="str" component={StudentRegistration} />
                  {/* <stack.Screen name="edu" component={Education} /> */}
                  <stack.Screen name="TabNavigator" component={TabNavigator} />
                  {/* <stack.Screen name="Registration" component={Howtoapply} /> */}
                  <stack.Screen name="courses" component={AdmissionForm} />
                  <stack.Screen name="admitCard" component={AdminCard} />
                  {/* <stack.Screen name="EduDetail" component={EducationForm} /> */}
                  <stack.Screen name="details" component={ShowStd} />
                  {/* <stack.Screen name='edu' component={Education} /> */}
                  <stack.Screen name="exam" component={ExamScreen} />
                  <stack.Screen name="masterpage" component={MasterForm} />
                  <stack.Screen name="awards" component={Awards} />
                  {/* <stack.Screen name='fyp' component={fyp} /> */}
                  <stack.Screen name="fyp" component={Fyp} />
                  <stack.Screen name="shortfilms" component={ShortFilms} />
                  <stack.Screen name="selectedCourses" component={SelectedCourses} />
                  <stack.Screen name="changepass" component={ChangePassword} />
                </>
              )}
            </>
          ) : (
            <>
              {splash ? (
                <>
                  <stack.Screen name="SplashScreen" component={SplashSCreen} />
                </>
              ) : (
                <>
                  <stack.Screen name="Register" component={Register} />
                  <stack.Screen name="Login" component={Login} />
                  <stack.Screen
                    options={{
                      headerShown: true,
                      headerTitle: '',
                      headerStyle: {
                        height: 50,
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                        backgroundColor: '#fff',
                        shadowColor: 'transparent',
                        shadowOffset: {
                          height: 0,
                          width: 0,
                        },
                        shadowRadius: 0,
                        shadowOpacity: 0,
                      },
                    }}
                    name="ForgetScreen"
                    component={ForgetScreen}
                  />
                  <stack.Screen name="NewPassword" component={NewPassowrd} />
                  {/* <stack.Screen name="TabNavigator" component={TabNavigator}/> */}
                </>
              )}
              {/* <stack.Screen name="Login" component={Login}/>
                <stack.Screen name="Register" component={Register}/> */}
            </>
          )}
          {/* <stack.Screen name="StudentRegistration" component={StudentRegistration} /> */}
        </stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
