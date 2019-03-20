import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {


    // We need Http to talk to a remote server
    constructor(private _http : HttpClient) { }

    // Get user info from remote server.
    getUsers(user_id: number) {
        return this._http
            .get("http://localhost:5000/api/user/GetUsers?user_id="+user_id.toString())
    }
}