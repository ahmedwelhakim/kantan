import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AccountComponent } from './account/account.component';
import { AddressesComponent } from './account/addresses/addresses.component';
import { LoginSecComponent } from './account/login-sec/login-sec.component';
import { OrdersComponent } from './account/orders/orders.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { LogInComponent } from './auth/log-in/log-in.component';
import { SendOtpComponent } from './auth/send-otp/send-otp.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PageNotFoundComponent } from './errors/page-not-found/page-not-found.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactUsComponent,
    SignUpComponent,
    LogInComponent,
    SendOtpComponent,
    ForgetPasswordComponent,
    AccountComponent,
    OrdersComponent,
    LoginSecComponent,
    AddressesComponent,
    PageNotFoundComponent,
    LoaderComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    AppRoutingModule,
    NgbModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
