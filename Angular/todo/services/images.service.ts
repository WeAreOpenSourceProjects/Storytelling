import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../apps/default/src/environments/environment';
@Injectable()
export class ImagesService {
  private _baseUrl: string;
  private progress$;
  private progressObserver;
  private progress;

  constructor(private http: Http) {
    this.progress$ = Observable.create(observer => {
      this.progressObserver = observer;
    }).share();
    const { protocol, host, port, endpoints } = environment.backend;
    this._baseUrl = `${protocol}://${host}:${port}/${endpoints.basePath}`;
  }

  getImage(id): Observable<any> {
    const backendURL = `${this._baseUrl}/${environment.backend.endpoints.images}/${id}`;
    return this.http.get(backendURL).map((response: Response) => response.json());
  }
  uploadImage(img) {
    return Observable.create(observer => {
      const backendURL = `${this._baseUrl}/${environment.backend.endpoints.images}`;
      let xhr: XMLHttpRequest = new XMLHttpRequest();
      let formData: any = new FormData();
      formData.append('file', img);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };

      xhr.upload.onprogress = event => {
        this.progress = Math.round(event.loaded / event.total * 100);
        //  this.progressObserver.next(this.progress);
      };

      xhr.open('POST', backendURL, true);
      xhr.send(formData);
    });
  }
}
