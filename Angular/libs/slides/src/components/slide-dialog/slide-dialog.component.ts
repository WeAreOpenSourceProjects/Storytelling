import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'slide-delete-dialog',
  templateUrl: './slide-dialog.component.html'
})
export class SlideDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<SlideDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() { }

  yes() {
    this.dialogRef.close({ delete: true, slideId: this.data.slideId });
  }

  no() {
    this.dialogRef.close({ delete: false });
  }
}
