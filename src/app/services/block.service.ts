import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Block } from 'src/models/block';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

    // We need Http to talk to a remote server
    constructor(private _http : HttpClient) { }

    // Get list of blocks from remote server.
    readBlocks(chain_id: number) {
        return this._http
          .get("http://localhost:5000/api/Chain/GetChain?chain_id="+chain_id.toString());
    }

    createBlock(block: Block) {
        return this._http
          .post("http://localhost:5000/api/Block/PostNewBlock", block);
    }

    createInitBlock(block: Block) {
        return this._http
          .post("http://localhost:5000/api/Block/PostInitBlock", block);
    }
}
