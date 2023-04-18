import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class SaldoContableService {

    constructor(private _httpClient: HttpClient) {
    }

    listarEnvios(data) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/notasPedidos/list/factura/`, data);
    }
}
