import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { LiveAnnouncer} from '@angular/cdk/a11y';
import { MatSort, Sort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { AuthUsuario }  from 'src/app/_model/auth_usuario'
import { AdminUsuariosService } from 'src/app/_services/admin-usuarios.service';
import { MatPaginator } from '@angular/material/paginator';



@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {

  displayedColumns: string[] = ['id_usuario','usuario', 'id_empresa', 'id_rol','acciones'];
  dataSource !: MatTableDataSource<AuthUsuario>;      

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private adminUsuariosService: AdminUsuariosService) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  cantidad: number = 0;

 

  ngOnInit(): void {
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

    eliminar(idPaciente: number) {
    }

}
