import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteCobrosService {

  constructor(private _httpClient: HttpClient) { }

  obtenerCobros(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/monedasEmpresa/list/`, datos);
  }
}
