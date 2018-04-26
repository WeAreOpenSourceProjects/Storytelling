import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  QueryList,
  ViewContainerRef,
  ElementRef,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ViewChildren
} from '@angular/core';

import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { GridsterItemComponent } from 'angular-gridster2/dist/gridsterItem.component';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import defaultConfig from './defalut-config';
import { MatDialog, MatDialogRef } from '@angular/material';
import { GraphComponent } from  '@labdat/charts';
import { TinyEditorComponent } from '@labdat/tiny-editor'
@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit{

@Input() boxes : any;
@Input() gridConfig : GridsterConfig;
@Input() presentationMode : Boolean = false;
@Input() editMode : Boolean = false;
@Input() editModeEditor$ : Observable<Boolean>;
@Input() background :any;
@Output () enableEditEvent : EventEmitter<any> = new EventEmitter<any>();
@Output () removeItemEvent : EventEmitter<any> = new EventEmitter<any>();
@Output () emptyCellClickCallbackEvent : EventEmitter<any> = new EventEmitter<any>();
@Output () textToSave : EventEmitter<any> = new EventEmitter<any>();
@Output() saveImage : EventEmitter<any>= new EventEmitter<any>();
public options : GridsterConfig;

@ViewChildren (TinyEditorComponent)
public editors;

@ViewChild('texteditor')
public texteditor;

@ViewChild('imageeditor')
public imageeditor;

@ViewChild('grapheditor')
public grapheditor;

@Output()
public outsideClick = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private element: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef){}

  ngOnInit(){
    const options = {
      ...this.gridConfig,
      ...defaultConfig,
      emptyCellClickCallback : this.emptyCellClick.bind(this),
      emptyCellContextMenuCallback : this.emptyCellContextMenu.bind(this)
    }
    this.options = options;
    if(this.background && this.background.image && !this.background.imagePreview){
      this.background.imagePreview = 'data:' + this.background.image.contentType +
      ';base64,' +this.arrayBufferToBase64(this.background.image.data.data);
    }
  }

  emptyCellContextMenu(event, item) {
    this.editMode = false;
    this.boxes.forEach(box => {
      box.editMode = false;      
    });
    for (var j=0; j<this.editors.toArray().length;j++) {
        this.editors.toArray()[j].setEditMode(false);
    }
    this.emptyCellClickCallbackEvent.emit({event, item})
  }
  changedOptions() {
    if (this.gridConfig.api && this.gridConfig.api.optionsChanged) {
      this.gridConfig.api.optionsChanged();
    }
  }
  saveText(text, index){

    this.textToSave.emit({text, index});
  }
  getTemplate(type){
    switch(type) {
      case 'text': return this.texteditor;
      case 'chart': return this.grapheditor;
      case 'image': return this.imageeditor;
    }
  }

  getImageId(event, index){
    console.log(event, index);
    this.saveImage.emit({id: event, index});
  }

  enableEdit (box, i){
    box.editMode = true;
    console.log(box)
    if(box.content.type==='text'){
      let acc = 0;
      for(let j=0; j<i ; j++){
        if(this.boxes[j].content.type === 'text')
          acc++;
      }
      this.editors.toArray()[acc].setEditMode(true);
      for (var j=0; j<this.editors.toArray().length;j++) {
        if(j !== acc)
          this.editors.toArray()[j].setEditMode(false);
      }
    } else {
      this.enableEditEvent.emit({box, i})
    }
  }
  emptyCellClick(event, item) {
    this.editMode = false;
    this.boxes.forEach(box => {
      box.editMode = false;      
    });
    this.outsideClick.emit();
    for (var i=0; i<this.editors.toArray().length;i++) {
      this.editors.toArray()[i].setEditMode(false);
    }

  }
  removeItem ($event, item){
    this.removeItemEvent.emit({$event, item})
  }

  arrayBufferToBase64(buffer) {
    var binary = '';
    /* eslint no-undef: 0 */
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  trackById(i, box){
     return box._id; 
  }

  getBackround(){
    return (this.background && this.background.imagePreview)?'url('+this.background.imagePreview +')': '';
  }
}
