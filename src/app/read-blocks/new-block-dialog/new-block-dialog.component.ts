import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-new-block-dialog',
  templateUrl: './new-block-dialog.component.html',
  styleUrls: ['./new-block-dialog.component.css']
})
export class NewBlockDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<NewBlockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
