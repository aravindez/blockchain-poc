import { Component, OnInit } from '@angular/core';
import { Router } from '../../node_modules/@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    public title: String;
    public show_login_html: boolean;

    public constructor(private router: Router) {}
    // properties for child components
    ngOnInit(): void {
        this.title = 'blockchain-poc';
        this.router.navigate(['/login']);
        //this.show_login_html = true;
    }

    switch(): void {
        console.log('switched');
        this.show_login_html = !this.show_login_html;
    }
}
