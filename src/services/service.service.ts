import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from './url.service';


@Injectable({
    providedIn: 'root'
})

export class ServiceService {

    constructor(private HttpClient: HttpClient, private UrlService: UrlService) { }

    get(endpoint): Observable<any> {
        const headers = {
            headers: new HttpHeaders({
                'Content-Type': "application/json"
            }),
            withCredentials: true
        };

        return this.HttpClient.get(this.UrlService.getUrl() + endpoint, headers);
    }

    post(endpoint, data): Observable<any> {
        const headers = {
            headers: new HttpHeaders({
                'Content-Type': "application/json"
            }),
            withCredentials: true
        };

        return this.HttpClient.post(this.UrlService.getUrl() + endpoint, data, headers);
    }


    put(endpoint, data?): Observable<any> {
        const headers = {
            headers: new HttpHeaders({
                'Content-Type': "application/json"
            }),
            withCredentials: true
        };

        return this.HttpClient.put(this.UrlService.getUrl() + endpoint, data, headers);
    }

    delete(endpoint): Observable<any> {
        const headers = {
            headers: new HttpHeaders({
                'Content-Type': "application/json"
            }),
            withCredentials: true
        };

        return this.HttpClient.delete(this.UrlService.getUrl() + endpoint, headers);
    }

}