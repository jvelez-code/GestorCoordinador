import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { BehaviorSubject, interval, Subject, Subscription } from 'rxjs';
import { AskEstadoExtension } from 'src/app/_model/askEstadoExtension';
import { LoginService } from 'src/app/_services/login.service';
import { MonitoreoService } from '../../../_services/monitoreo.service'



@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.scss']
})
export class MonitoreoComponent implements OnInit , OnDestroy{
  
  empresaparametro !:  string;
  loading : Boolean;

  private subscripcion : Subscription = new Subscription();

  

  displayedColumns = ['serial','extension', 'login', 'fecha','descripcion', 'numero_origen','total'];
  dataSource !: MatTableDataSource<AskEstadoExtension>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;



  constructor( 
    private monitoreoService : MonitoreoService,
    private loginService: LoginService
            ) {
    this.loading=true;
    
  }
  ngOnInit(): void {
    
    this.loginService.isEmpresa.subscribe(data=>{
      this.empresaparametro=data;
      console.log(this.empresaparametro)
    })

        
    const parametros= {empresa:this.empresaparametro }

    const actualizar = interval(3000)
    this.subscripcion= actualizar.subscribe(n=>{
         this.monitoreoService.monitoreoEmpresa(parametros).subscribe(data=>{
          this.dataSource= new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
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
