import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatSnackBar, MatSort } from '@angular/material';
import { BlockService } from '../services/block.service';
import { ChainService } from '../services/chain.service';
import { UserService } from '../services/user.service';
import { ValidationService } from '../services/validation.service';
import { Block } from '../../models/block';
import { Chain } from '../../models/chain';
import { User } from 'src/models/user'; 
import { NewBlockDialogComponent } from './new-block-dialog/new-block-dialog.component';
import { NewChainDialogComponent } from './new-chain-dialog/new-chain-dialog.component';
import * as utils from '../../utils';
import { sha256 } from 'js-sha256';
import { ToastrService } from 'ngx-toastr';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { Validation } from 'src/models/validation';
import { environment } from '../../environments/environment';
import { invoke } from 'q';

@Component({
    selector: 'app-read-blocks',
    templateUrl: './read-blocks.component.html',
    styleUrls: ['./read-blocks.component.css'],
    providers: [BlockService, ChainService, UserService, ValidationService]
})
export class ReadBlocksComponent implements OnInit {

    @ViewChild(MatSort) sort: MatSort;
    private hub: HubConnection | undefined;

    //ui variables
    displayedColumns: string[] = ['order', 'timestamp', 'created_by', 'user_name', 'previous_hash', 'data', 'hash', 'nonce', 'isValid'];
    blocksDataSource: any;
    users: User[] = [];
    blocks: Block[];
    chains: Chain[];
    chain: Chain;
    newChainID: number = 1;
    newChainIndex: number = 0;
    newChainResult: number;

    user: User;
    title: String;

    // for storage of blocks/chains list
    tempList: any;
    tempBlock: Block;
    tempChain: Chain;

    // info from create block and chain
    blockDialogInput: any;
    newBlock: Block = new Block();
    newBlockData: any;
    newChainName: any;
    newChainInitData: any;
    newChainGroups: any;
    newChainUsers: any;

    loading: boolean;

    // initialize blockService to retrieve list blocks in the ngOnInit()
    constructor(private chainService: ChainService, private blockService: BlockService,
        private userService: UserService, private validationService: ValidationService,
        public dialog: MatDialog, private toastr: ToastrService){}

    // Read blocks from API.
    ngOnInit(){
        this.loading = true;
        this.user = JSON.parse(sessionStorage.getItem("user"));
        this.getUsers(this.user.id);
        this.title = "Dashboard - Welcome "+this.user.name;

        this.hub = new signalR.HubConnectionBuilder()
            .withUrl(environment.apiRoot + '/BlockchainHub')
            .configureLogging(signalR.LogLevel.Information)
            .build();
 
        this.hub.start().catch(err => console.error(err.toString()));

        this.hub.on('createBlock', (result: boolean) => {
            console.log("createBlock");
            console.log(result);
            if (result == true) {
                this.createBlock();
                this.loading = false;
            } else {
                this.loading = false;
                this.concurrencyError();
            }
        });
 
        this.hub.on('Validate', (block: Block) => {
            console.log("On Validate");
            //console.log(block);
            if (block.created_by != this.user.id) {
                let chain: Block[] = JSON.parse(localStorage.getItem(block.chain_id.toString()));
                console.log("chain: " + chain.toString());
                let validation: Validation = new Validation();
                validation.user_id = this.user.id;
                validation.block_id = block.id;
                validation.isValid = utils.validateBlock(chain, block) ? 1 : 0;
                console.log("Invoke Validation");
                console.log(block.chain_id);
                this.hub.invoke('Validation', validation, block);
            }
        });

        this.hub.on('Validated', (chain: any) => {
            console.log("Validated");
            let chain_id: number = chain;
            console.log(this.chain.id);
            console.log(chain_id);
            //this.getChains(false, true);
            if (this.chain.id == chain_id) {
                console.log("hit refresh chain");
                this.getBlocks();
            }
        });

        this.hub.on("RefreshChains", (chain_id: number, chain: Block[]) => {
            console.log("New Chain Created");
            localStorage.setItem(chain_id.toString(), JSON.stringify(chain));
            this.getChains(false, true);
        });

        this.getChains(true);
        //if (sessionStorage.getItem("failure") !== null) {
        //    this.toastr.error(sessionStorage.getItem("failure"));
        //}
    }

