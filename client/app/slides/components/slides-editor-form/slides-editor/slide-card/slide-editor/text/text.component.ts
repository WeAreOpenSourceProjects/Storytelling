import {Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnChanges} from '@angular/core';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit, AfterViewInit, OnChanges{
  @Input() text: any;
  @Input() event: any;
  @Input() currentIndex: any;
  @Input() BoxIndexToResize: any;
  @ViewChild('textContainer') textContainer: ElementRef;

  constructor() {

  }

  ngOnInit() {
      }

  ngAfterViewInit() {}
ngOnChanges() {
    if(this.textContainer.nativeElement.children[0] && this.currentIndex === this.BoxIndexToResize) {
      this.textContainer.nativeElement.children[0].firstChild.width = this.event.width ;
      this.textContainer.nativeElement.children[0].firstChild.height = this.event.height;
    }
  }
}
