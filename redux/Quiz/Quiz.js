const initstate = {
    quizOptions:[]
}


const QuizReducer = (state = initstate, action) => {
    switch(action.type){
        case 'ADDED':
            return {
                ...state,
                quizOptions: [...state.quizOptions, action.payload]
            }
        case 'DELETED':
            return {
                ...state,
                quizOptions: state.quizOptions.filter(item => item.id !== action.payload)
            }
        default:
            return state;


    }
}

export default QuizReducer;


