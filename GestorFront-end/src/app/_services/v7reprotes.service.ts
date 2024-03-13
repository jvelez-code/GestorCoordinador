import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class V7reprotesService {
  private readonly http = inject(HttpClient);

  reporLlamadasPerdidas():Observable<any>{
      
    return this.http.get(`http://localhost:3000/reporGestor/reportes`);
   }
}
