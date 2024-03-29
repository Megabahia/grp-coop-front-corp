import {Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy} from '@angular/core';
import {NgbPagination, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {GanarSuperMoneda} from '../models/superMonedas';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {MisFacturasService} from '../../personas/vistas/supermonedas/mis-facturas/mis-facturas.service';
import {CoreSidebarService} from '../../../../@core/components/core-sidebar/core-sidebar.service';
import {CoreMenuService} from '../../../../@core/components/core-menu/core-menu.service';
import {ParametrizacionesService} from '../../center/parametrizaciones.service';
import {BienvenidoService} from '../../personas/vistas/bienvenido/bienvenido.service';

/**
 * COOP
 * Corp
 * ESta pantalla sirve para cargar los bigpuntos
 * Rutas:
 * `${environment.apiUrl}/core/monedas/list/monedas/empresas`,
 * `${environment.apiUrl}/corp/empresas/listOne/filtros/`,
 * `${environment.apiUrl}/central/param/list/tipo/todos/`,
 * `${environment.apiUrl}/core/monedas/upload/monedasClientes`,
 */
@Component({
    selector: 'app-listar',
    templateUrl: './listar.component.html',
    styleUrls: ['./listar.component.scss'],
    providers: [DatePipe]
})
export class ListarComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(NgbPagination) paginator: NgbPagination;
    @ViewChild('mensajeModal') mensajeModal;

    public page = 1;
    public page_size: any = 10;
    public maxSize;
    public collectionSize;
    public usuario;
    public empresaId;
    public loading = false;
    public mensaje = '';
    public superMonedasElec: GanarSuperMoneda;
    public nombreFacElec = '';
    public categoriaEmpresaOpciones;
    public facFisiForm: FormGroup;
    public archivoFacElec = new FormData();
    public facFisiFormData = new FormData();
    public facturas;
    public fecha;
    public listaSupermonedas;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _misFacturasService: MisFacturasService,
        private datePipe: DatePipe,
        private _coreSidebarService: CoreSidebarService,
        private _coreMenuService: CoreMenuService,
        private paramService: ParametrizacionesService,
        private _bienvenidoService: BienvenidoService,
        private modalService: NgbModal,
        private _formBuilder: FormBuilder,
        private cdRef: ChangeDetectorRef
    ) {
        this.usuario = this._coreMenuService.grpCorpUser;

        this.superMonedasElec = this.inicializarSuperMoneda();

        this._unsubscribeAll = new Subject();

    }

    inicializarSuperMoneda(): GanarSuperMoneda {
        return {
            credito: 0,
            descripcion: '',
            tipo: 'Credito',
            user_id: this.usuario.id,
            empresa_id: this.empresaId
        };
    }

    ngOnInit(): void {

        this.facFisiForm = this._formBuilder.group({
            razonSocial: ['', [Validators.required]],
            pais: ['', [Validators.required]],
            provincia: ['', [Validators.required]],
            ciudad: ['', [Validators.required]],
            fechaEmision: ['', [Validators.required]],
            importeTotal: [0, [Validators.required]],
            categoria: ['', [Validators.required]],
            urlFoto: ['', [Validators.required]],
        });
        this.obtenerEmpresaId();

        this.obtenerCategoriaEmpresaOpciones();
        this.fecha = this.transformarFecha(new Date());

        this.usuario = this._coreMenuService.grpCorpUser;


        this.cdRef.detectChanges();
    }

    obtenerListaSupermonedas() {
        this._misFacturasService.obtenerSupermonedas({
            page: this.page - 1, page_size: this.page_size,
        }).subscribe((info) => {
            this.listaSupermonedas = info.info;
            this.collectionSize = info.cont;
        });
    }

    obtenerEmpresaId() {
        this._bienvenidoService.obtenerEmpresa({
            nombreComercial: 'Global RedPyme'
        }).subscribe((info) => {
            this.superMonedasElec.empresa_id = info._id;
        }, (error) => {
            this.mensaje = 'Ha ocurrido un error al actualizar su imagen';
            this.abrirModal(this.mensajeModal);
        });
    }

    ngAfterViewInit() {
        this.iniciarPaginador();
        this.obtenerListaSupermonedas();
        // this.cdRef.detectChanges();
    }

    toggleSidebar(name): void {
        if (name === 'factura-electronica') {
            this.nombreFacElec = '';
            this.archivoFacElec = new FormData();
        }
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }

    obtenerCategoriaEmpresaOpciones() {
        this.paramService.obtenerListaPadres('CATEGORIA_EMPRESA').subscribe((info) => {
            this.categoriaEmpresaOpciones = info;
        });
    }

    transformarFecha(fecha) {
        return this.datePipe.transform(fecha, 'yyyy-MM-dd');
    }

    cargarFacturaElec(event: any) {
        if (event.target.files && event.target.files[0]) {
            const archivo = event.target.files[0];
            this.nombreFacElec = archivo.name;

            this.archivoFacElec = new FormData();
            this.archivoFacElec.delete('documento');
            this.archivoFacElec.append('documento', archivo, Date.now() + '_' + archivo.name);
        }
    }

    subirFacturaElec() {
        if (this.nombreFacElec) {
            this.loading = true;
            this.archivoFacElec.append('user_id', this.usuario.id);
            this._misFacturasService.asignarSuperMonedas(this.archivoFacElec).subscribe((info) => {
                    this.loading = false;
                    this.obtenerListaSupermonedas();
                    this.toggleSidebar('factura-electronica');
                    console.log(info);
                    if (info.errores.length > 0) {
                        this.mensaje = '';
                        info.errores.map(item => {
                            this.mensaje += item.error + '\n';
                        });
                    } else {
                        this.mensaje = 'Supermonedas asignadas correctamente';
                    }
                    this.abrirModal(this.mensajeModal);
                },
                (error) => {
                    this.loading = false;

                    this.mensaje = `
            ¡Lo sentimos!
            Ha ocurrido un error al cargar el documento, por favor valide que los datos ingresados sean correctos y vuelva a intentar.
          `;
                    this.abrirModal(this.mensajeModal);
                });
        } else {
            this.loading = false;

            this.mensaje = 'Es necesario cargar un archivo tipo PDF o XML';
            this.abrirModal(this.mensajeModal);
        }
    }

    iniciarPaginador() {
        this.paginator.pageChange.subscribe(() => {
            this.obtenerListaSupermonedas();
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
