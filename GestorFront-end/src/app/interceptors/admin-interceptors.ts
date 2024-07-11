import { Observable, finalize } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { AuthUsuario } from "../_model/auth_usuario";
import { LoginService } from "../_services/login.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Console } from "console";

@Injectable()
export class AdminInterceptors implements HttpInterceptor {

    constructor( 
        private loginService: LoginService,
        private ngxUiLoaderService: NgxUiLoaderService )
    {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const excludedUrls = [
            '/reporContact/monitoreo'
          ];

        const isExcluded = excludedUrls.some(url => request.url.includes(url));

        if (isExcluded) {
            return next.handle(request);
          }

        this.ngxUiLoaderService.start();
        return next.handle(request).pipe(finalize(()=>this.ngxUiLoaderService.stop()));
        

        if(!request.url.includes('login')){

        const authToken= this.loginService.userTokenValue;
        const authReq = request.clone({
            setHeaders:{
                auth: authToken,
            },
        });

        return next.handle(authReq);

    }
        

              


    }
}