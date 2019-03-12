import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReadBlocksComponent } from './read-blocks.component';

const routes: Routes = [
    {
        path: '',
        component: ReadBlocksComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReadBlocksRoutingModule {}