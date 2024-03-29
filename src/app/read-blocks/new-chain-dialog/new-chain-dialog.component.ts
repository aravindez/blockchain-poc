import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { UserService } from 'src/app/services/user.service';
import { Group } from 'src/models/group';
import { User } from 'src/models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-chain-dialog',
  templateUrl: './new-chain-dialog.component.html',
  styleUrls: ['./new-chain-dialog.component.css']
})

export class NewChainDialogComponent implements OnInit {

  nameColor: String = "accent";
  dataColor: String = "accent";
  usersColor: String = "accent";
  emptyErrorFields: string[] = [];
  groups: Group[] = [];
  groupDict: {[id: number]: User[]} = {};

  constructor(
    public dialogRef: MatDialogRef<NewChainDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private userService: UserService) {}

  ngOnInit() {
    let results: any; let result: any;
    let group: Group;
    this.userService.getUserGroups(this.data.user.id)
      .subscribe(_results => {
        results = _results;
        results.forEach(_result => {
          result = _result;
          group = result;
          this.groups.push(group);
          /*
          let results: any; let user: User;
          this.userService.getGroupUsers(group.id)
            .subscribe(_users => {
              results = _users;
              results.forEach(result => {
                user = result;
                result = user;
              });
              let users: User[] = results;
              this.groupDict[group.id] = users;
            });
          */
        });
      });
    
  }

  onCancelClick(): void {
    console.log(this.groups);
    this.dialogRef.close();
  }

  onFieldClick(field: string): void {
    this.color([field], false);
  }

  selectGroup(id: number) {
    console.log(this.groupDict[id]);
  }
  /*
    let users: User[] = this.groupDict[id];
    for (let i:number = 0; i<users.length; i++) {
      if (this.data.selectedUsers.indexOf(users[i].id) == -1) {
        this.data.selectedUsers.push()
      }
    }
  }
  */

  color(fields: string[], error: boolean) {
    // TODO: ENTIRE COLOR FUNCTIONALITY ISN'T WORKING
    fields.forEach(field => {
      if (field == "Name") { this.nameColor = error ? "warn" : "accent"; }
      else if (field == "Init Data") { this.dataColor = error ? "warn" : "accent"; }
      else if (field == "Select Users") { this.usersColor = error ? "warn" : "accent"; }
    });
  }

  submit(): void {
    let isError: boolean = false;
    let isEmptyError: boolean = false;
    let isInvalidError: boolean = false;
    this.emptyErrorFields = [];
    if (this.data.chainDialogName == undefined || this.data.chainDialogName == "") {
      isError = true;
      isEmptyError = true;
      this.emptyErrorFields.push("Name");
    }
    if (this.data.chainDialogInitData == undefined || this.data.chainDialogInitData == "") {
      isError = true;
      isEmptyError = true;
      this.emptyErrorFields.push("Init Data");
    }
    if ((this.data.selectedGroups == undefined || this.data.selectedGroups.length == 0) && (this.data.selectedUsers == undefined || this.data.selectedUsers.length == 0)) {
      isError = true;
      isEmptyError = true;
      this.emptyErrorFields.push("Select Users/Groups");
    }
    if (/^\d+$/.test(this.data.chainDialogInitData)==false) {
      isError = true;
      isInvalidError = true;
    }
    if (isError) {
      if (isEmptyError && isInvalidError) {
        this.throwEmptyError(this.emptyErrorFields);
        this.color(this.emptyErrorFields, true);
        this.color(["Select Users"], true);
        this.throwInvalidError();
      } else if (isEmptyError) {
        this.throwEmptyError(this.emptyErrorFields);
        this.color(this.emptyErrorFields, true);
      } else if (isInvalidError) {
        this.throwInvalidError();
        this.color(["Select Users"], true);
      }
    } else { this.dialogRef.close(this.data); }
  }

  throwInvalidError() {
    let invalidErrorString: string = "Init Data must be an integer";
    this.toastr.error(invalidErrorString, "Invalid Input");
  }

  throwEmptyError(emptyErrorFields: string[]) {
    let emptyErrorString: string = "Fields cannot be left empty: ";
    let emptyFieldsString = "";
    if (emptyErrorFields.length==1) { emptyFieldsString = emptyErrorFields[0] }
    else if (emptyErrorFields.length==2) 
    { emptyFieldsString = emptyErrorFields[0] + ", " + emptyErrorFields[1]; }
    else if (emptyErrorFields.length==3) 
    { emptyFieldsString = emptyErrorFields[0] + ", " + emptyErrorFields[1] + ", " + emptyErrorFields[2]; }
    this.toastr.error(emptyFieldsString, emptyErrorString);
  }

}