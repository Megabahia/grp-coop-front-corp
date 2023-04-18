import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {FlatpickrOptions} from 'ng2-flatpickr';

@Injectable({
    providedIn: 'root'
})
export class GuiaRemisionService {



    constructor(private _httpClient: HttpClient) {
    }

    guardarDatos(data) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/envios/create/`, data);
    }
}
