import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from 'src/app/_model/empresa';
import { LoginService } from 'src/app/_services/login.service';
import { ReporteService } from 'src/app/_services/reporte.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {
  [x: string]: any;

  //empresas !: Empresa[];
  empresas$ !: Observable<Empresa[]>;
  pseudonimo !: string;
  

  constructor( private reporteService : ReporteService,
    private loginService: LoginService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.empresas$=this.reporteService.empresas();

    this.reporteService.getMensajeCambio().subscribe(data =>{ 
      this.snackBar.open(data, 'AVISO', { duration: 4000 })
    });
  }

  aceptar(){
    console.log('prueba empresa',this.pseudonimo);
    
    this.loginService.setEmpresaCambio(this.pseudonimo)

    this.reporteService.setMensajecambio('SE ACTUALIZÓ');

    
  }

      

}
