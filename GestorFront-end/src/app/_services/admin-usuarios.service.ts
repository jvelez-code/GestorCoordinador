import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthUsuario } from 'src/app/_model/auth_usuario'

@Injectable({
  providedIn: 'root'
})
export class AdminUsuariosService {

  private url: string = `${environment.HOST}`;

  constructor( private http: HttpClient) { }

  listarUsuarios(){
    return this.http.get<AuthUsuario[]>(`${this.url}/authUsuario`)
  };
  
  listarUsuariosId( id:number ){
    return this.http.get<AuthUsuario>(`${this.url}/authUsuario/${id}`)
  };
  crearUsuarios(){};
  actualizarUsuarios(){};
  eliminarUsuarios(){};
}
