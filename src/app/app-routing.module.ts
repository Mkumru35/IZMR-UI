import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';  
 
import { HomeComponent } from './ui/components/home/home.component';
import { authGuardFn } from './guard/common/auth.guard';

const routes: Routes = [

  { path: "", component: HomeComponent ,canActivate:[authGuardFn]},
  { path: "login",loadChildren:()=>import("./ui/components/login/login.module").then(module=>module.LoginModule)},   
  { path: "financeDetail", loadChildren:()=>import("./ui/components/finance-detail/finance-detail.module").then(module=>module.FinanceDetailModule),canActivate:[authGuardFn]},
  { path: "financeDetail/:pageNo", loadChildren:()=>import("./ui/components/finance-detail/finance-detail.module").then(module=>module.FinanceDetailModule),canActivate:[authGuardFn]},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
