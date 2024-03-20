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
import { ExcelPorcentajeDeTipificacionService } from 'src/app/_services/excel.porcentaje.de.tipificacion.service';
import { ReportesGeneral } from 'src/app/_model/reportesgeneral';


@Component({
  selector: 'app-porcentaje',
  templateUrl: './porcentaje.component.html',
  styleUrls: ['./porcentaje.component.css']
})
export class PorcentajeComponent {



  fechaInicio : Date = new Date;
  fechaFin : Date = new Date;
  empresaparametro !:  string;
  campana !: number;
  idCampana !: number;

  form!: FormGroup;
  reporteName : string ="PORCENTAJE DE TIPIFICACIÓN"

  campaignOne!: FormGroup;
  campaignTwo!: FormGroup;

  mensaje !: string;
  detalleGestion !: DetalleGestion[];
  parametros !: Parametros;

  displayedColumns: string[] = ['campana', 'nombrecampana', 'tipificacion', 'suma_total',
                                'subtipificacion', 'cantidad', 'porcentaje'];

  dataSource!: MatTableDataSource<ReportesGeneral>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  fechaInicios !: any;
  fechaFins !: any;
  fechaparametro1 !:  string;
  fechaparametro2 !:  string;
  

  constructor( private reporteService : ReporteService, 
               private route: ActivatedRoute,
               private loginService: LoginService,
               private router: Router,
               private excelPorcentajeDeTipificacionService :ExcelPorcentajeDeTipificacionService )  
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
      
      const parametros= { fechaini:this.fechaparametro1, fechafin:this.fechaparametro2,empresa:this.empresaparametro,
                          campana:this.idCampana}
     //parametros son los paramatros que enviamos y node.js los toma en el header
     
      this.reporteService.reporPorcentaje(parametros).subscribe(data=>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
  
    }); 
  }
  
  
  exportarTodo(): void {
    //this.reporteService.exportar(this.dataSource.data,this.reporteName);
    
    const parametros = {
      fechaini: this.fechaparametro1,
      fechafin: this.fechaparametro2,
      empresa: this.empresaparametro,
    };
    
    this.reporteService.reporPorcentaje(parametros).subscribe((data) => {
      this.excelPorcentajeDeTipificacionService.porcentajeportipificacion(data,parametros);
      console.log(parametros)
      console.log(data)
    });
  }
  exportarFiltro(): void{
    this.reporteService.exportar(this.dataSource.filteredData,'my_export');

  
  }
  
  
    filtro(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
  
  





}
