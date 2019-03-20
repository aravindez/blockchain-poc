import { Component, OnInit } from '@angular/core';
import { Router } from '../../node_modules/@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { User } from 'src/models/user';

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

    logout() {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/login']);
    }
}
