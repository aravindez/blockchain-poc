import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material-module';

import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { NewUserDialogComponent } from './new-user-dialog/new-user-dialog.component';
import { NewGroupDialogComponent } from './new-group-dialog/new-group-dialog.component';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, AdminDashboardRoutingModule, MaterialModule
  ],
  declarations: [AdminDashboardComponent, NewUserDialogComponent, NewGroupDialogComponent, AddUserDialogComponent],
  entryComponents: [
    NewUserDialogComponent, AddUserDialogComponent, NewGroupDialogComponent
  ]
})
export class AdminDashboardModule { }