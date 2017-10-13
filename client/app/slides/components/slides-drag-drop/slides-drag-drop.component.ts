import {Component, ViewEncapsulation, ViewChildren, ElementRef, QueryList} from '@angular/core';
import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';
import { Slide } from '../../models/slide';
import { MdDialog, MdDialogRef } from '@angular/material';

import {ChartBuilderComponent} from './charts-builder';
import {TextEditorComponent} from './text-editor/text-editor.component';
import {Chart} from '../../../charts';



@Component({
  selector: 'app-slides-drag-drop',
  templateUrl: './slides-drag-drop.component.html',
  styleUrls: ['./slides-drag-drop.component.scss']
})
export class SlidesDragDropComponent {
  public slide: Slide;
  public slideIndex: number;  // slide index
  private curNum;
  @ViewChildren('textContainer') textContainer: QueryList<ElementRef>;
  private gridConfig: NgGridConfig = <NgGridConfig>{
    'margins': [5],
    'draggable': true,
    'resizable': true,
    'max_rows': 38,
    'visible_rows': 90,
    'visible_cols': 90,
    'min_cols': 1,
    'min_rows': 1,
    'col_width': 1,
    'row_height': 1,
    'cascade': 'off',
    'min_width': 1,
    'min_height': 1,
    'fix_to_grid': false,
    'auto_style': true,
    'auto_resize': true,
    'maintain_ratio': false,
    'prefer_new': false,
    'zoom_on_drag': false,
    'limit_to_screen': false
  };
  private itemPositions: Array<any> = [];

  openChartBuilder() {
    const dialog = this.dialog.open(ChartBuilderComponent, {height: '95%', width: '90%'});
    dialog.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed');
        this.addBox(result, 'chart');
      }
    });
  }

  constructor(private dialog: MdDialog, public dialogRef: MdDialogRef<SlidesDragDropComponent>) {
  }

  refreshBox(index, box) {
    this.removeBox(index);
    box = {
      config : this._generateItemConfig(45, box.config.row, box.config.sizex, box.config.sizey),
      text: box.text,
      chart: box.chart,
      height: box.height,
      width: box.width
    };
    this.slide.boxes.push(box);
  }

  addBox(objectToAdd, type) {
    if (type === 'text') {
      const conf: NgGridItemConfig = this._generateItemConfig(1, 1, 30, 30);
      this.slide.boxes.push({config: conf, text: objectToAdd, chart: null, height: 30, width: 30});
    } else if (type === 'chart') {
      const conf: NgGridItemConfig = this._generateItemConfig(1, 1, 20, 20);
      this.slide.boxes.push({config: conf, text: null, chart: objectToAdd, height: 20, width: 30});
    }
  }

  addText() {
    const dialog = this.dialog.open(TextEditorComponent, {height: '60%', width: '90%'});
    dialog.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed');
        this.addBox(result, 'text');
      }
    });
  }

  removeBox(index: number) {
    if (this.slide.boxes[index]) {
      this.slide.boxes.splice(index, 1);
    }
  }

  editBox(index: number) {
    if (this.slide.boxes[index].text) {
      const dialog = this.dialog.open(TextEditorComponent, {height: '60%', width: '95%'});
      dialog.componentInstance.text = this.slide.boxes[index].text;
      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.slide.boxes[index].text = result;
        }
      });
    }
    if (this.slide.boxes[index].chart) {
      const dialog = this.dialog.open(ChartBuilderComponent, {height: '95%', width: '95%'});
      dialog.componentInstance.chartType = this.slide.boxes[index].chart.chartType;
      dialog.componentInstance.chartOptions = this.slide.boxes[index].chart.chartOptions;
      dialog.componentInstance.data = this.slide.boxes[index].chart.data;
      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.slide.boxes[index].chart = result;
        }
      });
    }
  }

  onResize(index: number, event: NgGridItemEvent): void {
    this.slide.boxes[index].width = event.width ;
    this.slide.boxes[index].height = event.height;
    if (this.slide.boxes[index].text) {
      this.textContainer.map((e, i) => {
        if (i === index && e.nativeElement.children[0]) {
          e.nativeElement.children[0].firstChild.width = event.width;
          e.nativeElement.children[0].firstChild.height = event.height;
        }
      });
    }
  }

  confirmSlide() {
    this.dialogRef.close(this.slide);
  }

  private _generateItemConfig(col, row, sizex, sizey): NgGridItemConfig {
    return {'dragHandle': '.handle', 'col': col, 'row': row, 'sizex': sizex, 'sizey': sizey};
  }

  onDragStop(index, item , box) {
    if (item.col > 45) {
      this.refreshBox(index, box);
    }
  }
}
