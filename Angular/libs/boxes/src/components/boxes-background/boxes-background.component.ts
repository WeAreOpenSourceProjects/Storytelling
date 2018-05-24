import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-boxes-background',
  templateUrl: './boxes-background.component.html',
  styleUrls: ['./boxes-background.component.scss']
})
export class BoxesBackgroundComponent {
  public image: string;
  @Input() color: string ='rgb(255,255,255)';
  private opacity: number = 1;
  @Input() imagePreview;

  setImage() {
    return {
      color: this.color,
      image: this.image,
      imagePreview: this.imagePreview ? this.imagePreview : ''
    };
  }
}
