import { Component, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import { Reportes } from '../../_model/reportes';
import { CityI } from '../../_model/cityI';
import { ReporteService } from '../../_services/reporte.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import {FormsModule} from '@angular/forms';
import { UntypedFormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  displayedColumns = ['serial', 'nombre', 'acciones'];
  dataSource !: MatTableDataSource<Reportes>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  mensaje !: string;
  nombrepadre :string ="Sin nombre";

  reportes !:Reportes[];
  cities !: CityI;


  form !: UntypedFormGroup;
  tituloPagina = 'Parte de Horas';
  fechaActual:Date=new Date();
  mesActual:number=this.fechaActual.getMonth();
  anoActual:number=this.fechaActual.getFullYear();
  fechaActuals!:string;

  selectedValue!: any;
  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date() ;
  campana !: string

  


  constructor( 
               private reporteService : ReporteService,
               public route: ActivatedRoute,
               private snackBar: MatSnackBar
               ) { }

  ngOnInit(): void {

    
     this.reporteService.listar().subscribe(data => {
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

