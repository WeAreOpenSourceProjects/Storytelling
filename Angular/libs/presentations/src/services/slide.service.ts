import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../apps/default/src/environments/environment';
import { Slide } from '../models/index';
import { Slides } from '../models/index';
import { selectUser, AuthenticationState } from '@labdat/authentication-state';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { filter } from 'rxjs/operators';
import { User } from '@labdat/data-models';

@Injectable()
export class SlideService {
  private _baseUrl: string;
  private slide: any = {};
  private user: any;
  private progress$;
  private progressObserver;
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
  confirmSlides(slide: Slide, id: any, idSlides: any): Observable<any> {
    const backendURL = `${this._baseUrl}/${environment.backend.endpoints.slides}/${idSlides}/slide/${id}`;
    return this.http.post(backendURL, slide).map((response: Response) => response.json());
  }

  getSlide(idSlides: any, id: any): Observable<any> {
    const backendURL = `${this._baseUrl}/${environment.backend.endpoints.slides}/${idSlides}`;
    return this.http.get(backendURL).map((response: Response) => {
      return response.json().slides[id - 1] ? response.json().slides[id - 1] : new Slide();
    });
  }
}
