// IMPORT REFERENCE FILES FROM NODE_MODULES
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UserIdleService } from 'angular-user-idle';
import { SessionService } from './services/session.service';
import { Router } from '../../node_modules/@angular/router';

// IMPORT REFERENCE FROM CREATED FILES
import { LoginService } from './services/login.service';
import { TranslateService } from '../../node_modules/@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [SessionService]
})
export class AppComponent implements OnInit {
    constructor(private userIdle: UserIdleService, private route: Router, private session: SessionService,
        private login: LoginService, private translate: TranslateService) {
    }

    ngOnInit() {
        this.translate.setDefaultLang('en');

        let start_time = new Date();
        // START WATCHING WHEN USER IDLE IS STARTING.
        this.userIdle.onTimerStart().subscribe(count => {
            start_time = new Date();
            console.log('Timer Started count ' + count + ' on ' + new Date().toString());
        });

        // START WATCHING THE USER ACTION
        this.userIdle.startWatching();

        // RESET THE TIMER
        this.userIdle.resetTimer();
        // START WATCH WHEN TIME IS UP.
        this.userIdle.onTimeout().subscribe(() => {
            console.log('session started on ' + start_time.toString() + ' & expired on ' + new Date().toString());
            if (this.session.isSessionAvailable()) {
                console.log("hit")
                this.route.navigate(['/read_blocks']);
                this.session.clearSession();
            }
        });
    }
}
