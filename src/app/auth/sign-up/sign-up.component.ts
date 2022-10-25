import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'src/app/shared/custom-validators.service';
import { environment } from 'src/environments/environment';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../auth.scss'],
})
export class SignUpComponent implements OnInit {
  url: string;
  apiUrl: string;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.apiUrl = environment.apiUrl;
    this.url = environment.apiUrl + '/api/user/auth/register/';
  }
  form!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [
        Validators.required,
        CustomValidators.isPhoneNumberValidator,
      ]),
      email: new FormControl(null, [CustomValidators.isEmailValidator(true)]),
      password: new FormControl(null, [
        Validators.required,
        CustomValidators.isStrongPassword,
      ]),
    });
  }
  onSubmit() {
    if (!this.form.valid) return;
    this.authService.signUp(this.form.value).subscribe({
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
      next: (res) =>
        this.router.navigate(['../send-otp'], { relativeTo: this.route }),
    });
  }
}
