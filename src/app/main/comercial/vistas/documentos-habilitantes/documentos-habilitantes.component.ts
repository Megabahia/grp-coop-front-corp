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
        {'label': 'Copia de cédula', 'valor': 'identificacion'},
        {'label': 'Foto tamaño carnet', 'valor': 'fotoCarnet'},
        {'label': 'Papeleta de votación', 'valor': 'papeletaVotacion'},
        {'label': 'Copia de cédula de cónyuge', 'valor': 'identificacionConyuge'},
        {'label': 'Papeleta de votación de cónyuge', 'valor': 'papeletaVotacionConyuge'},
        {'label': 'Copia de planilla de luz del Domicilio', 'valor': 'planillaLuzDomicilio'},
        {'label': 'Mecanizado del IESS', 'valor': 'mecanizadoIess'},

        {'label': 'Copia de matrícula del vehículo', 'valor': 'matriculaVehiculo'},
        {'label': 'Copia de pago de impuesto predial', 'valor': 'impuestoPredial'},
        {'label': 'Buró de Crédito', 'valor': 'buroCredito'},

        {'label': 'Copia de planilla de luz del Negocio, Oficina o de la Asociación', 'valor': 'planillaLuzNegocio'},
        {'label': 'Copia de la Factura de venta del último mes', 'valor': 'facturasVentas2meses'},
        {'label': 'Copia de la Factura de venta del penúltimo mes (hace 2 meses)', 'valor': 'facturasVentas2meses2'},
        {'label': 'Certificado de la Asociación (es opcional y aplica si usted es transportista: Bus o Taxi)', 'valor': 'facturasVentasCertificado'},
        {'label': 'Certificado de la Asociación (es opcional y aplica si usted es transportista: Bus o Taxi)', 'valor': 'facturasVentasCertificado'},

        {'label': 'Solicitud de crédito', 'valor': 'solicitudCredito'},
        {'label': 'Evaluación crediticia', 'valor': 'evaluacionCrediticia'},
        {'label': 'Buró Institución Financiera', 'valor': 'buroCreditoIfis'},
        {'label': 'Pagaré', 'valor': 'pagare'},
        {'label': 'Contratos de cuenta', 'valor': 'contratosCuenta'},
        {'label': 'Tabla de amortización', 'valor': 'tablaAmortizacion'},
    ];

    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private _consultaCreditosService: DocumentosHabilitantesService,
    ) {
    }
public ver = false;
    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => this.idCredito = params['identificacion']);
        this._consultaCreditosService.obtenerCredito(this.idCredito).subscribe((info) => {
            // this._consultaCreditosService.obtenerCredito('6351823c5a5d48154714551b').subscribe((info) => {
            this.credito = info;
            this.ver = true;
        });

    }

    continuar() {
        this._router.navigate(['/comercial/envio-doocumentos', this.credito.numeroIdentificacion]);
    }
}
