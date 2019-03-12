import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '../../../node_modules/@angular/router';
import { LoginService } from '../services/login.service';
import { Credentials } from '../../models/credentials';
import { User } from '../../models/user';
import {Md5} from 'ts-md5/dist/md5';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ LoginService ]
})
export class LoginComponent implements OnInit {


  private user_cred: Credentials = new Credentials();
  private user: User;
  private tempUser: any;

  public invalid_cred: boolean = false;
  public error_message: String = "";

  public constructor(private router: Router, private route: ActivatedRoute, private loginService: LoginService) { }

  ngOnInit() {
  }

  login() {
    //this.router.navigate(['/read-blocks']);
    this.invalid_cred = false;
    if (this.user_cred.uname == undefined || this.user_cred.pword == undefined) {
      this.invalid_cred = true;
      this.error_message = "Username or Password is blank. Please ensure all boxes are filled.";
      return;
    } else {
      this.loginService.getUser(this.user_cred.uname, Md5.hashStr(this.user_cred.pword.toString()).toString())
        .subscribe(user => {
          this.tempUser = user;
          this.user = this.tempUser;
          this.tempUser = null;

          if (this.user.id == 0) {
            this.invalid_cred = true;
            this.error_message = "Invalid Username or Password."
          } else {
            localStorage.setItem("user", JSON.stringify(this.user));
            this.router.navigate(['/read-blocks']);
          }
        })
    }
  }
}
