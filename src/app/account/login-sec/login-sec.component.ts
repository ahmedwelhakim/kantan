import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/custom-validators.service';
import { environment } from 'src/environments/environment';
import { HttpService } from '../../shared/http.service';

@Component({
  selector: 'app-login-sec',
  templateUrl: './login-sec.component.html',
  styleUrls: ['./login-sec.component.scss'],
})
export class LoginSecComponent implements OnInit {
  constructor(private httpService: HttpService) {}
  form!: FormGroup;
  url = environment.apiUrl + '/api/user/account/';
  toastHidden = true;
  toastMessage = '';
  isLoading = false;
  response: LoginResponse | null = null;
  ngOnInit(): void {
    this.initForm();
    this.isLoading = true;
    this.httpService.fetchData<LoginResponse>(this.url).subscribe((res) => {
      this.response = res;
      this.form.get('name')?.setValue(res.name);
      this.form.get('phone')?.setValue(res.phone);
      this.form.get('email')?.setValue(res.email);
      this.form.setValidators(CustomValidators.isNotEqual<LoginResponse>(res));
      this.isLoading = false;
    });
  }

  onSubmit() {
    this.httpService.putData(this.url, this.form.value).subscribe({
      next: () => {
        this.toastHidden = false;
        this.toastMessage = 'Updated Successfully';
      },
      error: () => {
        this.toastHidden = false;
        this.toastMessage = 'An error has occured!';
      },
    });
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [
        Validators.required,
        CustomValidators.isPhoneNumberValidator,
      ]),
      email: new FormControl(this.response?.email, [
        CustomValidators.isEmailValidator(true),
      ]),
    });
  }
}
interface LoginResponse {
  phone: string;
  name: string;
  email: null | string;
}
