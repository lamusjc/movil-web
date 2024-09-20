import { Injectable } from "@angular/core";
import { ServiceService } from 'src/services/service.service';

@Injectable({
    providedIn: 'root'
})

export class HomeService {

    constructor(private serviceService: ServiceService) { }

    createNote(data) {
        return this.serviceService.post('note', data);
    }

    getNote() {
        return this.serviceService.get('note?bydate=false');
    }

    modifyNote(data) {
        return this.serviceService.put('note', data);
    }

    deleteNote(data) {
        return this.serviceService.delete('note/' + data.note_id);
    }

    updatePosition(arr){
        return this.serviceService.post("updatePosition", arr);
    }

    logout() {
        return this.serviceService.get('logout');
    }

}