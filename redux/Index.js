import { combineReducers } from "redux";
import LoginReducer from "./LoginReducer/LoginReducer";
import StepReducer from "./Step/StepReducer";
import QuizReducer from "./Quiz/Quiz";



export const rootReducer = combineReducers({
    LoginReducer: LoginReducer,
    StepReducer: StepReducer,
    QuizReducer: QuizReducer
});


