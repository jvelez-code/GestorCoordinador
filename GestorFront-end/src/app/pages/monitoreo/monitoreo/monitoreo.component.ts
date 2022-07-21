import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { interval, Subscription } from 'rxjs';
import { AskEstadoExtension } from 'src/app/_model/askEstadoExtension';
import { MonitoreoService } from '../../../_services/monitoreo.service'



@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.css']
})
export class MonitoreoComponent implements OnInit , OnDestroy{
  
  empresaparametro !:  string;
  loading : Boolean;

  private subscripcion : Subscription = new Subscription();

  

  displayedColumns = ['serial','extension', 'login', 'fecha', 'descripcion', 'total'];
  dataSource !: MatTableDataSource<AskEstadoExtension>;
  @ViewChild(MatSort) sort!: MatSort;



  constructor( private monitoreoService : MonitoreoService ) {
    this.loading=true;
    
  }

  ngOnInit(): void {
    this.empresaparametro = 'ASISTIDA'

 
    const parametros= {empresa:this.empresaparametro }
   //

    const actualizar = interval(3000)
    this.subscripcion= actualizar.subscribe(n=>{
      console.log("total",n)
     
         this.monitoreoService.monitoreoEmpresa(parametros).subscribe(data=>{
          this.dataSource= new MatTableDataSource(data);
          this.loading=false;
         })
      
      })
    
  }


  ngOnDestroy(): void {
   this.subscripcion.unsubscribe();
  }


  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
