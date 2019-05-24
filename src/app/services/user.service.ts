import { Injectable } from '@angular/core';
import { ServiceFactory } from './ServiceFactory';
import { User } from '../../models/user';
import { UserGroup } from 'src/models/usergroup';
import { Group } from 'src/models/group';

@Injectable({
  providedIn: 'root'
})
export class UserService {


    // We need Http to talk to a remote server
    constructor(private sf : ServiceFactory) { }

    // Get user info from remote server.
    getUsers(user_id: number) {
        return this.sf.callRequest("GET", "/api/User/GetUsers?user_id="+user_id.toString())
    }

    getUserGroups(user_id: number) {
        return this.sf.callRequest("GET", "/api/User/GetUserGroups?user_id="+user_id.toString())
    }

    getGroups() {
        return this.sf.callRequest("GET", "/api/User/GetGroups");
    }

    getGroupUsers(group_id: number, notIn: boolean = false) {
        return this.sf.callRequest("GET", "/api/User/GetGroupUsers?group_id=" + group_id.toString()
                                                            + "&notIn=" + notIn.toString());
    }

    postUser(newUser: User) {
        return this.sf.callRequest("GET", "/api/User/PostUser", newUser);
    }

    postUserGroup(ug: UserGroup) {
        return this.sf.callRequest("POST", "/api/User/PostUserGroup", ug);
    }

    postGroup(group: Group) {
        return this.sf.callRequest("POST", "/api/User/PostGroup", group);
    }
}