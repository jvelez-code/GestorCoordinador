import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { LiveAnnouncer} from '@angular/cdk/a11y';
import { MatSort, Sort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { AuthUsuario }  from 'src/app/_model/auth_usuario'
import { AdminUsuariosService } from 'src/app/_services/admin-usuarios.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';



@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {

  displayedColumns: string[] = ['id_usuario','usuario', 'id_empresa', 'id_rol','acciones'];
  dataSource !: MatTableDataSource<AuthUsuario>;      

  constructor(private adminUsuariosService: AdminUsuariosService,
              private snackBar: MatSnackBar) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  cantidad: number = 0;

 

  ngOnInit(): void {
    this.adminUsuariosService.getUsuarioCambio().subscribe(data=>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.adminUsuariosService.getMensajeCambio().subscribe(data =>{
      this.snackBar.open(data, 'AVISO', {duration: 4000});
    });

    this.adminUsuariosService.listarUsuarios().subscribe(data =>{
      console.log(data);     
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    
  }

    mostrarMas(e: any) {
    }

    filtrar(valor: string) {
      this.dataSource.filter = valor.trim().toLowerCase();
    }

    eliminar(idUsuario: number) {
      this.adminUsuariosService.eliminarUsuarios(idUsuario).pipe(switchMap (()=>{
        return this.adminUsuariosService.listarUsuarios()
      })).subscribe(data => {
        this.adminUsuariosService.setUsuarioCambio(data);
        this.adminUsuariosService.setMensajecambio('SE ELIMINÓ')

      });
    }

}
