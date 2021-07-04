//ACTION TYPES
export const SUBMIT = 'SUBMIT'


const initialState = { serverAddress: '127.0.0.1:3000' }


function configReducer(state = initialState, action) {
    let nextState

    switch (action.type) {
        case SUBMIT:
            nextState = {
                ...state,
                serverAddress: action.value,
            }
            return nextState
        default:
            return state
    }
}

export default configReducer