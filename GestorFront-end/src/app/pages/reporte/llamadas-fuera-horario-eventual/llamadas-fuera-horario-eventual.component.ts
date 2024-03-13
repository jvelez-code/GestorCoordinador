import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { LlamadaFueraHorarioI } from 'src/app/_model/llamadaFueraHorario';
import { Parametros } from 'src/app/_model/parametros';
import { LoginService } from 'src/app/_services/login.service';
import { ReporteService } from 'src/app/_services/reporte.service';



@Component({
  selector: 'app-llamadas-fuera-horario-eventual',
  templateUrl: './llamadas-fuera-horario-eventual.component.html',
  styleUrls: ['./llamadas-fuera-horario-eventual.component.scss']
})


export class LlamadasFueraHorarioEventualComponent implements OnInit {

selectHoraEventual!: string;

  horaEventuales: LlamadaFueraHorarioI[] = [
    {ValorhoraEventual:'10:00',horaEventual: '10:00'},
    {ValorhoraEventual:'12:00',horaEventual: '12:00'},
    {ValorhoraEventual:'14:00',horaEventual: '14:00'},
    {ValorhoraEventual:'16:00',horaEventual: '16:00'},
    {ValorhoraEventual:'18:00',horaEventual: '18:00'},
  ];


  fechaInicio : Date = new Date;
  fechaFin : Date = new Date;
  form!: FormGroup;
  reporteName : string ="LLAMADA FUERA DE HORARIO EVENTUAL"

  campaignOne!: FormGroup;
  campaignTwo!: FormGroup;

  fechaparametro1 !:  string;
  fechaparametro2 !:  string;
  empresaparametro !:  string;

  llamadaFueraHorarioI !: LlamadaFueraHorarioI
  parametros !: Parametros;
  displayedColumns: string[] = ['gestion','ruta_entrante', 'tipo_doc', 'numero_documento','numero_origen','fecha_asterisk','hora_asterisk'];
  dataSource!: MatTableDataSource<LlamadaFueraHorarioI>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor( 
    private reporteService : ReporteService,
    private loginService: LoginService ) { 

    // this.loginService.isLogged.subscribe(data=>{
    //   console.log('pruebaObservable',data)
    // })

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

 
    const parametros= {fechaini:this.fechaparametro1, fechafin:this.fechaparametro2,empresa:this.empresaparametro, 
      horaEven:this.selectHoraEventual }
   //parametros son los paramatros que enviamos y node.js los toma en el header
    this.reporteService.reporLlamadasFueradeHorarioEventual(parametros).subscribe(data=>{
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
