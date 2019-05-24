import { Component, OnInit } from '@angular/core';
import { Router } from '../../node_modules/@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { User } from 'src/models/user';
import { HubConnection } from '@aspnet/signalr';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    public title: String;

    public constructor(private router: Router) {}
    // properties for child components
    ngOnInit(): void {
        this.title = 'Blockchain POC';
        this.router.navigate(['/login']);
        //this.router.navigate(['/read-blocks']);
    }

    goHome() {
        this.router.navigate(['/login']);
    }

    logout() {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/login']);
    }
}
