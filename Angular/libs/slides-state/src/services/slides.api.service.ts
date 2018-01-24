import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { Slide } from '@labdat/data-models';
import { selectUser, AuthenticationState } from '@labdat/authentication-state';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { User } from '@labdat/data-models';
import { environment } from '../../../../apps/default/src/environments/environment'

@Injectable()
export class SlidesApiService {
  private baseUrl: string;
  private endpoints: any;

  constructor(private http: HttpClient, private store: Store<AuthenticationState>) {
    const { protocol, host, port, endpoints } = environment.backend;
    this.endpoints = endpoints;
    this.baseUrl = `${protocol}://${host}:${port}/${endpoints.basePath}`;
  }

  getPresentationSlides(presentationId): Observable<any> {
    const backendURL = `${this.baseUrl}/slides/presentation/${presentationId}`;
    return this.http.get(backendURL)
    .pipe(map((slides: Slide[]) => slides.map(slide => ({...slide, id: slide._id}))));
  }

  add(slide: Slide): Observable<any> {
    const backendURL = `${this.baseUrl}/slides`;
    return this.http.post(backendURL, slide).pipe(map((slide: Slide) => ({ ...slide, id: slide._id })));
  }

  reorder(presentationId, slideIds): Observable<any> {
    const backendURL = `${this.baseUrl}/presentations/${presentationId}`;
    return this.http.patch(backendURL, { slideIds });
  }

  delete(slideId: string): Observable<any> {
    const backendURL = `${this.baseUrl}/slides/${slideId}`;
    return this.http.delete(backendURL).pipe(map((slide: Slide) => ({...slide, id: slide._id})));
  }
  getAllBoxes(id): Observable<any> {
    const params: URLSearchParams = new URLSearchParams();
    const backendURL = `${this.baseUrl}/slides/${id}`;
    return this.http.get(backendURL);
  }
}
