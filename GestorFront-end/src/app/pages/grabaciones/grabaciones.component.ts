import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CityI, listas } from 'src/app/_model/cityI';
import { GrabacionesPilaI } from 'src/app/_model/grabacionesPilaI.';
import { GrabacionesPilaService } from 'src/app/_services/grabaciones-pila.service';

@Component({
  selector: 'app-grabaciones',
  templateUrl: './grabaciones.component.html',
  styleUrls: ['./grabaciones.component.css']
})
export class GrabacionesComponent {

  title="listasonidos";
  //let audio = new Audio(item.fechafin);
  private audio = new Audio();
  public grabacionesPila !: GrabacionesPilaI [];
  public listas:Array<CityI> = listas;
  //public grabacionesPila:Array<GrabacionesPilaI> = listas;

  constructor( 
    private grabacionesPilaService : GrabacionesPilaService,
    private router: Router,
    private snackBar: MatSnackBar ) { }

    displayedColumns: string[] = ['fecha_grabacion', 'uniqueid', 'ruta_grabacion'];
    dataSource!: MatTableDataSource<GrabacionesPilaI>;



  reproducirsonido(item:CityI){
    item.reproducciendo= false;
    
//    this.audio.play();
      this.audio.src = item.fechafin;
      this.audio.pause();

      if(item.reproducciendo){
        console.log('hola');
        this.audio.pause();
        item.reproducciendo= false;
      }else{
        console.log('mundo');
        this.audio.play();
        item.reproducciendo= true;
        setTimeout(()=>{
          item.reproducciendo= false;
        },4000)
      }

  }
  
  reproducirAudios(){

    const parametros ={ fechaini: '2023-09-01 01:02:00', fechafin: '2023-09-01 11:02:00', empresa: '1'}
  
    this.grabacionesPilaService.rutaGrabaciones(parametros).subscribe(data =>{
      console.log(data)
      this.grabacionesPila=data;
      this.dataSource = new MatTableDataSource(data);
    });
  }

}
