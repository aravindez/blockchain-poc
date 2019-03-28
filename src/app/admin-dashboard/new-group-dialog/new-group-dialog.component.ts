import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { UserService } from 'src/app/services/user.service';
import { Group } from 'src/models/group';
import { User } from 'src/models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-group-dialog',
  templateUrl: './new-group-dialog.component.html',
  styleUrls: ['./new-group-dialog.component.css']
})

export class NewGroupDialogComponent implements OnInit {

  nameColor: String = "accent";
  emptyErrorFields: string[] = [];
  users: User[] = [];
  groups: Group[] = [];
  groupDict: {[id: number]: User[]} = {};

  constructor(
    public dialogRef: MatDialogRef<NewGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private userService: UserService) {}

  ngOnInit() {
    let userResults: any; let userResult: any;
    let user: User;
    this.userService.getUsers(this.data.user_id)
      .subscribe(_results => {
        userResults = _results;
        userResults.forEach(_result => {
          userResult = _result;
          user = userResult;
          this.users.push(user);
        })
      });
    let groupResults: any; let groupResult: any;
    let group: Group;
    this.userService.getGroups()
      .subscribe(_results => {
        groupResults = _results;
        groupResults.forEach(_result => {
          groupResult = _result;
          group = groupResult;
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
    if (fields.indexOf("Name") != -1) {
      this.nameColor = error ? "warn" : "accent";
    }
  }

  submit(): void {
    let isError: boolean = false;
    this.emptyErrorFields = [];
    if (this.data.groupName == undefined || this.data.groupDialogName == "") {
      isError = true;
      this.emptyErrorFields.push("Name");
    }
    if ((this.data.selectedGroups == undefined || this.data.selectedGroups.length == 0) && (this.data.selectedUsers == undefined || this.data.selectedUsers.length == 0)) {
      isError = true;
      this.emptyErrorFields.push("Select Users/Groups");
    }
    if (isError) {
      this.throwEmptyError(this.emptyErrorFields);
      this.color(this.emptyErrorFields, true);
    } else { this.dialogRef.close(this.data); }
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