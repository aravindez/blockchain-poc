import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '../../../node_modules/@angular/router';
import { Validation } from '../../models/validation'
import { Credentials } from '../../models/credentials';
import { User } from '../../models/user';
import { ValidationService } from '../services/validation.service';
import { ChainService } from '../services/chain.service';
import { LoginService } from '../services/login.service';
import {Md5} from 'ts-md5/dist/md5';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { Block } from 'src/models/block';
import * as utils from '../../utils';
import { MatSnackBar } from '@angular/material';
import { Chain } from 'src/models/chain';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ LoginService, ValidationService, ChainService ]
})
export class LoginComponent implements OnInit {

  public loading: boolean = false;

  private user_cred: Credentials = new Credentials();
  private user: User;
  private tempUser: any;

  private remember_me: boolean = false;

  public error_message: string = "";

  public constructor(private router: Router, private route: ActivatedRoute,
      private loginService: LoginService, private chainService: ChainService, 
      private validationService: ValidationService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (sessionStorage.getItem("user") !== null) {
      this.loading = true;
      this.getPendingBlocks(JSON.parse(sessionStorage.getItem("user")).id);
      this.router.navigate(['/read-blocks']);
    } else if (localStorage.getItem("user") !== null) {
      sessionStorage.setItem("user", JSON.parse(localStorage.getItem("user")).stringify());
      this.loading = true;
      this.getPendingBlocks(JSON.parse(sessionStorage.getItem("user")).id);
    }
  }

  login() {
    if (this.user_cred.email == undefined || this.user_cred.pword == undefined) {
      this.error_message = "Username or Password is blank. Please ensure all boxes are filled.";
      this.snackBar.open(this.error_message, "", {
          duration: 5000
      });
      return;
    } else {
      this.loginService.getUser(this.user_cred.email, Md5.hashStr(this.user_cred.pword.toString()).toString())
        .subscribe(user => {
          this.tempUser = user;
          this.user = this.tempUser;
          this.tempUser = null;

          if (this.user.id == 0) {
            this.error_message = "Invalid Username or Password."
            this.snackBar.open(this.error_message, "", {
                duration: 5000
            });
          } else {
            if (this.remember_me) {
              localStorage.setItem("user", JSON.stringify(this.user));
              sessionStorage.setItem("user", JSON.stringify(this.user));
            } else {
              sessionStorage.setItem("user", JSON.stringify(this.user));
            }
            this.loading = true;
            this.storeChains(this.user.id);
            this.getPendingBlocks(this.user.id);
          }
        })
    }
  }

  storeChains(user_id: number) {
      let result: any; let chain: Chain; let chainList: Chain[] = [];
      this.chainService.getChains(user_id)
        .subscribe(_chain => {
          result = _chain;
          result.forEach(_chain => {
            chain = _chain;
            chainList.push(chain);
          });
          chainList.forEach(_chain => {
            this.saveChain(_chain.id);
          });
        });
  }

  saveChain(chain_id: number): any {
    let result: any; let block: Block;
    let rawBlocks: any; let blocks: Block[];
    this.chainService.getValidChain(chain_id)
      .subscribe(_result => {
        result = _result;
        result.forEach(_block => {
          block = _block;
          _block = block;
        });
        blocks = result;
        localStorage.setItem("storeChains", true.toString());
        localStorage.setItem(chain_id.toString(), JSON.stringify(blocks));
      });
  }

  getPendingBlocks(user_id: number) {
    let blockResult: Block;
    let results: any; let blockResults: Block[] = [];
    this.validationService.getPendingBlocks(user_id)
        .subscribe(elements => {
            results = elements;
            results.forEach(element => {
                blockResult = element;
                blockResults.push(blockResult);
            });
            blockResult = null; results = null;
            this.validateBlocks(user_id, blockResults);
        });
  }

  validateBlocks(user_id:number, blocks: Block[]) {
      let blockResult: Block;
      let results: any; let chainResult: Block[];
      let validations: number = blocks.length;
      if (blocks.length == 0) {
        this.router.navigate(['/read-blocks']);
      }
      if(localStorage.getItem("storeChains") === null) {
        this.storeChains(user_id);
        blocks.forEach(block => {
          let chain: Block[] = JSON.parse(localStorage.getItem(block.chain_id.toString()));
          let validation: Validation = new Validation();
          validation.user_id = user_id;
          validation.block_id = block.id;
          if (utils.validateBlock(chain, block)) {
            validation.isValid = 1;
          } else { validation.isValid = 0; }
          this.postValidation(validation, validations);
          validations--;
        });
      } else {
        blocks.forEach(block => {
          let chain: Block[] = JSON.parse(localStorage.getItem(block.chain_id.toString()));
          let validation: Validation = new Validation();
          validation.user_id = user_id;
          validation.block_id = block.id;
          if (utils.validateBlock(chain, block)) {
            validation.isValid = 1;
          } else { validation.isValid = 0; }
          this.postValidation(validation, validations);
          validations--;
        });
      }
  }

  postValidation(validation: Validation, validations: number): boolean {
      let ret: boolean = false;
      let retResult: any;
      this.validationService.postValidation(validation)
          .subscribe(result => {
              retResult = result;
              ret = retResult;
              if (!ret) {
                sessionStorage.setItem("failure", "Failed to post validation: { block_id: "
                  +validation.block_id.toString()+", isValid: "+validation.isValid.toString()+"}");
              }
              if (validations == 1) {
                this.router.navigate(['/read-blocks']);
              }
          });
      return ret;
  }
}