import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyInterceptorService {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    const company = localStorage.getItem('company'); 
    
 
    if (req.method === 'POST' && company) {
      const modifiedReq = req.clone({ 
        body: { ...req.body, company } // Örnek olarak veriyi gövdeye ekliyorum, bu sizin kullanımınıza göre değişebilir
      });
      return next.handle(modifiedReq);
    }
    
    // Diğer durumlarda, URL parametresi olarak ekle
    if (company) {
      const modifiedReq = req.clone({ 
        params: req.params.set('company', company)
      });
      return next.handle(modifiedReq);
    }

    // Company değeri yoksa, isteği değiştirmeden devam et
    return next.handle(req);
  }
}