import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class NotasPedidoService {
  constructor(private _httpClient: HttpClient) {}

  obtenerListaNotasPedido(datos) {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/corp/notasPedidos/list/`,
      datos
    );
  }
  obtenerInformacionPersona(datos) {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/personas/personas/listOne/cedula/`,
      datos
    );
  }
  crearNotaPedido(datos) {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/corp/notasPedidos/create/`,
      datos
    );
  }
  actualizarNotaPedido(datos) {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/corp/notasPedidos/update/${datos.id}`,
      datos
    );
  }
  generarCodigo(datos) {
    return this._httpClient.post<any>(
      `${environment.apiUrl}/corp/notasPedidos/generar/habilitantes/credito/`,
      datos
    );
  }
  obtenerNotaPedido(id) {
    return this._httpClient.get<any>(
      `${environment.apiUrl}/corp/notasPedidos/listOne/${id}`
    );
  }
}
