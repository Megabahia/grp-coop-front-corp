import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class EnvioDocumentosService {
    constructor(private _httpClient: HttpClient) {
    }

    guardarDatos(data) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoArchivos/subir/documentosFirmados/`, data);
    }
    getCredito(data) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoPersonas/list/`, data);
    }
}
