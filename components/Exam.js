import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {RadioButton} from 'react-native-paper';

let json = [
  {
    id: 1,
    question: 'test1',
    questionType: 'radio',
    examTypeId: 1,
    option1: 'abc',
    option2: 'def',
    option3: 'ghi',
    option4: 'jkl',
    createdBy: null,
    createdDate: '2022-05-30T19:09:40.0444908',
    updateBy: null,
    updateDate: null,
    active: 'Y',
  },
  {
    id: 2,
    question: 'test2',
    questionType: 'checkbox',
    examTypeId: 1,
    option1: 'mno',
    option2: 'pqr',
    option3: 'stu',
    option4: 'vwx',
    createdBy: null,
    createdDate: '2022-05-30T19:09:40.0444908',
    updateBy: null,
    updateDate: null,
    active: 'Y',
  },
  {
    id: 6,
    question: 'test3',
    questionType: 'radio',
    examTypeId: 1,
    option1: 'abc',
    option2: 'abcd',
    option3: 'efgh',
    option4: 'ijkl',
    createdBy: null,
    createdDate: '2022-05-30T19:09:40.0444908',
    updateBy: null,
    updateDate: null,
    active: 'Y',
  },
  {
    id: 7,
    question: 'test4',
    questionType: 'checkbox',
    examTypeId: 1,
    option1: '11',
    option2: '67',
    option3: '55',
    option4: '88',
    createdBy: null,
    createdDate: '2022-05-30T19:09:40.0444908',
    updateBy: null,
    updateDate: null,
    active: 'Y',
  },
  {
    id: 8,
    question: 'test5',
    questionType: 'radio',
    examTypeId: 1,
    option1: 'true',
    option2: 'false',
    option3: null,
    option4: null,
    createdBy: null,
    createdDate: '2022-05-30T19:09:40.0444908',
    updateBy: null,
    updateDate: null,
    active: 'Y',
  },
];
const Exam = () => {
  const [questions, setQuestions] = useState(json);
  const [i, setI] = useState(0);
  const [answers, setanswers] = useState([]);

  
   

  return (
    <>
        <RadioButton.Group
            onValueChange={value => {
               console.log(value);
                if(questions[i].option1 === value){
                    setQuestions();
                }
                console.log(questions);
                
            }}
        >
            <RadioButton.Item label={questions[i].option1} value={questions[i].option1}  />
            <RadioButton.Item label={questions[i].option2} value={questions[i].option2}  />
            <RadioButton.Item label={questions[i].option3} value={questions[i].option3}  />
            <RadioButton.Item label={questions[i].option4} value={questions[i].option4}  />
        
            
        </RadioButton.Group>
    </>
  );
};

export default Exam;

const styles = StyleSheet.create({});
