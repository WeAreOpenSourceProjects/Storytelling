import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './presentation-dialog.component.html'
})
export class PresentationDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<PresentationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() { }

  yes() {
    this.dialogRef.close({ delete: true, presentationId: this.data.presentationId });
  }

  no() {
    this.dialogRef.close({ delete: false });
  }
}
