import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from './../../environments/environment';
import {
  LocalStorageKeys,
  LocalStorageService,
} from './../shared/local-storage.service';
import { LoginReq, SignUpReq, User } from './auth.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  expirationTimer!: NodeJS.Timeout;
  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {}
  registerUrl = environment.apiUrl + '/api/user/auth/register/';
  resendOtpUrl = environment.apiUrl + '/api/user/auth/resend-otp/';
  tokenUrl = environment.apiUrl + '/api/token/';
  forgetPasswordUrl =
    environment.apiUrl + '/api/user/auth/reset-forget-password/';
  refreshTokenUrl = environment.apiUrl + '/api/token/refresh/';

  user = new BehaviorSubject<User | null>(null);
  signUp(data: SignUpReq) {
    if (!data.email) data.email = null;
    this.localStorageService.setItem(LocalStorageKeys.phone, {
      phone: data.phone,
    });
    return this.httpClient.post(this.registerUrl, data);
  }

  sendOtp(otp: string) {
    const phone = this.localStorageService.getItem(
      LocalStorageKeys.phone
    )!.phone;
    return this.httpClient.put(this.registerUrl, { code: otp, phone });
  }

  resendOtp() {
    const phone = this.localStorageService.getItem(LocalStorageKeys.phone);
    return this.httpClient.put(this.resendOtpUrl, { phone });
  }

  createUser(obs: { refresh: string; access: string }) {
    const userObj = new User(obs.access, obs.refresh);
    console.log(userObj);
    this.user.next(userObj);
    this.localStorageService.setItem(LocalStorageKeys.User, {
      access: obs.access,
      refresh: obs.refresh,
    });
    console.log('User stored');
  }
  login(data: LoginReq) {
    return this.httpClient
      .post<{ refresh: string; access: string }>(this.tokenUrl, data)
      .pipe(
        tap((obs) => {
          this.createUser(obs);
        })
      );
  }

  forgetPassword(data: { phone: string }) {
    return this.httpClient.post(this.forgetPasswordUrl, data);
  }

  autoLogin() {
    const userData = this.localStorageService.getItem(LocalStorageKeys.User);
    if (!userData) {
      console.log('Return!');
      return;
    }
    const user = new User(userData.access, userData.refresh);
    if (user.accessToken) {
      this.user.next(user);
    }
    if (!user.accessToken) {
      this.refreshToken();
    }
    clearTimeout(this.expirationTimer);
    const time = user.expDate.getTime() - new Date().getTime();
    console.log(user.expDate);
    console.log(time / (1000 * 60 * 60 * 24));
  }

  autoRefresh(expirateTime_ms: number) {
    this.expirationTimer = setTimeout(() => {
      this.refreshToken();
    }, expirateTime_ms);
  }

  refreshToken() {
    this.httpClient
      .post<{ access: string }>(this.refreshTokenUrl, {
        refresh: this.user.value?.refreshToken,
      })
      .subscribe({
        next: (res) => {
          if (!this.user.value) return;
          this.user.value.accessToken = res.access;
          this.user.next(this.user.value);
          this.localStorageService.setItem(LocalStorageKeys.User, {
            access: this.user.value.accessToken,
            refresh: this.user.value.refreshToken,
          });
        },
        error: (err) => console.log(err),
      });
  }
  logout() {
    this.user.next(null);
    this.localStorageService.removeItem(LocalStorageKeys.User);
    clearTimeout(this.expirationTimer);
  }
}
