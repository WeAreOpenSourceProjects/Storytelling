
import {Component, ViewEncapsulation, ViewChildren,OnInit, ViewChild, ElementRef, QueryList, HostListener, ChangeDetectionStrategy, ViewContainerRef, ComponentFactoryResolver} from '@angular/core';

import { Slide } from '../../../../models/slide';
import { MatDialog, MatDialogRef } from '@angular/material';

import {SlideService} from '../../../../services';
import {ChartsBuilderComponent} from './charts-builder';
import {TextEditorComponent} from './text-editor/text-editor.component';
import {Chart} from '../../../../../../charts';
import { ActivatedRoute, Router } from '@angular/router';
import { GridsterConfig, GridsterItem  }  from 'angular-gridster2';
import { MenuBarComponent } from '../../../menu-bar/menu-bar.component'
import {GraphComponent} from './graph/graph.component'
@Component({
  selector: 'app-slides-drag-drop',
  templateUrl: './slide-editor.component.html',
  styleUrls: ['./slide-editor.component.scss'],
  providers: [SlideService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlideEditorComponent implements OnInit{
  @ViewChild('menubar', { read: ViewContainerRef }) menubar: ViewContainerRef;
  @ViewChildren('texteditor', {read: ViewContainerRef}) public texteditor: QueryList<ViewContainerRef>;

  @HostListener ('window:click',['$event']) onClick(event){
    this.editMode = false;
  }
  editMode =true;
  editors;
  slide: any;
  isOpened = false;
  id: any;
  idSlides: any;
  gridConfig:GridsterConfig;
  constructor(
    private dialog: MatDialog,
    private slideService : SlideService,
    private route : ActivatedRoute,
    private router: Router,
    private element: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

enableEdit(){
  this.editMode= true;
}

emptyCellClick(event, item) {
  let componentFactory = this.componentFactoryResolver.resolveComponentFactory(MenuBarComponent);
  if (this.menubar) {
        this.menubar.clear();
     }
  let componentRef = this.menubar.createComponent(componentFactory);
  (<MenuBarComponent>componentRef.instance).top = event.clientY-50;
  (<MenuBarComponent>componentRef.instance).left = event.clientX-50;
  (<MenuBarComponent>componentRef.instance).isOpen.subscribe((type)=>{
    let componentEditorRef;
    this.texteditor.changes.subscribe((a)=>{
    if(type==='text'){
      for (let i = 0; i < this.texteditor.toArray().length; i++) {
        if(i===this.slide.boxes.length-1 && !componentEditorRef){
           let componentEditorFactory = this.componentFactoryResolver.resolveComponentFactory(TextEditorComponent);
           componentEditorRef = this.texteditor.toArray()[i].createComponent(componentEditorFactory);
           (<TextEditorComponent>componentEditorRef.instance).textTosave.subscribe((text)=>{
             item.text = text;
           });

         }
       }
     }
   })
   if (type==='chart'){
     item.cols= 5;
     item.rows =5;
    const dialog = this.dialog.open(ChartsBuilderComponent, {height: '95%', width: '90%'});
    dialog.afterClosed().subscribe(result => {
      if (result !== 'CANCEL') {
        console.log('The dialog was closed');
        item.chart = result;
        }
    });
   }
    this.menubar.clear();
    this.slide.boxes.push(item);
  });
}

ngOnInit() {
  this.route.params.subscribe(params => {
     this.idSlides = params['idSlides'];
     this.id = params['id'];
   });
   this.slide = this.route.snapshot.data.slide || {}
   this.slide.index = this.id;
   if(!this.slide.boxes) {
     this.slide.boxes = []
   }
  this.gridConfig = {
    gridType: 'fit',
    compactType: 'none',
    margin: 5,
    outerMargin: true,
    mobileBreakpoint: 640,
    minCols: 10,
    maxCols: 20,
    minRows: 10,
    maxRows: 20,
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
    enableEmptyCellContextMenu: false,
    enableEmptyCellDrop: false,
    enableEmptyCellDrag: false,
    itemResizeCallback: SlideEditorComponent.itemResize,
    emptyCellClickCallback: this.emptyCellClick.bind(this),
    itemChangeCallback: SlideEditorComponent.itemChange,
    emptyCellDragMaxCols: 50,
    emptyCellDragMaxRows: 50,
    draggable: {
      delayStart: 0,
      enabled: true,
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
      pushDirections: {north: true, east: true, south: true, west: true},
      pushResizeItems: false,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false

  };
}

changedOptions() {
  if (this.gridConfig.api && this.gridConfig.api.optionsChanged) {
    this.gridConfig.api.optionsChanged();
  }
}

static itemChange(item, itemComponent) {
 }

static itemResize(item, itemComponent){
  item.width = itemComponent.width;
  item.height = itemComponent.height;
}

removeItem($event, item) {
  $event.preventDefault();
  $event.stopPropagation();
  this.slide.boxes.splice(this.slide.boxes.indexOf(item), 1);
}

  confirmSlide(slide){
    this.slideService.confirmSlides(slide, this.id, this.idSlides)
      .subscribe(
        res => {
          this.router.navigate(['/slides/display/', this.idSlides])
        });
  }
}
