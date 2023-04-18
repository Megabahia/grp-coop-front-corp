import {NgModule} from '@angular/core';
import {CoreCommonModule} from '@core/common.module';
import {RouterModule} from '@angular/router';
import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';
import {TranslateModule} from '@ngx-translate/core';
import {SwiperModule} from 'ngx-swiper-wrapper';
import {FormsModule} from '@angular/forms';
import {CoreTouchspinModule} from '@core/components/core-touchspin/core-touchspin.module';
import {AuthGuard} from '../../auth/helpers/auth.guards';
import {Ng2FlatpickrModule} from 'ng2-flatpickr';
import {EmpleadosComponent} from './empleados/empleados.component';
import {ListarComponent as ModenasComponent} from './cargar-bigpuntos/listar.component';
import {CoreSidebarModule} from '../../../@core/components';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxCaptchaModule} from 'ngx-captcha';

const routes = [
    {path: '', redirectTo: 'nomina-empleados', pathMatch: 'full'},
    {
        path: 'nomina-empleados',
        component: EmpleadosComponent,
        // data: { roles: [Role.SuperMonedas] },
        canActivate: [AuthGuard]
        // data: { animation: 'auth' }
    },
    {
        path: 'cargar-bigpuntos',
        component: ModenasComponent,
        // data: { roles: [Role.SuperMonedas] },
        canActivate: [AuthGuard]
        // data: { animation: 'auth' }
    },
];

@NgModule({
    declarations: [
        EmpleadosComponent,
        ModenasComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        ContentHeaderModule,
        TranslateModule,
        CoreCommonModule,
        SwiperModule,
        FormsModule,
        CoreTouchspinModule,
        CoreSidebarModule,
        NgbModule,
        Ng2FlatpickrModule,
        NgxCaptchaModule,
    ],
    exports: []
})
export class CorpModule {
}
