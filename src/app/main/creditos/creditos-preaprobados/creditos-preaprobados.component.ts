import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ExportService} from 'app/services/export.service';
import {CoreMenuService} from '@core/components/core-menu/core-menu.service';
import {CreditosService} from '../creditos.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ParametrizacionesService} from 'app/main/center/parametrizaciones.service';
import {NotasPedidoService} from 'app/main/comercial/vistas/notas-pedido/notas-pedido.service';
import {Iva, NotaPedido} from 'app/main/comercial/models/comercial';
import {Router} from '@angular/router';

@Component({
    selector: 'app-creditos-preaprobados',
    templateUrl: './creditos-preaprobados.component.html',
    styleUrls: ['./creditos-preaprobados.component.scss'],
    providers: [DatePipe],
})
export class CreditosPreaprobadosComponent implements OnInit {
    @ViewChild('mensajeModal') mensajeModal;
    @ViewChild('mensajeAfirmacionl') mensajeAfirmacionl;
    public page = 1;
    public page_size: any = 10;
    public collectionSize;
    public usuario;

    public detalles = [];
    public detallesTransac;
    public iva;
    public tipoIdentificacionOpciones;
    public submittedNotaPedidoForm = false;
    public numRegex = /^-?\d*[.,]?\d{0,2}$/;
    public notaPedidoForm: FormGroup;
    public notaPedido: NotaPedido;

    public listaCreditos;
    public infoExportar = [];
    public mensaje;
    public creditoSelecionado;
    public fechaAct;

