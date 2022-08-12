import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { ReporteService } from '../../../_services/reporte.service';
import { ActivatedRoute,  Router } from '@angular/router';
import { Gestion } from '../../../_model/gestion';
import { MatTableDataSource } from '@angular/material/table';
import { CityI } from '../../../_model/cityI';
import { Parametros } from 'src/app/_model/parametros';
import * as moment from 'moment';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-detalle-gestion',
  templateUrl: './detalle-gestion.component.html',
  styleUrls: ['./detalle-gestion.component.css']
})
export class DetalleGestionComponent implements OnInit {


  fechaInicio : Date = new Date;
  fechaFin : Date = new Date;
  form!: UntypedFormGroup;
  reported : string ="jaime velez"

  campaignOne!: UntypedFormGroup;
  campaignTwo!: UntypedFormGroup;

  mensaje !: string;
  gestion !: Gestion[];
  parametros !: Parametros;
  displayedColumns: string[] = ['campana', 'tipo', 'documento', 'razonSocial'];
  dataSource!: MatTableDataSource<Gestion>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  fechaInicios !: any;
  fechaFins !: any;
  fechaparametro1 !:  string;
  fechaparametro2 !:  string;
  

  constructor( private reporteService : ReporteService, 
               private route: ActivatedRoute,
               private router: Router) 
               { 
                const today = new Date();
                const month = today.getMonth();
                const year = today.getFullYear();
            
                this.campaignOne = new UntypedFormGroup({
                  start: new UntypedFormControl(new Date(year, month, 13)),
                  end: new UntypedFormControl(new Date(year, month, 16)),

                });

                  this.campaignTwo = new UntypedFormGroup({
                    start: new UntypedFormControl(new Date(year, month, 15)),
                    end: new UntypedFormControl(new Date(year, month, 19)),
                  });
               }
               
             
  ngOnInit(): void {
     
    }

    aceptar(){    
        this.fechaparametro1 = moment(this.fechaInicio).format('YYYY-MM-DD 00:00:01');
        this.fechaparametro2 = moment(this.fechaFin).format('YYYY-MM-DD 23:59:59');

     
        const parametros= {fechaini:this.fechaparametro1, fechafin:this.fechaparametro2}
       //parametros son los paramatros que enviamos y node.js los toma en el header
      //   this.reporteService.reporDetalleGestiones(parametros).subscribe(data=>{
      //   console.log(data);
      //   this.dataSource = new MatTableDataSource(data);
      //   this.dataSource.sort = this.sort;
      //   this.dataSource.paginator = this.paginator;
  
      // });    }

      // filtrar(valor: string) {
      //   this.dataSource.filter = valor.trim().toLowerCase();
      // }
  
   





    
  }

 

}
