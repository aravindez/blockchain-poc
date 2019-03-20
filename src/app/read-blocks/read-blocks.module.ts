import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material-module';

import { ReadBlocksRoutingModule } from './read-blocks-routing.module';
import { ReadBlocksComponent} from './read-blocks.component';
import { NewBlockDialogComponent } from './new-block-dialog/new-block-dialog.component';
import { NewChainDialogComponent } from './new-chain-dialog/new-chain-dialog.component';

@NgModule({
  imports: [
    CommonModule, ReadBlocksRoutingModule, MaterialModule, FormsModule
  ],
  declarations: [ReadBlocksComponent, NewBlockDialogComponent, NewChainDialogComponent],
  entryComponents: [
    NewBlockDialogComponent, NewChainDialogComponent
  ]
})
export class ReadBlocksModule { }
