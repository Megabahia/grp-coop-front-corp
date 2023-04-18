import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {CoreMenuService} from '@core/components/core-menu/core-menu.service';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {User} from 'app/auth/models';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {Subject} from 'rxjs';
import {CobroMonedas, CobroConCodigo, GenerarCobro} from '../../models/superMonedas';
import {CobrarService} from './cobrar.service';
import {DatePipe} from '@angular/common';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {error} from 'protractor';

@Component({
    selector: 'app-cobrar',
    templateUrl: './cobrar.component.html',
    styleUrls: ['./cobrar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {class: 'ecommerce-application'},
    providers: [DatePipe]
})
export class CobrarComponent implements OnInit {
    @ViewChild('preautorizacionCobroMdl') preautorizacionCobroMdl;
    @ViewChild('confirmacionCobroMdl') confirmacionCobroMdl;
    @ViewChild('mensajeModal') mensajeModal;
    @ViewChild(NgbPagination) paginator: NgbPagination;


    // public
    public cobroForm: FormGroup;
    public page = 1;
    public page_size: any = 10;
    public maxSize;
    public collectionSize;
    public contentHeader: object;
    public cobroConCodigo: any;
    public generarCobro: GenerarCobro;
    public listaCobros;
    public codigoCobro = '';
    public mensaje = '';
    public wishlist;
    public productos;
    public producto;
    private _unsubscribeAll: Subject<any>;
    public cobroSubmitted = false;
    public usuario: User;
    public cobrar: boolean = true;
    public montoSupermonedas;

    constructor(
        private _cobrarService: CobrarService,
        private _coreMenuService: CoreMenuService,
        private modalService: NgbModal,
        private datePipe: DatePipe,
        private _formBuilder: FormBuilder,
    ) {
        this._unsubscribeAll = new Subject();
        this.usuario = this._coreMenuService.grpCorpUser;
        this.cobroConCodigo = this.inicializarCobroConCodigo();
        this.generarCobro = this.inicializarGenerarCobro();
    }

    inicializarCobroConCodigo() {
        return {
            id: '',
            identificacion: '',
            autorizacion: '',
            nombres: '',
            apellidos: '',
            fechaCobro: this.transformarFecha(Date.now()),
            codigoPreautorizacion: '',
            montoTotalFactura: null,
            montoSupermonedas: null,
            codigoCobro: ''
        };
    }

    inicializarGenerarCobro() {
        return {
            user_id: '',
            empresa_id: this.usuario.empresa._id,
            codigoCobro: '',
            montoTotalFactura: null,
            montoSupermonedas: null,
            nombres: null,
            apellidos: null,
            identificacion: null,
            whatsapp: null,
        };

    }

    transformarFecha(fecha) {
        let nuevaFecha = this.datePipe.transform(fecha, 'yyyy-MM-dd');
        return nuevaFecha;
    }

    get cobForm() {
        return this.cobroForm.controls;
    }

    ngOnInit(): void {
        this.cobroForm = this._formBuilder.group({
            montoTotal: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)]],
            montoSuperMonedas: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)]],
            numeroFactura: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)]]
        });
    }

    obtenerListaCobros() {
        this._cobrarService.obtenerCobro({codigoCobro: this.codigoCobro}).subscribe(info => {
            this.cobroConCodigo = info;
            this.cobroConCodigo.fechaCobro = this.transformarFecha(Date.now());
            this.cobroConCodigo.codigoCobro = this.codigoCobro;
            this.cobroConCodigo.autorizacion = 2222;
            this.cobroConCodigo.nombres = info.nombres;
            this.cobroConCodigo.apellidos = info.apellidos;
            this.cobroConCodigo.whatsapp = info.whatsapp;
            this.cobrar = false;
        }, (error) => {
            this.mensaje = 'Código ingresado no es válido.';
            this.abrirModal(this.mensajeModal);
            this.cobrar = true;
        });
    }

    procesarCobro() {
        this.cobroSubmitted = true;
        if (this.cobroForm.invalid) {
            return;
        }
        if (this.generarCobro.montoSupermonedas !== this.cobroForm.value.montoSuperMonedas) {
            this.mensaje = 'El monto que ingreso no coincide con el monto del comprobante.';
            this.abrirModal(this.mensajeModal);
            return;
        }
        this.cobroConCodigo.montoSupermonedas = this.generarCobro.montoSupermonedas;
        this.cobroConCodigo.montoTotalFactura = this.generarCobro.montoTotalFactura;
        this.abrirModal(this.preautorizacionCobroMdl);
    }

    nuevoCobro() {
        this.codigoCobro = '';
        this.cobroConCodigo = this.inicializarCobroConCodigo();
        this.generarCobro = this.inicializarGenerarCobro();
        this.cerrarModal();
        this.cobrar = true;
    }

    confirmarCobro() {
        const empresa = JSON.parse(localStorage.getItem('grpCorpUser')).empresa;
        this.cobroConCodigo.numeroFactura = this.cobroForm.value.numeroFactura;
        this.cobroConCodigo.empresa_id = empresa._id;
        this._cobrarService.guardarCobro(this.cobroConCodigo).subscribe((info) => {
                this.abrirModal(this.confirmacionCobroMdl);
            },
            (error) => {
                this.mensaje = 'Error en guardar cobro, revise su crédito';
                this.abrirModal(this.mensajeModal);
            });
    }

    abrirModal(modal) {
        this.modalService.open(modal);
    }

    cerrarModal() {
        this.modalService.dismissAll();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
