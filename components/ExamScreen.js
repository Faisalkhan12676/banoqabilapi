import {React, useState, useEffect} from 'react';
import axios from 'axios';

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

const ExamScreenx = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setquestions] = useState([]);
  const [answers, setanswers] = useState([]);

  const getQuestion = async () => {
    // await axios({
    //     method: 'get',
    //     url: `https://banoqabil.azurewebsites.net/api/ExamQuestion/GetAll`,
    //     header: {
    //         'Content-Type': 'application/json',
    //     },
    // }).then((response) => {
    //     console.log(response.data);
    //     setquestions(response.data)
    // })
    console.log(json);
    setquestions(json);
  };

  useEffect(() => {
    getQuestion();
  }, []);

  const handelRadio = (e, questionId, optId, questionType) => {
    let temp = answers;
    let isGotUpdated = false;
    let insertRadioObj = {
      examTypeId: questions[0].examTypeId,
      id: questionId,
      'questionType:': questionType,
      answer1: optId === 'answer1' ? e.target.value : null,
      answer2: optId === 'answer2' ? e.target.value : null,
      answer3: optId === 'answer3' ? e.target.value : null,
      answer4: optId === 'answer4' ? e.target.value : null,
    };

    temp.forEach((element, index, array) => {
      if (element.id == questionId) {
        array[index] = insertRadioObj;
        isGotUpdated = true;
      }
    });
    if (!isGotUpdated) {
      temp.push(insertRadioObj);
    }

    setanswers(temp);
    console.log(answers);
    setQuestionIndex(questionIndex + 1);
    setTimeout(() => {
      setQuestionIndex(questionIndex);
    }, 1);
  };

  const radioCheck = (answervar, questionvar, getQuestionId) => {
    let returnForCheck = false;
    answers.forEach((element, index, array) => {
      if (element[answervar] == questionvar && element.id == getQuestionId) {
        returnForCheck = true;
      }
    });

    return returnForCheck;
  };

  const RadioButton = props => {
    return props.isCheckedValue === true ? (
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          value={props.value}
          onChange={e => props.onChangeFunction(e)}
          name={props.name}
          id={props.id}
          checked
        />
        <label className="form-check-label" htmlFor={props.id}>
          {props.innerString}
        </label>
      </div>
    ) : (
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          value={props.value}
          onChange={e => props.onChangeFunction(e)}
          name={props.name}
          id={props.id}
        />
        <label className="form-check-label" htmlFor={props.id}>
          {props.innerString}
        </label>
      </div>
    );
  };

  const handelCheckBox = (e, questionId, optId, questionType) => {
    let temp = answers;
    let isGotUpdated = false;
    let insertRadioObj = {
      examTypeId: questions[0].examTypeId,
      id: questionId,
      'questionType:': questionType,
      answer1: optId === 'answer1' ? e.target.value : null,
      answer2: optId === 'answer2' ? e.target.value : null,
      answer3: optId === 'answer3' ? e.target.value : null,
      answer4: optId === 'answer4' ? e.target.value : null,
    };

    console.log(e);

    temp.forEach((element, index, array) => {
      if (element.id == questionId) {
        element[optId] = e.target.checked == true ? e.target.value : null;
        array[index] = element;
        isGotUpdated = true;
      }
    });
    if (!isGotUpdated) {
      temp.push(insertRadioObj);
    }

    setanswers(temp);
    console.log(answers);

    setQuestionIndex(questionIndex + 1);
    setTimeout(() => {
      setQuestionIndex(questionIndex);
    }, 1);
  };

  const ChecBoxCheck = (answervar, questionvar, getQuestionId) => {
    let returnForCheck = false;
    answers.forEach((element, index, array) => {
      if (element[answervar] == questionvar && element.id == getQuestionId) {
        returnForCheck = true;
      }
    });

    return returnForCheck;
  };

  const CheckBox = props => {
    return props.isCheckedValue === true ? (
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value={props.value}
          onChange={e => props.onChangeFunction(e, this)}
          name={props.name}
          id={props.id}
          checked
        />
        <label className="form-check-label" id={props.id}>
          {props.innerString}
        </label>
      </div>
    ) : (
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value={props.value}
          onChange={e => props.onChangeFunction(e, this)}
          name={props.name}
          id={props.id}
        />
        <label className="form-check-label" id={props.id}>
          {props.innerString}
        </label>
      </div>
    );
  };
  return (
    <>
      {
        <div className="card col-12 px-0">
          <div className="card-header p-4">
            Question {questions.length + ' / ' + parseInt(questionIndex + 1)}
          </div>
          <div className="card-body">
            <div
              className="d-flex flex-column p-3"
              style={{minHeight: '350px'}}>
              <h5 className="card-title">
                {questions[questionIndex]?.question}
              </h5>

              {questions[questionIndex]?.questionType == 'radio' && (
                <div className=" pt-4">
                  {questions[questionIndex]?.option1 != null && (
                    <RadioButton
                      value={questions[questionIndex]?.option1}
                      onChangeFunction={e =>
                        handelRadio(
                          e,
                          questions[questionIndex]?.id,
                          'answer1',
                          questions[questionIndex]?.questionType,
                        )
                      }
                      innerString={questions[questionIndex]?.option1}
                      isCheckedValue={radioCheck(
                        'answer1',
                        questions[questionIndex]?.option1,
                        questions[questionIndex]?.id,
                      )}
                      name="flexRadioDefault"
                      id="labelid1"
                    />
                  )}
                  {questions[questionIndex]?.option2 != null && (
                    <RadioButton
                      value={questions[questionIndex]?.option2}
                      onChangeFunction={e =>
                        handelRadio(
                          e,
                          questions[questionIndex]?.id,
                          'answer2',
                          questions[questionIndex]?.questionType,
                        )
                      }
                      innerString={questions[questionIndex]?.option2}
                      isCheckedValue={radioCheck(
                        'answer2',
                        questions[questionIndex]?.option2,
                        questions[questionIndex]?.id,
                      )}
                      name="flexRadioDefault"
                      id="labelid2"
                    />
                  )}
                  {questions[questionIndex]?.option3 != null && (
                    <RadioButton
                      value={questions[questionIndex]?.option3}
                      onChangeFunction={e =>
                        handelRadio(
                          e,
                          questions[questionIndex]?.id,
                          'answer3',
                          questions[questionIndex]?.questionType,
                        )
                      }
                      innerString={questions[questionIndex]?.option3}
                      isCheckedValue={radioCheck(
                        'answer3',
                        questions[questionIndex]?.option3,
                        questions[questionIndex]?.id,
                      )}
                      name="flexRadioDefault"
                      id="labelid3"
                    />
                  )}
                  {questions[questionIndex]?.option4 != null && (
                    <RadioButton
                      value={questions[questionIndex]?.option4}
                      onChangeFunction={e =>
                        handelRadio(
                          e,
                          questions[questionIndex]?.id,
                          'answer4',
                          questions[questionIndex]?.questionType,
                        )
                      }
                      innerString={questions[questionIndex]?.option4}
                      isCheckedValue={radioCheck(
                        'answer4',
                        questions[questionIndex]?.option4,
                        questions[questionIndex]?.id,
                      )}
                      name="flexRadioDefault"
                      id="labelid4"
                    />
                  )}
                </div>
              )}
              {questions[questionIndex]?.questionType == 'checkbox' && (
                <div className=" pt-4">
                  {questions[questionIndex]?.option1 != null && (
                    <CheckBox
                      value={questions[questionIndex]?.option1}
                      onChangeFunction={(e, thisget) =>
                        handelCheckBox(
                          e,
                          questions[questionIndex]?.id,
                          'answer1',
                          questions[questionIndex]?.questionType,
                          thisget,
                        )
                      }
                      innerString={questions[questionIndex]?.option1}
                      isCheckedValue={ChecBoxCheck(
                        'answer1',
                        questions[questionIndex]?.option1,
                        questions[questionIndex]?.id,
                      )}
                      name="flexRadioDefault"
                      id="checkboxid1"
                    />
                  )}
                  {questions[questionIndex]?.option2 != null && (
                    <CheckBox
                      value={questions[questionIndex]?.option2}
                      onChangeFunction={(e, thisget) =>
                        handelCheckBox(
                          e,
                          questions[questionIndex]?.id,
                          'answer2',
                          questions[questionIndex]?.questionType,
                          thisget,
                        )
                      }
                      innerString={questions[questionIndex]?.option2}
                      isCheckedValue={ChecBoxCheck(
                        'answer2',
                        questions[questionIndex]?.option2,
                        questions[questionIndex]?.id,
                      )}
                      name="flexRadioDefault"
                      id="checkboxid2"
                    />
                  )}
                  {questions[questionIndex]?.option3 != null && (
                    <CheckBox
                      value={questions[questionIndex]?.option3}
                      onChangeFunction={(e, thisget) =>
                        handelCheckBox(
                          e,
                          questions[questionIndex]?.id,
                          'answer3',
                          questions[questionIndex]?.questionType,
                          thisget,
                        )
                      }
                      innerString={questions[questionIndex]?.option3}
                      isCheckedValue={ChecBoxCheck(
                        'answer3',
                        questions[questionIndex]?.option3,
                        questions[questionIndex]?.id,
                      )}
                      name="flexRadioDefault"
                      id="checkboxid3"
                    />
                  )}
                  {questions[questionIndex]?.option4 != null && (
                    <CheckBox
                      value={questions[questionIndex]?.option4}
                      onChangeFunction={(e, thisget) =>
                        handelCheckBox(
                          e,
                          questions[questionIndex]?.id,
                          'answer4',
                          questions[questionIndex]?.questionType,
                          thisget,
                        )
                      }
                      innerString={questions[questionIndex]?.option4}
                      isCheckedValue={ChecBoxCheck(
                        'answer4',
                        questions[questionIndex]?.option4,
                        questions[questionIndex]?.id,
                      )}
                      name="flexRadioDefault"
                      id="checkboxid4"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="d-flex w-100 justify-content-end card-footer py-3">
            <div>
              {questionIndex > 0 && (
                <button
                  onClick={() => setQuestionIndex(questionIndex - 1)}
                  className="btn btn-primary me-2">
                  Previous
                </button>
              )}
            </div>
            <div>
              {questionIndex < questions.length - 1 ? (
                <button
                  onClick={() => setQuestionIndex(questionIndex + 1)}
                  className="btn btn-primary ">
                  Next
                </button>
              ) : (
                <button
                  onClick={() => alert('Result Console may check karlo')}
                  className="btn btn-warning ">
                  Check Result{' '}
                </button>
              )}
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default ExamScreenx;
