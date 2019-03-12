import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


    // We need Http to talk to a remote server
    constructor(private _http : HttpClient) { }

    // Get list of blocks from remote server.
    getUser(uname, pword) {
        return this._http
            .get("http://localhost:5000/api/user/GetUserItem?uname="+uname+"&pword="+pword)
    }
}