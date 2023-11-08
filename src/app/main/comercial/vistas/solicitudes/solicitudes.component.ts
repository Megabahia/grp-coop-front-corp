import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {SolicitudesService} from './solicitudes.service';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {repeaterAnimation} from 'app/main/elementos/forms/form-repeater/form-repeater.animation';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {CoreMenuService} from '@core/components/core-menu/core-menu.service';
import {Iva, NotaPedido} from '../../models/comercial';
import {ParametrizacionesService} from 'app/main/center/parametrizaciones.service';

/**
 * COOP
 * Corp
 * Esta pantalla sirve para mostrar las solicitudes de creditos
 * Rutas:
 * `${environment.apiUrl}/corp/notasPedidos/listOne/credito/${id}`,
 * `${environment.apiUrl}/personas/personas/listOne/${id}`
 * `${environment.apiUrl}/personas/personas/listOne/cedula/`,
 * `${environment.apiUrl}/corp/notasPedidos/create/`,
 * `${environment.apiUrl}/corp/notasPedidos/update/${datos.id}`,
 * `${environment.apiUrl}/central/param/list/tipo/todos/`,
 */

@Component({
    selector: 'app-solicitudes',
    templateUrl: './solicitudes.component.html',
    styleUrls: ['./solicitudes.component.scss'],
    animations: [repeaterAnimation],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe]
})
export class SolicitudesComponent implements OnInit, AfterViewInit {
    @ViewChild('mensajeModal') mensajeModal;
    @ViewChild(NgbPagination) paginator: NgbPagination;
    public mensaje;
    public submittedNotaPedidoForm = false;
    public tipoIdentificacionOpciones;
    public page = 1;
    public page_size: any = 10;
    public maxSize;
    public collectionSize;
    public items = [{itemId: '', itemName: '', itemQuantity: '', itemCost: ''}];
    public notaPedidoForm: FormGroup;
    public notaPedido: NotaPedido;
    public iva;
    public usuario;
    public item = {
        itemName: '',
        itemQuantity: '',
        itemCost: ''
    };
    public numRegex = /^-?\d*[.,]?\d{0,2}$/;
    public apiData;
    public detalles = [];
    public detallesTransac;
    public invoiceSelect = [];
    public invoiceSelected;

    public listaSolicitudes: [] = [];
    public nombresCompleto = '';
    public cedula = '';

    constructor(
        private _formBuilder: FormBuilder,
        private _coreSidebarService: CoreSidebarService,
        private _solicitudesCreditosService: SolicitudesService,
        private datePipe: DatePipe,
        private _coreMenuService: CoreMenuService,
        private paramService: ParametrizacionesService,
        private modalService: NgbModal
    ) {
        this.usuario = this._coreMenuService.grpCorpUser;
        this.notaPedido = this.inicializarNotaPedido();
        this.notaPedido.nombreVendedor = this.usuario.persona.nombres + ' ' + this.usuario.persona.apellidos;

        this.iva = this.inicializarIva();

    }

    ngOnInit(): void {
        this.notaPedidoForm = this._formBuilder.group({
            // fecha: ['', [Validators.required]],
            tipoIdentificacion: ['', [Validators.required]],
            identificacion: ['', [Validators.required]],
            razonSocial: ['', [Validators.required]],
            direccion: ['', [Validators.required]],
            telefono: ['', [Validators.required]],
            correo: ['', [Validators.required]],
            nombreVendedor: ['', [Validators.required]],
            // canal: ['', [Validators.required]],
            detalles: this._formBuilder.array([
                this.crearDetalleGrupo()
            ]),
        });
        this.invoiceSelect = this.apiData;
        this.invoiceSelected = this.invoiceSelect;
        this.inicializarDetalles();
        this.obtenerIVA();
        this.obtenerTipoIdentificacionOpciones();
    }

    inicializarIva(): Iva {
        return {
            created_at: '',
            descripcion: '',
            id: '',
            idPadre: '',
            nombre: '',
            tipo: '',
            tipoVariable: '',
            updated_at: '',
            valor: 0
        };
    }

