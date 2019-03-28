import { Component, Inject, ViewChild, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.css']
})
export class NewUserDialogComponent implements OnInit {
  //@ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  fnameColor: string = "accent";
  lnameColor: string = "accent";
  emailColor: string = "accent";
  pwordColor: string = "warn";
  cpwordColor: string = "accent";

  constructor(
    public dialogRef: MatDialogRef<NewUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private toast: ToastrService) {}

  ngOnInit() {
    //this.toast.overlayContainer = this.toastContainer;
  }
  
  onCancelClick(): void {
    this.dialogRef.close();
  }

  onFieldClick(field: string): void {
    switch (field) {
      case "fname": { this.color(["First Name"], false); }
      case "lname": { this.color(["Last Name"], false); }
      case "email": { this.color(["Email"], false); }
      case "pword": { this.color(["Password"], false); }
      case "cpword": { this.color(["Confirm Password"], false); }
    }
  }

  color(fields: string[], error: boolean) {
    // TODO: ENTIRE COLOR FUNCTIONALITY ISN'T WORKING
    fields.forEach(field => {
      switch (field) {
        case "First Name": { this.fnameColor = error ? "warn" : "accent"; }
        case "Last Name": { this.lnameColor = error ? "warn" : "accent"; }
        case "Email": { this.emailColor = error ? "warn" : "accent"; }
        case "Password": { this.pwordColor = error ? "warn" : "accent"; }
        case "Confirm Password": { this.cpwordColor = error ? "warn" : "accent"; }
      }
    });
  }

  submit(): void {
    let isError: boolean = false;
    let isEmptyError: boolean = false;
    let isEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isInvalidError: boolean = false;
    let emptyErrorFields: string[] = [];
    let invalidErrorFields: string[] = [];
    if (this.data.newFname == undefined || this.data.newFName == "") {
      isError = true;
      isEmptyError = true;
      emptyErrorFields.push("First Name");
    }
    if (this.data.newLname == undefined || this.data.newLname == "") {
      isError = true;
      isEmptyError = true;
      emptyErrorFields.push("Last Name");
    }
    if (this.data.newEmail == undefined || this.data.newEmail == "") {
      isError = true;
      isEmptyError = true;
      emptyErrorFields.push("Email");
    } else if (!isEmail.test(this.data.newEmail)) {
      isError = true;
      isInvalidError = true;
      invalidErrorFields.push("email");
    }
    let emptyPassword: boolean = this.data.newPassword == undefined || this.data.newPassword == "";
    let emptyCPassword: boolean = this.data.confirmPassword == undefined || this.data.confirmPassword == "";
    if (emptyPassword) {
      isError = true;
      isEmptyError = true;
      emptyErrorFields.push("Password");
    }
    if (emptyCPassword) {
      isError = true;
      isEmptyError = true;
      emptyErrorFields.push("Confirm Password");
    }
    if (!emptyPassword && !emptyCPassword && this.data.newPassword!=this.data.confirmPassword) {
      isError = true;
      isInvalidError = true;
      invalidErrorFields.push("passwordMatch");
    }
    if (isError) {
      if (isEmptyError && isInvalidError) {
        this.throwEmptyError(emptyErrorFields, 1500);
        this.throwInvalidError(invalidErrorFields, 1500);
        this.color(emptyErrorFields, true);
      } else if (isEmptyError) {
        this.throwEmptyError(emptyErrorFields, 3000);
        this.color(emptyErrorFields, true);
      } else if (isInvalidError) {
        this.throwInvalidError(invalidErrorFields, 3000);
      }
    } else { this.dialogRef.close(this.data); }
  }

  throwInvalidError(invalidErrorFields: string[], length: number) {
    let invalidErrorStrings: string[] = [];
    invalidErrorFields.forEach(field => {
      switch (field) {
        case "email": { 
          invalidErrorStrings.push("Invalid email address.");
          this.color(["Email"], true);
          break;
        }
        case "passwordMatch": {
          invalidErrorStrings.push("Passwords do not match. Please ensure they are the same.");
          this.color(["Password", "Confirm Password"], true);
          break;
        }
      }
    });
    let timeout: number = 0;
    invalidErrorStrings.forEach(error => {
      this.toast.error(error, "Invalid Input");
    });
  }

  throwEmptyError(emptyErrorFields: string[], length: number) {
    let emptyErrorString: string = "Fields cannot be left empty: ";
    let emptyFieldsString = "";
    if (emptyErrorFields.length==1) { emptyFieldsString = emptyErrorFields[0] }
    else if (emptyErrorFields.length > 1) {
      for (let i: number = 0; i < emptyErrorFields.length-1; i++) {
        emptyFieldsString += emptyErrorFields[i] + ", "
      }
      emptyFieldsString += emptyErrorFields[emptyErrorFields.length-1]
    }
    this.toast.error(emptyFieldsString, emptyErrorString)
  }
}
