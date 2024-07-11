import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Menu } from '../_model/menu';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends GenericService<Menu> {

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.HOST}/reporGestor`
    );
  }

  listarPorUsuario(nombre: string) {
    
  const headers = { 'content-type': 'application/json'}  
  const body=JSON.stringify({nombre});
  return this.http.post<Menu[]>(`${this.url}/menus`,body,{'headers':headers});
 }

}
