import { Component, OnInit } from '@angular/core';
import { ReporteCobrosService } from './reporte-cobros.service';
import { CoreMenuService } from '../../../../../@core/components/core-menu/core-menu.service';
import { DatePipe } from '@angular/common';
import { ExportService } from '../../../../services/export.service';

@Component({
  selector: 'app-reporte-cobros',
  templateUrl: './reporte-cobros.component.html',
  styleUrls: ['./reporte-cobros.component.scss'],
  providers: [DatePipe]
})
export class ReporteCobrosComponent implements OnInit {

  public page = 1;
  public page_size: any = 10;
  public collectionSize;
  public usuario;

  public cobros;
  public infoExportar = [];

  constructor(
    private _reporteCobrosService: ReporteCobrosService,
    private _coreMenuService: CoreMenuService,
    private datePipe: DatePipe,
    private exportFile: ExportService,
  ) {
    this.usuario = this._coreMenuService.grpCorpUser;
   }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.obtenerListaCobros();
  }

  transformarFecha(fecha) {
    let nuevaFecha = this.datePipe.transform(fecha, 'yyyy-MM-dd');
    return nuevaFecha;
  }

  exportarExcel() {
    this.infoExportar = [];
    const headers = ['Fecha cobro', 'Monto factura', 'Numero factura', 'Monto cobrado con Supermonedas', 'Nombre cliente', 'Cédula', 'WhatsApp'];
    if(this.cobros){
      let objetoExportar = Object.create(this.cobros);
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
      headers
    };

    this.exportFile.exportExcel(reportData);
  }

  obtenerListaCobros() {
    this._reporteCobrosService.obtenerCobros({
      page: this.page - 1, page_size: this.page_size, user_id: this.usuario.empresa._id
    }).subscribe(info => {
      this.cobros = info.info;
      this.collectionSize = info.cont;
    });
  }

}
