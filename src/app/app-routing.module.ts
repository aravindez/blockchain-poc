import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'login', loadChildren: './login/login.module#LoginModule'},
  {path: 'read-blocks', loadChildren: './read-blocks/read-blocks.module#ReadBlocksModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
