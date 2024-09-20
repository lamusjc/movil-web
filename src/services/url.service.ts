import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class UrlService {
    url: any;
    constructor() {
        this.url = 'https://mysql-movil-lamus.herokuapp.com/'
    }

    getUrl() {
        return this.url;
    }

}