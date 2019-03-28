import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { NewGroupDialogComponent } from './new-group-dialog/new-group-dialog.component';
import { NewUserDialogComponent } from './new-user-dialog/new-user-dialog.component';
import { UserService } from '../services/user.service';
import { User } from 'src/models/user'; 
import { Group } from 'src/models/group'; 
import { ToastrService } from 'ngx-toastr';
import {Md5} from 'ts-md5/dist/md5';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { UserGroup } from 'src/models/usergroup';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  providers: [UserService]
})
export class AdminDashboardComponent implements OnInit {

  title: string = "Admin Dashboard";
  loading: boolean;
  usersDataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['select', 'id', 'email', 'name', 'groups'];
  
  user: User;
  groups: Group[] = [];
  users: User[] = [];

  newGroupID: number = 0;

  constructor(private userService: UserService, private dialog: MatDialog,
    private snackBar: MatSnackBar, private toastr: ToastrService) { }

  ngOnInit() {
    this.loading = true;
    this.user = JSON.parse(sessionStorage.getItem("user"));
    this.getGroupList();
    this.getUserList(this.user.id);
  }

  getGroupList() {
    this.groups = [];
    let results: any; let result: any;
    let group: Group;
    this.userService.getGroups()
      .subscribe(_results => {
        results = _results;
        results.forEach(element => {
          result = element;
          group = result;
          this.groups.push(group);
        });
      });
  }

  changeGroup(newGroup: number) {
    this.newGroupID = newGroup;
    this.getUserList(this.user.id, newGroup);
  }

  getUserList(user_id: number, group_id: number = 0) {
    this.users = [];
    this.loading = true;
    let results: any; let user: User;
    if (group_id == 0) {
      this.userService.getUsers(user_id)
        .subscribe(_users => {
          results = _users;
          results.forEach(result => {
            user = result;
            this.users.push(user);
          });
          this.getUserGroups();
        });
    } else {
      this.userService.getGroupUsers(group_id)
        .subscribe(_users => {
          results = _users;
          results.forEach(result => {
            user = result;
            this.users.push(user);
          });
          this.getUserGroups();
        });
    }
  }

  getUserGroups() {
    for (let i: number = 0; i<this.users.length; i++) {
      let results: any; let result: Group;
      let groups: string[] = [];
      this.userService.getUserGroups(this.users[i].id)
        .subscribe(_groups => {
          results = _groups;
          results.forEach(_result => {
            result =_result;
            groups.push(result.name);
          });
          this.users[i].groups = groups;
          this.users[i].prettyGroups = this.prettifyList(groups);
          groups = [];
          if (i == this.users.length-1) {
            this.usersDataSource = new MatTableDataSource(this.users);
            this.usersDataSource.paginator = this.paginator;
            this.loading = false;
          }
        });
    }
  }

  prettifyList(groups: string[]) {
    let ret: string = "";
    if (groups.length > 1) {
      for (let i: number = 0; i<(groups.length-1); i++) {
        ret += groups[i]+", ";
      }
    }
    ret += groups[groups.length-1]
    return ret;
  }

  openUserListDialog() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      data: { group_id: this.newGroupID }
    });
  
    dialogRef.beforeClose().subscribe(result => {
      if (result != undefined) {
        result.selectedUsers.forEach(user_id => {
          let ug: UserGroup = new UserGroup();
          ug.group_id = this.newGroupID; ug.user_id = user_id;
          let result: any; let success: boolean;
          this.userService.postGroup(ug)
            .subscribe(_result => {
              result = _result;
              success = result;
              if (success) {
                this.toastr.success("id: "+user_id.toString(), "User successfully added to Group.");
                this.getUserList(this.user.id, this.newGroupID);
              } else {
                this.toastr.error("id: "+user_id.toString(), "User not added to Group.");
              }
            });
        });
      }
    });
  }

  openUserFormDialog() {
    const dialogRef = this.dialog.open(NewUserDialogComponent);
  
    dialogRef.beforeClose().subscribe(result => {
      if (result != undefined) {
        let newUser: User = new User();
        newUser.fname = result.newFname;
        newUser.lname = result.newLname;
        newUser.email = result.newEmail;
        newUser.password = Md5.hashStr(result.newPassword).toString(); //ADD SALT
        this.createUser(newUser);
      } else {
        console.log("result is undefined.");
      }
    });
  }

  createUser(newUser: User) {
    let response: any; let success: boolean;
    this.userService.postUser(newUser)
      .subscribe(_response => {
        response = _response;
        success = response;
        if (success) {
          this.getUserList(this.user.id);
          this.toastr.success(newUser.fname+" "+newUser.lname+" - "+newUser.email, "New User Added");
        }
      })
  }

  openNewGroupDialog() {
    const dialogRef = this.dialog.open(NewGroupDialogComponent, {
      data: { user_id: this.user.id }
    });
  
    dialogRef.beforeClose().subscribe(result => {
      // TODO: IMPLEMENT CREATE NEW GROUP FROM DIALOG DATA
    });
  }

}
