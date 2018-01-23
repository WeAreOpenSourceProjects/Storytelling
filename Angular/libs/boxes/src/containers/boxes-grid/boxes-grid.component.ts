
import {Component, ViewEncapsulation, ViewChildren,OnInit, ViewChild, ElementRef, QueryList, HostListener, ChangeDetectionStrategy, ViewContainerRef, ComponentFactoryResolver} from '@angular/core';

// import { Slide } from '../../../../models/slide';
import { MatDialog, MatDialogRef } from '@angular/material';

import {BoxesApiService} from '../../../../boxes-state/src/services/boxes.api.service';
import {ChartsBuilderComponent} from '../../components/charts-builder';
import {TextEditorComponent} from '../../components/text-editor/text-editor.component';
import {Chart} from '@labdat/charts';

import { ActivatedRoute, Router } from '@angular/router';
import { GridsterConfig, GridsterItem  }  from 'angular-gridster2';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component'
import {GraphComponent} from '../../components/graph/graph.component';
import { Slide } from '@labdat/data-models';

@Component({
  selector: 'app-boxes-grid',
  templateUrl: './boxes-grid.component.html',
  styleUrls: ['./boxes-grid.component.scss'],
  providers: [BoxesApiService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxesGridComponent implements OnInit{
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
  gridConfig:any;
  options;

  constructor(
    private dialog: MatDialog,
    private boxesService : BoxesApiService,
    private route : ActivatedRoute,
    private router: Router,
    private element: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

enableEdit(box){
  if(box.content && box.content.type === 'text'){
    this.editMode= true;
  } else if(box.content && box.content.type==='chart'){
    const dialog = this.dialog.open(ChartsBuilderComponent, {height: '95%', width: '90%'});
    dialog.componentInstance.inputOptions = box.content.chart.chartOptions;
    dialog.componentInstance.inputData = box.content.chart.data;
    dialog.afterClosed().subscribe(result => {
      if (result !== 'CANCEL') {
        console.log('The dialog was closed');
        box.content.type='chart';
        box.content.chart = result;
        box.width = box.cols *25;
        box.height = box.cols *25;
        }
    });
  }
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
    if(type==='text'){
      this.texteditor.changes.subscribe((a)=>{
        for (let i = 0; i < this.texteditor.toArray().length; i++) {
          if(i===this.slide.boxIds.length-1 && !componentEditorRef){
             let componentEditorFactory = this.componentFactoryResolver.resolveComponentFactory(TextEditorComponent);
             componentEditorRef = this.texteditor.toArray()[i].createComponent(componentEditorFactory);
             (<TextEditorComponent>componentEditorRef.instance).textTosave.subscribe((text)=>{
               item.content =  {
                 'type': 'text',
                 'text': text
               }

             });

           }
         }
     })
   }
   if (type==='chart'){
     item.cols= 5;
     item.rows =5;
    const dialog = this.dialog.open(ChartsBuilderComponent, {height: '95%', width: '90%'});
    dialog.afterClosed().subscribe(result => {
      if (result !== 'CANCEL') {
        console.log('The dialog was closed');
        item.content =  {
          'type': 'chart',
          'chart': result
        }
        }
    });
   }
   this.menubar.clear();
   this.slide.boxIds.push(item);
  });
}

ngAfterViewInit(){
for(let i = 0; i<this.slide.boxIds.length; i++){
  if(this.slide.boxIds[i].content.type === 'text'){
    let componentEditorFactory = this.componentFactoryResolver.resolveComponentFactory(TextEditorComponent);
    let componentEditorRef = this.texteditor.toArray()[i].createComponent(componentEditorFactory);
    (<TextEditorComponent>componentEditorRef.instance).editorContent = this.slide.boxIds[i].content.text;
    (<TextEditorComponent>componentEditorRef.instance).textTosave.subscribe((text)=>{
      this.slide.boxIds[i].content =  {
        'type': 'text',
        'text': text
      }
    });
    }
  }
}
ngOnInit() {
  this.route.params.subscribe(params => {
     this.id = params['id'];
   });
   this.slide = this.route.snapshot.data.boxes;
   if(!this.slide.boxIds) {
     this.slide.boxIds = []
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
    itemResizeCallback: BoxesGridComponent.itemResize,
    emptyCellClickCallback: this.emptyCellClick.bind(this),
    itemChangeCallback: BoxesGridComponent.itemChange,
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
  this.slide.boxIds.splice(this.slide.boxIds.indexOf(item), 1);
}

  confirmSlide(slide){

    for (let i=0 ; i<slide.boxIds.length; i++){
      slide.boxIds[i].slideId = this.id;
      if(slide.boxIds[i]._id){
        console.log(slide.boxIds[i])
        this.boxesService.update(slide.boxIds[i], slide.boxIds[i]._id).subscribe((resu) =>{
          console.log(resu);
        })
      } else {
        this.boxesService.addBox(slide.boxIds[i]).subscribe((resu) =>{
          console.log(resu);
        })
      }
    }
  }
}