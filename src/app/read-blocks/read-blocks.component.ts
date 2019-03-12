import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlockService } from '../services/block.service';
import { Block } from '../../models/block';
import { User } from 'src/models/user';

@Component({
    selector: 'app-read-blocks',
    templateUrl: './read-blocks.component.html',
    styleUrls: ['./read-blocks.component.css'],
    providers: [BlockService]
})
export class ReadBlocksComponent implements OnInit {

    user: User;

    // store list of blocks
    blocks: Block[];
    tempList: any;
    tempBlock: Block

    // initialize blockService to retrieve list blocks in the ngOnInit()
    constructor(private blockService: BlockService){}

    // methods that we will use later
    createBlock(){}
    readOneBlock(id){}
    updateBlock(id){}
    deleteBlock(id){}

    // Read blocks from API.
    ngOnInit(){
        this.user = JSON.parse(localStorage.getItem("user"));
        this.blockService.readBlocks()
          .subscribe(_blocks => {
            this.tempList = _blocks;
            this.tempList.forEach(element => {
                this.tempBlock = element;
                element = this.tempBlock;
            });
            this.blocks = this.tempList;
            this.tempList = null;
            this.tempBlock = null;
          });
    }

}
