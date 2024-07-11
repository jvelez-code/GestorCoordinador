import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { BehaviorSubject, interval, Observable, Subject, Subscription } from 'rxjs';
import { AskEstadoExtension } from 'src/app/_model/askEstadoExtension';
import { LoginService } from 'src/app/_services/login.service';
import { MonitoreoService } from '../../../_services/monitoreo.service'
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AskEstadoExtService } from 'src/app/_services/ask-estado-ext.service';
import { ParametrosDTO } from 'src/app/_dto/ParametrosDTO';



@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.css'],
})
export class MonitoreoComponent implements OnInit , OnDestroy{
  
  empresaparametro !:  string;
  loading : Boolean;
  mostrarCodigoCuadros: boolean = true; 
  mostrarCodigolista: boolean = false; 
  monitoreoEmpresa$ !: Observable<AskEstadoExtension[]>;



  private subscripcion : Subscription = new Subscription();

  

  displayedColumns = ['serial','extension', 'login', 'fecha','descripcion', 'numero_origen','total', 'cerrar'];
  dataSource !: MatTableDataSource<AskEstadoExtension>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;



  constructor( 
    private monitoreoService : MonitoreoService,
    private loginService: LoginService,
  private askEstadoExtService : AskEstadoExtService            ) {
    this.loading=true;
    
  }
  ngOnInit(): void {
    
    this.loginService.isEmpresa.subscribe(data=>{
      this.empresaparametro=data;
      console.log(this.empresaparametro)
    })

        
    const parametros= {empresa:this.empresaparametro }
    this.monitoreoEmpresa$=this.monitoreoService.monitoreoEmpresa(parametros);



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

 askEstadoMonitoreo(extension: number ){

  let ParametrosDTO ={ idExtension: extension }
  this.askEstadoExtService.actuAskEstados(ParametrosDTO).subscribe(data =>{

  });

 }


}