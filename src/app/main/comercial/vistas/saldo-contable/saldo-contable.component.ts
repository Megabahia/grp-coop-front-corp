import {Component, OnInit} from '@angular/core';
import {EnviosRealizadosService} from '../envios-realizados/envios-realizados.service';
import {SaldoContableService} from './saldo-contable.service';

@Component({
    selector: 'app-saldo-contable',
    templateUrl: './saldo-contable.component.html',
    styleUrls: ['./saldo-contable.component.scss']
})
export class SaldoContableComponent implements OnInit {
    public page_size: any = 10;
    public collectionSize;
    public page = 0;
    public notasPedido = [];
    public cliente;

    constructor(
        private _consultaCreditosService: SaldoContableService,
    ) {
    }

    ngOnInit(): void {
        this._consultaCreditosService.listarEnvios({page_size: this.page_size, page: this.page})
            .subscribe((data) => {
                this.notasPedido = data.info;
            });
    }

    datosCliente(cliente) {
        this.cliente = JSON.parse(cliente);
        return this.cliente.nombre + ' ' + this.cliente.apellido;
    }

}
