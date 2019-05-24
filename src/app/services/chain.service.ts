import { Injectable } from '@angular/core';
import { ServiceFactory } from './ServiceFactory';
import { Chain } from '../../models/chain';
 
@Injectable()
export class ChainService {
 
    constructor(private sf : ServiceFactory) { }

    getChains(user_id: number) {
        return this.sf.callRequest("GET", "/api/Chain/GetChainItems?user_id=" + user_id.toString());
    }

    getValidChain(chain_id: number, store: boolean = false) {
        return this.sf.callRequest("GET", "/api/Chain/GetChain?chain_id=" + chain_id.toString()
                + "&store=" + String(store));
    }

    getChain(chain_id: number) {
        return this.sf.callRequest("GET", "/api/Chain/GetChain?chain_id=" + chain_id.toString());
    }
    
    postChain(newChain: Chain) {
        return this.sf.callRequest("POST", "/api/Chain/PostChainItem", newChain);
    }
}