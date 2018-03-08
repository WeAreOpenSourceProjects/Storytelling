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
@Input () editMode: Boolean = false;
@Input() presentationMode : Boolean = false;
@Input() editModeEditor$ : Observable<Boolean>;
@Output () enableEditEvent : EventEmitter<any> = new EventEmitter<any>();
@Output () removeItemEvent : EventEmitter<any> = new EventEmitter<any>();
@Output () emptyCellClickCallbackEvent : EventEmitter<any> = new EventEmitter<any>();

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

private dynamicComponent = [];
private dynamicBoxes = []

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
    console.log(this.options);
  }

  emptyCellContextMenu(event, item) {
    this.editMode = false;
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

  getTemplate(type){
    switch(type) {
      case 'text': return this.texteditor;
      case 'chart': return this.grapheditor;
      case 'image': return this.imageeditor;
    }
  }


  enableEdit (box, i){
    this.editMode = true;
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
          console.log(this.editors.toArray())
      }
    } else {
      this.enableEditEvent.emit({box, i})
    }
  }
  emptyCellClick(event, item) {
    this.editMode = false;
    console.log('????')
    this.outsideClick.emit();
    for (var i=0; i<this.editors.toArray().length;i++) {
      this.editors.toArray()[i].setEditMode(false);
    }

    // for (var i in this.dynamicComponent) {
    //   this.dynamicComponent[i].setEditMode(false);
    // }
  }
  removeItem ($event, item){
    console.log(item);
    this.removeItemEvent.emit({$event, item})
  }
}
