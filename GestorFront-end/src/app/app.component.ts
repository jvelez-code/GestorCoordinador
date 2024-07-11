import { Component, OnInit } from '@angular/core';
import { LoginService } from './_services/login.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
import { Menu } from './_model/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  menus!: Menu[];

  constructor(
    public loginService: LoginService,
    private bnIdle: BnNgIdleService,
    private router: Router
  ){
    this.bnIdle.startWatching(50000).subscribe((res) => {
      if(res) {
        console.log("session expired");
        this.router.navigate(['/login']);
        loginService.cerrarSesion();
      }
    })
  }

  ngOnInit() {
    this.loginService.getMenuCambio().subscribe(data => {
      this.menus = data;
    });
  }
  
}
