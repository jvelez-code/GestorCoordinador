import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Parametros } from 'src/app/_model/parametros';
import { Tmo } from 'src/app/_model/tmo';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ReporteService } from 'src/app/_services/reporte.service';
import * as moment from 'moment';
//descargar a excel
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
//import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { Usuario } from 'src/app/_model/usuario';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/_services/login.service';
import { ActivatedRoute } from '@angular/router';




const EXCEL_TYPE =
'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
const EXCEL_EXT = '.xlsx';

@Injectable()

@Component({
  selector: 'app-tmo-detallado',
  templateUrl: './tmo-detallado.component.html',
  styleUrls: ['./tmo-detallado.component.css']
})
export class TmoDetalladoComponent implements OnInit {
 

  campaignOne!: FormGroup;
  campaignTwo!: FormGroup;

  tmo !: Tmo[];
  usuarios  !: Usuario[];
  usuarios$ !: Observable<Usuario[]>
  parametros !: Parametros;
  displayedColumns: string[] = ['fecha', 'id', 'agente', 'telefono', 'duracion'];
  dataSource!: MatTableDataSource<Tmo>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  fechaInicio : Date = new Date;
  fechaFin : Date = new Date;
  usuarioSeleccionado !: string;
  form!: FormGroup;
  reporteName : string ="TMO DETALLADO";

  fechaparametro1 !:  string;
  fechaparametro2 !:  string;
  empresaparametro !:  string;

  usuarioparametro = this.usuarioSeleccionado;

   

  constructor( 
    private reporteService : ReporteService,
    private loginService :LoginService,
    public route: ActivatedRoute, ) { 

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

    this.parametros= {fechaini:this.fechaparametro1, fechafin:this.fechaparametro2,
      empresa:this.empresaparametro, usuario:this.usuarioSeleccionado }  


       //this.usuarios$ = this.reporteService.usuariosXEmpresa(this.parametros);

      
  }



  aceptar(){  
        
    this.fechaparametro1 = moment(this.fechaInicio).format('YYYY-MM-DD 00:00:01');
    this.fechaparametro2 = moment(this.fechaFin).format('YYYY-MM-DD 23:59:59');
    

 
    const parametros= {fechaini:this.fechaparametro1, fechafin:this.fechaparametro2,empresa:this.empresaparametro }
   //parametros son los paramatros que enviamos y node.js los toma en el header

   
    this.reporteService.reporTmoDetallado(parametros).subscribe(data=>{
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  });    }


  //Exportar a excel
  exportar(json: any[], excelFileName:string): void{
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook :  XLSX.WorkBook = {
      Sheets:{'data': worksheet},
      SheetNames: ['data']
  };
  const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type:'array'});
  this.saveExcel(excelBuffer, excelFileName)
}

private saveExcel(buffer:any, fileName:string): void {
  const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXT);
}

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
