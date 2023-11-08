import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {CoreMenuService} from '@core/components/core-menu/core-menu.service';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {User} from 'app/auth/models';
import {Subject} from 'rxjs';
import {CobroMonedas} from '../../models/superMonedas';
import {PrincipalService} from './principal.service';

/**
 * COOP
 * Corp
 * ESta pantalla sirve para buscar los prospectos de los clientes
 * Rutas:
 * `${environment.apiUrl}/corp/cobrarSupermonedas/list/`,
 * `${environment.apiUrl}/corp/cobrarSupermonedas/update/${datos.id}`,
 */

@Component({
    selector: 'app-principal',
    templateUrl: './principal.component.html',
    styleUrls: ['./principal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {class: 'ecommerce-application'}
})
export class PrincipalComponent implements OnInit, OnDestroy {
    @ViewChild('DetalleProducto') DetalleProducto;
    @ViewChild('CanjearProducto') CanjearProducto;
    @ViewChild('confirmarPreautorizacionMdl') confirmarPreautorizacionMdl;
    @ViewChild('mensajeModal') mensajeModal;
    @ViewChild(NgbPagination) paginator: NgbPagination;


    // public
    public page = 1;
    public page_size: any = 10;
    public maxSize;
    public collectionSize;
    public contentHeader: object;
    public cobroMonedas: CobroMonedas;
    public listaCobros;
    public idCobro = '';
    public mensaje = '';
    public wishlist;
    public productos;
    public producto;
    private _unsubscribeAll: Subject<any>;

    public usuario: User;

    constructor(
        private _principalService: PrincipalService,
        private _coreMenuService: CoreMenuService,
        private modalService: NgbModal,
    ) {
        this._unsubscribeAll = new Subject();
        this.usuario = this._coreMenuService.grpCorpUser;
        this.cobroMonedas = {
            codigoCobro: '',
            correo: '',
            identificacion: '',
            monto: ''
        };
    }

    ngOnInit(): void {

        this.obtenerListaCobros();
    }

    obtenerListaCobros() {
        this._principalService.obtenerListaCobros({
            ...this.cobroMonedas, page_size: this.page_size, page: this.page - 1
        }).subscribe(info => {

            this.collectionSize = info.cont;
            this.listaCobros = info.info;
        });
    }

    preautorizarCobro() {
        this.cerrarModal();
        this._principalService.preautorizarCobro({
            id: this.idCobro,
            estado: 'Pre-autorizado',
            user_id: this.usuario.id
        }).subscribe((info) => {
                this.mensaje = 'Cobro Pre-autorizado';
                this.abrirModal(this.mensajeModal);
                this.obtenerListaCobros();
            },
            (error) => {
                const errores = Object.values(error);
                const llaves = Object.keys(error);
                this.mensaje = '';
                errores.map((infoErrores, index) => {
                    this.mensaje += llaves[index] + ': ' + infoErrores + '<br>';
                });
                this.abrirModal(this.mensajeModal);
            });
    }

    procesarCobro(id) {
        this.idCobro = id;
        this.abrirModal(this.confirmarPreautorizacionMdl);
    }

    abrirModal(modal) {
        this.modalService.open(modal);
    }

    cerrarModal() {
        this.modalService.dismissAll();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
