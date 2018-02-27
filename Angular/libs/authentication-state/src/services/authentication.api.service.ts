import { Injectable, Inject } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { User, Authenticate } from '@labdat/data-models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../apps/default/src/environments/environment';
import { map } from 'rxjs/operators/map';

@Injectable()
export class AuthenticationApiService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    const { protocol, host, port, endpoints } = environment.backend;
    this.baseUrl = `${protocol}://${host}:${port}/${endpoints.basePath}`;
  }

  login({ email, password }: Authenticate) {
    return this.http.post(
      `${this.baseUrl}/auth/signin`,
      { usernameOrEmail: email, password },
      { withCredentials: true }
    );
  }

  register(registration: any) {
    return this.http.post(`${this.baseUrl}/auth/signup`, registration);
    //      .do(token => this.setAuthorizationHeader(token));
  }
  forgetPassword(email: any) {
    const backendURL = `${this.baseUrl}/auth/forgot` ;
    return this.http.post(backendURL, email);
  }
  resetPassword(auth) {
    const backendURL = `${this.baseUrl}/auth/reset/${auth.token}` ;
    return this.http.post(backendURL, auth.password);
  }
}
