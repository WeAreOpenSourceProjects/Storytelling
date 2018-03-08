import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-boxes-background',
  templateUrl: './boxes-background.component.html',
  styleUrls: ['./boxes-background.component.scss']
})
export class BoxesBackgroundComponent {
  public image : string;
  public color: string;
  private opacity : number = 1;
  public imagePreview;
  setImage(){
    return {
      'background': this.color,
      'image': this.image,
      'imagePreview' :this.imagePreview? this.imagePreview :''
    }
  }
}
