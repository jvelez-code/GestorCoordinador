import { Component, OnInit } from '@angular/core';
import { LoginService } from './_services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  reporteName : string ="TMO Entrante Saliente"

  constructor(
    public loginService: LoginService
  ){}

  ngOnInit(){
     
  }
  
}
