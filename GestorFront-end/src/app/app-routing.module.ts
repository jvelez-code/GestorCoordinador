import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { GraficoComponent } from './pages/grafico/grafico.component';
import { DetalleGestionComponent } from './pages/reporte/detalle-gestion/detalle-gestion.component';
import { MonitoreoComponent } from './pages/monitoreo/monitoreo/monitoreo.component';
import { LoginComponent } from './pages/login/login.component';
import { TmoComponent } from './pages/reporte/tmo/tmo.component';
import { TmoDetalladoComponent } from './pages/reporte/tmo-detallado/tmo-detallado.component';
import { TmoSalienteComponent } from './pages/reporte/tmo-saliente/tmo-saliente.component';
import { SecretariaVirtualComponent } from './pages/reporte/secretaria-virtual/secretaria-virtual.component';
import { SeguimientoAgenteComponent } from './pages/reporte/seguimiento-agente/seguimiento-agente.component';
import { LlamadasRecibidasComponent } from './pages/reporte/llamadas-recibidas/llamadas-recibidas.component';
import { EntranteSalienteComponent } from './pages/reporte/entrante-saliente/entrante-saliente.component';
import { LlamadasCalificadasComponent } from './pages/reporte/llamadas-calificadas/llamadas-calificadas.component';
import { AdminUsuariosComponent } from './pages/adminUsuarios/admin-usuarios.component';
import { AdminEdicionComponent } from './pages/adminUsuarios/admin-edicion/admin-edicion.component';
import { LlamadasonlineComponent } from './pages/grafico/llamadasonline/llamadasonline.component';
import { EmpresasComponent } from './pages/empresa/empresas/empresas.component';
import { DuracionEstadoComponent } from './pages/reporte/duracion-estado/duracion-estado.component';
import { MonitoreoLlamadasComponent } from './pages/reporte/monitoreo-llamadas/monitoreo-llamadas.component';
import { IvrComponent } from './pages/reporte/ivr/ivr.component';
import { LlamadasCalificadasGDEComponent } from './pages/reporte/llamadas-calificadas-gde/llamadas-calificadas-gde.component';
import { LlamadasFueraHorarioComponent } from './pages/reporte/llamadas-fuera-horario/llamadas-fuera-horario.component';
import { LlamadasFueraHorarioEventualComponent } from './pages/reporte/llamadas-fuera-horario-eventual/llamadas-fuera-horario-eventual.component';
import { FacturacionComponent } from './pages/reporte/facturacion/facturacion.component';
import { CompromisoComercialComponent } from './pages/reporte/compromiso-comercial/compromiso-comercial.component';
import { GestionComercialComponent } from './pages/reporte/gestion-comercial/gestion-comercial.component';
import { ConsolCiclovidaComponent } from './pages/reporte/consol-ciclovida/consol-ciclovida.component';

const routes: Routes = [
  { path: 'reporte', component: ReporteComponent, children: [
    { path: 'ConsolidadoGestiones', component: DetalleGestionComponent },
    { path: 'ReporteTMO', component: TmoComponent },
    { path: 'ReporteTMODetallado', component: TmoDetalladoComponent },
    { path: 'ReporteTMOSaliente', component: TmoSalienteComponent },
    { path: 'SecretariaVirtual', component: SecretariaVirtualComponent },
    { path: 'SeguimientoAgente', component: SeguimientoAgenteComponent },
    { path: 'LlamadasRecibidas', component: LlamadasRecibidasComponent },
    { path: 'TmoEntranteSaliente', component: EntranteSalienteComponent },
    { path: 'DetalladoNuevo', component: DetalleGestionComponent },
    { path: 'Duracion Estados', component: DuracionEstadoComponent },
    { path: 'Monitoreo Llamadas', component: MonitoreoLlamadasComponent },
    { path: 'ReporteIVR', component: IvrComponent },
    { path: 'CalificacionDelServicio', component: LlamadasCalificadasComponent },
    { path: 'CalificacionDelServicioGDE', component: LlamadasCalificadasGDEComponent },
    { path: 'LlamadasFueraHorario', component: LlamadasFueraHorarioComponent },
    { path: 'LlamadasFueraHorarioEventual', component: LlamadasFueraHorarioEventualComponent },
    { path: 'FacturacionGde', component: FacturacionComponent },
    { path: 'compromisoscomerciales', component: CompromisoComercialComponent },
    { path: 'ConsolidadoGestiones2', component: GestionComercialComponent },
    { path: 'ConsolidadodeCicloVida', component: ConsolCiclovidaComponent },
    
  ]},
  { path: 'grafico', component: GraficoComponent },
  { path: 'monitoreo', component: MonitoreoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'adminUsuario', component: AdminUsuariosComponent, children: [ 
    { path: 'admin-edicion/:id', component: AdminEdicionComponent },
    { path: 'admin-nuevo', component: AdminEdicionComponent },
  ]},
  { path: 'graficos', component: GraficoComponent, children: [ 
    { path: 'llamadaHora', component: LlamadasonlineComponent }
  ]},
  { path: 'empresas', component: EmpresasComponent },
  { path: '', redirectTo:'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
