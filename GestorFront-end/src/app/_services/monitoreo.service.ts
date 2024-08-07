import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AskEstadoExtension } from '../_model/askEstadoExtension'
import { Parametros } from '../_model/parametros';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {

  parametroDTO !: Parametros

  private url:string = `${environment.HOST}`;


  constructor( private http: HttpClient ) { }

  listarMonitoreo(){
    return this.http.get<AskEstadoExtension[]>(`${this.url}/monitoreo`);
  }


  monitoreoEmpresa(parametros: Parametros) {
      
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(parametros);
    return this.http.post<AskEstadoExtension[]>(`${this.url}/reporContact/monitoreo`,body,{'headers':headers});
   }
}
