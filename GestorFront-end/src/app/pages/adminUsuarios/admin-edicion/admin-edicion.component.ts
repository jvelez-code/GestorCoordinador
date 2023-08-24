import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminUsuariosService } from 'src/app/_services/admin-usuarios.service';
import { switchMap } from 'rxjs/operators';
import { Usuario } from 'src/app/_model/usuario';
import { AuthUsuario } from 'src/app/_model/auth_usuario';



@Component({
  selector: 'app-admin-edicion',
  templateUrl: './admin-edicion.component.html',
  styleUrls: ['./admin-edicion.component.css']
})
export class AdminEdicionComponent implements OnInit {


  form!: FormGroup;
  id!: number;
  edicion!: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: AdminUsuariosService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({      
      'id_usuario': new FormControl(0),
      'usuario': new FormControl(),
      'clave': new FormControl(),
      'nombre': new FormControl('', Validators.required),
      'apellido': new FormControl('', Validators.required),
      'documento': new FormControl(),
      'estado': new FormControl(),
      'correo': new FormControl(),
      'id_empresa': new FormControl(),
      'id_rol': new FormControl()
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });

  }

  get f() { return this.form.controls; }

  private initForm() {
    
    if (this.edicion) {
        this.usuarioService.listarUsuariosId(this.id).subscribe(data => {
        this.form = new FormGroup({          
          'id_usuario': new FormControl(data.id_usuario),
          'usuario': new FormControl(data.usuario),
          'clave': new FormControl(data.clave),
          'nombre': new FormControl(data.nombre),
          'apellido': new FormControl(data.apellido),
          'documento': new FormControl(data.documento),
          'estado': new FormControl(data.estado),
          'correo': new FormControl(data.correo),
          'id_empresa': new FormControl(data.id_empresa),
          'id_rol': new FormControl(data.id_rol)       
         });

      });
    }
  }

  operar() {
    if (this.form.invalid) { return; }
    //valoresdel formulario
    let authUsuario = new AuthUsuario();

    authUsuario.id_usuario = this.form.value['id_usuario'];
    //authUsuario.id_usuario = 55;
    authUsuario.usuario= this.form.value['usuario'];
    authUsuario.clave = this.form.value['clave'];
    authUsuario.nombre = this.form.value['nombre'];
    authUsuario.apellido = this.form.value['apellido'];
    authUsuario.documento = this.form.value['documento'];
    authUsuario.estado = this.form.value['estado'];
    authUsuario.correo = this.form.value['correo'];
    authUsuario.id_empresa = this.form.value['id_empresa'];
    authUsuario.id_rol = this.form.value['id_rol'];

    if (this.edicion) {
      //MODIFICAR
      //no devuelve data

      /*this.usuarioService.actualizarUsuarios(authUsuario).subscribe();//() => {
        this.usuarioService.listarUsuarios().subscribe(data => {
          //this.usuarioService.setUsuarioCambio.next(data);
          this.usuarioService.setUsuarioCambio(data);
       // });
     });*/

      //PRACTICA IDEAL
      this.usuarioService.actualizarUsuarios(authUsuario).pipe(switchMap(() => {
        return this.usuarioService.listarUsuarios();
      })).subscribe(data => {
        this.usuarioService.setUsuarioCambio(data);
        this.usuarioService.setMensajecambio('SE MODIFICÓ');
      });
    } 
    else {

      this.usuarioService.crearUsuarios(authUsuario).pipe(switchMap(() => {
        return this.usuarioService.listarUsuarios();
      })).subscribe(data => {
        this.usuarioService.setUsuarioCambio(data);
        this.usuarioService.setMensajecambio('SE REGISTRÓ');
      });
    }
    this.router.navigate(['adminUsuario']);
  }



}
