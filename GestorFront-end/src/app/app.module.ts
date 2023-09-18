import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from './material/material.module'
import { MatInputModule } from '@angular/material/input';

//componentes
import { GraficoComponent } from './pages/grafico/grafico.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { DetalleGestionComponent } from './pages/reporte/detalle-gestion/detalle-gestion.component';
import { MonitoreoComponent } from './pages/monitoreo/monitoreo/monitoreo.component';
import { LoginComponent } from './pages/login/login.component';

import { TmoComponent } from './pages/reporte/tmo/tmo.component';

import localeEs  from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { FrameworkComponent } from './pages/reporte/framework/framework.component';
import { TmoDetalladoComponent } from './pages/reporte/tmo-detallado/tmo-detallado.component';
import { TmoSalienteComponent } from './pages/reporte/tmo-saliente/tmo-saliente.component';
import { DevolucionFiltradaComponent } from './pages/reporte/devolucion-filtrada/devolucion-filtrada.component';
import { SecretariaVirtualComponent } from './pages/reporte/secretaria-virtual/secretaria-virtual.component';
import { SeguimientoAgenteComponent } from './pages/reporte/seguimiento-agente/seguimiento-agente.component';
import { LoadingComponent } from './pages/monitoreo/loading/loading.component';
import { LlamadasRecibidasComponent } from './pages/reporte/llamadas-recibidas/llamadas-recibidas.component';
import { EntranteSalienteComponent } from './pages/reporte/entrante-saliente/entrante-saliente.component';
import { LlamadasCalificadasComponent } from './pages/reporte/llamadas-calificadas/llamadas-calificadas.component';
import { LlamadasonlineComponent } from './pages/grafico/llamadasonline/llamadasonline.component';
import { AdminUsuariosComponent } from './pages/adminUsuarios/admin-usuarios.component';
import { AdminEdicionComponent } from './pages/adminUsuarios/admin-edicion/admin-edicion.component';
import { environment } from 'src/environments/environment';
import { JwtModule } from '@auth0/angular-jwt';
import { AdminInterceptors } from './interceptors/admin-interceptors';
import { EmpresasComponent } from './pages/empresa/empresas/empresas.component';
import { DuracionEstadoComponent } from './pages/reporte/duracion-estado/duracion-estado.component';
import { MonitoreoLlamadasComponent } from './pages/reporte/monitoreo-llamadas/monitoreo-llamadas.component';
import { IvrComponent } from './pages/reporte/ivr/ivr.component';
import { LlamadasFueraHorarioComponent } from './pages/reporte/llamadas-fuera-horario/llamadas-fuera-horario.component';
import { LlamadasFueraHorarioEventualComponent } from './pages/reporte/llamadas-fuera-horario-eventual/llamadas-fuera-horario-eventual.component';
import { LlamadasCalificadasGDEComponent } from './pages/reporte/llamadas-calificadas-gde/llamadas-calificadas-gde.component';
import { FacturacionComponent } from './pages/reporte/facturacion/facturacion.component';
import { CompromisoComercialComponent } from './pages/reporte/compromiso-comercial/compromiso-comercial.component';
import { AsteriskComponent } from './pages/asterisk/asterisk.component';
import { GestionComercialComponent } from './pages/reporte/gestion-comercial/gestion-comercial.component';
import { ConsolCiclovidaComponent } from './pages/reporte/consol-ciclovida/consol-ciclovida.component';
import { ControlVisitasComponent } from './pages/reporte/control-visitas/control-visitas.component';
import { RegistrosNuevosComponent } from './pages/reporte/registros-nuevos/registros-nuevos.component';
import { ReporteAgendaComponent } from './pages/reporte/reporte-agenda/reporte-agenda.component';
import { ConsolidadoGestionesComponent } from './pages/reporte/consolidado-gestiones/consolidado-gestiones.component';
import { LlamadasPerdidasComponent } from './pages/reporte/llamadas-perdidas/llamadas-perdidas.component';
import { FiltradoSecretariaComponent } from './pages/reporte/filtrado-secretaria/filtrado-secretaria.component';
import { PorcentajeComponent } from './pages/reporte/porcentaje/porcentaje.component'; // import bn-ng-idle service
registerLocaleData(localeEs,'es');
import { BnNgIdleService } from 'bn-ng-idle';
import { NgHcaptchaModule } from 'ng-hcaptcha';


export function tokenGetter() {
  return localStorage.getItem(environment.TOKEN_NAME);
}






@NgModule({
  declarations: [
    AppComponent,
    GraficoComponent,
    ReporteComponent,
    DetalleGestionComponent,
    MonitoreoComponent,
    LoginComponent,
    TmoComponent,
    FrameworkComponent,
    TmoDetalladoComponent,
    TmoSalienteComponent,
    DevolucionFiltradaComponent,
    SecretariaVirtualComponent,
    SeguimientoAgenteComponent,
    LoadingComponent,
    LlamadasRecibidasComponent,
    EntranteSalienteComponent,
    LlamadasCalificadasComponent,
    LlamadasonlineComponent,
    AdminUsuariosComponent,
    AdminEdicionComponent,
    EmpresasComponent,
    DuracionEstadoComponent,
    MonitoreoLlamadasComponent,
    IvrComponent,
    LlamadasFueraHorarioComponent,
    LlamadasFueraHorarioEventualComponent,
    LlamadasCalificadasGDEComponent,
    FacturacionComponent,
    CompromisoComercialComponent,
    AsteriskComponent,
    GestionComercialComponent,
    ConsolCiclovidaComponent,
    ControlVisitasComponent,
    RegistrosNuevosComponent,
    ReporteAgendaComponent,
    ConsolidadoGestionesComponent,
    LlamadasPerdidasComponent,
    FiltradoSecretariaComponent,
    PorcentajeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,    
    FormsModule,
    MatInputModule,
    NoopAnimationsModule,
    NgHcaptchaModule.forRoot(      {
      siteKey: '53b9bb7e-49a4-428f-ab81-5935daec8a8a',
      languageCode: 'es', 
      //theme: 'dark' // añade esta opción para el tema oscuro
    }
  ),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.HOST.substring(7)],
        disallowedRoutes: [`http://${environment.HOST.substring(7)}/login/enviarCorreo`],
      },
    }),
    ],
  providers: [
    { provide:LOCALE_ID,useValue:'es' },
    { provide :HTTP_INTERCEPTORS, useClass: AdminInterceptors, multi:true},
    { provide :BnNgIdleService }
      ],
       bootstrap: [AppComponent]
    })
export class AppModule { }