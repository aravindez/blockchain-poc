import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';
import { UserGroup } from 'src/models/usergroup';
import { Group } from 'src/models/group';

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

    getUserGroups(user_id: number) {
        return this._http
            .get("http://localhost:5000/api/user/GetUserGroups?user_id="+user_id.toString())
    }

    getGroups() {
        return this._http
            .get("http://localhost:5000/api/user/GetGroups");
    }

    getGroupUsers(group_id: number, notIn: boolean = false) {
        return this._http
            .get("http://localhost:5000/api/user/GetGroupUsers?group_id=" + group_id.toString()
                                                            + "&notIn=" + notIn.toString());
    }

    postUser(newUser: User) {
        return this._http
            .post("http://localhost:5000/api/user/PostUser", newUser);
    }

    postUserGroup(ug: UserGroup) {
        return this._http
            .post("http://localhost:5000/api/user/PostUserGroup", ug);
    }

    postGroup(group: Group) {
        return this._http
            .post("http://localhost:5000/api/user/PostGroup", group);
    }
}