import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
  query
} from '@angular/animations';
@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  animations: [
    trigger('changeState', [
      state('normal', style({
        backgroundColor: 'red',
        transform: 'scale(1)'
      })),
      state('animatedRight', style({
        backgroundColor: '#00acc1',
        transform: 'translateX(150%)'
      })),
      state('animatedBottom', style({
        backgroundColor: '#00acc1',
        transform: 'translateY(150%)'
      })),
      state('animatedLeft', style({
        backgroundColor: '#00acc1',
        transform: 'translateX(-150%)'
      })),
      state('animatedTop', style({
        backgroundColor: '#00acc1',
        transform: 'translateY(-150%)'
      })),
      state('close', style({
        backgroundColor: '#00acc1',
        transform: 'translate(0%)',
        display : 'none'
      })),
      transition('*=>normal', animate('800ms')),
      transition('*=>*', animate('200ms')),
      transition('*=>close', animate('500ms'))
    ])
  ]
})
export class MenuItemComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
  @Input() currentState;
  @Input() icon;
}
