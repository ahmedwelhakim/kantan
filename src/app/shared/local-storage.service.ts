import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  setItem<T extends LocalStorageKeys>(key: T, item: LocalStorageTypes<T>) {
    localStorage.setItem(key, JSON.stringify(item));
  }
  getItem<T extends LocalStorageKeys>(key: T): LocalStorageTypes<T> | null {
    const localStorageStr = localStorage.getItem(key);
    if (!localStorageStr) return null;
    return JSON.parse(localStorageStr);
  }
  removeItem(key: LocalStorageKeys) {
    localStorage.removeItem(key);
  }
}
export enum LocalStorageKeys {
  User = 'user',
  phone = 'phone',
}

type LocalStorageTypes<T> = T extends LocalStorageKeys.User
  ? UserType
  : T extends LocalStorageKeys.phone
  ? PhoneType
  : never;

type UserType = {
  access: string;
  refresh: string;
};
type PhoneType = {
  phone: string;
};
