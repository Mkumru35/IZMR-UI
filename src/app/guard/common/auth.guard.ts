import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner'; 
import { ToastrService } from 'ngx-toastr';
import { SpinnerType } from 'src/app/base/base.component';
import { _isAuthenticated } from 'src/app/services/common/auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/toastr.services/custom-toastr.service';

export const authGuardFn: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const jwtHelper = new JwtHelperService();
  const spinner = new NgxSpinnerService();  
  spinner.show(SpinnerType.BallAtom);  

  if (!_isAuthenticated) {
    inject(Router).navigate(["login"], { queryParams: { returnUrl: state.url } });
    inject(CustomToastrService).message("Oturum açmanız gerekiyor!", "Yetkisiz Erişim!", {
      messageType: ToastrMessageType.Warning,
      position: ToastrPosition.TopRight
    });
    spinner.hide(SpinnerType.BallAtom);
    return false;
  }

  spinner.hide(SpinnerType.BallAtom);
  return true;
};

