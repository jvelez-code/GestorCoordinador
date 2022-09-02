import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, ChartType } from 'chart.js';
import * as moment from 'moment';
import { Parametros } from 'src/app/_model/parametros';
import { GraficosService } from 'src/app/_services/graficos.service';
import { LoginService } from 'src/app/_services/login.service';

export interface PeriodicElement {
  total: string;
  contestadas: number;
  nocontestadas: number;
  totalG: number;
}



@Component({
  selector: 'app-llamadasonline',
  templateUrl: './llamadasonline.component.html',
  styleUrls: ['./llamadasonline.component.css']
})



export class LlamadasonlineComponent implements OnInit {

  fechaini !:  string;
  fechafin !: string;
  empresa  !: string;
  parametros !: Parametros;
  parametrosTotal !: PeriodicElement[];
  
  
  totalContestadas !: number;
  totalNoContestadas !: number;
  totalLLamadas !: number;

  campaignOne!: FormGroup;
  campaignTwo!: FormGroup;

  fechaInicio : Date = new Date;
  fechaFin : Date = new Date;
  fechaparametro1 !:  string;
  fechaparametro2 !:  string;
  empresaparametro !:  string;

  titulo : boolean = true;
  chart: any;
  tipo: ChartType ='line';

  displayedColumns = ['hora_llamada', 'answered', 'no_answer','totales'];
  dataSource !: MatTableDataSource<Parametros>;

  displayedColumnss: string[]=['total','contestadas', 'nocontestadas', 'totalG']
  dataSources !: MatTableDataSource<PeriodicElement>;

  
  constructor(
    private graficosService: GraficosService,
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

  
  llamadasporHora(){

    if (this.chart != null) {
      this.chart.destroy();
    }
    
    this.fechaparametro1 = moment(this.fechaInicio).format('YYYY-MM-DD 00:00:01');
    this.fechaparametro2 = moment(this.fechaFin).format('YYYY-MM-DD 23:59:59');
    
    const parametros= {fechaini:this.fechaparametro1, fechafin:this.fechaparametro2,empresa:this.empresaparametro }
    
    this.graficosService.llamadasporHora(parametros).subscribe(data =>{
    this.dataSource = new MatTableDataSource(data);
    
    this.totalContestadas=data.map((x: { answered: any; })=>x.answered).reduce((count: number, x: string) => count + parseFloat(x), 0),
    this.totalNoContestadas=data.map((x: { no_answer: any; })=>x.no_answer).reduce((count: number, x: string) => count + parseFloat(x), 0),
    this.totalLLamadas=data.map((x: { totales: any; })=>x.totales).reduce((count: number, x: string) => count + parseFloat(x), 0),
 
    this.parametrosTotal = [{total: 'TOTAL', contestadas: this.totalContestadas, nocontestadas: this.totalNoContestadas, 
      totalG: this.totalLLamadas }]

    this.dataSources = new MatTableDataSource(this.parametrosTotal);
    });

    this.graficosService.llamadasporHora(parametros).subscribe(data =>{
      let fechas = data.map((x: { hora_llamada: any; }) => x.hora_llamada);
      let contestadas = data.map((x: { answered: any; })=> x.answered);
      let nocontestadas = data.map((x: { no_answer: any; })=> x.no_answer);
      let totales = data.map((x: { totales: any; })=> x.totales);

  this.chart=new Chart('canvas',{
    type: this.tipo,
    data: {
      labels: fechas,
      datasets:[
    {
        label:'Contestadas',
        data: contestadas,
        backgroundColor:'green',
        borderColor:'green',
      
      },
      {
        label:'No Contestadas',
        data: nocontestadas,
        backgroundColor:'red',
        borderColor:'red',
     

      },
      {
        label:'Total',
        data: totales,
        backgroundColor:'blue',
        borderColor:'blue',
      }
    ]
    },
    

  });


  });

  }
  

  cambiar() {   
    

    if (this.titulo) {
      this.tipo = 'bar';
    }
    else {
      this.tipo = 'line';
    }
    this.titulo = !this.titulo;
    
    
    if (this.chart != null) {
      this.chart.destroy();
    }
    this.llamadasporHora();
  }

  



}
