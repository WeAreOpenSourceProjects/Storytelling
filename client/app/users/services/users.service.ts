import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from "rxjs";

import { User } from '../models/index';
import { environment } from "../../../environments/environment";
const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class UsersService {

    private _baseUrl : string;
    constructor(private http: Http) {
       // build backend base url
        this._baseUrl = `${environment.backend.protocol}://${environment.backend.host}`;
        if (environment.backend.port) {
            this._baseUrl += `:${environment.backend.port}`;
        }
    }
    signup(user: User): Observable<any> {
        let backendURL = `${this._baseUrl}${environment.backend.endpoints.signup}` ;
        return this.http.post(backendURL, user).map((response: Response) => response.json());
    }


    getProfile (): Observable<any> {
      let backendURL = `${this._baseUrl}${environment.backend.endpoints.users}/me` ;
      return this.http.get(backendURL).map((response: Response) => response.json());
    }
    editProfile(user):Observable<any>{
      let backendURL = `${this._baseUrl}${environment.backend.endpoints.users}` ;
      return this.http.put(backendURL, user).map((response: Response) => response.json());
    }
    getUsers():Observable<any>{
      let backendURL = `${this._baseUrl}${environment.backend.endpoints.users}` ;
      return this.http.get(backendURL).map((response: Response) => response.json());
    }
}
