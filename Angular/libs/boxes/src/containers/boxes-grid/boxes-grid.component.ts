import {
  Component,
  ViewEncapsulation,
  ViewChildren,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
  QueryList,
  HostListener,
  ChangeDetectionStrategy,
  ViewContainerRef,
  ComponentFactoryResolver} from '@angular/core';

// import { Slide } from '../../../../models/slide';
import { MatDialog, MatDialogRef } from '@angular/material';

import {BoxesApiService} from '../../../../boxes-state/src/services/boxes.api.service';
import {ChartsBuilderComponent} from '../../components/charts-builder';
import {ImageUploadComponent} from '@labdat/image-upload';

//import {TextTinyEditorComponent} from '../../components/text-editor/text-editor.component';
import { TinyEditorComponent } from '@labdat/tiny-editor';
import { Chart } from '@labdat/charts';

import { ActivatedRoute, Router } from '@angular/router';
import { GridsterConfig, GridsterItem  }  from 'angular-gridster2';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component'
import { GraphComponent } from '@labdat/charts';
import { BoxDialogComponent } from '../../components/box-dialog/box-dialog.component'
import { Store } from '@ngrx/store';
import {selectCurrentPresentationId, PresentationsState } from '@labdat/presentations-state';
import { fromRouter } from '@labdat/router-state';
import { GridsterItemComponent } from 'angular-gridster2/dist/gridsterItem.component';
import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { filter } from 'rxjs/operators/filter';
import { Observable } from 'rxjs/Observable';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { zip } from 'rxjs/observable/zip';
import { take } from 'rxjs/operators/take';
import { of } from 'rxjs/observable/of';
import { tap } from 'rxjs/operators/tap';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-boxes-grid',
  templateUrl: './boxes-grid.component.html',
  styleUrls: ['./boxes-grid.component.scss'],
  providers: [BoxesApiService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxesGridComponent implements OnInit, AfterViewInit {

  @ViewChild('menubar', { read: ViewContainerRef })
  public menubar: ViewContainerRef;

  @ViewChildren('texteditor', {read: ViewContainerRef})
  public texteditor: QueryList<ViewContainerRef>;
  @ViewChildren('imageeditor', {read: ViewContainerRef})
  public imageeditor: QueryList<ViewContainerRef>;

  public editMode = false;
  public editors;
  public slide: any;
  public isOpened = false;
  public id: any;
  public idSlides: any;
  public gridConfig: any;
  public options;
  private currentPresentationId$ = this.store.select(selectCurrentPresentationId)
  private presentationId: any;

  private emptyCellContextMenu$ = new Subject();
  private subscriptions: Subscription;

  private dynamicTextEditors = [];

  constructor(
    private dialog: MatDialog,
    private boxesService : BoxesApiService,
    private route : ActivatedRoute,
    private router: Router,
    private element: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr : ChangeDetectorRef,
    private store : Store<PresentationsState>
  ) { }

  ngOnInit() {
    this.subscriptions = this.currentPresentationId$.subscribe((presentationId) => {
      this.presentationId = presentationId;
    })

    const routesSubscription = this.route.params.subscribe(params => {
       this.id = params['id'];
     });
     this.subscriptions.add(routesSubscription);

     this.slide = this.route.snapshot.data.boxes;
     if(!this.slide.boxIds) {
       this.slide.boxIds= []
     }

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
      itemResizeCallback: BoxesGridComponent.itemResize,
      emptyCellClickCallback: this.emptyCellClick.bind(this),
      emptyCellContextMenuCallback: this.emptyCellContextMenu.bind(this),
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      draggable: {
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
        displayGrid: 'always',
        disableWarnings: false,
        scrollToNewItems: false

    };
  }

  public enableEdit(box, i) {
    this.editMode= true;
    if (box.content && box.content.type === 'text') {
      this.dynamicTextEditors[i].setEditMode();
    } else if (box.content && box.content.type==='chart') {
      const dialog = this.dialog.open(ChartsBuilderComponent, {height: '95%', width: '90%'});
      dialog.componentInstance.inputOptions = box.content.chart.chartOptions;
      dialog.componentInstance.inputData = box.content.chart.data;
      const dialogSubscription = dialog.afterClosed().subscribe(result => {
        if (result && result !== 'CANCEL' ) {
          box.content.type='chart';
          box.content.chart = result;
          box.width = box.cols * 25;
          box.height = box.cols * 25;
        }
        this.editMode= false;
      });
      this.subscriptions.add(dialogSubscription);
    }

  }

  emptyCellClick(event, item) {
    this.editMode = false;
  }

  emptyCellContextMenu(event, item) {
    this.emptyCellContextMenu$.next({event, item})
  }

  ngAfterViewInit() {
    console.log(this.texteditor.toArray());
    let j = 0;
    let k = 0;
      for (let i = 0; i<this.slide.boxIds.length; i++) {
        if (this.slide.boxIds[i].content.type === 'text') {
          const componentEditorFactory = this.componentFactoryResolver.resolveComponentFactory(TinyEditorComponent);
          const componentEditorRef = this.texteditor.toArray()[j].createComponent(componentEditorFactory);
          j++;
          componentEditorRef.instance.initialValue = this.slide.boxIds[i].content.text;
          this.dynamicTextEditors.push(componentEditorRef.instance);
          (<TinyEditorComponent>componentEditorRef.instance).textToSave.subscribe(text => {
            this.slide.boxIds[i].content.text = text;
          });
        } else if (this.slide.boxIds[i].content.type === 'image'){
          const componentEditorFactory = this.componentFactoryResolver.resolveComponentFactory(ImageUploadComponent);
          const componentEditorRef = this.imageeditor.toArray()[k].createComponent(componentEditorFactory);
          k++;
          componentEditorRef.instance.image = this.slide.boxIds[i].content.imageId;
          componentEditorRef.instance.editMode = this.editMode;
          this.dynamicTextEditors.push(componentEditorRef.instance);
          console.log('id');
          (<ImageUploadComponent>componentEditorRef.instance).imageId.subscribe(id => {
            console.log(id);
            this.slide.boxIds[i].content.imageId = id;
          });
        }
      }
    const addBox$ = this.emptyCellContextMenu$.pipe(
      map(({event, item}) => {
        this.editMode = false;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MenuBarComponent);
        if (this.menubar) {
          this.menubar.clear();
        }
        const componentRef = this.menubar.createComponent(componentFactory);
        (<MenuBarComponent>componentRef.instance).top = event.clientY - 50;
        (<MenuBarComponent>componentRef.instance).left = event.clientX - 50;
        return componentRef.instance;
      }),
      switchMap((componentRef: MenuBarComponent) => componentRef.isOpen$)
    )
    .share();

    const chartType$ = addBox$.pipe(
      filter(type => type === 'chart')
    );

    const textType$ = addBox$.pipe(
      filter(type => type === 'text')
    );

    const imageType$ = addBox$.pipe(
      filter(type => type === 'image')
    );

    const textBoxSubscription = textType$.pipe(
      withLatestFrom(this.emptyCellContextMenu$, (type, item) => item),
      switchMap((item: any) => {
        item.item.cols = 16;
        item.item.rows = 3;
        item.item.content = { type: 'text' };
        this.slide.boxIds.push(item.item);
        return zip(this.texteditor.changes, of(item));
      })
    ).subscribe(([texteditor, item]: [any, any]) => {
      const componentEditorFactory = this.componentFactoryResolver.resolveComponentFactory(TinyEditorComponent);
      const componentEditorRef = this.texteditor.last.createComponent(componentEditorFactory);
      (<TinyEditorComponent>componentEditorRef.instance).textToSave.subscribe(text => {
        this.slide.boxIds[this.texteditor.length - 1].content.text = text;
      });
      this.dynamicTextEditors.push(componentEditorRef.instance)
      this.editMode = true;
//      (<TinyEditorComponent>componentEditorRef.instance).id = 0;
/*
      (<TinyEditorComponent>componentEditorRef.instance).textTosave.subscribe(text => {
        this.slide.boxIds.slice(-1)[0].content = { type: 'text', text }
      });
      */
    });
    this.subscriptions.add(textBoxSubscription);

    const chartBoxSubscription = chartType$.pipe(
      withLatestFrom(this.emptyCellContextMenu$, (type, item) => item),
      map((item: any) => {
        return this.dialog.open(ChartsBuilderComponent, {height: '95%', width: '90%'});
      }),
      switchMap((dialog: MatDialogRef<ChartsBuilderComponent>) => dialog.afterClosed())
    ).subscribe((chart: any) => {
      if (chart) {
        var item ={
          cols: 15,
          rows : 15,
          minItemRows :15,
          minItemCols: 15
        };
        this.slide.boxIds.push(item);
        this.slide.boxIds.slice(-1)[0].content = {'type':'chart', chart}
      }
      this.cdr.detectChanges();
      this.menubar.clear();
    });
    this.subscriptions.add(chartBoxSubscription);


    ///////
    const imageBoxSubscription = imageType$.pipe(
      withLatestFrom(this.emptyCellContextMenu$, (type, item) => item),
      switchMap((item: any) => {
        item.item.cols = 15;
        item.item.rows = 15;
        item.item.content = { type: 'image' };
        this.slide.boxIds.push(item.item);
        return zip(this.imageeditor.changes, of(item));
      })
    ).subscribe(([imageeditor, item]: [any, any]) => {
        const componentEditorFactory = this.componentFactoryResolver.resolveComponentFactory(ImageUploadComponent);
        const componentEditorRef = this.imageeditor.last.createComponent(componentEditorFactory);
        (<ImageUploadComponent>componentEditorRef.instance).imageId.subscribe(id => {
          console.log(id);
          this.slide.boxIds[this.imageeditor.length - 1].content.imageId = id;
        });
        this.dynamicTextEditors.push(componentEditorRef.instance);
        this.editMode = true;
      });

      this.subscriptions.add(imageBoxSubscription);
  }

  changedOptions() {
    if (this.gridConfig.api && this.gridConfig.api.optionsChanged) {
      this.gridConfig.api.optionsChanged();
    }
  }

  static itemResize(item, itemComponent){

  }

  removeItem($event, item) {
    const dialog = this.dialog.open(BoxDialogComponent);
    const dialogSubscription = dialog.afterClosed().pipe(take(1)).subscribe(result => {
      if (result.delete) {
        if (item._id) {
          this.boxesService.delete(item._id).subscribe()
        }
        this.slide.boxIds.splice(this.slide.boxIds.indexOf(item), 1);
        this.cdr.detectChanges();
      }
    });
    this.subscriptions.add(dialogSubscription);
  }

  confirmSlide(slide){
    for (let i = 0 ; i < slide.boxIds.length; i++) {
      slide.boxIds[i].slideId = this.id;
      if (slide.boxIds[i]._id) {
        this.boxesService.update(slide.boxIds[i], slide.boxIds[i]._id).subscribe()
      } else {
        this.boxesService.addBox(slide.boxIds[i]).subscribe()
      }
    }
    this.router.navigate(['/','presentations', this.slide.presentationId, 'edit'])
  }

  ngOnDestroy() {
    console.log('unsubscribe')
    this.subscriptions.unsubscribe();
  }
}
