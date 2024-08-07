import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
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
import { LoginService } from 'src/app/_services/login.service';
import { ReportesGeneral } from 'src/app/_model/reportesgeneral';
//import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
const EXCEL_TYPE =
'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
const EXCEL_EXT = '.xlsx';

@Injectable()

@Component({
  selector: 'app-seguimiento-agente',
  templateUrl: './seguimiento-agente.component.html',
  styleUrls: ['./seguimiento-agente.component.css']
})
export class SeguimientoAgenteComponent implements OnInit {
  fechaInicio : Date = new Date;
  fechaFin : Date = new Date;
  form!: FormGroup;
  reporteName : string ="Seguimiento de Agentes"

  campaignOne!: FormGroup;
  campaignTwo!: FormGroup;

  fechaparametro1 !:  string;
  fechaparametro2 !:  string;
  empresaparametro !:  string;

  ReportesGeneral !: ReportesGeneral[];
  parametros !: Parametros;
  displayedColumns: string[] = ['fecha', 'campana', 'idcampana', 'usuario', 'efectiva','no_efectiva','total_gestiones'];
  dataSource!: MatTableDataSource<ReportesGeneral>;
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

 
    const parametrosDTO= { fechaInicial : this.fechaparametro1, fechaFinal : this.fechaparametro2, 
                           empresa : this.empresaparametro }
   // parametrosDTO que enviamos y node.js los toma en el header
    this.reporteService.reporSeguimiento(parametrosDTO).subscribe(data=>{
    console.log(data);
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
