import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/_services/login.service';
import { environment } from 'src/environments/environment';
import '../../../assets/login-animation.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  hide !: false;
  usuario !: string;
  clave !: string;
  mensaje !: string;
  error !: string;



  public aFormGroup!: FormGroup;
  private subscripcion : Subscription = new Subscription();



  constructor( 
    private loginService: LoginService,
    private router: Router,
    private formBuilder: FormBuilder ) { }


  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    })
  }


  ngOnDestroy(): void {
     this.subscripcion.unsubscribe();
  }

  siteKey :string= "6Ldg4NEgAAAAADsM8zee7pEVzDmNp1zMyl6sz60e";


  iniciarSesion(){
    const user= {usuario:this.usuario, clave:this.clave }
    this.subscripcion = this.loginService.login(user).subscribe(data=>{
       this.router.navigate(['reporte']);
    })
    
    }

  

  ngAfterViewInit() {
    (window as any).initialize();
  }

}


