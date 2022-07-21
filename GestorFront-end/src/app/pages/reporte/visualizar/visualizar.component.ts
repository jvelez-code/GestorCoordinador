import { Component, OnInit, Input} from '@angular/core';
import { Reportes } from '../../../_model/reportes';
import { ReporteService } from '../../../_services/reporte.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Gestion } from '../../../_model/gestion';
import { MatTableDataSource } from '@angular/material/table';
import { CityI } from '../../../_model/cityI';
import * as moment from 'moment';


@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.css']
})
export class VisualizarComponent implements OnInit {

  mensaje !: string;
  gestion !: Gestion[];
  cities !: CityI;
  displayedColumns: string[] = ['id_gestion', 'id_campana', 'id_agente', 'fecha_gestion'];
  dataSource!: MatTableDataSource<Gestion>;
  //displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  //dataSource = this.gestion;
  
  id!: number;
  @Input() 
  fechahija1 : string="Sin nombre";
 
  fechanueva !:  string;
 
 
  campana !:  string;
  get bar(): string {
    return this.campana;
   }
  set bar(value: string) {
    this.campana = value;
    }

  fechaparametro1 !:  string;
  fechaparametro2 !:  string;
  

  constructor( private reporteService : ReporteService, 
               private route: ActivatedRoute,
               private router: Router) { }

  ngOnInit(): void {  }
 
}
