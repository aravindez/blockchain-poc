import { Injectable } from '@angular/core';
import { ServiceFactory } from './ServiceFactory';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


    // We need Http to talk to a remote server
    constructor(private sf : ServiceFactory) { }

    // Get user info from remote server.
    getUser(uname, pword) {
        return this.sf.callRequest("GET", "/api/User/GetUserItem?uname="+uname+"&pword="+pword)
    }
}