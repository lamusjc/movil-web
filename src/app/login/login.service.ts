import { Injectable } from "@angular/core";
import { ServiceService } from 'src/services/service.service';

@Injectable({
    providedIn: 'root'
})

export class LoginService {
    public isAuthenticated = false;
    constructor(private serviceService: ServiceService) { }

    loginUser(data) {
        return this.serviceService.post('login', data);
    }

}