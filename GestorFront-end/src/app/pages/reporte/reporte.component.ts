import { Component, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import { Reportes } from '../../_model/reportes';
import { CityI } from '../../_model/cityI';
import { ReporteService } from '../../_services/reporte.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import {FormsModule} from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { LoginService } from 'src/app/_services/login.service';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  displayedColumns = ['serial','nombre_reporte','acciones' ];
  dataSource !: MatTableDataSource<Reportes>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


 
  reportes !:Reportes[];
  empresaparametro !:  string;



  form !: FormGroup;
  tituloPagina = 'Parte de Horas';
  fechaActual: Date = new Date();
  mesActual: number = this.fechaActual.getMonth();
  anoActual: number = this.fechaActual.getFullYear();
  fechaActuals !: string;

  selectedValue!: any;
  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date() ;
  campana !: string

  


  constructor( 
               private reporteService : ReporteService,
               private loginService :LoginService,
               public route: ActivatedRoute,
               private snackBar: MatSnackBar
               ) { }

  ngOnInit(): void {
    this.loginService.isEmpresa.subscribe(data=>{
      console.log('prueba', data)
      this.empresaparametro=data;
    })


    const parametros= {empresa:this.empresaparametro}

    
     this.reporteService.reporEmpresa(parametros).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    
    });   
   
    }


 
  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
   
}

