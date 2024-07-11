import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ParametrosDTO } from '../_dto/ParametrosDTO';

@Injectable({
  providedIn: 'root'
})
export class AskEstadoExtService {

   private url:string = `${environment.HOST}/askEstado`;
 
   constructor( 
     private http: HttpClient,
     private router: Router 
     ) { 
     }


     actuAskEstados(parametrosDTO: ParametrosDTO) {
      const headers = { headers: new HttpHeaders({ 'content-type': "application/json" }) };  
      const body=JSON.stringify(parametrosDTO);
      return this.http.post<ParametrosDTO>(`${this.url}/askLogEstados`, body, headers);
    }

}
