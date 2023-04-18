import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CobrarService {

    constructor(private _httpClient: HttpClient) {
    }

    obtenerListaCobros(datos) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/cobrarSupermonedas/list/`, datos);
    }

    obtenerCobro(datos) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/pagos/list/`, datos);
    }

    guardarCobro(datos) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/movimientoCobros/create/`, datos);
    }

    // preautorizarCobro(datos){
    //   return this._httpClient.post<any>(`${environment.apiUrl}/corp/cobrarSupermonedas/update/${datos.id}`,datos);
    // }

}
