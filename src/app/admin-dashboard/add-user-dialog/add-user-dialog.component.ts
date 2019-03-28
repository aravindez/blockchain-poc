import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/models/user';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent {

  users: User[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    let userResults: any; let userResult: any; let user: User;
    this.userService.getGroupUsers(this.data.group_id, true)
      .subscribe(_users => {
        userResults = _users;
        userResults.forEach(_user => {
          userResult = _user;
          user = userResult;
          this.users.push(user);
        });
      });
  }
  
  onCancelClick(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.data.selectedUsers == undefined || this.data.selectedUsers.length == 0) {
      this.toastr.error("Must select at least one user.");
    } else {
      this.dialogRef.close(this.data);
    }
  }
}
