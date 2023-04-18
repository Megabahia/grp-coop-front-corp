import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DocumentosHabilitantesService} from './documentos-habilitantes.service';
import {Validators} from '@angular/forms';

@Component({
    selector: 'app-documentos-habilitantes',
    templateUrl: './documentos-habilitantes.component.html',
    styleUrls: ['./documentos-habilitantes.component.scss']
})
export class DocumentosHabilitantesComponent implements OnInit {

    public idCredito;
    public credito;

    public documentos = [
        {'label': 'Solicitud de crédito', 'valor': 'solicitudCredito'},
        {'label': 'Evaluación crediticia', 'valor': 'evaluacionCrediticia'},
        {'label': 'Documento Buró', 'valor': 'buro'},
        {'label': 'Copia de cédula y/o RUC ', 'valor': 'identificacion'},
        {'label': 'Papeleta de votación', 'valor': 'papeletaVotacion'},
        {'label': 'Copia de cédula de cónyuge', 'valor': 'identificacionConyuge'},
        {'label': 'Papeleta de votación de cónyuge', 'valor': 'papeletaVotacionConyuge'},
        {'label': 'Copia de planilla de luz del Domicilio', 'valor': 'planillaLuzDomicilio'},
        {'label': 'Mecanizado del IESS', 'valor': 'mecanizadoIees'},
        {'label': 'Copia de matrícula del vehículo', 'valor': 'matriculaVehiculo'},
        {'label': 'Copia de pago de impuesto predial', 'valor': 'impuestoPredial'},
        {'label': 'Autorización de información ', 'valor': 'autorizacionInformacion'},
        {'label': 'Ficha cliente creado ', 'valor': 'fichaCliente'},
        {'label': 'Convenios cuenta creada', 'valor': 'conveniosCuenta'},
        {'label': 'Pagaré', 'valor': 'pagare'},
        {'label': 'Tabla de amortización', 'valor': 'tablaAmortizacion'},
        {'label': 'Seguro de desgravamen', 'valor': 'seguroDesgravamen'},
        {'label': 'Gastos Administrativos', 'valor': 'gastosAdministracion'},
    ];

    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private _consultaCreditosService: DocumentosHabilitantesService,
    ) {
    }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => this.idCredito = params['identificacion']);
        this._consultaCreditosService.obtenerCredito(this.idCredito).subscribe((info) => {
            // this._consultaCreditosService.obtenerCredito('6351823c5a5d48154714551b').subscribe((info) => {
            this.credito = info;

        });

    }

    continuar() {
        this._router.navigate(['/comercial/envio-doocumentos', this.credito.numeroIdentificacion]);
    }
}
