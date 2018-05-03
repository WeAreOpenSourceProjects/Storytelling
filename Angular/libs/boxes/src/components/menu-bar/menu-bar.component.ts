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
  @Input() public isOpen: any;
  @Output() public addBox: EventEmitter<any> = new EventEmitter<any>();
  states=[];
  public isOpen$ = new Subject();
  constructor(el: ElementRef, public renderer: Renderer2) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.renderer.setStyle(this.el, 'left', this.left + 'px');
    this.renderer.setStyle(this.el, 'top', this.top + 'px');
    this.states = [
      {currentState:'animatedTop' , type:'chart' ,icon :'editor:ic_multiline_chart_24px'},
      {currentState:'animatedLeft' , type:'image' ,icon :'image:ic_collections_24px'},
      {currentState:'animatedRight' , type:'background' ,icon :'image:ic_filter_hdr_24px'},
      {currentState:'animatedBottom' , type:'text' ,icon :'content:ic_font_download_24px'},
      {currentState: 'normal' , type: false ,icon :'navigation:ic_close_24px' }
    ]
  }

  closeMenu() {
    for(let i=0; i<this.states.length; i++){
      this.states[i].currentState = 'close';
    }
    this.states[this.states.length-1].icon = 'navigation:ic_menu_24px';
  }

  open(type) {
    if(type){
      this.addBox.emit({ type, ...this.top, ...this.left });
    }
    this.closeMenu();
  }
}
