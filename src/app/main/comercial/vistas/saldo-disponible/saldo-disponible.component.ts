import { Component, OnInit } from '@angular/core';
import {SaldoContableService} from '../saldo-contable/saldo-contable.service';

@Component({
  selector: 'app-saldo-disponible',
  templateUrl: './saldo-disponible.component.html',
  styleUrls: ['./saldo-disponible.component.scss']
})
export class SaldoDisponibleComponent implements OnInit {

  public page_size: any = 10;
  public collectionSize;
  public page = 1;
  public cliente;
  public notasPedido = [];

  constructor(
      private _consultaCreditosService: SaldoContableService,
  ) { }

  ngOnInit(): void {
    this._consultaCreditosService.listarEnvios({page_size: this.page_size, page: this.page, estado: ['Aprobado']})
        .subscribe((data) => {
          this.notasPedido = data.info;
        });
  }

  datosCliente(cliente) {
    this.cliente = JSON.parse(cliente);
    return this.cliente.nombre + ' ' + this.cliente.apellido;
  }
}