    concurrencyError() {
        this.toastr.error("A block already exists with the provided `previous_hash`.", "Concurrency Error");
        console.log("mfer");
    }

    getUsers(user_id: number) {
        let results: any; let userItem: User;
        this.userService.getUsers(user_id)
            .subscribe(_users => {
                results = _users;
                results.forEach(result => {
                    userItem = result;
                    this.users.push(userItem);
                });
            });
    }

    getChains(init: boolean = false, refresh: boolean = false) {
        this.loading = true;
        this.chainService.getChains(this.user.id)
          .subscribe(_chains => {
            this.tempList = _chains;
            this.tempList.forEach(element => {
                this.tempChain = element;
                element = this.tempChain;
            });
            this.chains = this.tempList;
            this.tempList = null;
            this.tempChain = null;
            if (!refresh) {
                this.chain = this.chains[init ? 0 : this.chains.length-1];
                this.newChainID = this.chain.id;
                this.getBlocks();
            } else { this.loading = false; }
        });
    }

    getBlocks() {
        this.blockService.readBlocks(this.chain.id)
            .subscribe(_blocks => {
              this.tempList = _blocks;
              this.tempList.forEach(element => {
                  this.tempBlock = element;
                  element = this.tempBlock;
              });
              this.blocks = this.tempList;
              this.tempList = null;
              this.tempBlock = null;
              this.getValidations();
            });
    }

    getValidations() {
        for (let i = 0; i<this.blocks.length; i++) {
            let validResult: any; let validation: Validation;
            this.validationService.getValidation(this.blocks[i].id)
                .subscribe(result => {
                    validResult = result;
                    validation = validResult;
                    if (validation.isValidString.length > 7) {
                        this.toastr.error(validation.isValidString, "Middleware Failure");
                    }
                    else { this.blocks[i].isValid = validation.isValidString; }
                    if (i==this.blocks.length-1) {
                        let j: number = 0;
                        /*
                        while (j < this.blocks.length) {
                            if (this.blocks[j].isValid=="pending" && this.blocks[j].created_by!=this.user.id) {
                                this.blocks.splice(j, 1);
                            } else { j++; }
                        }
                        */
                        let o: number = 1;
                        this.blocks.forEach(block => {
                            block.order = o++;
                        });
                        this.blocksDataSource = new MatTableDataSource(this.blocks);
                        this.blocksDataSource.sort = this.sort;
                        this.loading = false;
                    }
                });
       }
    }

    changeChain(chain_id: number) {
        let i: number = 0;
        this.chains.forEach(_chain => {
            if (_chain.id == chain_id) {
                this.newChainIndex = i;
                this.chain = _chain;
                this.getBlocks();
            }
            i++;
        });
    }

    openNewChainDialog() {
        const dialogRef = this.dialog.open(NewChainDialogComponent, {
            data: { user: this.user, users: this.users }
          });
        
        dialogRef.beforeClose().subscribe(result => {
            if (result != undefined) {
                this.newChainName = result.chainDialogName;
                this.newChainInitData = result.chainDialogInitData;
                this.newChainUsers = result.selectedUsers;
                if (result.selectedGroups == undefined || result.selectedGroups == null)
                { this.newChainGroups = []; this.createChain() }
                else {
                    this.newChainGroups = result.selectedGroups;
                    result.selectedGroups.forEach(group_id => {
                        let results: any; let user: User;
                        this.userService.getGroupUsers(group_id)
                            .subscribe(_users => {
                                results = _users;
                                results.forEach(result => {
                                    user = result;
                                    result = user;
                                });
                                let users: User[] = results;
                                let limit = users.length; let i = 1;
                                users.forEach(user => {
                                    if (this.newChainUsers != undefined) {
                                        if (this.newChainUsers.indexOf(user.id.toString()) == -1) {
                                            this.newChainUsers.push(user.id);
                                        }
                                    } else { this.newChainUsers = [user.id]; }
                                    if (i==limit) { this.createChain(); }
                                    i++;
                                });
                            });
                        });
                }
            }
        });
    }

