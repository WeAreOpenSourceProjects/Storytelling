import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../apps/default/src/environments/environment';
import { Slides } from '../models/index';
import { selectUser, AuthenticationState } from '@labdat/authentication-state';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { filter } from 'rxjs/operators';
import { User } from '@labdat/data-models';

@Injectable()
export class SlidesService {
  private _baseUrl: string;
  private slides: any = {};
  private user: any;
  private progress$;
  private progressObserver;
  private progress;
  //    @select(['session', 'user']) user$: Observable<IUser>;
  public user$ = this.store.select(selectUser).pipe(filter(user => !isEmpty(user)));

  constructor(private http: Http, private store: Store<AuthenticationState>) {
    this.progress$ = Observable.create(observer => {
      this.progressObserver = observer;
    }).share();
    const { protocol, host, port, endpoints } = environment.backend;
    this._baseUrl = `${protocol}://${host}:${port}/${endpoints.basePath}`;
    this.user$.subscribe((user: User) => {
      this.user = {
        username: user.firstName + user.lastName,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        email: user.email
      };
    });
  }
  me(): Observable<any> {
    const backendURL = `${this._baseUrl}/${environment.backend.endpoints.users}/me`;
    return this.http.get(backendURL).map((response: Response) => response.json());
  }

  submitSlides(slides: Slides): Observable<any> {
    slides.slidesSetting.author = this.user.username;
    const backendURL = `${this._baseUrl}/${environment.backend.endpoints.slides}`;
    return this.http.post(backendURL, slides).map((response: Response) => response.json());
  }
  getSlidesList(pageIndex, pageSize): Observable<any> {
    const params: URLSearchParams = new URLSearchParams();
    if (this.user !== undefined) params.set('username', this.user.username);
    params.set('pageIndex', pageIndex);
    params.set('pageSize', pageSize);

    const backendURL = `${this._baseUrl}/${environment.backend.endpoints.search}`;
    return this.http
      .get(backendURL, { search: params })
      .map((response: Response) => response.json())
      .take(1);
  }
  getSlides(id): Observable<any> {
    const backendURL = `${this._baseUrl}/${environment.backend.endpoints.slides}/${id}`;
    return this.http.get(backendURL).map((response: Response) => response.json());
  }

  updateSlide(slide, id): Observable<any> {
    const backendURL = `${this._baseUrl}/${environment.backend.endpoints.slides}/${id}`;
    return this.http.put(backendURL, slide).map((response: Response) => response.json());
  }
  deleteSlides(id): Observable<any> {
    const backendURL = `${this._baseUrl}/${environment.backend.endpoints.slides}/${id}`;
    return this.http.delete(backendURL).map((response: Response) => response.json());
  }
  getSlideToSearch(textToSearch, pageIndex, pageSize): Observable<any> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('title', textToSearch.title);
    params.set('state', textToSearch.filter);
    params.set('favorite', textToSearch.favorite);
    params.set('username', this.user.username);
    params.set('email', this.user.email);
    params.set('pageIndex', pageIndex);
    params.set('pageSize', pageSize);
    params.set('order', textToSearch.order);
    const backendURL = `${this._baseUrl}/${environment.backend.endpoints.search}`;
    return this.http.get(backendURL, { params: params }).map((response: Response) => response.json());
  }
}
