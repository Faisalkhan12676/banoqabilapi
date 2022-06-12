const stepOne = {
    stepOne: true,
}


const stepTwo = {
    stepTwo: false,
}

const StepReducer = (state = stepOne, action) => {
    switch (action.type) {
        case 'STEP_ONE':
            return {
                ...state,
                stepOne: false,
            };
        case 'STEP_TWO':
            return {
                ...state,
                stepTwo: true,
            };
        default:
            return state;
    }
}

export default StepReducer;
