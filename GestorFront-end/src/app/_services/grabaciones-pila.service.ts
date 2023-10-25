import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Parametros } from '../_model/parametros';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GrabacionesPilaI } from '../_model/grabacionesPilaI.';

@Injectable({
  providedIn: 'root'
})
export class GrabacionesPilaService {

  private url:string = `${environment.HOST}/reporContact`;


  constructor( private http: HttpClient ) { }


  rutaGrabaciones(parametros: Parametros){      
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(parametros);
    return this.http.post<GrabacionesPilaI[]>(`${this.url}/grabacionesPila`,body,{'headers':headers});
   }
}
