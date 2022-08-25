import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthUsuario } from 'src/app/_model/auth_usuario'
import { Subject } from 'rxjs';
//import { tokenGetter } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class AdminUsuariosService {

  private usuarioCambio = new Subject<AuthUsuario[]>();
  private mensajeCambio = new Subject<string>();

  private url: string = `${environment.HOST}`;

  constructor( private http: HttpClient) { }

  listarUsuarios(){
    const headers = { 'content-type': 'application/json'}  
    return this.http.get<AuthUsuario[]>(`${this.url}/authUsuario`)//,{headers: new HttpHeaders()
    //.set('auth',`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjgsInVzdWFyaW8iOiJqdmVsZXpfMSIsImlhdCI6MTY2MDk1NjcyMSwiZXhwIjoxNjYwOTYwMzIxfQ.KdrL2pu5UQpdfcop-46QN9DnjO-bKzk8C7f_6-P67lw`)})
    //.set('auth', "token")
  
  };

  listarUsuariosId( id:number ){
    return this.http.get<AuthUsuario>(`${this.url}/authUsuario/${id}`)
  };

  crearUsuarios(authUsuario: AuthUsuario) {
    const headers = { 'content-type': 'application/json'}  
    return this.http.post(`http://localhost:3010/authUsuario`, authUsuario, {'headers':headers})
  };

  actualizarUsuarios(authUsuario: AuthUsuario) {
    return this.http.put(`${this.url}/authUsuario/}`, authUsuario)
  };

  eliminarUsuarios(id:number){
    return this.http.delete(`${this.url}/authUsuario/${id}`)
  };

  getUsuarioCambio(){
    return this.usuarioCambio.asObservable();
  }

  setUsuarioCambio(authUsuarios: AuthUsuario[]){
    this.usuarioCambio.next(authUsuarios);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajecambio(mensaje: string){
    return this.mensajeCambio.next(mensaje);
  }

}
