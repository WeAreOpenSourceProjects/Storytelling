
import {Component, ViewEncapsulation, ViewChildren,OnInit, OnChanges,AfterViewInit, ViewChild, ElementRef, QueryList, HostListener, ChangeDetectionStrategy, ViewContainerRef, ComponentFactoryResolver} from '@angular/core';

import { Slide } from '../../../../models/slide';
import { MatDialog, MatDialogRef } from '@angular/material';

import {SlideService} from '../../../../services';
import {ChartsBuilderComponent} from './charts-builder';
import {TextEditorComponent} from './text-editor/text-editor.component';
import {Chart} from '../../../../../../charts';
import { ActivatedRoute, Router } from '@angular/router';
import { GridsterConfig, GridsterItem }  from 'angular-gridster2';
import { MenuBarComponent } from '../../../menu-bar/menu-bar.component'

@Component({
  selector: 'app-slides-drag-drop',
  templateUrl: './slide-editor.component.html',
  styleUrls: ['./slide-editor.component.scss'],
  providers: [SlideService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlideEditorComponent implements OnInit, OnChanges, AfterViewInit{
  @ViewChild('menubar', { read: ViewContainerRef }) menubar: ViewContainerRef;
  @ViewChildren('texteditor', {read: ViewContainerRef}) public texteditor: QueryList<ViewContainerRef>;
  @HostListener ('window:click',['$event']) onClick(event){
    this.editMode = false;
  }
  editors;
  slide: any;
  isOpened = false;
  id: any;
  idSlides: any;
  gridConfig:any;
  options;
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
  console.log(this.editMode);
}
emptyCellClick(event, item) {
  console.info('empty cell click', event, item);
  let componentFactory = this.componentFactoryResolver.resolveComponentFactory(MenuBarComponent);
  if (this.menubar) {
        this.menubar.clear();
     }
  let componentRef = this.menubar.createComponent(componentFactory);
  (<MenuBarComponent>componentRef.instance).top = event.clientY-50;
  (<MenuBarComponent>componentRef.instance).left = event.clientX-50;
  (<MenuBarComponent>componentRef.instance).isOpen.subscribe((type)=>{
    this.slide.boxes.push(item);
    let componentEditorRef;
    this.texteditor.changes.subscribe((a)=>{
    if(type==='text'){
      for (let i = 0; i < this.texteditor.toArray().length; i++) {
        if(i===this.slide.boxes.length-1 && !componentEditorRef){
           let componentEditorFactory = this.componentFactoryResolver.resolveComponentFactory(TextEditorComponent);
           componentEditorRef = this.texteditor.toArray()[i].createComponent(componentEditorFactory);
           (<TextEditorComponent>componentEditorRef.instance).textTosave.subscribe((text)=>{
             this.slide.boxes[this.slide.boxes.length-1].text = text;
           });

         }
       }
     }
   })
   if (type==='chart'){
    const dialog = this.dialog.open(ChartsBuilderComponent, {height: '95%', width: '90%'});
    dialog.afterClosed().subscribe(result => {
      if (result !== 'CANCEL') {
        console.log('The dialog was closed');
         this.slide.boxes[this.slide.boxes.length-1].chart = result;
        }
    });
   }
    this.menubar.clear();
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
    emptyCellClickCallback: this.emptyCellClick.bind(this),
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
    }
  };
}



removeItem($event, item) {
  $event.preventDefault();
  $event.stopPropagation();
  this.slide.boxes.splice(this.slide.boxes.indexOf(item), 1);
}

  //
  // openChartBuilder() {
  //   const dialog = this.dialog.open(ChartsBuilderComponent, {height: '95%', width: '90%'});
  //   dialog.afterClosed().subscribe(result => {
  //     if (result !== 'CANCEL') {
  //       console.log('The dialog was closed');
  //       this.addBox(result, 'chart');
  //     }
  //   });
  // }
  //
  //
  // refreshBox(index, box) {
  //   this.removeBox(index);
  //   box = {
  //     config : this._generateItemConfig( box.config.col, box.config.row, box.config.sizex, box.config.sizey),
  //     text: box.text,
  //     chart: box.chart,
  //     height: box.height,
  //     width: box.width
  //   };
  //   this.slide.boxes.push(box);
  // }
  //
  // addBox(objectToAdd, type) {
  //   const push = new GridsterPush(gridsterItemComponent); // init the service
  //   gridsterItemComponent.$item.rows += 1; // move your item
  //   push.pushItems(push.fromEast);  // push items from a direction
  //   push.setPushedItems(); // save the items pushed
  //   push.restoreItems(); // restore to initial state the pushed items
  //   push.checkPushBack(); // check for items restore to original position
  //
  // }
  //
  // addText() {
  //   const dialog = this.dialog.open(TextEditorComponent, {height: '60%', width: '90%'});
  //   dialog.afterClosed().subscribe(result => {
  //     if (result) {
  //       console.log('The dialog was closed');
  //       this.addBox(result, 'text');
  //     }
  //   });
  // }
  //
  //
  // editBox(event, item) {
  //   console.log(item);
  //   if (item.text) {
  //     const dialog = this.dialog.open(TextEditorComponent, {height: '60%', width: '95%'});
  //     dialog.componentInstance.text = this.slide.boxes[index].text;
  //     dialog.afterClosed().subscribe(result => {
  //       if (result !== 'CANCEL') {
  //         this.slide.boxes[index].text = result;
  //       }
  //     });
  //   }

  //   if (item.chart) {
  //     const dialog = this.dialog.open(ChartsBuilderComponent, {height: '95%', width: '95%'});
  //     dialog.componentInstance.chartType = this.slide.boxes[index].chart.chartType;
  //     dialog.componentInstance.inputOptions = this.slide.boxes[index].chart.chartOptions;
  //     dialog.componentInstance.inputData = this.slide.boxes[index].chart.data;
  //     dialog.afterClosed().subscribe(result => {
  //       console.log(result);
  //       if (result !== 'CANCEL') {
  //         this.slide.boxes[index].chart = result;
  //       }
  //     });
  //   }
  // }
  //
  // onResize(index: number, event: NgGridItemEvent): void {
  //   this.slide.boxes[index].width = event.width ;
  //   this.slide.boxes[index].height = event.height;
  //   this.event = event;
  //   this.boxIndexToResize = index;
  // }
  //
  confirmSlide(slide){
    this.slideService.confirmSlides(slide, this.id, this.idSlides)
      .subscribe(
        res => {
          this.router.navigate(['/slides/display/', this.idSlides])
        });
  }
  //
  // private _generateItemConfig(col, row, sizex, sizey): NgGridItemConfig {
  //   return {'dragHandle': '.handle', 'col': col, 'row': row, 'sizex': sizex, 'sizey': sizey};
  // }
  //
  // onDragStop(index, item , box) {
  //   console.log(item, this.element.nativeElement.offsetWidth);
  //   if (item.width + item.left > this.element.nativeElement.offsetWidth || item.row * item.sizey > this.element.nativeElement.offsetHeight) {
  //     this.refreshBox(index, box);
  //   }
  // }
  //
  // openMenu(){
  //   console.log("yessss");
  // }
}
