import { Injectable } from "@angular/core";
import { ServiceService } from 'src/services/service.service';

@Injectable({
    providedIn: 'root'
})

export class RegisterService {

    constructor(private serviceService: ServiceService) { }

    registerUser(data) {
        return this.serviceService.post('register', data);
    }

}