    constructor(
        private _creditosService: CreditosService,
        private _coreMenuService: CoreMenuService,
        private datePipe: DatePipe,
        private exportFile: ExportService,
        private modalService: NgbModal,
        private _coreSidebarService: CoreSidebarService,
        private _formBuilder: FormBuilder,
        private paramService: ParametrizacionesService,
        private _router: Router,
        private _notasPedidoService: NotasPedidoService
    ) {
        this.usuario = this._coreMenuService.grpCorpUser;
        this.notaPedido = this.inicializarNotaPedido();
        this.inicializarDetalles();
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
            detalles: this._formBuilder.array([this.crearDetalleGrupo()]),
        });

        this.obtenerTipoIdentificacionOpciones();
    }

    inicializarDetalles() {
        this.detalles = [];
        this.detalles.push(this.inicializarDetalle());
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
            nombreVendedor:
                this.usuario.persona.nombres + ' ' + this.usuario.persona.apellidos,
            subTotal: 0,
            descuento: 0,
            iva: 0,
            total: 0,
            canal: '',
            numeroProductosComprados: 0,
            user_id: '',
            detalles: [],
            credito: '',
            empresaComercial: this.usuario.empresa._id,
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
            cantidad: [
                0,
                [
                    Validators.required,
                    Validators.pattern('^[0-9]*$'),
                    Validators.min(1),
                ],
            ],
            precio: [0, [Validators.required]],
            informacionAdicional: ['', [Validators.required]],
            descuento: [0, [Validators.required, Validators.pattern(this.numRegex)]],
            valorDescuento: [0, [Validators.required]],
        });
    }

    obtenerTipoIdentificacionOpciones() {
        this.paramService
            .obtenerListaPadres('TIPO_IDENTIFICACION')
            .subscribe((info) => {
                this.tipoIdentificacionOpciones = info;
            });
    }

    obtenerCliente() {
        this._notasPedidoService
            .obtenerInformacionPersona({
                identificacion: this.notaPedido.identificacion,
            })
            .subscribe(
                (info) => {
                    this.notaPedido.identificacion = info.identificacion;
                    this.notaPedido.razonSocial = info.nombres + ' ' + info.apellidos;
                    this.notaPedido.telefono = info.telefono;
                    this.notaPedido.direccion = info.direccion;
                    this.notaPedido.correo = info.email;
                    this.notaPedido.user_id = info.user_id;
                },
                (error) => {
                }
            );
    }

    addItem() {
        this.detalles.push(this.inicializarDetalle());
        let detGrupo = this.crearDetalleGrupo();
        this.detallesArray.push(detGrupo);
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
            valor: 0,
        };
    }

    confirmarPedido(afirm) {
        if (afirm) {
            this.cerrarModal();
            this.calcularSubtotal();
            this.notaPedido.detalles = this.detallesTransac;
            this.notaPedido.credito = this.creditoSelecionado._id;
            this._notasPedidoService.crearNotaPedido(this.notaPedido).subscribe(
                (info) => {
                    this.toggleSidebar('factura', '');
                    this.cerrarModal();
                    this._router.navigate(['/comercial/notas-pedido']);
                    /*         this.mensaje = "Nota de pedido creada con éxito";
                  this.abrirModal(this.mensajeModal);
           */
                },
                (error) => {
                }
            );
        } else {
            return;
        }
    }

    guardarNotaPedido() {
        this.submittedNotaPedidoForm = true;

        if (this.notaPedidoForm.invalid) {
            return;
        }

        if (!this.notaPedido.user_id) {
            // this.mensaje = "Necesita encontrar un usuario para crear la nota de pedido";
            // this.abrirModal(this.mensajeModal);
            return;
        }
        this.abrirModal(this.mensajeAfirmacionl);
    }

    get detallesArray(): FormArray {
        return this.notaPedidoForm.get('detalles') as FormArray;
    }

    get tForm() {
        return this.notaPedidoForm.controls;
    }

    calcularSubtotal() {
        let detalles = this.detalles;
        let subtotal = 0;
        let descuento = 0;
        let cantidad = 0;
        if (detalles) {
            detalles.map((valor) => {
                let valorUnitario = Number(valor.valorUnitario)
                    ? Number(valor.valorUnitario)
                    : 0;
                let porcentDescuento = valor.descuento ? valor.descuento : 0;
                let cantidadProducto = valor.cantidad ? valor.cantidad : 0;
                let precio = cantidadProducto * valorUnitario;

                valor.valorDescuento = this.redondeoValor(
                    precio * (porcentDescuento / 100)
                );
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
        this.notaPedido.iva = this.redondear(
            (subtotal - descuento) * this.iva.valor
        );
        this.notaPedido.descuento = this.redondear(descuento);
        this.notaPedido.total = this.redondear(
            subtotal - descuento + this.notaPedido.iva
        );
    }

    redondeoValor(valor) {
        return isNaN(valor) ? valor : parseFloat(valor).toFixed(2);
    }

    redondear(num, decimales = 2) {
        var signo = num >= 0 ? 1 : -1;
        num = num * signo;
        if (decimales === 0)
            //con 0 decimales
        {
            return signo * Math.round(num);
        }
        // round(x * 10 ^ decimales)
        num = num.toString().split('e');
        num = Math.round(
            +(num[0] + 'e' + (num[1] ? +num[1] + decimales : decimales))
        );
        // x * 10 ^ (-decimales)
        num = num.toString().split('e');
        let valor =
            signo *
            Number(num[0] + 'e' + (num[1] ? +num[1] - decimales : -decimales));
        return valor;
    }

    ngAfterViewInit() {
        this.obtenerListaCreditos();
        this.fechaAct = this.transformarFecha(Date.now());
    }

    transformarFecha(fecha) {
        let nuevaFecha = this.datePipe.transform(fecha, 'yyyy-MM-dd');
        return nuevaFecha;
    }

    toggleSidebar(name, id): void {
        this.inicializarNotaPedido();
        this.cerrarModal();
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }

    exportarExcel() {
        this.infoExportar = [];
        const headers = [
            'Fecha cobro',
            'Monto factura',
            'Numero factura',
            'Monto cobrado con Supermonedas',
            'Nombre cliente',
            'Cédula',
            'WhatsApp',
        ];
        if (this.listaCreditos) {
            let objetoExportar = Object.create(this.listaCreditos);
            objetoExportar.forEach((row: any) => {
                const values = [];
                values.push(this.transformarFecha(row['fechaCobro']));
                values.push(row['montoTotalFactura']);
                values.push(row['numeroFactura']);
                values.push(row['montoSupermonedas']);
                values.push(row['nombreCompleto']);
                values.push(row['identificacion']);
                values.push(row['whatsapp']);
                this.infoExportar.push(values);
            });
        }
        const reportData = {
            title: 'Reporte de Cobros con Supermonedas',
            data: this.infoExportar,
            headers,
        };

        this.exportFile.exportExcel(reportData);
    }

    obtenerListaCreditos() {
        this._creditosService
            .obtenerCreditos({
                page: this.page - 1,
                page_size: this.page_size,
                empresaComercial_id: this.usuario.empresa._id,
                estado: 'Confirmado',
            })
            .subscribe((info) => {
                this.listaCreditos = info.info;
                this.collectionSize = info.cont;
            });
    }

    SelectionCredito(credito_id) {
        this._creditosService
            .obtenerCreditoSelecionado(credito_id)
            .subscribe((info) => {
                this.creditoSelecionado = info;
                this.abrirModal(this.mensajeModal);
            });
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

    abrirModal(modal) {
        this.modalService.open(modal);
    }

    cerrarModal() {
        this.modalService.dismissAll();
    }
}
