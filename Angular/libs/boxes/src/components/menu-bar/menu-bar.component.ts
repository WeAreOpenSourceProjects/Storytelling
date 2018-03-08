import { Component, OnInit, Renderer2, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css'],
  animations: [
    trigger('flyInOut', [
      transition('void => *', [style({ opacity: 0 }), animate(200, style({ opacity: 1 }))]),
      transition('* => void', [animate(200, style({ opacity: 0 }))])
    ])
  ]
})
export class MenuBarComponent implements OnInit {

  el: any;
  @Input() top: any;
  @Input() left: any;

  @Output() public isOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isOpen$ = new Subject();

  constructor(el: ElementRef, public renderer: Renderer2) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.renderer.setStyle(this.el, 'left', this.left + 'px');
    this.renderer.setStyle(this.el, 'top', this.top + 'px');
  }
  closeMenu() {
    this.isOpen.emit(false);
  }
  open(type) {
    this.isOpen.emit(type);
    this.isOpen$.next(type);
  }
}
