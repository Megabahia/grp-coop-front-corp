import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ConsultaCreditosAprobadosService} from './consulta-creditos-aprobados.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-consulta-creditos-aprobados',
    templateUrl: './consulta-creditos-aprobados.component.html',
    styleUrls: ['./consulta-creditos-aprobados.component.scss']
})
export class ConsultaCreditosAprobadosComponent implements OnInit {
    public submitted = false;
    public submittedCA = false;
    public pantalla = 1;
    public datosClienteForm: FormGroup;
    public creditoAprobadoForm: FormGroup;
    public codigo;
    public credito;
    public actualizarCreditoFormData;
    private mensaje: string;
    private saldoDisponible = true;

    constructor(
        private modalService: NgbModal,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _consultaCreditosService: ConsultaCreditosAprobadosService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.actualizarCreditoFormData = new FormData();
        this.datosClienteForm = this._formBuilder.group({
            identificacion: ['', [Validators.required]], //
            codigo: [''], //
        });
        this.creditoAprobadoForm = this._formBuilder.group({
            nombre: ['', [Validators.required]], //
            apellido: ['', [Validators.required]], //
            identificacion: ['', [Validators.required]], //
            celular: ['', [Validators.required]], //
            correo: ['', [Validators.required]], //
            direccion: ['', [Validators.required]], //
            monto: ['', [Validators.required]], //
            saldoDisponible: [''], //
            cooperativa: ['coopsanjose-corp.crediventa.com', [Validators.required]], //
        });
    }

    get controlsForm() {
        return this.datosClienteForm.controls;
    }

    get creditoAprobadoControlsForm() {
        return this.creditoAprobadoForm.controls;
    }

    continuar(modal) {
        this.submitted = true;
        if (this.datosClienteForm.invalid) {
            return;
        }
        const data = {
            numeroIdentificacion: this.datosClienteForm.getRawValue().identificacion,
            codigo: this.datosClienteForm.getRawValue().codigo
        };
        this._consultaCreditosService.valdiar(data).subscribe(info => {
            localStorage.setItem('creditoConsulta', JSON.stringify({identificacion: info.numeroIdentificacion, estado: 'aprovado'}));

            console.log(info);
            this.credito = info;
            this.creditoAprobadoForm.patchValue({
                nombre: info?.nombres,
                apellido: info?.apellidos,
                identificacion: info?.numeroIdentificacion,
                celular: info?.celular,
                correo: info?.email,
                monto: info?.montoAprobado,
                saldoDisponible: info?.montoDisponible,
                cooperativa: 'https://coopsanjose-corp.crediventa.com'
            });
            this.pantalla = 2;
        }, (error) => {
            this.mensaje = 'Código no valido';
            this.modalOpenSLC(modal);
            return;
        });
        this._consultaCreditosService.consultarDatosaArchivos({numeroIdentificacion: this.datosClienteForm.getRawValue().identificacion}
        ).subscribe((info) => {
            if (info.solicitudCredito) {
                this.saldoDisponible = false;
            }
        });
    }

    generar(modal) {
        this.submitted = true;
        if (this.datosClienteForm.invalid) {
            return;
        }
        const data = {
            numeroIdentificacion: this.datosClienteForm.getRawValue().identificacion,
        };
        this._consultaCreditosService.generarCodigo(data).subscribe(info => {
            this.mensaje = 'Código enviado al correo';
            this.modalOpenSLC(modal);

        });
    }

    facturar(modal) {
        localStorage.removeItem('montoDisponible');
        localStorage.setItem('montoDisponible', this.credito.monto);
        this.submittedCA = true;
        if (this.creditoAprobadoForm.invalid) {
            return;
        }
        const formulario = this.creditoAprobadoForm.getRawValue();
        this.actualizarCreditoFormData.set('cliente', JSON.stringify({
            nombre: formulario.nombre,
            apellido: formulario.apellido,
            identificacion: formulario.identificacion,
            direccion: this.credito.user.direccion,
            celular: formulario.celular,
            correo: formulario.correo,
        }));
        this.actualizarCreditoFormData.set('monto', formulario.monto);
        this.actualizarCreditoFormData.set('cooperativa', formulario.cooperativa);
        this.actualizarCreditoFormData.set('credito_id', this.credito._id);
        this._consultaCreditosService.guardarDatos(this.actualizarCreditoFormData).subscribe((info) => {
            this._router.navigate(['/comercial/facturacion/', this.credito._id]);
        }, (error) => {
            this.mensaje = 'Error al guardar los datos' + error;
            this.modalOpenSLC(modal);
            return;
        });
    }

    modalOpenSLC(modalSLC = 'modalSLC') {
        this.modalService.open(modalSLC, {
                centered: true,
                size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
            }
        );
    }
}
