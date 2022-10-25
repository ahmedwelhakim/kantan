import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AddressesComponent } from './account/addresses/addresses.component';
import { LoginSecComponent } from './account/login-sec/login-sec.component';
import { OrdersComponent } from './account/orders/orders.component';
import { AuthLoginGuard } from './auth/auth-login.guard';
import { AuthGuard } from './auth/auth.guard';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { LogInComponent } from './auth/log-in/log-in.component';
import { SendOtpComponent } from './auth/send-otp/send-otp.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PageNotFoundComponent } from './errors/page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/contact-us', pathMatch: 'full' },
  { path: 'contact-us', component: ContactUsComponent },
  {
    path: 'auth',
    canActivate: [AuthLoginGuard],
    children: [
      { path: '', redirectTo: '/auth/log-in', pathMatch: 'full' },
      { path: 'log-in', component: LogInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'send-otp', component: SendOtpComponent },
      { path: 'forget-password', component: ForgetPasswordComponent },
    ],
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'login-sec', component: LoginSecComponent },
      { path: 'addresses', component: AddressesComponent },
      { path: 'orders', component: OrdersComponent },
    ],
  },
  { path: 'errors/page-not-found', component: PageNotFoundComponent },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/errors/page-not-found',
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
