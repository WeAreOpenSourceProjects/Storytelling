import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class WindowResizeService {
  width$: Observable<number>;
  height$: Observable<number>;
  constructor() {
    let windowSize$ = createWindowSize$();
    this.width$ = (windowSize$.pluck('width') as Observable<number>).distinctUntilChanged();
    this.height$ = (windowSize$.pluck('height') as Observable<number>).distinctUntilChanged();
  }
}
const createWindowSize$ = () =>
  Observable.fromEvent(window, 'resize')
    .map(getWindowSize)
    .startWith(getWindowSize())
    .publishReplay(1)
    .refCount();

const getWindowSize = () => {
  return {
    height: window.innerHeight,
    width: window.innerWidth
  };
};
