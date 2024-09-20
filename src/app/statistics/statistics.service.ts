import { Injectable } from "@angular/core";
import { ServiceService } from 'src/services/service.service';

@Injectable({
    providedIn: 'root'
})

export class StatisticsService {

    constructor(private serviceService: ServiceService) { }

    registerUser(data) {
        return this.serviceService.post('register', data);
    }

    getNote() {
        return this.serviceService.get('note?bydate=true');
    }

    logout() {
        return this.serviceService.get('logout');
    }

}