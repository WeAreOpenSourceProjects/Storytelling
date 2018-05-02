import * as fromAuthentication from '../actions/authentication-state.actions';
import { StatusState } from '../states/status.state';

const initialStatusState: StatusState = {
  loggedIn: false,
  user: null,
  tokenExpiresIn: null
};

export function statusReducer(state = initialStatusState, action: fromAuthentication.Actions): StatusState {
  switch (action.type) {
    case fromAuthentication.LOAD_USER:
    case fromAuthentication.REGISTER_SUCCESS:
    case fromAuthentication.RESET_PASSWORD_SUCCESS:
    case fromAuthentication.LOGIN_SUCCESS: {
      console.log(action.payload);
      return {
        ...state,
        loggedIn: true,
        user: action.payload.user,
        tokenExpiresIn: action.payload.tokenExpiresIn
      };
    }
    case fromAuthentication.LOGOUT: {
      return initialStatusState;
    }
    default: {
      return state;
    }
  }
}
