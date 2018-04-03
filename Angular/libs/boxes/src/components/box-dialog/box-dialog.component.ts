import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'box-delete-dialog',
  templateUrl: './box-dialog.component.html',
  styleUrls: ['./box-dialog.component.scss']
})
export class BoxDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<BoxDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {}

  yes() {
    this.dialogRef.close({ delete: true });
  }

  no() {
    this.dialogRef.close({ delete: false });
  }
}
