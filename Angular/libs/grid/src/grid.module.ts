import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './components/grid/grid.component';
import { MatIconModule } from '@angular/material';
import { GridsterModule } from 'angular-gridster2';

@NgModule({
  imports: [CommonModule, MatIconModule, GridsterModule],
  declarations: [GridComponent],
  exports: [GridComponent]
})
export class GridModule {}
