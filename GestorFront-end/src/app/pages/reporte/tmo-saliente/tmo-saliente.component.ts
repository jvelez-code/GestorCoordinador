import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Parametros } from 'src/app/_model/parametros';
import { Tmo } from 'src/app/_model/tmo';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ReporteService } from 'src/app/_services/reporte.service';
import * as moment from 'moment';
import { LoginService } from 'src/app/_services/login.service';


@Injectable()
@Component({
  selector: 'app-tmo-saliente',
  templateUrl: './tmo-saliente.component.html',
  styleUrls: ['./tmo-saliente.component.scss']
})
export class TmoSalienteComponent implements OnInit {

  fechaInicio : Date = new Date;
  fechaFin : Date = new Date;
  form!: FormGroup;
  reporteName : string ="TMO SALIENTE"

  campaignOne!: FormGroup;
  campaignTwo!: FormGroup;

  fechaparametro1 !:  string;
  fechaparametro2 !:  string;
  empresaparametro !:  string;

  tmo !: Tmo[];
  parametros !: Parametros;
  displayedColumns: string[] = ['fecha', 'agente', 'login', 'duracion', 'cantidad','segundos'];
  dataSource!: MatTableDataSource<Tmo>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  
  constructor( private reporteService : ReporteService,
    private loginService: LoginService ) { 

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
    this.reporteService.reporTmoSaliente(parametros).subscribe(data=>{
    console.log('tmo saliente',data);
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
