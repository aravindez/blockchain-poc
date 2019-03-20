import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Validation } from '../../models/validation';
 
@Injectable()
export class ValidationService {
 
    constructor(private _http: HttpClient) { }

    getValidation(block_id: number) {
        return this._http
            .get("http://localhost:5000/api/Block/GetValidation?block_id=" + block_id.toString(),
              { responseType: 'text' });
    }

    getPendingBlocks(user_id: number) {
        return this._http
            .get("http://localhost:5000/api/Block/GetPendingBlocks?user_id=" + user_id.toString());
    }

    postValidation(validation: Validation) {
        return this._http
            .post("http://localhost:5000/api/Block/PostValidation", validation);
    }
}