import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ParametrosDTO } from '../_model/parametrosDTO';
import { Menu } from '../_model/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  
  parametroDTO !: ParametrosDTO

  private url:string = `${environment.HOST}`;


  constructor( private http: HttpClient ) { }

  listarPorUsuario(parametroDTO: ParametrosDTO) {      
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(parametroDTO);
    return this.http.post<Menu[]>(`${this.url}/auth/menuUsuario`,body,{'headers':headers});
   }

}
