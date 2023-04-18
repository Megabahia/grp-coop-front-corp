import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FacturacionService {

    constructor(private _httpClient: HttpClient) {
    }
    consultarDatos(id) {
        return this._httpClient.get<any>(`${environment.apiUrl}/corp/notasPedidos/listOne/factura/${id}`);
    }
    guardarDatos(data) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/notasPedidos/create/factura/`, data);
    }
    consultarDatosaArchivos(data) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoArchivos/documentosFirmados/listar/`, data);
    }
}
