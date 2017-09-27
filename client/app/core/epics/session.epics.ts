import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import { Action } from 'redux';
import { environment } from '../../../environments/environment';
import { IPayloadAction, SessionActions } from 'app/core';


@Injectable()
export class SessionEpics {
  _baseUrl : string ;

  constructor(private http: Http) {
              this._baseUrl = `${environment.backend.protocol}://${environment.backend.host}`;
        if (environment.backend.port) {
            this._baseUrl += `:${environment.backend.port}`;
        }
  }

  login = (action$: Observable<IPayloadAction>) => {
    return action$
      .filter<IPayloadAction>(({ type }) => type === SessionActions.LOGIN_USER)
      .mergeMap<IPayloadAction, IPayloadAction>(({ payload }) => {
        const backendURL = `${this._baseUrl}${environment.backend.endpoints.signin}` ;
        return this.http.post(backendURL, payload)
          .map<Response, IPayloadAction>(result => ({
            type: SessionActions.LOGIN_USER_SUCCESS,
            payload: result.json()
          }))
          .catch(err => Observable.of<IPayloadAction>({
              type: SessionActions.LOGIN_USER_ERROR,
              payload: { hasMessage: err.json().message }
            })
          );
        });
  }

  editProfile = (action$: Observable<IPayloadAction>) => {
    return action$
      .filter<IPayloadAction>(({ type }) => type === SessionActions.PUT_USER)
      .mergeMap<IPayloadAction, IPayloadAction>(({ payload }) => {
        const backendURL = `${this._baseUrl}${environment.backend.endpoints.users}` ;
        return this.http.put(backendURL, payload)
          .map<Response, IPayloadAction>(result => ({
            type: SessionActions.PUT_USER_SUCCESS,
            payload: {user : result.json()}
          }))
          .catch(err => Observable.of<IPayloadAction>({

              type: SessionActions.PUT_USER_ERROR,
              payload: { hasMessage: err.json().message }
            })
          );
        });
  }

  getProfile = (action$: Observable<IPayloadAction>) => {
    return action$
      .filter<IPayloadAction>(({ type }) => type === SessionActions.GET_USER)
      .mergeMap<IPayloadAction, IPayloadAction>(({ payload }) => {
        const backendURL = `${this._baseUrl}${environment.backend.endpoints.users}/me` ;
        return this.http.get(backendURL).timeout(10000)
          .map<Response, IPayloadAction>(result => ({
            type: SessionActions.GET_USER_SUCCESS,
            payload: result.json()
          }))
          .catch(err => Observable.of<IPayloadAction>({
            type: SessionActions.GET_USER_ERROR,
            payload: {type : 'echec', message: 'An error occurred'}
          }));
        });
  }

  changePassword = (action$: Observable<IPayloadAction>) => {
    return action$
      .filter<IPayloadAction>(({ type }) => type === SessionActions.CHANGE_PASSWORD)
      .mergeMap<IPayloadAction, IPayloadAction>(({ payload }) => {
        const backendURL = `${this._baseUrl}${environment.backend.endpoints.users}/password` ;
        return this.http.post(backendURL, payload)
          .map<Response, IPayloadAction>(result => ({
            type: SessionActions.CHANGE_PASSWORD_SUCCESS,
            payload: {type : 'success', message: result.json().message}
          }))
          .catch(err => Observable.of<IPayloadAction>({
            type: SessionActions.CHANGE_PASSWORD_ERROR,
            payload: {hasMessage: err.json().message}
          }));
      });
  }
}
