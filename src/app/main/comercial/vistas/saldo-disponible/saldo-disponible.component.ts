import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {SaldoContableService} from '../saldo-contable/saldo-contable.service';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-saldo-disponible',
  templateUrl: './saldo-disponible.component.html',
  styleUrls: ['./saldo-disponible.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class SaldoDisponibleComponent implements OnInit {
  @ViewChild(NgbPagination) paginator: NgbPagination;

  public page_size: any = 10;
  public collectionSize;
  public page = 1;
  public cliente;
  public notasPedido = [];
  private _unsubscribeAll: Subject<any>;

  constructor(
      private _consultaCreditosService: SaldoContableService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.refrescarLista();
  }

  datosCliente(cliente) {
    this.cliente = JSON.parse(cliente);
    return this.cliente.nombre + ' ' + this.cliente.apellido;
  }

  refrescarLista() {
    this._consultaCreditosService.listarEnvios({page_size: this.page_size, page: this.page - 1, estado: ['Aprobado']})
        .subscribe((data) => {
          this.collectionSize = data.cont;
          this.notasPedido = data.info;
        });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
