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
  ComponentFactoryResolver
} from '@angular/core';

// import { Slide } from '../../../../models/slide';
import { MatDialog, MatDialogRef } from '@angular/material';

import { BoxesApiService } from '../../../../boxes-state/src/services/boxes.api.service';
import { ChartsBuilderComponent } from '../../components/charts-builder';
import { BoxesBackgroundComponent } from '../../components/boxes-background/boxes-background.component';
import { ImageUploadComponent } from '@labdat/image-upload';

//import {TextTinyEditorComponent} from '../../components/text-editor/text-editor.component';
import { TinyEditorComponent } from '@labdat/tiny-editor';
import { Chart } from '@labdat/charts';

import { ActivatedRoute, Router } from '@angular/router';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component';
import { GraphComponent } from '@labdat/charts';
import { BoxDialogComponent } from '../../components/box-dialog/box-dialog.component';
import { Store } from '@ngrx/store';
import { selectCurrentPresentationId, PresentationsState } from '@labdat/presentations-state';
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
import { delay } from 'rxjs/operators/delay';
import { GridComponent } from '@labdat/grid';

@Component({
  selector: 'app-boxes-grid',
  templateUrl: './boxes-grid.component.html',
  styleUrls: ['./boxes-grid.component.scss'],
  providers: [BoxesApiService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxesGridComponent implements OnInit {
  public editMode = false;
  public editors;
  public slide: any;
  public isOpened = false;
  public id: any;
  public idSlides: any;
  public gridConfig: any;
  public options;
  private currentPresentationId$ = this.store.select(selectCurrentPresentationId);
  private presentationId: any;
  public backgroundImage: any;
  private subscriptions: Subscription;
  public menu = {
    open : false,
    top : 0,
    left : 0
  }
  private dynamicComponent = [];

  constructor(
    private dialog: MatDialog,
    private boxesService: BoxesApiService,
    private route: ActivatedRoute,
    private router: Router,
    private element: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private store: Store<PresentationsState>
  ) {}

  ngOnInit() {
    this.subscriptions = this.currentPresentationId$.subscribe(presentationId => {
      this.presentationId = presentationId;
    });

    const routesSubscription = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.subscriptions.add(routesSubscription);

    this.slide = this.route.snapshot.data.boxes;
    if (!this.slide.boxIds) {
      this.slide.boxIds = [];
    }
    if(this.slide.background && this.slide.background.image)
      this.backgroundImage = 'url(data:' + this.slide.background.image.contentType +
      ';base64,' +this.arrayBufferToBase64(this.slide.background.image.data.data) +')';

    this.gridConfig = {
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
      displayGrid: 'always',
      emptyCellContextMenuCallback : this.emptyCellContextMenu.bind(this)
    };
  }

  public enableEdit(event) {
    this.editMode = true;
    if (event.box.content) {
      if (event.box.content.type === 'chart') {
        const dialog = this.dialog.open(ChartsBuilderComponent, { height: '95%', width: '90%' });
        dialog.componentInstance.inputOptions = event.box.content.chart.chartOptions;
        dialog.componentInstance.inputData = event.box.content.chart.data;
        const dialogSubscription = dialog.afterClosed().subscribe(result => {
          if (result && result !== 'CANCEL') {
            event.box.content.type = 'chart';
            event.box.content.chart = result;
            event.box.width = event.box.cols * 25;
            event.box.height = event.box.cols * 25;
          }
          this.editMode = false;
        });
        this.subscriptions.add(dialogSubscription);
      }
    }
  }

  emptyCellContextMenu(event) {
    setTimeout(()=>{
      console.log('false')
      this.menu.open = false;
      setTimeout(()=>{
        console.log('true');
        this.menu.open = true;
      },500)
    },500)
    console.log(this.menu.open);

    this.menu.top = event.event.clientY - 50;
    this.menu.left = event.event.clientX - 50;
  }

  removeItem(event) {
    const dialog = this.dialog.open(BoxDialogComponent);
    const dialogSubscription = dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe(result => {
        if (result.delete) {
          if (event.item._id) {
            this.boxesService.delete(event.item._id).subscribe();
          }
          if (event.item.content.imageId) {
            this.boxesService.deleteImage(event.item.content.imageId).subscribe();
          }
          this.slide.boxIds.splice(this.slide.boxIds.indexOf(event.item), 1);
          this.cdr.detectChanges();
        }
      });
    this.subscriptions.add(dialogSubscription);
  }

  confirmSlide(slide) {
    for (let i = 0; i < slide.boxIds.length; i++) {
      slide.boxIds[i].slideId = this.id;
      if(slide.background.image && slide.background.image._id){
        slide.background.image= slide.background.image._id;
      }
      if (slide.boxIds[i]._id) {
        this.boxesService.update(slide.boxIds[i], slide.boxIds[i]._id).subscribe();
      } else {
        this.boxesService.addBox(slide.boxIds[i]).subscribe();
      }
    }
    if(this.backgroundImage != ''){
      this.boxesService.changeGridBackground({ background: slide.background, id: this.id }).subscribe();
    } else {
        this.boxesService.deleteImage(this.slide.background.image._id).subscribe();
    }
    this.router.navigate(['/', 'presentations', this.slide.presentationId, 'edit']);
  }

  ngOnDestroy() {
    console.log('unsubscribe');
    this.subscriptions.unsubscribe();
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
}
