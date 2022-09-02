import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Parametros } from '../_model/parametros';

@Injectable({
  providedIn: 'root'
})
export class GraficosService {
  private url:string = `${environment.HOST}/reporContact`;

  constructor(
    private http: HttpClient,
    private router: Router ) { }

 llamadasporHora(parametros: Parametros):Observable<any>{
      
  const headers = { 'content-type': 'application/json'}  
  const body=JSON.stringify(parametros);
  console.log('service prueba',parametros)
  return this.http.post<Parametros>(`${this.url}/llamadasporHora`,body,{'headers':headers});
 }
}
