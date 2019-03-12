import { Injectable } from '@angular/core';
//import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
//import { Observable} from 'rxjs';
//import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

    // We need Http to talk to a remote server
    constructor(private _http : HttpClient) { }

    // Get list of blocks from remote server.
    readBlocks() {
        return this._http
          .get("http://localhost:5000/api/Block");
    }
}
