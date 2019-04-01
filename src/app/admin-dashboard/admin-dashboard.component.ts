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

  getGroupList(set: boolean = false) {
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
        if (set) {
          this.newGroupID = this.groups[this.groups.length-1].id;
          this.getUserList(this.user.id, this.newGroupID);
        }
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
    if (groups.length == 0) { return "-" }
    let ret: string = "";
    if (groups.length > 1) {
      for (let i: number = 0; i<(groups.length-1); i++) {
        ret += groups[i]+", ";
      }
    }
    ret += groups[groups.length-1]
    if (ret == undefined || ret == "") { ret = "no groups"; }
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
          let ugResult: any; let ugSuccess: boolean;
          this.userService.postUserGroup(ug)
            .subscribe(_result => {
              ugResult = _result;
              ugSuccess = ugResult;
              let gcResult: any; let gcSuccess: boolean;
              if (ugSuccess) {
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
    const dialogRef = this.dialog.open(NewUserDialogComponent, {
      data: {}
    });
  
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
      if (result != undefined) {
        let group: Group = new Group();
        group.name = result.groupName;
        group.users = result.selectedUsers;
        if (result.selectedGroups != undefined) {
          let limitI = result.selectedGroups.length; let i = 0;
          result.selectedGroups.forEach(group_id => {
            let results: any; let user: User;
            this.userService.getGroupUsers(group_id)
                .subscribe(_users => {
                    i++;
                    results = _users;
                    results.forEach(result => {
                        user = result;
                        result = user;
                    });
                    let groupUsers: User[] = results;
                    let limitJ = groupUsers.length; let j = 1;
                    groupUsers.forEach(user => {
                        if (group.users != undefined) {
                            if (group.users.indexOf(user.id.toString()) == -1) {
                                group.users.push(user.id.toString());
                            }
                        } else { group.users = [user.id.toString()]; }
                        if (i==limitI && j==limitJ) {
                          console.log(group.users); this.createGroup(group);
                        }
                        j++;
                    });
                });
            });
        } else { this.createGroup(group); }
      }
    });
  }

  createGroup(group: Group) {
    let result: any; let success: boolean;
    this.userService.postGroup(group)
      .subscribe(_result => {
        result = _result;
        success = result;
        if (success) {
          this.toastr.success(group.name, "Group Successfully Created");
          this.getGroupList(true);
        } else {
          this.toastr.error(group.name, "Failed to Create Group");
        }
      });
  }

}
