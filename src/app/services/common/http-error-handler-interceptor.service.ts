import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, Observable, of } from 'rxjs';
import { SpinnerType } from '../../base/base.component';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../toastr.services/custom-toastr.service';
import { UserAuthService } from '../model/user-auth.service';
import { AuthService } from './auth.service';
 
 

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {

  constructor(private authService:AuthService,private toastrService: CustomToastrService,private router: Router, private spinner: NgxSpinnerService,private userAuthService:UserAuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(catchError(error => {
      switch (error.status) {
        case HttpStatusCode.Unauthorized:

        this.userAuthService.refreshTokenLogin(localStorage.getItem("refreshToken"),localStorage.getItem("username"),(data)=>{
          if (data==false) {
            this.router.navigateByUrl('/login');
            this.toastrService.message("Bu işlemi yapmaya yetkiniz bulunmamaktadır!", "Yetkisiz işlem!", {
              messageType: ToastrMessageType.Warning,
              position: ToastrPosition.BottomFullWidth
            });
          } 
         }).then(data =>{});
        break;
       
        case HttpStatusCode.InternalServerError:
          this.toastrService.message("Sunucuya erişilmiyor!", "Sunucu hatası!", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.BottomFullWidth
          });
          break;
        case HttpStatusCode.BadRequest:
          this.toastrService.message("Geçersiz istek yapıldı!", "Geçersiz istek!", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.BottomFullWidth
          });
          break;
        case HttpStatusCode.NotFound:
          this.toastrService.message("Sayfa bulunamadı!", "Sayfa bulunamadı!", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.BottomFullWidth
          });
          break;
        default:
          this.toastrService.message("Beklenmeyen bir hata meydana gelmiştir!", "Hata!", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.BottomFullWidth
          });
          break;
      }

      this.spinner.hide(SpinnerType.BallAtom);
      
      return of(error);
    }));
  }
}
