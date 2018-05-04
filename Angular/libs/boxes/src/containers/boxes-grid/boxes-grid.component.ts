import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material';

import { BoxesApiService } from '../../../../boxes-state/src/services/boxes.api.service';
import { ChartsBuilderComponent } from '../../components/charts-builder';
import { BoxesBackgroundComponent } from '../../components/boxes-background/boxes-background.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component';
import { BoxDialogComponent } from '../../components/box-dialog/box-dialog.component';
import { Store } from '@ngrx/store';
import { selectCurrentPresentationId, PresentationsState } from '@labdat/presentations-state';
import { selectCurrentSlide } from '@labdat/slides-state';

import { take } from 'rxjs/operators/take';
import { Subscription } from 'rxjs/Subscription';
import { GridComponent } from '@labdat/grid';
import * as domtoimage from 'dom-to-image';
import { fromBoxes, selectAllBoxes } from '@labdat/boxes-state';
import { fromSlides } from '@labdat/slides-state';

import { tap, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { slidesAdapter } from '@labdat/slides-state/src/+state/slides.interfaces';

function delay(t, v) {
  return new Promise(function(resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

@Component({
  selector: 'app-boxes-grid',
  templateUrl: './boxes-grid.component.html',
  styleUrls: ['./boxes-grid.component.scss'],
  providers: [BoxesApiService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxesGridComponent implements OnInit {
 
  @ViewChild('gridChild', { read: ElementRef })
  private gridChild: ElementRef;

  public slide$ = this.store.select(selectCurrentSlide).pipe(map(slide => cloneDeep(slide)));
  public boxes$ = this.store.select(selectAllBoxes).pipe(map(boxes => cloneDeep(boxes)));

  public slide: any;
  public id: any;
  public x = 0;
  public y = 0;
  public gridConfig: any;
  public boxes;
  private currentPresentationId$ = this.store.select(selectCurrentPresentationId);
  private presentationId: any;
  private subscriptions: Subscription;
  public menu = {
    open: false,
    top: 0,
    left: 0
  };

  constructor(
    private dialog: MatDialog,
    private boxesService: BoxesApiService,
    private route: ActivatedRoute,
    private router: Router,
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

    this.gridConfig = {
      draggable: {
        enabled: true,
        ignoreContentClass: 'gridster-item-content'
      },
      resizable: {
        enabled: true
      },
      displayGrid: 'always',
      emptyCellContextMenuCallback: this.emptyCellContextMenu.bind(this)
    };
    const boxesSubscription = this.boxes$.subscribe(boxes => {
      this.boxes = boxes;
    });
    this.subscriptions.add(boxesSubscription);
    const slidesSubscription = this.slide$.subscribe(slide => {
      this.slide = slide;
    });
    this.subscriptions.add(slidesSubscription);
  }

  public enableEdit(event) {
    if (event.box.content) {
      if (event.box.content.type === 'chart') {
        const dialog = this.dialog.open(ChartsBuilderComponent, { height: '95%', width: '90%' });
        dialog.componentInstance.inputOptions = event.box.content.chart.chartOptions;
        dialog.componentInstance.inputData = event.box.content.chart.data;
        const dialogSubscription = dialog.afterClosed().subscribe(result => {
          if (result && result !== 'CANCEL') {
            this.store.dispatch(
              new fromBoxes.Update({
                box: { 
                  id: event.box._id,
                  changes: {                    
                    width: event.box.cols * 25,
                    height: event.box.cols * 25,
                    content: {
                      type: 'chart',
                      chart: result
                    }
                  } 
                }
              })
            );
          }
        });
        this.subscriptions.add(dialogSubscription);
      }
    }
  }

  addBox(event) {
    switch (event.type) {
      case 'text': {
        this.store.dispatch(
          new fromBoxes.Add({
            box: {
              slideId: this.id,
              x: this.x,
              y: this.y,
              cols: 16,
              rows: 3,
              content: {
                type: event.type
              }
            }
          })
        );
        break;
      }
      case 'chart': {
        const dialog = this.dialog.open(ChartsBuilderComponent, { height: '95%', width: '90%' });
        const chartBoxSubscription = dialog.afterClosed().subscribe(chart => {
          if (chart) {
            this.store.dispatch(
              new fromBoxes.Add({
                box: {
                  slideId: this.id,
                  x: this.x,
                  y: this.y,
                  cols: 15,
                  rows: 15,
                  minItemRows: 15,
                  minItemCols: 15,
                  content: {
                    type: event.type,
                    chart: chart
                  }
                }
              })
            );
          }
        });
        this.subscriptions.add(chartBoxSubscription);
        break;
      }
      case 'image': {
        this.store.dispatch(
          new fromBoxes.Add({
            box: {
              slideId: this.id,
              x: this.x,
              y: this.y,
              content: {
                type: event.type
              }
            }
          })
        );
        break;
      }
      case 'background': {
        const dialog = this.dialog.open(BoxesBackgroundComponent, { width: '50%', height:'50%'});
        const backgroundBoxSubscription = dialog.afterClosed().subscribe(background => {
          if (background) {
            this.store.dispatch(
              new fromSlides.UpdateState({ slide: { id: this.slide._id, changes: { background: background } } })
            );
            this.cdr.detectChanges();
          }
        });
        this.subscriptions.add(backgroundBoxSubscription);
        break;
      }
    }
  }

  saveImage(event) {
    console.log(event);
    this.store.dispatch(
      new fromBoxes.Update({
        box: {
          id: event.index,
          changes: {
            content: {
              type: 'image',
              imageId: event.id, 
              previewData : event.previewData
            }
          }
        }
      })
    );
  }

  saveText(event) {
    this.store.dispatch(
      new fromBoxes.Update({
        box: {
          id: event.index,
          changes: {
            content: {
              type: 'text',
              text: event.text
            }
          }
        }
      })
    );
  }

  emptyCellContextMenu(event) {
    setTimeout(() => {
      this.menu.open = false;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.menu.open = true;
        this.cdr.detectChanges();
      });
    });
    this.x = event.item.x;
    this.y = event.item.y;

    this.menu.top = event.event.clientY - 90;
    this.menu.left = event.event.clientX - 70;
  }

  removeItem(event) {
    const dialog = this.dialog.open(BoxDialogComponent, { height: '180px', width: '350px' });
    const dialogSubscription = dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe(result => {
        if (result && result.delete) {
          if (event.item._id) {
            this.store.dispatch(new fromBoxes.Delete({ boxId: event.item._id }));
          }
          if (event.item.content.imageId) {
            this.store.dispatch(new fromBoxes.DeleteImage({ imageId: event.item.content.imageId }));
          }
        }
      });
    this.subscriptions.add(dialogSubscription);
  }

  confirmSlide() {
    domtoimage
      .toPng(this.gridChild.nativeElement.querySelector('div'))
      .then(function(dataUrl) {
        return dataUrl;
      })
      .then(dataUrl => {
        this.store.dispatch(
          new fromSlides.ConfirmState({ slide: { ...this.slide, screenShot: dataUrl }, boxes: this.boxes })
        );
        this.router.navigate(['/', 'presentations', this.slide.presentationId, 'edit']);
      });
  }

  itemChanged(event){
    this.store.dispatch(new fromBoxes.Update({
      box: {
        id: event.id,
        changes: {
          cols : event.cols, 
          rows: event.rows,
          x: event.x, 
          y: event.y 
        }
      }
    }) 
  )
    

  }
  ngOnDestroy() {
    console.log('unsubscribe');
    this.subscriptions.unsubscribe();
  }
}
