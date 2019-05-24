import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceFactory } from './ServiceFactory';
import { Block } from 'src/models/block';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

    // We need Http to talk to a remote server
    constructor(private sf : ServiceFactory) { }

    // Get list of blocks from remote server.
    readBlocks(chain_id: number) {
        return this.sf.callRequest("GET", "/api/Chain/GetChain?chain_id="+chain_id.toString());
    }

    createBlock(block: Block) {
        return this.sf.callRequest("POST", "/api/Block/PostNewBlock", block);
    }

    createInitBlock(block: Block) {
        return this.sf.callRequest("POST", "/api/Block/PostInitBlock", block);
    }
}
