import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/custom-validators.service';
import { HttpService } from '../shared/http.service';
import { environment } from './../../environments/environment.prod';
import { ContactRes } from './contact-us.model';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  apiUrl: string;
  url: string;
  constructor(private httpService: HttpService) {
    this.apiUrl = environment.apiUrl;
    this.url = '/api/contact-us/';
  }
  form!: FormGroup;
  response: ContactRes | null = null;
  ngOnInit(): void {
    this.initForm();
    this.httpService.fetchData<ContactRes>(this.url).subscribe({
      next: (res) => {
        this.response = res;
      },
      error: (err) => console.log(err),
    });
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [
        Validators.required,
        CustomValidators.isEmailValidator(false),
      ]),
      phone: new FormControl(null, [
        Validators.required,
        CustomValidators.isPhoneNumberValidator,
      ]),
      subject: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.required]),
    });
  }
  onSubmit() {
    if (!this.form.valid) return;
    this.httpService.postData(this.url, this.form.value).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err),
    });
  }
}
