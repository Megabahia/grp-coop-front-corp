import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FacturacionService} from '../facturacion/facturacion.service';
import {EnvioDocumentosService} from './envio-documentos.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-envio-documentos',
    templateUrl: './envio-documentos.component.html',
    styleUrls: ['./envio-documentos.component.scss']
})
export class EnvioDocumentosComponent implements OnInit {
    public submitted = false;
    public envioForm: FormGroup;
    public actualizarCreditoFormData;
    private mensaje: string;
    public identificacion;
    private creditoConsulta;
    public dataUser;
    public soltero = false;
    public negocioPropio = false;
    public credito;
    public enviarForm = false;

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private route: ActivatedRoute,
        private _consultaCreditosService: EnvioDocumentosService,
        private modalService: NgbModal,
    ) {
        this.creditoConsulta = JSON.parse(localStorage.getItem('creditoConsulta'));
    }

    ngOnInit(): void {

        this.route.params.subscribe((params: Params) => this.identificacion = params['identificacion']);
        // if (this.identificacion) {
        //     this.mensaje = 'Primero consulte crèdito';
        //     this.modalOpenSLC('#modalSLC');
        // }
        this.actualizarCreditoFormData = new FormData();

        this.envioForm = this._formBuilder.group({
            solicitudCredito: [''], //
            evaluacionCrediticia: [''], //
            buro: [''], //
            identificacion: ['', [Validators.required]], //
            ruc: ['', [Validators.required]], //
            papeletaVotacion: ['', [Validators.required]], //
            identificacionConyuge: [''], //
            papeletaVotacionConyuge: [''], //
            fotoCarnet: ['', [Validators.required]], //
            planillaLuzDomicilio: ['', [Validators.required]], //
            planillaLuzNegocio: [''], //
            facturasCompra: [''], //
            facturasVenta: [''], //
            mecanizadoIees: ['', [Validators.required]], //
            matriculaVehiculo: ['', [Validators.required]], //
            impuestoPredial: ['', [Validators.required]], //
            autorizacionInformacion: ['', [Validators.required]], //
            fichaCliente: ['', [Validators.required]], //
            conveniosCuenta: ['', [Validators.required]], //
            pagare: ['', [Validators.required]], //
            tablaAmortizacion: ['', [Validators.required]], //
            seguroDesgravamen: ['', [Validators.required]], //
            gastosAdministracion: ['', [Validators.required]], //
        });

        this._consultaCreditosService.getCredito({...this.creditoConsulta, page_size: 1, page: 0}).subscribe((info) => {
            this.credito = info.info[0];
            this.dataUser = info.info[0].user;
            if (this.dataUser.estadoCivil === 'Solter@' || this.dataUser.estadoCivil === 'Divorciad@') {
                this.soltero = true;
                this.envioForm.controls['identificacionConyuge'].clearValidators();
                this.envioForm.controls['papeletaVotacionConyuge'].clearValidators();
            } else {
                this.envioForm.controls['identificacionConyuge'].setValidators([Validators.required]);
                this.envioForm.controls['identificacionConyuge'].setValue('');
                this.envioForm.controls['papeletaVotacionConyuge'].setValidators([Validators.required]);
                this.envioForm.controls['papeletaVotacionConyuge'].setValue('');
                this.soltero = false;
            }
            if (this.dataUser.tipoPersona === 'Negocio propio') {
                this.negocioPropio = true;
                this.envioForm.controls['planillaLuzNegocio'].setValidators([Validators.required]);
                this.envioForm.controls['planillaLuzNegocio'].setValue('');
                this.envioForm.controls['facturasCompra'].setValidators([Validators.required]);
                this.envioForm.controls['facturasCompra'].setValue('');
                this.envioForm.controls['facturasVenta'].setValidators([Validators.required]);
                this.envioForm.controls['facturasVenta'].setValue('');
            } else {
                this.negocioPropio = false;
                this.envioForm.controls['planillaLuzNegocio'].clearValidators();
                this.envioForm.controls['facturasCompra'].clearValidators();
                this.envioForm.controls['facturasVenta'].clearValidators();

            }
        }, (error) => {
            this.mensaje = 'Error al guardar los datos' + error;
            // this.modalOpenSLC(modal);
            return;
        });
    }

    subirDoc(event, key) {
        if (event.target.files && event.target.files[0]) {
            const doc = event.target.files[0];
            this.actualizarCreditoFormData.delete(`${key}`);
            this.actualizarCreditoFormData.append(`${key}`, doc, Date.now() + '_' + doc.name);
        }
    }

    get envioControlsForm() {
        return this.envioForm.controls;
    }

    enviar(modal) {
        this.submitted = true;
        if (this.envioForm.invalid) {
            return;
        }
        this.enviarForm = true;
        this.actualizarCreditoFormData.set('numeroIdentificacion', this.identificacion);
        this._consultaCreditosService.guardarDatos(this.actualizarCreditoFormData).subscribe((info) => {
            this.enviarForm = false;
            this._router.navigate(['/comercial/guia-remision']);

        }, (error) => {
            this.enviarForm = false;
            this.mensaje = 'Error al guardar los datos' + error;
            this.modalOpenSLC(modal);
            return;
        });
    }

    modalOpenSLC(modalSLC) {
        this.modalService.open(modalSLC, {
                centered: true,
                size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
            }
        );
    }

}
