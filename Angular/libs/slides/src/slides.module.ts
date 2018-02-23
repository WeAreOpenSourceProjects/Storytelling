import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatTooltipModule,
  MatCardModule,
  MatIconModule,
  MatButtonModule,
  MatChipsModule,
  MatDialogModule
} from '@angular/material';
import { SlidesListComponent } from './containers/slides-list/slides-list.component';
import { SlidesRoutingModule } from '@labdat/slides-routing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragulaModule } from 'ng2-dragula';
import { environment } from '../../../apps/default/src/environments/environment';
import { SlideCardComponent } from './components/slide-card/slide-card.component';
import { SlideDialogComponent } from './components/slide-dialog/slide-dialog.component';

@NgModule({
  imports: [
    DragulaModule,
    CommonModule,
    MatTooltipModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule
  ],
  declarations: [SlidesListComponent, SlideDialogComponent, SlideCardComponent],
  entryComponents: [SlideDialogComponent],
  exports: [SlidesListComponent]
})
export class SlidesModule {}

@NgModule({
  imports: [SlidesModule, SlidesRoutingModule]
})
export class RootSlidesModule {}
