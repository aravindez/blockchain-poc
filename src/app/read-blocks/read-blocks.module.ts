import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReadBlocksRoutingModule } from './read-blocks-routing.module';
import { ReadBlocksComponent } from './read-blocks.component';

@NgModule({
  imports: [
    CommonModule, ReadBlocksRoutingModule
  ],
  declarations: [ReadBlocksComponent]
})
export class ReadBlocksModule { }
