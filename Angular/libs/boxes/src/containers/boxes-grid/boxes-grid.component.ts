import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
  ChangeDetectionStrategy,
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
import { take } from 'rxjs/operators/take';
import { Subscription } from 'rxjs/Subscription';
import { GridComponent } from '@labdat/grid';

@Component({
  selector: 'app-boxes-grid',
  templateUrl: './boxes-grid.component.html',
  styleUrls: ['./boxes-grid.component.scss'],
  providers: [BoxesApiService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxesGridComponent implements OnInit {

  @HostListener('document:click', ['$event'])
  clickedOutside($event) {
    this.menu.open = false;
  }

  public editMode = false;
  public slide: any;
  public id: any;
  public x = 0 ;
  public y = 0;
  public gridConfig: any;
  private currentPresentationId$ = this.store.select(selectCurrentPresentationId);
  private presentationId: any;
  private subscriptions: Subscription;
  public menu = {
    open : false,
    top : 0,
    left : 0
  }

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

    this.slide = this.route.snapshot.data.boxes;
    if (!this.slide.boxIds) {
      this.slide.boxIds = [];
    }

    this.gridConfig = {
      draggable: {
        enabled: true,
        ignoreContentClass: 'gridster-item-content'
      },
      resizable: {
        enabled: true
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

  addBox(event){
    switch (event.type) {
      case 'text' : {
        this.slide.boxIds.push({
          x : this.x,
          y : this.y,
          cols :16,
          rows : 3,
          content :{
            type : event.type
          }
        });
        break;
      }
      case 'chart' : {
        const dialog = this.dialog.open(ChartsBuilderComponent, { height: '95%', width: '90%' });
        const chartBoxSubscription =  dialog.afterClosed()
        .subscribe((chart)=>{
          if(chart){
            this.slide.boxIds.push({
              x : this.x,
              y : this.y,
              cols: 15,
              rows: 15,
              minItemRows: 15,
              minItemCols: 15,
              content : {
                type: event.type,
                chart : chart
              }
            })
          };
        });
        this.subscriptions.add(chartBoxSubscription);
        break;
      }
      case 'image' :{
        this.slide.boxIds.push({
            x : this.x,
            y : this.y,
            cols: 15,
            rows: 15,
            content : {
              type: event.type
            }
          });
          break;
      }
      case 'background' : {
        const dialog = this.dialog.open(BoxesBackgroundComponent, {'width' : '50%'});
        const backgroundBoxSubscription = dialog.afterClosed().subscribe((background)=>{
          if(background){
            this.slide.background = background;
            this.slide.background.color = background.background
            this.cdr.detectChanges();
          }
        });
        this.subscriptions.add(backgroundBoxSubscription);
        break;
      }
    }
  }


  saveImage(event){
    this.slide.boxIds[event.index].content.imageId = event.image;
  }

  saveText(event){
    this.slide.boxIds[event.index].content.text = event.text;
  }


  emptyCellContextMenu(event) {
    console.log(event)
    setTimeout(() => {
      this.menu.open = false;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.menu.open = true;
        this.cdr.detectChanges();
      })
    })
    console.log(event.item);
    this.x = event.item.x;
    this.y = event.item.y;

    this.menu.top = event.event.clientY - 50;
    this.menu.left = event.event.clientX - 50;
  }

  removeItem(event) {
    const dialog = this.dialog.open(BoxDialogComponent, { height: '180px', width: '350px'});
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
    if(this.slide.background != ''){
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


}
