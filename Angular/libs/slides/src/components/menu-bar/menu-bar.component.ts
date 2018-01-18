import { Component, OnInit, Renderer2, ElementRef, Input, Output, EventEmitter, HostListener} from '@angular/core';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
  @HostListener('document:click', ['$event']) clickedOutside($event){
   // here you can hide your menu
   this.isOpened = false;
 }
  isOpened: boolean =false;
  el: any;
  @Input() top: any;
  @Input() left: any;
  @Output() isOpen: EventEmitter<string> = new EventEmitter<string>();

  constructor(el: ElementRef, public renderer: Renderer2) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.isOpened = true;
    this.renderer.setStyle(this.el, 'left', this.left+'px');
    this.renderer.setStyle(this.el, 'top', this.top+'px');
  }
  closeMenu(){
    this.isOpened = false;
  }
  open(type){
    this.isOpen.emit(type);
  }
}
