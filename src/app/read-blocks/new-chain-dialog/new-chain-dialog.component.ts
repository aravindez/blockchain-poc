import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-new-chain-dialog',
  templateUrl: './new-chain-dialog.component.html',
  styleUrls: ['./new-chain-dialog.component.css']
})

export class NewChainDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<NewChainDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}