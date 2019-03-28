import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-block-dialog',
  templateUrl: './new-block-dialog.component.html',
  styleUrls: ['./new-block-dialog.component.css']
})
export class NewBlockDialogComponent {

  color: string = "accent";

  constructor(
    public dialogRef: MatDialogRef<NewBlockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onFieldClick(): void {
    this.color = "accent";
  }

  submit(): void {
    this.color = "accent";
    if (this.data.newBlockData == undefined) {
      this.toastr.error("Cannot leave field empty.");
      this.color = "warn";
      this.data.newBlockData = undefined;
    } else if (/^\d+$/.test(this.data.newBlockData)==false) {
      this.toastr.error("Block data must be an integer.");
      this.color = "warn";
      this.data.newBlockData = undefined;
    } else {
      this.dialogRef.close(this.data.newBlockData);
    }
  }
}
