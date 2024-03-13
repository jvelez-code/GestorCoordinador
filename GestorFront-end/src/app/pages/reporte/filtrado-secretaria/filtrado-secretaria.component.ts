import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { ReporteService } from '../../../_services/reporte.service';
import { ActivatedRoute,  Router } from '@angular/router';
import { DetalleGestion } from 'src/app/_model/detalleGestiones';
import { MatTableDataSource } from '@angular/material/table';
import { Parametros } from 'src/app/_model/parametros';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LoginService } from 'src/app/_services/login.service';
import { Observable } from 'rxjs';
import { CampanaI } from 'src/app/_model/campanaI';


@Component({
  selector: 'app-filtrado-secretaria',
  templateUrl: './filtrado-secretaria.component.html',
  styleUrls: ['./filtrado-secretaria.component.scss']
})
export class FiltradoSecretariaComponent {



  fechaInicio : Date = new Date;
  fechaFin : Date = new Date;
  empresaparametro !:  string;

  form!: FormGroup;
  reporteName : string ="FILTRAR DEVOLUCIONES "

  campaignOne!: FormGroup;
  campaignTwo!: FormGroup;

  mensaje !: string;
  detalleGestion !: DetalleGestion[];
  parametros !: Parametros;
  fechaInicios !: any;
  fechaFins !: any;
  fechaparametro1 !:  string;
  fechaparametro2 !:  string;
  regDevolver : number = 0;
  regPendientes : number = 0;
  

  constructor( private reporteService : ReporteService, 
               private route: ActivatedRoute,
               private loginService: LoginService,
               private router: Router) 
               { 
                const today = new Date();
                const month = today.getMonth();
                const year = today.getFullYear();
            
                this.campaignOne = new FormGroup({
                  start: new FormControl(new Date(year, month, 13)),
                  end: new FormControl(new Date(year, month, 16)),

                });

                  this.campaignTwo = new FormGroup({
                    start: new FormControl(new Date(year, month, 15)),
                    end: new FormControl(new Date(year, month, 19)),
                  });
               }
               
             
  ngOnInit(): void {
    this.loginService.isEmpresa.subscribe(data=>{
      this.empresaparametro=data;
    });     
    }

    aceptar(){    
      this.fechaparametro1 = moment(this.fechaInicio).format('YYYY-MM-DD 00:00:01');
      this.fechaparametro2 = moment(this.fechaFin).format('YYYY-MM-DD 23:59:59');
   
      const parametros= { fechaini:this.fechaparametro1, fechafin:this.fechaparametro2,
                          empresa:this.empresaparametro }
     //parametros son los paramatros que enviamos y node.js los toma en el header
     
      this.reporteService.reporfiltradosSecretaria(parametros).subscribe(data=>{
        console.log(data[0].devolucion,'HOLA')
        this.regDevolver= data[0].devolucion;
        this.regPendientes= data[0].intento;
        
  
    }); 
  }
  
}
