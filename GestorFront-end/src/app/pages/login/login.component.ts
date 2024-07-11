import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/_services/login.service';
import { environment } from 'src/environments/environment';
import '../../../assets/login-animation.js';
import { MenuService } from 'src/app/_services/menu.service';

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
  mensajecaptcha!: string;
  captchaVerified: boolean = false;
  captchaactivo: boolean = true;


  public aFormGroup!: FormGroup;
  private subscripcion : Subscription = new Subscription();



  constructor( 
    private loginService: LoginService,
    private menuService: MenuService,
    private router: Router,
    private formBuilder: FormBuilder ) { }


  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    })
  }

  onVerify(token: string) {
    console.log("El captcha es valido");
    this.captchaVerified = true;
  }

  onExpired(response: any) {
    console.log("se expiro el captcha");
  }

  onError(error: any) {
    console.log("ocurrio un error con el captcha");
  }

  setMensajeInformativo(mensaje: string) {
    this.mensajecaptcha = mensaje;
  }


  ngOnDestroy(): void {
     this.subscripcion.unsubscribe();
  }



  iniciarSesion(){


    const user= {usuario:this.usuario, clave:this.clave }

   if(this.captchaVerified || !this.captchaactivo){
      this.subscripcion = this.loginService.login(user).subscribe(data=>{
        console.log(environment.TOKEN_NAME,'envire'),
        console.log(data.token,'envire45'),
        localStorage.setItem(environment.TOKEN_NAME,data.token );




        this.menuService.listarPorUsuario(this.usuario).subscribe(data =>{
          console.log(data,'menu');
          this.loginService.setMenuCambio(data);
        });

        this.router.navigate(['reporte']);


         
      })
    }else{
      this.setMensajeInformativo("Por favor, complete el captcha.");
    }
    
    
    }

  

  ngAfterViewInit() {
    
    
    const randomNumber = Math.floor(Math.random() * 13) + 1;
    const bodyElement = document.getElementById("bodylogin");
    const backgroundImage = `url('assets/fondos/fondo${randomNumber}.jpg')`;
    //const backgroundImage = `url('assets/fondos/fondo12.jpg')`;
    if (bodyElement) {
      bodyElement.style.backgroundImage = backgroundImage;
      bodyElement.style.backgroundRepeat = "no-repeat";
      bodyElement.style.backgroundSize = "cover";
     
    }
    
    // Usar una media query para ajustar la imagen en pantallas pequeñas
    if (window.matchMedia("(max-width: 768px)").matches) {
      if (bodyElement) {
        bodyElement.style.backgroundSize = "contain"; // Otra opción para imágenes más pequeñas
      }
    }

    (window as any).initialize();

  }

}


