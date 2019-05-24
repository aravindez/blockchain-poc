import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceFactory {

    http: any;
    environment: any;
    // We need Http to talk to a remote server
    constructor(private _http : HttpClient) {
        this.http = _http;
        this.environment = environment;
    }

    callRequest(verb: string, apiString: string, model?: any) {
        // header options for PUT', 'POST', and 'DELETE'
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', '*/*');
        if (verb == "GET") {
            return this.http
                .get(this.environment.apiRoot + apiString);
        } else if (verb == "POST") {
            return this.http
                .post(this.environment.apiRoot + apiString, model, { headers: headers });
        } else {
            throw new Error("invalid callRequest");
        }
    }

}