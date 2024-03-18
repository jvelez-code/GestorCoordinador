import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable,  } from '@angular/core';
import { BehaviorSubject, catchError, map, observable, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Parametros } from '../_model/parametros';
import { Router } from '@angular/router';
import { User, UserResponse } from '../_model/userLogin';
import { Token } from '@angular/compiler';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Empresa } from '../_model/empresa';
import { Menu } from '../_model/menu';


const helper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private menuCambio = new Subject<Menu[]>();
  private logedIn = new BehaviorSubject<boolean>(false);
  private logeoEmpresa=  new BehaviorSubject<string>('--SIN EMPRESA--');
  private userToken=  new BehaviorSubject<string>('null') ;

  private empresaCambio = new Subject<string>();
  pseudonimo !: string;



  //reporteName : boolean = false;

  private url:string = `${environment.HOST}`;
  //sudo kill $(sudo lsof -t -i:4200)


  header = new HttpHeaders();
  constructor( 
    private http: HttpClient,
    private router: Router 
    ) { 
      this.checktoken();
    }



    //////// get, set ///////////////////
    
    getMenuCambio() {
      return this.menuCambio.asObservable();
    }

    setMenuCambio(menus: Menu[]) {
      this.menuCambio.next(menus);
    } 


    getEmpresaCambio(){
      return this.empresaCambio.asObservable();
    }
  
    setEmpresaCambio(empresa: string){
      this.empresaCambio.next(empresa);
      this.logeoEmpresa.next(empresa);
    }
  

    get isLogged(): Observable<boolean>{
      return this.logedIn.asObservable();
    }

    get isEmpresa(): Observable<string>{
      return this.logeoEmpresa.asObservable();
    }
    
     
    set setEmpresa(empresa: string){
       this.logeoEmpresa.next(empresa);
    }
         

    get userTokenValue(): string{
      return this.userToken.getValue();
    }


  


  login(user: User ): Observable <UserResponse  | any>{
    

    return this.http.post<UserResponse>(`${this.url}/auth/login`,user)
    .pipe(
      map((res: UserResponse)=>{
        console.log('holaaa',res);
        this.savetoken(res.token)
        this.logedIn.next(true);
        this.logeoEmpresa.next(res.id_empresa);
        this.userToken.next(res.token);
        return res;
      }),
      catchError((err) => this.handlerError(err) )
      );

      
          
    // const headers = { 'content-type': 'application/json'}  
    // const body=JSON.stringify(parametros);
    // return this.http.post<Parametros>(`${this.url}/auth/login`,body,{'headers':headers});

   }


   cerrarSesion(): void {
     localStorage.removeItem('token');
     this.logedIn.next(false);
     this.router.navigate(['login']);
     this.userToken.next('null')
    // this.reporteName= false
    // console.log("Hola login", this.reporteName)
    
    //  sessionStorage.clear();
    //  this.router.navigate(['login']);
    //  return this.reporteName
   }

   private checktoken (): void{
     const userToken: any = localStorage.getItem('token');
     const isExpired = helper.isTokenExpired(userToken);
     this.userToken.next(userToken);
     //set userisLogged = isExpired;
     console.log('isExpired',isExpired)
     isExpired ? this.cerrarSesion() : this.logedIn.next(true);
   };

   private savetoken (token: string ): void {
     localStorage.setItem('token', token);

   };
   
   private handlerError (err:any): Observable<never>{
     let errorMessage ='Ha ocurrido un error recibiendo Data'
     if(err){
       errorMessage = `Error: code ${err.errorMessage}`

     }
     window.alert(errorMessage)
     return throwError(errorMessage)
   };
   
}
