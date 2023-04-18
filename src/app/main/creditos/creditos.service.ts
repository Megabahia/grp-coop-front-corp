import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class CreditosService {
  constructor(private _httpClient: HttpClient) {}
  obtenerCreditos(datos) {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/corp/creditoPersonas/list/`,
      datos
    );
  }
  obtenerCredito(id) {
    return this._httpClient.get<any>(
      `${environment.apiUrl}/corp/creditoPersonas/listOne/${id}`
    );
  }
  actualizarCreditos(datos) {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/corp/creditoPersonas/update/${datos.id}`,
      datos
    );
  }
  obtenerCreditoSelecionado(id) {
    return this._httpClient.get<any>(
      `${environment.apiUrl}/corp/creditoPersonas/listOne/persona/${id}`
    );
  }
}
