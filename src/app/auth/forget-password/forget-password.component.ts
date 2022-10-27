import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/custom-validators.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss', '../auth.scss'],
})
export class ForgetPasswordComponent implements OnInit {
  time!: number;
  constructor(private authService: AuthService) {}
  form!: FormGroup;
  errorMessage = '';
  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      phone: new FormControl(null, [
        Validators.required,
        CustomValidators.isPhoneNumberValidator,
      ]),
    });
  }

  onSubmit() {
    if (!this.form.valid) return;
    this.authService.forgetPassword(this.form.value).subscribe({
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
      },
      next: (res) => console.log(res),
    });
  }
}
