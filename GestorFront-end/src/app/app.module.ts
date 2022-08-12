import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';

import { MaterialModule } from './material/material.module'
import { MatInputModule } from '@angular/material/input';

//componentes
import { GraficoComponent } from './pages/grafico/grafico.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { VisualizarComponent } from './pages/reporte/visualizar/visualizar.component';
import { DetalleGestionComponent } from './pages/reporte/detalle-gestion/detalle-gestion.component';
import { LlamadasFueraComponent } from './pages/reporte/llamadas-fuera/llamadas-fuera.component';
import { MonitoreoComponent } from './pages/monitoreo/monitoreo/monitoreo.component';
import { LoginComponent } from './pages/login/login.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { TmoComponent } from './pages/reporte/tmo/tmo.component';
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

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
registerLocaleData(localeEs,'es');






@NgModule({
  declarations: [
    AppComponent,
    GraficoComponent,
    ReporteComponent,
    VisualizarComponent,
    DetalleGestionComponent,
    LlamadasFueraComponent,
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
    AdminEdicionComponent
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
    SocketIoModule.forRoot(config),
    NgxCaptchaModule  ],
  providers: [{ provide:LOCALE_ID,useValue:'es' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
