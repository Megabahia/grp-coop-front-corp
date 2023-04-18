import { NgModule } from '@angular/core';
import { PrincipalComponent } from '../personas/vistas/principal/principal.component';
import { AuthGuard } from '../../auth/helpers/auth.guards';
import { SolicitudesComponent } from './vistas/solicitudes/solicitudes.component';
import { CoreCommonModule } from '../../../@core/common.module';
import { RouterModule } from '@angular/router';
import { ContentHeaderModule } from '../../layout/components/content-header/content-header.module';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { FormsModule } from '@angular/forms';
import { CoreTouchspinModule } from '../../../@core/components/core-touchspin/core-touchspin.module';
import { CoreSidebarModule } from '../../../@core/components/core-sidebar/core-sidebar.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { CardSnippetModule } from '../../../@core/components/card-snippet/card-snippet.module';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { NotasPedidoComponent } from './vistas/notas-pedido/notas-pedido.component';
import {ConsultaCreditosAprobadosComponent} from './vistas/consulta-creditos-aprobados/consulta-creditos-aprobados.component';
import {FacturacionComponent} from './vistas/facturacion/facturacion.component';
import {DocumentosHabilitantesComponent} from './vistas/documentos-habilitantes/documentos-habilitantes.component';
import {EnvioDocumentosComponent} from './vistas/envio-documentos/envio-documentos.component';
import {GuiaRemisionComponent} from './vistas/guia-remision/guia-remision.component';
import {EnviosRealizadosComponent} from './vistas/envios-realizados/envios-realizados.component';
import {SaldoContableComponent} from './vistas/saldo-contable/saldo-contable.component';
import {SaldoDisponibleComponent} from './vistas/saldo-disponible/saldo-disponible.component';
import { SolicitudesPagosComponent } from './vistas/solicitudes-pagos/solicitudes-pagos.component';

const routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'inicio',
    component: PrincipalComponent,
    // data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },
  {
    path: 'solicitudes-de-credito',
    component: SolicitudesComponent,
    // data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },
  {
    path: 'notas-pedido',
    component: NotasPedidoComponent ,
    // data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },
  {
    path: 'consulta-creditos-aprobados',
    component: ConsultaCreditosAprobadosComponent ,
    // data: { roles: [Role.BigPuntos] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },
  {
    path: 'facturacion/:id',
    component: FacturacionComponent ,
    // data: { roles: [Role.BigPuntos] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },
  {
    path: 'documentos-habilitantes/:identificacion',
    component: DocumentosHabilitantesComponent ,
    // data: { roles: [Role.BigPuntos] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },
  {
    path: 'envio-doocumentos/:identificacion',
    component: EnvioDocumentosComponent ,
    // data: { roles: [Role.BigPuntos] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },
  {
    path: 'guia-remision',
    component: GuiaRemisionComponent ,
    // data: { roles: [Role.BigPuntos] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },
  {
    path: 'envios-realizados',
    component: EnviosRealizadosComponent ,
    // data: { roles: [Role.BigPuntos] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  }  ,
  {
    path: 'saldo-contable',
    component: SaldoContableComponent ,
    // data: { roles: [Role.BigPuntos] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },
  {
    path: 'saldo-disponible',
    component: SaldoDisponibleComponent ,
    // data: { roles: [Role.BigPuntos] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },
  {
    path: 'solicitud-pagos',
    component: SolicitudesPagosComponent ,
    // data: { roles: [Role.BigPuntos] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  }



];

@NgModule({
  declarations: [
    PrincipalComponent,
    SolicitudesComponent,
    NotasPedidoComponent,
    ConsultaCreditosAprobadosComponent,
    FacturacionComponent,
    DocumentosHabilitantesComponent,
    EnvioDocumentosComponent,
    GuiaRemisionComponent,
    SaldoContableComponent,
    SaldoDisponibleComponent,
    EnviosRealizadosComponent,
    SolicitudesPagosComponent
  ],
  imports: [
    CoreCommonModule,
    RouterModule.forChild(routes),
    ContentHeaderModule,
    TranslateModule,
    SwiperModule,
    FormsModule,
    CoreTouchspinModule,
    CoreSidebarModule,
    NgbModule,
    Ng2FlatpickrModule,
    CardSnippetModule,
    ShareIconsModule,
    ShareButtonsModule
  ],
  exports: [
    PrincipalComponent,
    SolicitudesComponent,
    NotasPedidoComponent
  ]
})
export class ComercialModule { }
