import { Block } from './models/block';
import { Validation } from './models/validation'
import { ValidationService } from './app/services/validation.service';
import { sha256 } from 'js-sha256';

export function nonce(block: Block): number {
    let ret: string[] = [];
    let nonce: number = 1;
    
    while (true) {
        let json: string = JSON.stringify({
            //timestamp: block.timestamp,
            created_by: block.created_by,
            data: block.data,
            nonce: nonce
        })
        let possHashString: string = block.previous_hash + json;
        let possHash: string = sha256(possHashString);
        let valid: boolean = true;
        for (let i:number = 0; i<2; i++) {
            if (possHash[i] != '0') {
                valid = false;
            }
        }
        if (valid) {
            return nonce;
        } else {
            nonce++;
        }
    }
}

export function validateBlock(chain: Block[], block: Block): boolean {
    let possBlock: Block = new Block();
    possBlock.previous_hash = block.previous_hash;
    possBlock.created_by = block.created_by;
    possBlock.data = block.data;
    let possNonce: number = nonce(possBlock);

    let json: string = JSON.stringify({
        created_by: possBlock.created_by,
        data: possBlock.data,
        nonce: possNonce
    })
    let possHashString: string = block.previous_hash + json;
    let possHash: string = sha256(possHashString);

    return block.hash == possHash;
}

// These functions are to manage validating blocks whenever the user changes pages, 
// but more thought needs to go into how the app works before they can be implemented.
/*
export function getValidation() {

}

export function postValidation() {

}

export function route(path: string) {

}
*/