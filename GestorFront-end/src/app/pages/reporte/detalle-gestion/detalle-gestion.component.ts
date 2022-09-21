import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { ReporteService } from '../../../_services/reporte.service';
import { ActivatedRoute,  Router } from '@angular/router';
import { Gestion } from '../../../_model/gestion';
import { DetalleGestion } from 'src/app/_model/detalleGestiones';
import { MatTableDataSource } from '@angular/material/table';
import { CityI } from '../../../_model/cityI';
import { Parametros } from 'src/app/_model/parametros';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LoginService } from 'src/app/_services/login.service';


@Component({
  selector: 'app-detalle-gestion',
  templateUrl: './detalle-gestion.component.html',
  styleUrls: ['./detalle-gestion.component.css']
})
export class DetalleGestionComponent implements OnInit {


  fechaInicio : Date = new Date;
  fechaFin : Date = new Date;
  empresaparametro !:  string;

  form!: FormGroup;
  reporteName : string ="DETALLE GESTIONES"

  campaignOne!: FormGroup;
  campaignTwo!: FormGroup;

  mensaje !: string;
  detalleGestion !: DetalleGestion[];
  parametros !: Parametros;

  displayedColumns: string[] = ['nombrecampana', 'tipodocaportante', 'numdocaporta', 'razonsocial','tipogestion',
                                'nombrecontacto', 'telefono1', 'telefono2', 'telefono3','numerorealmarcado',
                                'usuario', 'empresa', 'padretipificacion', 'tipicacion','fechagestion','numerocampana','observacion','empleados'];

  dataSource!: MatTableDataSource<DetalleGestion>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  fechaInicios !: any;
  fechaFins !: any;
  fechaparametro1 !:  string;
  fechaparametro2 !:  string;
  

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
    })
     
    }

    aceptar(){    
      this.fechaparametro1 = moment(this.fechaInicio).format('YYYY-MM-DD 00:00:01');
      this.fechaparametro2 = moment(this.fechaFin).format('YYYY-MM-DD 23:59:59');
      //this.empresaparametro = 'ASISTIDA'
  
   
      const parametros= {fechaini:this.fechaparametro1, fechafin:this.fechaparametro2,empresa:this.empresaparametro }
     //parametros son los paramatros que enviamos y node.js los toma en el header
     console.log(parametros)
      this.reporteService.reporDetalleGestion(parametros).subscribe(data=>{
        console.log(data)
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
  
    });    }
  
  
  exportarTodo(): void {
    this.reporteService.exportar(this.dataSource.data,this.reporteName);
  
  }
  exportarFiltro(): void{
    this.reporteService.exportar(this.dataSource.filteredData,'my_export');
  
  }
  
  
    filtro(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
  
  }
  