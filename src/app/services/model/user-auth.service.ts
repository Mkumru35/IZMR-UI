 import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../toastr.services/custom-toastr.service';
import { HttpClientService } from '../common/http-client-service';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { Login } from 'src/app/contracts/login';
 

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  constructor(private httpClientService: HttpClientService, private toastrService: CustomToastrService) { }

  async login(login:Login, callBackFunction?: () => void,errorCallBack?:(errorMessage:string)=>void): Promise<any> {
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller: "auth",
      action: "login"
    }, { login }) 

    const tokenResponse: TokenResponse = await firstValueFrom(observable).catch(error=>errorCallBack(error.message)) as TokenResponse;

    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);

      this.toastrService.message("Kullanıcı girişi başarıyla sağlanmıştır.", "Giriş Başarılı", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      })
    }

    callBackFunction();
  }

  async refreshTokenLogin(refreshToken: string,userName:string, callBackFunction?: (state) => void): Promise<any> {
    const observable: Observable<any | TokenResponse> = this.httpClientService.post({
      action: "refreshtokenlogin",
      controller: "auth"
    }, { refreshToken: refreshToken ,userName:userName});

    try {
      const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;

      if (tokenResponse) {
        localStorage.setItem("accessToken", tokenResponse.token.accessToken);
        localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      }

      callBackFunction(tokenResponse ? true : false);
    } catch {
     
      
      callBackFunction(false);
    }
  }

  
  

   

   
}
