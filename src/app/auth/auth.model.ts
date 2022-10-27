import jwt_decode from 'jwt-decode';
import { Token } from './token.model';
export interface SignUpReq {
  phone: string;
  name: string;
  password: string;
  email: string | null;
}

export interface OtpSend {
  code: string;
  phone: string;
}

export interface OtpResendReq {
  phone: string;
}

export interface LoginReq {
  phone: string;
  password: string;
}

export class User {
  private _name: string;
  private _exp: number;
  private _jti: string;
  private _id: number;
  private _phone: string;
  private _email: string | null;
  private _accessToken: string;
  private _refreshToken: string;
  public constructor(accessToken: string, refreshToken: string) {
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
    const token: Token = jwt_decode(accessToken);
    this._name = token.name;
    this._exp = token.exp;
    this._jti = token.jti;
    this._id = token.id;
    this._phone = token.phone;
    this._email = token.email;
  }

  get name() {
    return this._name;
  }
  get expDate() {
    return new Date(this._exp * 1000);
  }
  get jti() {
    return this._jti;
  }
  get id() {
    return this._id;
  }
  get phone() {
    return this._phone;
  }
  get email() {
    return this._email;
  }
  get accessToken(): string | null {
    if (!this.expDate || new Date() > this.expDate) return null;
    return this._accessToken;
  }
  set accessToken(token: string | null) {
    if (!token) return;
    this._accessToken = token;
    this.update();
  }
  private update() {
    const token: Token = jwt_decode(this.accessToken!);
    this._exp = token.exp;
  }
  get refreshToken() {
    return this._refreshToken;
  }
}
