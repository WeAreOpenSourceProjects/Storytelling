import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Slides } from '../models/index';
import { select } from '@angular-redux/store';
import { IUser } from '../../core/store/session';
@Injectable()
export class SlidesService {
    private _baseUrl: string;
    private slides: any = {};
    private user: any;
    private progress$;
    private progressObserver;
    private progress;
    @select(['session', 'user']) user$: Observable<IUser>;
    constructor(private http: Http) {
        this.progress$ = Observable.create(observer => {
            this.progressObserver = observer;
        }).share();
        this._baseUrl = `${environment.backend.protocol}://${environment.backend.host}`;
        if (environment.backend.port) {
            this._baseUrl += `:${environment.backend.port}`;
        };
        this.user$.subscribe(user => {
            this.user = {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles,
                email: user.email
            };
        });

    }
    me(): Observable<any> {
        const backendURL = `${this._baseUrl}${environment.backend.endpoints.users}/me`;
        return this.http.get(backendURL).map((response: Response) => response.json());
    }

    submitSlides(slides: Slides): Observable<any> {
        slides.slidesSetting.author = this.user.username;
        const backendURL = `${this._baseUrl}${environment.backend.endpoints.slides}`;
        return this.http.post(backendURL, slides).map((response: Response) => response.json());
    }
    getSlidesList(): Observable<any> {
        const params: URLSearchParams = new URLSearchParams();
        if (this.user != undefined)
            params.set('username', this.user.username);
        const backendURL = `${this._baseUrl}${environment.backend.endpoints.search}`;
        return this.http.get(backendURL, { search: params }).map((response: Response) => response.json());
    }
    getSlides(id): Observable<any> {
        const backendURL = `${this._baseUrl}${environment.backend.endpoints.slides}/${id}`;
        return this.http.get(backendURL).map((response: Response) => response.json());
    }

    updateSlide(slide, id): Observable<any> {
        const backendURL = `${this._baseUrl}${environment.backend.endpoints.slides}/${id}`;
        return this.http.put(backendURL, slide).map((response: Response) => response.json());
    }
    deleteSlides(id): Observable<any> {
        const backendURL = `${this._baseUrl}${environment.backend.endpoints.slides}/${id}`;
        return this.http.delete(backendURL).map((response: Response) => response.json());
    }
    getSlideToSearch(textToSearch): Observable<any> {
        const params: URLSearchParams = new URLSearchParams();
        params.set('title', textToSearch.title);
        params.set('state', textToSearch.filter);
        params.set('favorite', textToSearch.favorite);
        params.set('username', this.user.username);
        const backendURL = `${this._baseUrl}${environment.backend.endpoints.search}`;
        return this.http.get(backendURL, { params: params }).map((response: Response) => response.json());
    }
}
