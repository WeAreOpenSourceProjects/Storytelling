import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './components/grid/grid.component';
import { MatIconModule } from '@angular/material';
import { GridsterModule } from 'angular-gridster2';
import { ImageUploadModule } from '@labdat/image-upload';
import { TinyEditorModule } from '@labdat/tiny-editor'
import {ChartsModule} from '@labdat/charts'

@NgModule({
  imports: [CommonModule, MatIconModule, GridsterModule, TinyEditorModule, ImageUploadModule, ChartsModule ],
  declarations: [GridComponent],
  exports: [GridComponent]
})
export class GridModule {}
