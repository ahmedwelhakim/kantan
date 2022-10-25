import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-send-otp',
  templateUrl: './send-otp.component.html',
  styleUrls: ['./send-otp.component.scss', '../auth.scss'],
})
export class SendOtpComponent implements OnInit {
  time!: number;
  @ViewChild('otp') otpParent!: ElementRef;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  form!: FormGroup;
  response: { detail: string } | null = null;
  timerInterval: any;

  ngOnInit(): void {
    this.initForm();
    this.timerInterval = setInterval(() => {
      this.time = Math.max(--this.time, 0);
    }, 1000);
    this.resetTime();
  }
  ngAfterViewInit() {}
  initForm() {
    this.form = new FormGroup({
      otp1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(1),
      ]),
      otp2: new FormControl(null, [
        Validators.required,
        Validators.maxLength(1),
      ]),
      otp3: new FormControl(null, [
        Validators.required,
        Validators.maxLength(1),
      ]),
      otp4: new FormControl(null, [
        Validators.required,
        Validators.maxLength(1),
      ]),
    });
  }

  onSubmit() {
    if (!this.form.valid) return;
    this.authService
      .sendOtp(
        this.form.value.otp1 +
          this.form.value.otp2 +
          this.form.value.otp3 +
          this.form.value.otp4
      )
      .subscribe({
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
        next: (res) =>
          this.router.navigate(['../log-in'], { relativeTo: this.route }),
      });
  }

  onResend() {
    this.resetTime();
    this.authService.resendOtp().subscribe({
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
      next: (res) => console.log(res),
    });
  }
  resetTime() {
    this.time = 30;
  }
  onDigitInput(event: KeyboardEvent) {
    let elementindex: number = +(event.target as HTMLInputElement).name.at(-1)!;
    if (event.code !== 'Backspace')
      elementindex = Math.min(elementindex + 1, 4);
    if (event.code === 'Backspace')
      elementindex = Math.max(elementindex - 1, 1);

    this.otpParent.nativeElement.children['otp' + elementindex].focus();
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }
}
