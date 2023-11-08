import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FacturacionService} from './facturacion.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConsultaCreditosAprobadosService} from '../consulta-creditos-aprobados/consulta-creditos-aprobados.service';
import {CoreMenuService} from '../../../../../@core/components/core-menu/core-menu.service';

/**
 * COOP
 * Corp
 * ESta pantalla sirve para cargar la factura del cliente con sus datos
 * Rutas:
 * `${environment.apiUrl}/corp/creditoPersonas/listOne/${id}`
 * `${environment.apiUrl}/corp/notasPedidos/create/factura/`,
 */

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
    public mensaje: string;
    public cliente;
    public montoAprobado;
    public mostrarCampos = true;
    public valuePay = false;
    public creditoAprobadoActual;
    public usuario;

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _consultaCreditosService: FacturacionService,
        private _consultaCreditosAprobadosService: ConsultaCreditosAprobadosService,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private _coreMenuService: CoreMenuService,
    ) {
        this.usuario = this._coreMenuService.grpCorpUser;
    }

    ngOnInit(): void {
        this.actualizarCreditoFormData = new FormData();
        this.route.params.subscribe((params: Params) => this.idCredito = params['id']);

        this._consultaCreditosAprobadosService.obtenerCredito(this.idCredito).subscribe(info => {
            this.creditoAprobadoActual = info;
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
            celular: ['', [Validators.required,
                Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*$')
            ]],
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
        this.creditoAprobado = this.factruacionForm.value;
        this.actualizarCreditoFormData.delete('precio');
        const valorTotal = this.creditoAprobado.valorTotal.toString().replace(',', '.');
        this.actualizarCreditoFormData.append('precio', valorTotal);
        this.actualizarCreditoFormData.delete('cantidad');
        this.actualizarCreditoFormData.append('cantidad', this.creditoAprobado.cantidad);
        this.actualizarCreditoFormData.delete('descripcion');
        this.actualizarCreditoFormData.append('descripcion', this.creditoAprobado.descripcion);
        this.actualizarCreditoFormData.delete('cliente');
        this.actualizarCreditoFormData.append('cliente', JSON.stringify(this.cliente));
        this.actualizarCreditoFormData.delete('credito_id');
        this.actualizarCreditoFormData.append('credito_id', this.idCredito);
        this.actualizarCreditoFormData.delete('metodoPago');
        this.actualizarCreditoFormData.append('metodoPago', this.creditoAprobado.metodoPago);
        this.actualizarCreditoFormData.delete('pago');
        this.actualizarCreditoFormData.append('pago', this.creditoAprobado.pago);
        this.actualizarCreditoFormData.delete('creditoPersona_id');
        this.actualizarCreditoFormData.append('creditoPersona_id', this.creditoAprobadoActual._id);
        this.actualizarCreditoFormData.delete('casaComercial');
        this.actualizarCreditoFormData.append('casaComercial', JSON.stringify(this.usuario.empresa));
        this._consultaCreditosService.guardarDatos(this.actualizarCreditoFormData).subscribe((info) => {
        }, (error) => {
            this.mensaje = 'Error al guardar los datos' + error;
            this.modalOpenSLC(modal);
            return;
        });
        this._consultaCreditosService.consultarDatosaArchivos(data).subscribe((info) => {
            this._router.navigate(['/comercial/documentos-habilitantes', this.idCredito]);
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
        let valorTotal: string = this.factruacionForm.get('valorTotal').value;
        valorTotal = valorTotal.toString().replace(',', '.'); // Reemplazar comas por puntos
        console.log(valorTotal);
        console.log(this.montoAprobado);
        if (valorTotal > this.montoAprobado) {
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
        this.valuePay = value !== '';

    }
}
