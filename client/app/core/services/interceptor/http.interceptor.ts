import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { select } from '@angular-redux/store';
import { SessionActions } from 'app/core';


@Injectable()
export class InterceptedHttp extends Http {
    @select(['session', 'token']) Token$: Observable<boolean>;
    token = null;
    constructor(private backend: ConnectionBackend, private defaultOptions: RequestOptions,
        private router: Router, private actions: SessionActions) {
        super(backend, defaultOptions);
        this.Token$.subscribe(token => {
            this.token = token;
        });
    }


    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return super.request(url, this.setRequestOptionArgs(url, options))
            .catch<Response, Response>(err => this.handelErrorResponse(err, this.actions, this.router));
    }


    private setRequestOptionArgs(url: string | Request, options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }

        if (url instanceof Request) {
            options.headers = url.headers;
        } else if (options.headers == null) {
            options.headers = new Headers();
        }

        options.headers.append('Content-Type', 'application/json');
        if (this.token != null){
          options.headers.append('Authorization', 'JWT ' + this.token);
        }
        return options;
    }

    private handelErrorResponse(error: any, actions: SessionActions, router: Router): Observable<any> {
        switch (error.status) {
            case 400:
                router.navigate(['/bad-request']);
                return Observable.of();
            case 401:
                actions.logoutUser();
                router.navigate(['/']);
                return Observable.of();
            case 404:
                router.navigate(['/not-found']);
                return Observable.of();
        }
        return Observable.throw(error);
    }
}
