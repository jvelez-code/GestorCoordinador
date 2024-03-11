import { Observable, observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { AuthUsuario } from "../_model/auth_usuario";
import { LoginService } from "../_services/login.service";

@Injectable()
export class AdminInterceptors implements HttpInterceptor {

    
    constructor(private loginService: LoginService ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(!req.url.includes('login')){
        const authToken= this.loginService.userTokenValue;
        const authReq = req.clone({
            setHeaders:{
                auth: authToken,
            },
        });
        return next.handle(authReq);

    }
        return next.handle(req);
    }
}