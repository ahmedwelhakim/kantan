import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'src/app/shared/custom-validators.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss', '../auth.scss'],
})
export class LogInComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  form!: FormGroup;
  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      phone: new FormControl(null, [
        Validators.required,
        CustomValidators.isPhoneNumberValidator,
      ]),
      password: new FormControl(null, [
        Validators.required,
        CustomValidators.isStrongPassword,
      ]),
    });
  }
  onSubmit() {
    if (!this.form.valid) return;
    this.authService.login(this.form.value).subscribe({
      error: (err: HttpErrorResponse) => {
        console.log(err.name);
      },
      next: (res) => this.router.navigate(['/']),
    });
  }
}