    inicializarDetalle() {
        return {
            id: 0,
            articulo: '',
            valorUnitario: 0,
            cantidad: 0,
            precio: 0,
            codigo: '',
            informacionAdicional: '',
            descuento: 0,
            impuesto: 0,
            valorDescuento: 0,
        };
    }

    crearDetalleGrupo() {
        return this._formBuilder.group({
            // codigo: ['', [Validators.required]],
            articulo: ['', [Validators.required]],
            valorUnitario: [0, [Validators.required]],
            cantidad: [0, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)]],
            precio: [0, [Validators.required]],
            informacionAdicional: ['', [Validators.required]],
            descuento: [0, [Validators.required, Validators.pattern(this.numRegex)]],
            valorDescuento: [0, [Validators.required]]
        });
    }

    transformarFecha(fecha) {
        return this.datePipe.transform(fecha, 'yyyy-MM-dd');
    }

    get detallesArray(): FormArray {
        return this.notaPedidoForm.get('detalles') as FormArray;
    }

    get tForm() {
        return this.notaPedidoForm.controls;
    }

    toggleSidebar(name, user_id, id): void {

        this._solicitudesCreditosService.obtenerNotaPedido(id).subscribe((info) => {
                this.notaPedido = info;
                this.detalles = info.detalles;
            },
            (error) => {

                this.obtenerClienteId(user_id);
                this.notaPedido = this.inicializarNotaPedido();
                this.notaPedido.credito = id;
                this.inicializarDetalles();

            });
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }

    inicializarNotaPedido(): NotaPedido {
        return {
            id: '',
            numeroFactura: '',
            fecha: this.transformarFecha(new Date()),
            tipoIdentificacion: '',
            identificacion: '',
            razonSocial: '',
            direccion: '',
            telefono: '',
            correo: '',
            nombreVendedor: this.usuario.persona.nombres + ' ' + this.usuario.persona.apellidos,
            subTotal: 0,
            descuento: 0,
            iva: 0,
            total: 0,
            canal: '',
            numeroProductosComprados: 0,
            user_id: '',
            detalles: [],
            credito: '',
            empresaComercial: this.usuario.empresa._id
        };
    }

    ngAfterViewInit() {
        this.iniciarPaginador();
        this.obtenerListaSolicitudesCreditos();
    }

    obtenerClienteId(id) {
        this._solicitudesCreditosService.obtenerInformacionPersonaID(id)
            .subscribe((info) => {
                this.notaPedido.identificacion = info.identificacion;
                this.notaPedido.razonSocial = info.nombres + ' ' + info.apellidos;
                this.notaPedido.telefono = info.telefono;
                this.notaPedido.direccion = info.direccion;
                this.notaPedido.correo = info.email;
                this.notaPedido.user_id = info.user_id;
            }, (error) => {

            });
    }

    obtenerCliente() {
        this._solicitudesCreditosService.obtenerInformacionPersona({identificacion: this.notaPedido.identificacion})
            .subscribe((info) => {
                this.notaPedido.identificacion = info.identificacion;
                this.notaPedido.razonSocial = info.nombres + ' ' + info.apellidos;
                this.notaPedido.telefono = info.telefono;
                this.notaPedido.direccion = info.direccion;
                this.notaPedido.correo = info.email;
                this.notaPedido.user_id = info.user_id;
            }, (error) => {

            });
    }

    inicializarDetalles() {
        this.detalles = [];
        this.detalles.push(this.inicializarDetalle());
    }

    addItem() {
        this.detalles.push(this.inicializarDetalle());
        this.detallesArray.push(this.crearDetalleGrupo());
    }

    deleteItem(i) {
        this.detalles.splice(i, 1);
        this.calcularSubtotal();
        this.detallesArray.removeAt(i);
        // for (let i = 0; i < this.items.length; i++) {
        //   if (this.items.indexOf(this.items[i]) === id) {
        //     this.items.splice(i, 1);
        //     break;
        //   }
        // }
    }

    calcularSubtotal() {
        const detalles = this.detalles;
        let subtotal = 0;
        let descuento = 0;
        let cantidad = 0;
        if (detalles) {
            detalles.map((valor) => {
                const valorUnitario = Number(valor.valorUnitario) ? Number(valor.valorUnitario) : 0;
                const porcentDescuento = valor.descuento ? valor.descuento : 0;
                const cantidadProducto = valor.cantidad ? valor.cantidad : 0;
                const precio = cantidadProducto * valorUnitario;

                valor.valorDescuento = this.redondeoValor(precio * (porcentDescuento / 100));
                descuento += precio * (porcentDescuento / 100);
                subtotal += precio;
                cantidad += valor.cantidad ? valor.cantidad : 0;
                valor.precio = this.redondear(precio);
                valor.total = valor.precio;

            });
        }

        this.notaPedido.numeroProductosComprados = cantidad;
        this.detallesTransac = detalles;
        this.notaPedido.subTotal = this.redondear(subtotal);
        this.notaPedido.iva = this.redondear((subtotal - descuento) * this.iva.valor);
        this.notaPedido.descuento = this.redondear(descuento);
        this.notaPedido.total = this.redondear((subtotal - descuento) + this.notaPedido.iva);
    }

    guardarNotaPedido() {
        this.submittedNotaPedidoForm = true;
        if (this.notaPedidoForm.invalid) {
            return;
        }
        this.calcularSubtotal();
        this.notaPedido.detalles = this.detallesTransac;
        if (this.notaPedido.id === '') {
            this._solicitudesCreditosService.crearNotaPedido(this.notaPedido).subscribe((info) => {
                this.toggleSidebar('factura', '', '');
                this.mensaje = 'Nota de pedido creada con éxito';
                this.abrirModal(this.mensajeModal);
            }, (error) => {

            });
        } else {
            this._solicitudesCreditosService.actualizarNotaPedido(this.notaPedido).subscribe((info) => {
                this.toggleSidebar('factura', '', '');
                this.mensaje = 'Nota de pedido actualizada con éxito';
                this.abrirModal(this.mensajeModal);
            }, (error) => {

            });
        }

    }

    obtenerTipoIdentificacionOpciones() {
        this.paramService.obtenerListaPadres('TIPO_IDENTIFICACION').subscribe((info) => {
            this.tipoIdentificacionOpciones = info;
        });
    }

    redondear(num, decimales = 2) {
        const signo = (num >= 0 ? 1 : -1);
        num = num * signo;
        if (decimales === 0) {
            return signo * Math.round(num);
        }
        // round(x * 10 ^ decimales)
        num = num.toString().split('e');
        num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimales) : decimales)));
        // x * 10 ^ (-decimales)
        num = num.toString().split('e');
        return signo * (Number)(num[0] + 'e' + (num[1] ? (+num[1] - decimales) : -decimales));
    }

    redondeoValor(valor) {
        return isNaN(valor) ? valor : parseFloat(valor).toFixed(2);
    }

    obtenerListaSolicitudesCreditos() {
        this._solicitudesCreditosService.obtenerListaSolicitudesCreditos({
            page: this.page - 1,
            page_size: this.page_size,
            cedula: this.cedula,
            nombresCompleto: this.nombresCompleto,

        }).subscribe(info => {
            this.listaSolicitudes = info.info;
            this.collectionSize = info.cont;
        });
    }

    iniciarPaginador() {
        this.paginator.pageChange.subscribe(() => {
            this.obtenerListaSolicitudesCreditos();
        });
    }

    async obtenerIVA() {
        await this.paramService.obtenerParametroNombreTipo('ACTIVO', 'TIPO_IVA').subscribe((info) => {
                this.iva = info;
            },
            (error) => {
                this.mensaje = 'Iva no configurado';
                this.abrirModal(this.mensajeModal);
            }
        );
    }

    abrirModal(modal) {
        this.modalService.open(modal);
    }

    cerrarModal() {
        this.modalService.dismissAll();
    }

}
