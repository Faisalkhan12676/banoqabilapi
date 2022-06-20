import {StyleSheet, Text, View, ScrollView, Alert, Modal} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  RadioButton,
} from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import {color} from '../components/Colors';
import CountDown from 'react-native-countdown-component';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const ExamScreen = () => {
  const navigation = useNavigation();
  const examquestionsfromapi = [
    {
      id: 1,
      questionType: 'Radio',
      question:
        'It was Sunday on Jan 1, 2006. What was the day of the week Jan 1, 2010?',
      options: [
        {
          id: 1,
          option1: 'Sunday',
          isChecked: false,
        },
        {
          id: 2,
          option1: 'Saturday',
          isChecked: false,
        },
        {
          id: 3,
          option1: 'Friday',
          isChecked: false,
        },
        {
          id: 4,
          option1: 'Wednesday',
          isChecked: false,
        },
      ],
    },
    {
      id: 2,
      questionType: 'Radio',
      question: '56% of Y is 182. What is Y?',
      options: [
        {
          id: 1,
          option1: '350',
          isChecked: false,
        },
        {
          id: 2,
          option1: '364',
          isChecked: false,
        },
        {
          id: 3,
          option1: '325',
          isChecked: false,
        },
        {
          id: 4,
          option1: '330',
          isChecked: false,
        },
      ],
    },
    {
      id: 3,
      questionType: 'Radio',
      question: '3.52 ÷ 11 = ?',
      options: [
        {
          id: 1,
          option1: '0.32',
          isChecked: false,
        },
        {
          id: 2,
          option1: '32',
          isChecked: false,
        },
        {
          id: 3,
          option1: '0.032',
          isChecked: false,
        },
        {
          id: 4,
          option1: '3.2',
          isChecked: false,
        },
      ],
    },
    {
      id: 4,
      questionType: 'Radio',
      question: '(3 x 3.9) ÷ 3 = ?',
      options: [
        {
          id: 1,
          option1: '0.39',
          isChecked: false,
        },
        {
          id: 2,
          option1: '-3.9',
          isChecked: false,
        },
        {
          id: 3,
          option1: '-0.39',
          isChecked: false,
        },
        {
          id: 4,
          option1: '3.9',
          isChecked: false,
        },
      ],
    },
    {
      id: 5,
      questionType: 'Radio',
      question: 'Please, stop _______ so many mistakes.',
      options: [
        {
          id: 1,
          option1: 'to make',
          isChecked: false,
        },
        {
          id: 2,
          option1: 'make',
          isChecked: false,
        },
        {
          id: 3,
          option1: 'making',
          isChecked: false,
        },
        {
          id: 4,
          option1: 'makes',
          isChecked: false,
        },
      ],
    },
    {
      id: 6,
      questionType: 'Radio',
      question: 'Please, dont laugh _______ those beggars..',
      options: [
        {
          id: 1,
          option1: 'For',
          isChecked: false,
        },
        {
          id: 2,
          option1: 'Against',
          isChecked: false,
        },
        {
          id: 3,
          option1: 'At',
          isChecked: false,
        },
        {
          id: 4,
          option1: 'Form',
          isChecked: false,
        },
      ],
    },
    {
      id: 7,
      questionType: 'Radio',
      question: 'A computer possesses information',
      options: [
        {
          id: 1,
          option1: 'At once',
          isChecked: false,
        },
        {
          id: 2,
          option1: 'As directed by the operator',
          isChecked: false,
        },
        {
          id: 3,
          option1: 'Automatically',
          isChecked: false,
        },
        {
          id: 4,
          option1: 'Gradually and eventually',
          isChecked: false,
        },
      ],
    },
    {
      id: 8,
      questionType: 'Radio',
      question: 'Web browser is an example of a',
      options: [
        {
          id: 1,
          option1: 'Client agent',
          isChecked: false,
        },
        {
          id: 2,
          option1: 'Server agent',
          isChecked: false,
        },
        {
          id: 3,
          option1: 'User agent',
          isChecked: false,
        },
        {
          id: 4,
          option1: 'All of these',
          isChecked: false,
        },
      ],
    },
    {
      id: 9,
      questionType: 'Radio',
      question: 'Every Web page has a unique address called',
      options: [
        {
          id: 1,
          option1: 'URL',
          isChecked: false,
        },
        {
          id: 2,
          option1: 'ARL',
          isChecked: false,
        },
        {
          id: 3,
          option1: 'RUL',
          isChecked: false,
        },
        {
          id: 4,
          option1: 'LUR',
          isChecked: false,
        },
      ],
    },
    {
      id: 10,
      questionType: 'Radio',
      question: 'The CPU and memory are located on the',
      options: [
        {
          id: 1,
          option1: 'Expansion board',
          isChecked: false,
        },
        {
          id: 2,
          option1: 'Motherboard',
          isChecked: false,
        },
        {
          id: 3,
          option1: 'Storage device',
          isChecked: false,
        },
        {
          id: 4,
          option1: 'Output device',
          isChecked: false,
        },
      ],
    },
  ];
  // const [modalVisible, setModalVisible] = useState(false);
  const [state, setState] = useState(examquestionsfromapi);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [backdisbaled, setBackDisabled] = useState(true);
  const [radiox, setRadiox] = useState(false);

  // console.log("STATE"+state);

  const finalarr = state.filter(item => {
    return item.options.filter(item => {
      return item.isChecked === true;
    });
  });

  finalarr.map(e => {
    console.log(e);
  });

  // console.log(answers);

  return (
    <>
      {/* <View>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            textAlign: 'center',
            marginVertical: 20,
            color: color.primary,
          }}>
          DEMO EXAM
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: color.light,
          padding: 20,
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          {state[currentQuestion].question}
        </Text>
          {/* radio group */}

      {/* {state[currentQuestion].questionType === 'Radio' ? (
              state[currentQuestion].options.map((item, i) => {
                return (
                  <View key={item.id}>
                    <RadioButton.Group>
                        <View style={{ flexDirection: 'row' }}>
                          <RadioButton
                            value={item.option1}
                            status={item.isChecked ? 'checked' : 'unchecked'}
                            onPress={() => {
                              setRadiox(true);
                              state[currentQuestion].options[i].isChecked = true;
                              setState([...state]);
                            }}
                          />
                          <Text style={{ fontSize: 18, marginRight: 10 }}>
                            {item.option1}
                          </Text>
                          </View>
                    </RadioButton.Group>
                  </View>
                );
              }
              )
            ) : (
              <>
                {state[currentQuestion].options.map((item, i) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 5,
                  }}>
                  <CheckBox
                    key={item.id}
                    value={item.isChecked}
                    onValueChange={() => {
                      item.isChecked = !item.isChecked;
                      setState([...state]);
                    }}
                  />
                  <Text>{item.option1}</Text>
                </View>
              );
            })}
              </>
            )} */}

      <SafeAreaView>
        <View
          style={{
            height: 70,
            width: '100%',
            backgroundColor: color.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: color.light,
            }}>
            DEMO EXAM
          </Text>
        </View>

        <View style={{}}>
          {state[currentQuestion].questionType === 'Checkbox' ? (
            <>
              <Card
                style={{
                  margin: 10,
                }}>
                <Card.Content>
                  <Title>{state[currentQuestion].question}</Title>
                  {state[currentQuestion].options.map((item, i) => {
                    return (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 15,
                            marginVertical: 5,
                          }}>
                          <CheckBox
                            value={item.isChecked}
                            onValueChange={() => {
                              item.isChecked = !item.isChecked;
                              setState([...state]);
                            }}
                          />
                          <Paragraph>{item.option1}</Paragraph>
                        </View>
                      </>
                    );
                  })}
                </Card.Content>
              </Card>
            </>
          ) : (
            <>
              <Card
                style={{
                  margin: 10,
                }}>
                <Card.Content>
                  <Title>{state[currentQuestion].question}</Title>

                  {state[currentQuestion].options.map((item, i) => {
                    return (
                      <RadioButton.Group
                        onValueChange={e => {
                          //if option1 is checked then set all other options to false
                          if (e === item.option1) {
                            state[currentQuestion].options.map((item, i) => {
                              item.isChecked = false;
                            });
                            item.isChecked = true;
                            setState([...state]);
                          }
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <RadioButton.Item
                            value={item.option1}
                            status={item.isChecked ? 'checked' : 'unchecked'}
                          />
                          <Paragraph>{item.option1}</Paragraph>
                        </View>
                      </RadioButton.Group>
                    );
                  })}
                </Card.Content>
              </Card>
            </>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 10,
              paddingHorizontal: 10,
            }}>
            <Button
              color={color.primary}
              disabled={currentQuestion === 0 ? true : false}
              onPress={() => {
                setCurrentQuestion(currentQuestion - 1);
              }}>
              BACK
            </Button>
            {currentQuestion === state.length - 1 ? (
              <>
                <Button
                  mode="contained"
                  color={color.primary}
                  onPress={() => {
                    //show Alert
                    Alert.alert(
                      'Bano Qabil',
                      'Your Exam Has Been Finished',
                      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                      {cancelable: false},
                    );

                    navigation.navigate('TabNavigator');
                  }}>
                  Finish
                </Button>
              </>
            ) : (
              <>
                <Button
                  disabled={currentQuestion === state.length - 1 ? true : false}
                  mode="contained"
                  color={color.primary}
                  onPress={() => {
                    setCurrentQuestion(currentQuestion + 1);
                  }}>
                  NEXT
                </Button>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/*       

      <View
        style={{
          height: 70,
          width: '100%',
          backgroundColor: color.primary,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <CountDown
          until={60 * 30 + 0}
          size={20}
          onFinish={() => alert('Finished')}
          digitStyle={{backgroundColor: '#FFF'}}
          digitTxtStyle={{color: color.primary}}
          timeToShow={['M', 'S']}
          timeLabels={{m: '', s: ''}}
          showSeparator
        />
      </View>
      <View
        style={{
          flex: 1,
        }}>
        <ScrollView
          style={{
            flex: 1,
          }}>
          <Card
            style={{
              margin: 10,
            }}>
            <Card.Content>
              <Title>Q:1 What is Your Name?</Title>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 15,
                  marginVertical: 5,
                }}>
                <CheckBox />
                <Paragraph>Faisal</Paragraph>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 15,
                  marginVertical: 5,
                }}>
                <CheckBox />
                <Paragraph>Mubbashir</Paragraph>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 15,
                  marginVertical: 5,
                }}>
                <CheckBox />
                <Paragraph>Moid</Paragraph>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 15,
                  marginVertical: 5,
                }}>
                <CheckBox />
                <Paragraph>Muammar</Paragraph>
              </View>
            </Card.Content>
          </Card>

          <Card
            style={{
              margin: 10,
            }}>
            <Card.Content>
              <Title>Q:1 What is Your Name?</Title>
              <RadioButton.Group>
                <RadioButton.Item
                  color={color.primary}
                  value="Male"
                  labelStyle={{
                    textAlign: 'left',
                  }}
                  label="Pakistan"
                  position="leading"
                />
                <RadioButton.Item
                  color={color.primary}
                  value="Male"
                  labelStyle={{
                    textAlign: 'left',
                  }}
                  label="India"
                  position="leading"
                />
                <RadioButton.Item
                  color={color.primary}
                  value="Male"
                  labelStyle={{
                    textAlign: 'left',
                  }}
                  label="USA"
                  position="leading"
                />
              </RadioButton.Group>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>

      <View
        style={{
          height: 70,
          width: '100%',
          backgroundColor: color.divider,
          justifyContent: 'center',
          paddingHorizontal: 30,
        }}>
        <Button
          mode="contained"
          style={{
            backgroundColor: color.primary,
          }}
          >
          Start Exam
        </Button>
      </View> */}
    </>
  );
};

export default ExamScreen;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
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
