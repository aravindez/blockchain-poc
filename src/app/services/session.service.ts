import { isNullOrUndefined } from 'util';
import { UserIdleService } from '../../../node_modules/angular-user-idle';

import { session_model } from '../../models/session_model';

export class SessionService {

    appsession = new session_model;
    constructor(private userIdle: UserIdleService) { }

    setSession(session: session_model, isStartWatch: boolean = true) {
        this.appsession = session;
        localStorage.setItem('userSession', JSON.stringify(session));
        if (isStartWatch) {
            this.userIdle.startWatching();
            this.userIdle.resetTimer();
        }
    }

    setCurrentSession(role, userPerms) {
        this.appsession = this.getSession();
        this.appsession.userData.role_code = role;
        this.appsession.userData.userPermissions = userPerms;
        localStorage.setItem('userSession', JSON.stringify(this.appsession));
    }

    getSession() {
        if (this.isSessionAvailable()) {
            this.appsession = JSON.parse(localStorage.getItem('userSession'));
            return this.appsession;
        } else {
            return new session_model();
        }
    }

    clearSession() {
        localStorage.removeItem('userSession');
        this.userIdle.stopWatching();
        this.userIdle.stopTimer();
    }

    isSessionAvailable() {
        const localData = localStorage.getItem('userSession');
        return !isNullOrUndefined(localData) && localData !== 'undefined' && localData !== 'null' && localData !== '';
    }
}
