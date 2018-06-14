import { Injectable } from '@angular/core';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {pluck, publishReplay, startWith, refCount } from 'rxjs/operators';

import  'rxjs/add/observable/fromEvent'
@Injectable()
export class WindowResizeService {
  width$: Observable<number>;
  height$: Observable<number>;
  constructor() {
    let windowSize$ = createWindowSize$();
    this.width$ = (windowSize$.pipe(pluck('width')) as Observable<number>).pipe(distinctUntilChanged());
    this.height$ = (windowSize$.pipe(pluck('height')) as Observable<number>).pipe(distinctUntilChanged());
  }
}
const createWindowSize$ = () =>
  Observable.fromEvent(window, 'resize')
    .map(getWindowSize)
    .pipe(startWith(getWindowSize()), publishReplay(1))
    .pipe(refCount());

const getWindowSize = () => {
  return {
    height: window.innerHeight,
    width: window.innerWidth
  };
};
