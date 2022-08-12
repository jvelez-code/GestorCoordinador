import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminUsuariosService } from 'src/app/_services/admin-usuarios.service';
import { switchMap } from 'rxjs/operators';


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
    private pacienteService: AdminUsuariosService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'apellidos': new FormControl('', Validators.required),
      'dni': new FormControl(''),
      'telefono': new FormControl(''),
      'direccion': new FormControl('')
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });

  }

  get f() { return this.form.controls; }

  private initForm() {
    console.log('tres');
    if (this.edicion) {
      console.log('cuatro');
      this.pacienteService.listarUsuariosId(this.id).subscribe(data => {
        console.log('uno',data);
        console.log('dos',data.apellido);
        this.form = new FormGroup({
          'id': new FormControl(data.apellido),
          'nombres': new FormControl(data.apellido),
          'apellidos': new FormControl(data.apellido),
          'dni': new FormControl(data.apellido),
          'telefono': new FormControl(data.apellido),
          'direccion': new FormControl(data.apellido)
        });

      });
    }
  }

  operar() {

    /*if (this.form.invalid) { return; }

    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.telefono = this.form.value['telefono'];
    paciente.direccion = this.form.value['direccion'];

    if (this.edicion) {
      //MODIFICAR

      /*this.pacienteService.modificar(paciente).subscribe(() => {
        this.pacienteService.listar().subscribe(data => {
          //this.pacienteService.pacienteCambio.next(data);
          this.pacienteService.setPacienteCambio(data);
        });
      });

      //PRACTICA IDEAL
      this.pacienteService.modificar(paciente).pipe(switchMap(() => {
        return this.pacienteService.listar();
      })).subscribe(data => {
        this.pacienteService.setPacienteCambio(data);
        this.pacienteService.setMensajecambio('SE MODIFICÓ');
      });
    } else {
      //REGISTRAR
      //PRACTICA COMUN
      this.pacienteService.registrar(paciente).subscribe(() => {
        this.pacienteService.listar().subscribe(data => {
          this.pacienteService.setPacienteCambio(data);
          this.pacienteService.setMensajecambio('SE REGISTRÓ');
        });
      });
    }

    this.router.navigate(['paciente']);*/
  }


}
