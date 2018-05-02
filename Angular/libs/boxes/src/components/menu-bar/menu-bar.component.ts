import { Component, OnInit, Renderer2, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
})
export class MenuBarComponent implements OnInit {
  el: any;
  @Input() top: any;
  @Input() left: any;
  @Output() public isOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public addBox: EventEmitter<any> = new EventEmitter<any>();
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
    this.addBox.emit({ type, ...this.top, ...this.left });
  }
}
