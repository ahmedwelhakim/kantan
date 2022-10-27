import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, tap } from 'rxjs';
import { CustomValidators } from 'src/app/shared/custom-validators.service';
import { HttpService } from 'src/app/shared/http.service';
import { Address } from '../address.model';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  addressForm!: FormGroup;
  addresses$ = new BehaviorSubject<Address[]>([]);
  private addressesArr: Address[] = [];
  url = '/api/user-address/';
  constructor(private httpService: HttpService) {
    this.initAddressForm();
  }

  setDefaultAddress(address: Address) {
    address.is_default = true;
    const obs$ = this.httpService
      .patchData(this.url + `${address.id}`, address)
      .pipe(
        tap(() => {
          this.addressesArr[0].is_default = false;
          address.is_default = true;
          this.addressesArr.sort((a, b) =>
            a.is_default ? -1 : b.is_default ? 1 : 0
          );
          this.addresses$.next(this.addressesArr.slice());
        })
      );
    address.is_default = false;
    return obs$;
  }

  setAdressFormValues(address: Address) {
    Object.entries(address).forEach(([key, val]) =>
      this.addressForm.get(key)?.setValue(val)
    );
  }

  deleteAddress(address: Address) {
    this.addressesArr = this.addressesArr.filter((v) => v.id !== address.id);
    this.addresses$.next(this.addressesArr);
    return this.httpService.deleteData(this.url + address.id);
  }

  submitEditAddress(address: Address) {
    return this.httpService
      .putData(this.url + address.id, this.addressForm.value)
      .pipe(
        tap(() => {
          this.addressesArr.splice(
            this.addressesArr.findIndex((v) => v.id == address.id),
            1,
            this.addressForm.value
          );
          this.addresses$.next(this.addressesArr.slice());
        })
      );
  }
  submitNewAddress() {
    return this.httpService
      .postData<Address>(this.url, this.addressForm.value)
      .pipe(
        tap((res) => {
          this.addressesArr.push(res);
          this.addresses$.next(this.addressesArr.slice());
        })
      );
  }
  private initAddressForm() {
    this.addressForm = new FormGroup({
      address: new FormControl(null, [Validators.required]),
      apartment: new FormControl(null, [Validators.required]),
      building: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [CustomValidators.isEmailValidator(true)]),
      floor: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [
        Validators.required,
        CustomValidators.isPhoneNumberValidator,
      ]),
    });
  }

  fetchAddresses() {
    return this.httpService.fetchData<Address[]>(this.url).pipe(
      tap((res) => {
        this.addressesArr = res;
        this.addressesArr.sort((a, b) =>
          a.is_default ? -1 : b.is_default ? 1 : 0
        );
        this.addresses$.next(res);
      })
    );
  }
}
