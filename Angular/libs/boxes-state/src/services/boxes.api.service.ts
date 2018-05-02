import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { selectUser, AuthenticationState } from '@labdat/authentication-state';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { filter } from 'rxjs/operators/filter';
import { User, Box } from '@labdat/data-models';
import { environment } from '../../../../apps/default/src/environments/environment';

@Injectable()
export class BoxesApiService {
  private _baseUrl: string;
  private boxes: any = {};
  private baseUrl: string;
  private endpoints: any;

  constructor(private http: HttpClient) {
    const { protocol, host, port, endpoints } = environment.backend;
    this.endpoints = endpoints;
    this.baseUrl = `${protocol}://${host}:${port}/${endpoints.basePath}`;
  }

  addBox(box: Box): Observable<any> {
    const backendURL = `${this.baseUrl}/${this.endpoints.boxes}`;
    return this.http.post(backendURL, box);
  }
  getAll(slideId): Observable<any> {
    const params: URLSearchParams = new URLSearchParams();
    const backendURL = `${this.baseUrl}/${slideId}/${this.endpoints.boxes}`;
    return this.http.get(backendURL);
  }

  getOne(id): Observable<any> {
    const backendURL = `${this.baseUrl}/${this.endpoints.boxes}/${id}`;
    return this.http.get(backendURL);
  }

  update(boxe, id): Observable<any> {
    const backendURL = `${this.baseUrl}/${this.endpoints.boxes}/${id}`;
    return this.http.patch(backendURL, boxe);
  }
  changeGridBackground(background) {
    const backendURL = `${this.baseUrl}/${this.endpoints.boxes}/background`;
    return this.http.post(backendURL, background);
  }
  delete(id): Observable<any> {
    console.log(id);
    const backendURL = `${this.baseUrl}/${environment.backend.endpoints.boxes}/${id}`;
    return this.http.delete(backendURL);
  }
  deleteImage(id): Observable<any> {
    const backendURL = `${this.baseUrl}/${environment.backend.endpoints.images}/${id}`;
    return this.http.delete(backendURL);
  }

  updateBox(box) {
    const backendURL = `${this.baseUrl}/${this.endpoints.boxes}/${box.id}`;
    return this.http.patch(backendURL, { changes: box.changes });
  }

  updateAll(boxes) {
    const backendURL = `${this.baseUrl}/${this.endpoints.boxes}`;
    return this.http.patch(backendURL, boxes);
  }
}
