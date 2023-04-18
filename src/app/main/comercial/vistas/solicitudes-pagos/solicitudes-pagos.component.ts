import {Component, OnInit} from '@angular/core';
import {SolicitudesPagosService} from './solicitudes-pagos.service';

@Component({
    selector: 'app-solicitudes-pagos',
    templateUrl: './solicitudes-pagos.component.html',
    styleUrls: ['./solicitudes-pagos.component.scss']
})
export class SolicitudesPagosComponent implements OnInit {

    public page_size: any = 10;
    public collectionSize;
    public page = 0;
    public envios = [];
    public cliente;

    constructor(
        private _solicitudesPagosService: SolicitudesPagosService,
    ) {
    }

    ngOnInit(): void {
        this._solicitudesPagosService.listarPagos({page_size: this.page_size, page: this.page})
            .subscribe((data) => {
                this.envios = data.info;
            });
    }

}
