import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  ViewContainerRef
} from '@angular/core';

import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { GridsterItemComponent } from 'angular-gridster2/dist/gridsterItem.component';
import { Observer } from 'rxjs/Observer';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit{

public gridConfig;
@Input() boxes$ : Observer<any>;
@Input() visible$ : Observer<string>;
@Input() draggable$ : Observer<boolean>;
@Input () editMode$ : Observer<boolean>;
@Input () presentationMode$ : Observer<boolean>
@Output () emptyCellClick$ : Observer<any>;
@Output () emptyCellContextMenu$ : Observer<any>;

@ViewChildren('texteditor', { read: ViewContainerRef })
public texteditor: QueryList<ViewContainerRef>;
@ViewChildren('imageeditor', { read: ViewContainerRef })
public imageeditor: QueryList<ViewContainerRef>;
@ViewChildren('grapheditor', { read: ViewContainerRef })
public grapheditor: QueryList<ViewContainerRef>;

ngOnInit(){
  this.gridConfig = {
    gridType: 'fit',
    compactType: 'none',
    margin: 1,
    outerMargin: true,
    mobileBreakpoint: 640,
    minCols: 30,
    maxCols: 50,
    minRows: 30,
    maxRows: 50,
    maxItemCols: 100,
    minItemCols: 1,
    maxItemRows: 100,
    minItemRows: 1,
    maxItemArea: 2500,
    minItemArea: 1,
    defaultItemCols: 1,
    defaultItemRows: 1,
    fixedColWidth: 25,
    fixedRowHeight: 25,
    keepFixedHeightInMobile: false,
    keepFixedWidthInMobile: false,
    scrollSensitivity: 10,
    scrollSpeed: 20,
    enableEmptyCellClick: true,
    enableEmptyCellContextMenu: true,
    enableEmptyCellDrop: false,
    enableEmptyCellDrag: false,
    emptyCellClickCallback: this.emptyCellClick.bind(this),
    // emptyCellContextMenuCallback: this.emptyCellContextMenu$.bind(this),
    emptyCellDragMaxCols: 50,
    emptyCellDragMaxRows: 50,
    draggable: {
      enabled: this.draggable$,
      ignoreContentClass: 'gridster-item-content',
      ignoreContent: false,
      dragHandleClass: 'drag-handler',
      stop: undefined
    },
    resizable: {
      delayStart: 0,
      enabled: true,
      stop: undefined,
      handles: {
        s: true,
        e: true,
        n: true,
        w: true,
        se: true,
        ne: true,
        sw: true,
        nw: true
      }
    },
    swap: false,
    pushItems: true,
    disablePushOnDrag: false,
    disablePushOnResize: false,
    pushDirections: { north: true, east: true, south: true, west: true },
    pushResizeItems: false,
    disableWindowResize: false,
    displayGrid: this.visible$,
    disableWarnings: false,
    scrollToNewItems: false
  };

}
  emptyCellClick (event, item){

  }
}
