//ACTION TYPES
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'


const initialState = { authenticated: false, user_token:{} }


function authReducer(state = initialState, action) {
  let nextState
  
  switch (action.type) {
    case LOGIN:
      nextState = {
        ...state,
        authenticated: true,
        user_token: action.value,
      }
      return nextState
    case LOGOUT:
      nextState = {
        ...state,
        authenticated: false,
        user_token: {},
      }
      return nextState || state
    default:
      return state
  }
}

export default authReducer