    createChain() {
        let newChain: Chain = new Chain();
        newChain.created_by = this.user.id;
        newChain.name = this.newChainName;
        newChain.initValue = this.newChainInitData;
        newChain.users = this.newChainUsers;
        newChain.groups = this.newChainGroups;

        //figure out how to insert timestamp before inserting in the DB
        let initBlock: Block = new Block()
        initBlock.created_by = this.user.id;
        initBlock.data = +this.newChainInitData;
        initBlock.nonce = utils.nonce(initBlock);
        let json: string = JSON.stringify({
            created_by: initBlock.created_by,
            data: initBlock.data,
            nonce: initBlock.nonce
        });
        initBlock.hash = sha256(json);

        let postResult: any;
        this.chainService.postChain(newChain)
            .subscribe(_result => {
                postResult = _result;
                this.newChainResult = postResult;
                if (this.newChainResult == 0) {
                    this.toastr.error("Failed to create chain.", "Chain Failure");
                } else {
                    this.toastr.success(this.newChainName, "New Chain Created");
                    initBlock.chain_id = this.newChainResult;
                    this.postInitBlock(initBlock);
                }
            });
    }

    postInitBlock(initBlock: Block) {
        let initBlockResult: number;
        let rawResult: any;
        this.blockService.createInitBlock(initBlock)
            .subscribe(result => {
                rawResult = result;
                initBlockResult = rawResult;
                if (initBlockResult != 0) {
                    this.toastr.success(initBlock.data.toString(), "New Chain Initiated");
                    let chain_id: number = initBlock.chain_id;
                    initBlock.chain_id = undefined; initBlock.id = initBlockResult;
                    let chain: Block[] = [initBlock];
                    localStorage.setItem(chain_id.toString(), JSON.stringify(chain));
                    this.getChains();
                    console.log("invoke RefreshChains");
                    this.hub.invoke("RefreshChains", chain_id, chain);
                } else {
                    this.toastr.error("Failed to initiate chain.", "Chain Failure");
                }
            });
    }

    openNewBlockDialog(): void {
      const dialogRef = this.dialog.open(NewBlockDialogComponent, {
        data: { newBlockData: this.newBlockData }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          this.newBlockData = result;

          //let newBlock: Block = new Block()
          this.newBlock.previous_hash = this.blocks[this.blocks.length-1].hash;
          this.newBlock.created_by = this.user.id;
          this.newBlock.data = +this.newBlockData;
          this.newBlock.nonce = utils.nonce(this.newBlock);
          let json: string = JSON.stringify({
              created_by: this.newBlock.created_by,
              data: this.newBlock.data,
              nonce: this.newBlock.nonce
          });
          this.newBlock.hash = sha256(this.newBlock.previous_hash+json);
          this.newBlock.chain_id = this.chain.id;
          console.log("invoke CheckBlock");
          this.hub.invoke('CheckBlock', this.newBlock);
          this.loading = true;

          this.newBlockData = "";
        }
      });
    }

    createBlock() {
        let rawResult: any;
        let newBlockResult: number;
        this.blockService.createBlock(this.newBlock)
            .subscribe(result => {
                rawResult = result;
                newBlockResult = rawResult;
                console.log("newBlockResult: " + newBlockResult);
                if (newBlockResult == 0) {
                    this.toastr.error(this.newBlock.data.toString(), "Invalid Data");
                } else if (newBlockResult == -1) {
                    this.toastr.error("Error was thrown in Middleware.", "Request Error");
                } else {
                    this.toastr.success(this.newBlock.data.toString(), "Block Added");
                    let storedChain: Block[] = JSON.parse(localStorage.getItem(this.newBlock.chain_id.toString()));
                    this.newBlock.id = newBlockResult;
                    storedChain.push(this.newBlock);
                    localStorage.setItem(this.newBlock.chain_id.toString(), JSON.stringify(storedChain));
                    console.log("invoke NewBlock");
                    this.hub.invoke('NewBlock', this.newBlock.id, this.newBlock.chain_id);
                    this.getBlocks();
                }
                this.newBlock = new Block();
            });
    }
}
