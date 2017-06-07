import { Directive, HostListener, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from "rxjs";
@Directive({
    selector: '[appScroll]'
})
export class ScrollDirective implements OnInit {
    scrollPose: number = 1250; // scroll in same direction won't be triggered repeatedly inside <number> second
    private enableScroll: boolean = true;
    private delayDuration: number = 100;
    @Output() mouseWheelUp = new EventEmitter();
    @Output() mouseWheelDown = new EventEmitter();

    constructor() {
    }

    ngOnInit(){
        let events = Observable.fromEvent(window, 'mousewheel', (e) => e);
        let firstEventObservable = events.take(1);
        let remainingEventsObservable = events.skip(1).timeInterval()
                .filter(x => x.interval >= this.delayDuration)
                .map(x => x.value);
        let pageChangeObservable = firstEventObservable.concat(remainingEventsObservable);

        pageChangeObservable.subscribe(e => this.mouseWheelFunc(e));
    }
    // @HostListener('mousewheel', ['$event'])
    // private onMouseWheelChrome(event: any) {
    //     console.log('event => ', event);
    //     Observable.of(event)
    //         .do(console.log)
    //         .debounceTime(30)
    //         .map(this.mouseWheelFunc);
    //     // this.mouseWheelFunc(event);
    
    // }

    @HostListener('DOMMouseScroll', ['$event'])
    private onMouseWheelFirefox(event: any) {
        this.mouseWheelFunc(event);
    }

    @HostListener('onmousewheel', ['$event'])
    private onMouseWheelIE(event: any) {
        this.mouseWheelFunc(event);
    }

    private mouseWheelFunc(event: any) {
        //  if (!this.enableScroll) return;
        var event = window.event || event; // old IE support
        // for IE
        event.returnValue = false;
        // for Chrome and Firefox
        if (event.preventDefault) {
            event.preventDefault();
        }
        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
        if (delta > 0) {
            this.mouseWheelUp.emit();
        } else if (delta < 0) {
            this.mouseWheelDown.emit();
        }
    }
}
