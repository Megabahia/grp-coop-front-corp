import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FacturacionService} from '../facturacion/facturacion.service';
import {EnvioDocumentosService} from './envio-documentos.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

/**
 * COOP
 * Corp
 * ESta pantalla sirve para subir los archivos de los documentos habilitantes
 * Rutas:
 * `${environment.apiUrl}/corp/creditoArchivos/subir/documentosFirmados`,
 */
@Component({
    selector: 'app-envio-documentos',
    templateUrl: './envio-documentos.component.html',
    styleUrls: ['./envio-documentos.component.scss']
})
export class EnvioDocumentosComponent implements OnInit {
    public submitted = false;
    public envioForm: FormGroup;
    public actualizarCreditoFormData;
    public mensaje: string;
    public identificacion;
    private creditoConsulta;
    public dataUser;
    public soltero = false;
    public negocioPropio = false;
    public credito: any = {};
    public enviarForm = false;
    public facturaFisicaId = '';
    public tieneDocumentosFirmados = false;

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private route: ActivatedRoute,
        private _consultaCreditosService: EnvioDocumentosService,
        private modalService: NgbModal,
        private _fatturacion: FacturacionService,
    ) {
        this.creditoConsulta = JSON.parse(localStorage.getItem('creditoConsulta'));
        this._consultaCreditosService.getUltimaFactura({_id: localStorage.getItem('idCredito')}).subscribe((info) => {
            this.facturaFisicaId = info._id;
        }, error => console.log('error', error));
    }

    ngOnInit(): void {

        this.route.params.subscribe((params: Params) => this.identificacion = params['identificacion']);
        // if (this.identificacion) {
        //     this.mensaje = 'Primero consulte crèdito';
        //     this.modalOpenSLC('#modalSLC');
        // }
        this.actualizarCreditoFormData = new FormData();
        this.actualizarFormulario();
        this._fatturacion.consultarDatosaArchivos({numeroIdentificacion: this.creditoConsulta.identificacion}).subscribe((info) => {
            this.tieneDocumentosFirmados = info._id !== null;
        });
        this._consultaCreditosService.getCredito({...this.creditoConsulta, page_size: 1, page: 0}).subscribe((info) => {
            this.credito = info.info[0];
            this.dataUser = info.info[0].user;
            this.actualizarFormulario();
            if (this.credito.estadoCivil === 'Solter@' || this.credito.estadoCivil === 'Soltero' ||
                this.credito.user.estadoCivil === 'Solter@' || this.credito.user.estadoCivil === 'Divorciado' ||
                this.credito.estadoCivil === 'Divorciad@' || this.credito.estadoCivil === 'Divorciado') {
                this.soltero = true;
                if (!this.credito.identificacionConyuge) {
                    this.envioForm.controls['identificacionConyuge'].clearValidators();
                }
                if (!this.credito.identificacionConyuge) {
                    this.envioForm.controls['papeletaVotacionConyuge'].clearValidators();
                }
            } else {
                if (!this.credito.identificacionConyuge) {
                    this.envioForm.controls['identificacionConyuge'].setValidators([Validators.required]);
                    this.envioForm.controls['identificacionConyuge'].setValue('');
                }
                if (!this.credito.identificacionConyuge) {
                    this.envioForm.controls['papeletaVotacionConyuge'].setValidators([Validators.required]);
                    this.envioForm.controls['papeletaVotacionConyuge'].setValue('');
                }
                this.soltero = false;
            }
            if (this.dataUser.tipoPersona === 'Negocio propio') {
                this.negocioPropio = true;
                if (!this.credito.planillaLuzNegocio) {
                    this.envioForm.controls['planillaLuzNegocio'].setValidators([Validators.required]);
                    this.envioForm.controls['planillaLuzNegocio'].setValue('');
                }
                if (!this.credito.facturasVenta) {

                    this.envioForm.controls['facturasVenta'].setValidators([Validators.required]);
                    this.envioForm.controls['facturasVenta'].setValue('');
                }
            } else {
                this.negocioPropio = false;
                this.envioForm.controls['planillaLuzNegocio'].clearValidators();
                // this.envioForm.controls['facturasCompra'].clearValidators();
                // this.envioForm.controls['facturasVenta'].clearValidators();
            }
            // this.envioForm.patchValue(this.credito);
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
        if (this.actualizarCreditoFormData.invalid) {
            console.log(this.actualizarCreditoFormData);
            return;
        }
        this.enviarForm = true;
        this.actualizarCreditoFormData.set('numeroIdentificacion', this.identificacion);
        this.actualizarCreditoFormData.set('credito_id', localStorage.getItem('idCredito'));
        this._consultaCreditosService.guardarDatos(this.actualizarCreditoFormData).subscribe((info) => {
            this._consultaCreditosService.actualizarFacturaFisica({estado: 'Pendiente', _id: this.facturaFisicaId}).subscribe((data) => {
                this.enviarForm = false;
                this._router.navigate(['/comercial/guia-remision']);
            }, (error) => {
                console.log('eerrir', error);
            });
        }, (error) => {
            this.enviarForm = false;
            this.mensaje = 'Error al guardar los datos' + error;
            this.modalOpenSLC(modal);
            return;
        });
    }

    actualizarFormulario() {
        this.envioForm = this._formBuilder.group({
            solicitudCredito: [''], //
            evaluacionCrediticia: [''], //
            buro: [''], //
            identificacion: ['', !this.tieneDocumentosFirmados ? [Validators.required] : []], //
            // ruc: ['', [Validators.required]], //
            papeletaVotacion: ['', !this.tieneDocumentosFirmados ? [Validators.required] : []], //
            identificacionConyuge: [''], //
            papeletaVotacionConyuge: [''], //
            fotoCarnet: ['', !this.tieneDocumentosFirmados ? [Validators.required] : []], //
            planillaLuzDomicilio: ['', !this.tieneDocumentosFirmados ? [Validators.required] : []], //
            planillaLuzNegocio: [''], //
            // facturasCompra: [''], //
            // facturasVenta: [''], //
            fechaCompra: [new Date().toISOString().substring(0, 10)], //
            mecanizadoIess: ['', !this.tieneDocumentosFirmados ? [Validators.required] : []], //
            // matriculaVehiculo: ['', [Validators.required]], //
            // impuestoPredial: ['', [Validators.required]], //
            // autorizacionInformacion: ['', [Validators.required]], //
            // fichaCliente: ['', [Validators.required]], //
            // conveniosCuenta: ['', [Validators.required]], //
            pagare: ['', !this.tieneDocumentosFirmados ? [Validators.required] : []], //
            tablaAmortizacion: ['', !this.tieneDocumentosFirmados ? [Validators.required] : []], //
            seguroDesgravamen: ['', !this.tieneDocumentosFirmados ? [Validators.required] : []], //
            // gastosAdministracion: ['', [Validators.required]], //
            // buroCreditoIfis: ['', [Validators.required]],
            contratosCuenta: ['', !this.tieneDocumentosFirmados ? [Validators.required] : []],
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
