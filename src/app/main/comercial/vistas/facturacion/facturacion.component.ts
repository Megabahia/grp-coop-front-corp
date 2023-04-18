import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FacturacionService} from './facturacion.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConsultaCreditosAprobadosService} from '../consulta-creditos-aprobados/consulta-creditos-aprobados.service';

@Component({
    selector: 'app-facturacion',
    templateUrl: './facturacion.component.html',
    styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent implements OnInit {
    public factruacionForm: FormGroup;
    public submitted = false;
    public actualizarCreditoFormData;
    public idCredito;
    public credito;
    public creditoAprobado;
    private mensaje: string;
    public cliente;
    public montoAprobado;
    public mostrarCampos = true;
    public valuePay = false;

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _consultaCreditosService: FacturacionService,
        private _consultaCreditosAprobadosService: ConsultaCreditosAprobadosService,
        private route: ActivatedRoute,
        private modalService: NgbModal,
    ) {
    }

    ngOnInit(): void {
        this.actualizarCreditoFormData = new FormData();
        this.route.params.subscribe((params: Params) => this.idCredito = params['id']);

        this._consultaCreditosAprobadosService.obtenerCredito(this.idCredito).subscribe(info => {
            this.montoAprobado = info.montoAprobado;
            console.log('montoAprobado', this.montoAprobado);
        });
        this._consultaCreditosService.consultarDatos(this.idCredito).subscribe(info => {
            this.credito = info;
            this.cliente = JSON.parse(this.credito.cliente);
            this.factruacionForm.patchValue({
                nombre: this.cliente.nombre + ' ' + this.cliente.apellido, //
                identificacion: this.cliente.identificacion, //
                celular: this.cliente.celular, //
                direccion: this.cliente.direccion, //
                correo: this.cliente.correo,
                descripcion: this.credito.descripcion,
                cantidad: this.credito.cantidad,
                valorTotal: this.credito.valorTotal,
                facturaComercial: this.credito.facturaComercial,
            });
        });
        this.factruacionForm = this._formBuilder.group({
            nombre: ['', [Validators.required]], //
            identificacion: ['', [Validators.required]], //
            celular: ['', [Validators.required]], //
            direccion: ['', [Validators.required]], //
            correo: ['', [Validators.required]], //
            descripcion: ['', [Validators.required]], //
            cantidad: ['', [Validators.required]], //
            valorTotal: ['', [Validators.required]], //
            facturaComercial: ['', [Validators.required]], //
            metodoPago: ['', [Validators.required]], //
            pago: [0, [Validators.required]], //
        });
        this.comprobarMonto();

    }

    get facturacionControlsForm() {
        return this.factruacionForm.controls;
    }

    siguiente(modal) {
        if (localStorage.getItem('montoDisponible') < this.factruacionForm.get('pago').value) {
            if (!confirm('El valor total de la compra es mayor al Monto de Crédito Aprobado. Desea continuar?')) {
                return;
            }
        }
        this.submitted = true;
        if (this.factruacionForm.invalid) {
            console.log('form', this.factruacionForm);
            return;
        }
        const data = {
            numeroIdentificacion: this.cliente.identificacion
        };
        this.creditoAprobado = this.factruacionForm.getRawValue();
        this.actualizarCreditoFormData.set('precio', this.creditoAprobado.valorTotal);
        this.actualizarCreditoFormData.set('cantidad', this.creditoAprobado.cantidad);
        this.actualizarCreditoFormData.set('descripcion', this.creditoAprobado.descripcion);
        this.actualizarCreditoFormData.set('cliente', JSON.stringify(this.cliente));
        this.actualizarCreditoFormData.set('credito_id', this.idCredito);
        this.actualizarCreditoFormData.set('metodoPago', this.creditoAprobado.metodoPago);
        this.actualizarCreditoFormData.set('pago', this.creditoAprobado.pago);
        this._consultaCreditosService.guardarDatos(this.actualizarCreditoFormData).subscribe((info) => {
        }, (error) => {
            this.mensaje = 'Error al guardar los datos' + error;
            this.modalOpenSLC(modal);
            return;
        });
        this._consultaCreditosService.consultarDatosaArchivos(data).subscribe((info) => {
            if (info?.error === 'No existe') {
                this._router.navigate(['/comercial/documentos-habilitantes', this.idCredito]);
            } else {
                this._router.navigate(['/comercial/saldo-contable']);
            }
        }, (error) => {
            this.mensaje = 'Error al guardar los datos' + error;
            if (error.error === 'No existe') {
                this._router.navigate(['/comercial/documentos-habilitantes', this.idCredito]);
            }
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

    modalOpenSLC(modalSLC = 'modalSLC') {
        this.modalService.open(modalSLC, {
                centered: true,
                size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
            }
        );
    }

    comprobarMonto() {
        console.log(this.factruacionForm.get('valorTotal').value);
        console.log(this.montoAprobado);
        if (this.factruacionForm.get('valorTotal').value > this.montoAprobado) {
            this.mostrarCampos = true;
            (this.factruacionForm as FormGroup).setControl('metodoPago',
                new FormControl('', [Validators.required]));
            (this.factruacionForm as FormGroup).setControl('pago',
                new FormControl('', [Validators.required]));
        } else {
            this.mostrarCampos = false;
            (this.factruacionForm as FormGroup).setControl('metodoPago',
                new FormControl());
            (this.factruacionForm as FormGroup).setControl('pago',
                new FormControl());
        }
    }

    selectedMethodePay(value) {
        if (value !== '') {
            this.valuePay = true;
        } else {
            this.valuePay = false;

        }

    }
}
