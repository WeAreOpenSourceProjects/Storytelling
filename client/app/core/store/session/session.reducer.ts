import {actionTypes} from 'redux-localstorage'
import { SessionActions, IPayloadAction } from '../../actions/session.actions';
import { ISessionRecord } from './session.types';
import {
  INITIAL_STATE,
  INITIAL_USER_STATE,
  UserFactory,
} from './session.initial-state';

export const sessionReducer = (
  state: ISessionRecord = INITIAL_STATE,
  action: IPayloadAction) => {
  switch (action.type) {
    case SessionActions.LOGIN_USER:
      return state.merge({
        token: null,
        user: UserFactory(),
        hasError: false,
        isLoading: true
      });

    case SessionActions.LOGIN_USER_SUCCESS:

      return state.merge({
        token: action.payload.token,
        user: UserFactory(action.payload.user),
        hasError: false,
        isLoading: false,
        hasMessage :null,
        actionType : action.type
      });

    case SessionActions.LOGIN_USER_ERROR:
      return state.merge({
        token: null,
        user: UserFactory(),
        hasError: true,
        isLoading: false,
        hasMessage : action.payload.hasMessage,
        actionType : action.type
      });

    case SessionActions.LOGOUT_USER:
      return state.merge({
        token: null,
        user: UserFactory(),
        hasError: false,
        isLoading: false,
        hasMessage : null,
        actionType : null
      });

    case actionTypes.INIT:
      const persistedState = action.payload;
      if (persistedState) {
        return state.merge({
          token: persistedState.session.token,
          user: UserFactory(persistedState.session.user),
          hasError: persistedState.session.hasError,
          isLoading: persistedState.session.isLoading,
        });
      }
      case SessionActions.PUT_USER :
       {
        return state.merge({
          hasMessage: null,
          hasError: false,
          isLoading: true
        });
      }
        case SessionActions.PUT_USER_SUCCESS:
          return state.merge({
            user: UserFactory(action.payload.user),
            hasMessage : action.payload.hasMessage,
            hasError: false,
            isLoading: false,
            actionType : action.type
          });

        case SessionActions.PUT_USER_ERROR:
          return state.merge({
            hasError: true,
            isLoading: false,
            hasMessage: action.payload.hasMessage,
            actionType : action.type
        });

        case SessionActions.GET_USER:
          return state.merge({
            hasError: false,
            isLoading: false,
            hasMessage:null
        });
        case SessionActions.GET_USER_SUCCESS:
          return state.merge({
            user: UserFactory(action.payload),
            hasError: false,
            isLoading: false,
            hasMessage:null
        });
        case SessionActions.GET_USER_ERROR:
          return state.merge({
            token: null,
            user: UserFactory(),
            hasError: true,
            isLoading: false,
            hasMessage:null,
        });

        case SessionActions.CHANGE_PASSWORD:
          return state.merge({
            hasError: false,
            isLoading: false,
            hasMessage:null,
            actionType : action.type
        });
        case SessionActions.CHANGE_PASSWORD_SUCCESS:
          return state.merge({
            hasMessage : action.payload.hasMessage,
            hasError: false,
            isLoading: false,
            actionType : action.type
          });
          case SessionActions.CHANGE_PASSWORD_ERROR:
            return state.merge({
              hasMessage : action.payload.hasMessage,
              hasError: true,
              isLoading: false,
              actionType : action.type
            });
    default:
      return state.merge({
        hasMessage: null,
        hasError: false,
        isLoading: false,
      });
  }
}
