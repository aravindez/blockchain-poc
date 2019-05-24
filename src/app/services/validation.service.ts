import { Injectable } from '@angular/core';
import { ServiceFactory } from './ServiceFactory';
import { Validation } from '../../models/validation';
 
@Injectable()
export class ValidationService {
 
    constructor(private sf : ServiceFactory) { }

    getValidation(block_id: number) {
        return this.sf.callRequest("GET", "/api/Block/GetValidation?block_id=" + block_id.toString());
            //.get("http://localhost:5000/api/Block/GetValidation?block_id=" + block_id.toString(),
            //  { responseType: 'text' });
    }

    getPendingBlocks(user_id: number) {
        return this.sf.callRequest("GET", "/api/Block/GetPendingBlocks?user_id=" + user_id.toString());
    }

    postValidation(validation: Validation) {
        return this.sf.callRequest("POST", "/api/Block/PostValidation", validation);
    }
}