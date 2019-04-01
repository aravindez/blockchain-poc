import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
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

@Component({
    selector: 'app-read-blocks',
    templateUrl: './read-blocks.component.html',
    styleUrls: ['./read-blocks.component.css'],
    providers: [BlockService, ChainService, UserService, ValidationService]
})
export class ReadBlocksComponent implements OnInit {

    //ui variables
    displayedColumns: string[] = ['timestamp', 'user_id', 'user_name', 'data', 'hash', 'nonce', 'isValid'];
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

        this.getChains(true);
        if (sessionStorage.getItem("failure") !== null) {
            this.toastr.error(sessionStorage.getItem("failure"));
        }
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

    getChains(init: boolean = false) {
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
            this.chain = this.chains[init ? 0 : this.chains.length-1];
            this.newChainID = this.chain.id;
            this.getBlocks();
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
            let validResult: any;
            this.validationService.getValidation(this.blocks[i].id)
                .subscribe(result => {
                    validResult = result;
                    this.blocks[i].isValid = validResult;
                    if (i==this.blocks.length-1) {
                        let j: number = 0;
                        /*
                        while (j < this.blocks.length) {
                            if (this.blocks[j].isValid=="pending" && this.blocks[j].created_by!=this.user.id) {
                                this.blocks.splice(j, 1);
                            } else { j++; }
                        }
                        */
                        this.blocksDataSource = new MatTableDataSource(this.blocks);
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
        });
    }

    createChain() {
        let newChain: Chain = new Chain();
        newChain.created_by = this.user.id;
        newChain.name = this.newChainName;
        newChain.initValue = this.newChainInitData;
        newChain.users = this.newChainUsers;
        newChain.groups = this.newChainGroups;
        console.log(this.newChainGroups);

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
        let initBlockResult: boolean = false;
        let rawResult: any;
        this.blockService.createInitBlock(initBlock)
            .subscribe(result => {
                rawResult = result;
                initBlockResult = rawResult;
                if (initBlockResult) {
                    this.toastr.success(initBlock.data.toString(), "New Chain Initiated");
                    this.getChains();
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

          let newBlock: Block = new Block()
          newBlock.previous_hash = this.blocks[this.blocks.length-1].hash;
          newBlock.created_by = this.user.id;
          newBlock.data = +this.newBlockData;
          newBlock.nonce = utils.nonce(newBlock);
          let json: string = JSON.stringify({
              created_by: newBlock.created_by,
              data: newBlock.data,
              nonce: newBlock.nonce
          });
          newBlock.hash = sha256(newBlock.previous_hash+json);
          newBlock.chain_id = this.chain.id;

          this.createBlock(newBlock);
          this.newBlockData = "";
        }
      });
    }

    createBlock(newBlock: Block) {
        let rawResult: any;
        let newBlockResult: boolean;
        this.blockService.createBlock(newBlock)
            .subscribe(result => {
                rawResult = result;
                newBlockResult = rawResult;
                if (newBlockResult) {
                    this.toastr.success(newBlock.data.toString(), "Block Added");
                    this.getBlocks();
                } else {
                    this.toastr.error(newBlock.data.toString(), "Invalid Data");
                }
            });
    }
}
