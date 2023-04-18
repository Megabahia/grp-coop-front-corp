import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DocumentosHabilitantesService {

    constructor(private _httpClient: HttpClient) {
    }
    obtenerCredito(id) {
        return this._httpClient.get<any>(`${environment.apiUrl}/corp/creditoPersonas/listOne/${id}`);
    }
    guardarDatos(data) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/notasPedidos/create/factura/`, data);
    }
}
