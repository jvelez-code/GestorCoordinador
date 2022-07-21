import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, observable, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Parametros } from '../_model/parametros';
import { Router } from '@angular/router';
import { User, UserResponse } from '../_model/userLogin';
import { Token } from '@angular/compiler';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private logedIn = new BehaviorSubject<boolean>(false);

  //reporteName : boolean = false;

  private url:string = `${environment.HOST}`;
  //sudo kill $(sudo lsof -t -i:4200)



  constructor( 
    private http: HttpClient,
    private router: Router 
    ) { 
      this.checktoken();
    }

    get isLogged(): Observable<boolean>{
      return this.logedIn.asObservable();
    }


  login(user: User ): Observable <UserResponse  | any>{

    return this.http.post<UserResponse>(`${this.url}/auth/login`,user )
    .pipe(
      map((res: UserResponse)=>{
        console.log(res);
        this.savetoken(res.token)
        this.logedIn.next(true);
        return res;
      }),
      catchError((err) => this.handlerError(err) )
      );

      
          
    // const headers = { 'content-type': 'application/json'}  
    // const body=JSON.stringify(parametros);
    // return this.http.post<Parametros>(`${this.url}/auth/login`,body,{'headers':headers});

   }

  //  estaLogueado(){

  //   let token = sessionStorage.getItem(environment.TOKEN_NAME);
  //   //this.reporteName= true;
  //   console.log("Hola login", this.logedIn.value)
  //   //return token != null;
  //   return this.logedIn.value
  //  }

   cerrarSesion(): void {
     localStorage.removeItem('token');
     this.logedIn.next(false);
     this.router.navigate(['login']);
    // this.reporteName= false
    // console.log("Hola login", this.reporteName)
    
    //  sessionStorage.clear();
    //  this.router.navigate(['login']);
    //  return this.reporteName
   }

   private checktoken (): void{
     const userToken: any = localStorage.getItem('token');
     const isExpired = helper.isTokenExpired(userToken);
     //set userisLogged = isExpired;
     console.log('isExpired',isExpired)
     isExpired ? this.cerrarSesion() : this.logedIn.next(true);
   };

   private savetoken (token: string ): void {
     localStorage.setItem('token', token);

   };
   
   private handlerError (err:any): Observable<never>{
     let errorMessage ='Ha ocurrido un error reciviendo Data'
     if(err){
       errorMessage = `Error: code ${err.errorMessage}`

     }
     window.alert(errorMessage)
     return throwError(errorMessage)
   };
   
}
