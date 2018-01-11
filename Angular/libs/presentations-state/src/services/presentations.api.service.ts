import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { Presentation } from '@labdat/data-models';
import { selectUser, AuthenticationState } from '@labdat/authentication-state';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { filter } from 'rxjs/operators/filter';
import { User } from '@labdat/data-models';
import { environment } from '../../../../apps/default/src/environments/environment'

@Injectable()
export class PresentationsApiService {
  private _baseUrl: string;
  private presentations: any = {};
  private user: any;
  private progress$;
  private progressObserver;
  private progress;
  private baseUrl: string;
  private endpoints: any;
  public user$ = this.store.select(selectUser).pipe(filter(user => !isEmpty(user)));

  constructor(private http: HttpClient, private store: Store<AuthenticationState>) {
    this.progress$ = Observable.create(observer => {
      this.progressObserver = observer;
    }).share();
    this.user$.subscribe((user: User) => {
      this.user = {
        username: user.firstName + user.lastName,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        email: user.email
      };
    });
    const { protocol, host, port, endpoints } = environment.backend;
    this.endpoints = endpoints;
    this.baseUrl = `${protocol}://${host}:${port}/${endpoints.basePath}`;
  }

  me(): Observable<any> {
    const backendURL = `${this.baseUrl}/${this.endpoints.users}/me`;
    return this.http.get(backendURL));
  }

  add(presentation: Presentation): Observable<any> {
    presentation.author = this.user.username;
    const backendURL = `${this._baseUrl}/${environment.backend.endpoints.presentations}`;
    return this.http.post(backendURL, presentation);
  }

  getAll(pageIndex, pageSize): Observable<any> {
    const params: URLSearchParams = new URLSearchParams();
    if (this.user !== undefined) params.set('username', this.user.username);
    params.set('pageIndex', pageIndex);
    params.set('pageSize', pageSize);
    const backendURL = `${this.baseUrl}/${this.endpoints.presentations}`;
    return this.http
//      .get(backendURL, { search: params })
      .get(backendURL)
  }

  getOne(id): Observable<any> {
    const backendURL = `${this.baseUrl}/${this.endpoints.presentations}/${id}`;
    return this.http.get(backendURL).map((response: Response) => response.json());
  }

  update(presentation, id): Observable<any> {
    const backendURL = `${this.baseUrl}/${this.endpoints.presentations}/${id}`;
    return this.http.put(backendURL, presentation).map((response: Response) => response.json());
  }

  delete(id): Observable<any> {
    const backendURL = `${this._baseUrl}/${environment.backend.endpoints.presentations}/${id}`;
    return this.http.delete(backendURL).map((response: Response) => response.json());
  }
  getPresentationToSearch(textToSearch, pageIndex, pageSize): Observable<any> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('title', textToSearch.title);
    params.set('state', textToSearch.filter);
    params.set('favorite', textToSearch.favorite);
    params.set('username', this.user.username);
    params.set('email', this.user.email);
    params.set('pageIndex', pageIndex);
    params.set('pageSize', pageSize);
    params.set('order', textToSearch.order);
    const backendURL = `${this.baseUrl}/${this.endpoints.search}`;
    return this.http.get(backendURL, { params: params }).map((response: Response) => response.json());
  }
}
