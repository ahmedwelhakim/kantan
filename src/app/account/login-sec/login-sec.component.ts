import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidators } from 'src/app/shared/custom-validators.service';
import { HttpService } from '../../shared/http.service';

@Component({
  selector: 'app-login-sec',
  templateUrl: './login-sec.component.html',
  styleUrls: ['./login-sec.component.scss'],
})
export class LoginSecComponent implements OnInit {
  constructor(
    private httpService: HttpService,
    private modalService: NgbModal
  ) {}
  generalForm!: FormGroup;
  passwordForm!: FormGroup;
  @ViewChild('modal') modal!: ElementRef;
  url = '/api/user/account/';
  changePassurl = '/api/user/account/change-password';
  toastHidden = true;
  toastMessage = '';
  isLoading = false;
  response: LoginResponse | null = null;
  errorMessage = '';
  ngOnInit(): void {
    this.initGeneralForm();
    this.initPasswordForm();
    this.isLoading = true;
    this.httpService.fetchData<LoginResponse>(this.url).subscribe({
      next: (res) => {
        this.response = res;
        this.setForm(res);
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  onSubmit() {
    if (this.generalForm.invalid) return;
    if (!this.generalForm.get('email')?.value)
      this.generalForm.get('email')?.setValue(null);
    this.httpService.putData(this.url, this.generalForm.value).subscribe({
      next: () => {
        this.toastMessage = 'Updated Successfully';
        this.setForm(this.generalForm.value);
        this.generalForm.patchValue({});
      },
      error: () => {
        this.toastMessage = 'An error has occured!';
      },
    });
  }
  onChangePassword() {
    this.openModal();
  }
  onSavePassword() {
    if (this.passwordForm.invalid) return;
    this.httpService
      .putData(this.changePassurl, {
        old_password: this.passwordForm.get('currentPassword')?.value,
        new_password: this.passwordForm.get('newPassword')?.value,
        confirm_password: this.passwordForm.get('confirmPassword')?.value,
      })
      .subscribe({
        next: () => {
          this.toastMessage = 'Password saved successfully';
          this.modalService.dismissAll();
        },
        error: (err) => (this.errorMessage = err.message),
      });
  }
  setForm(res: LoginResponse) {
    this.generalForm.get('name')?.setValue(res.name);
    this.generalForm.get('phone')?.setValue(res.phone);
    this.generalForm.get('email')?.setValue(res.email);
    this.generalForm.setValidators(
      CustomValidators.isNotEqual<LoginResponse>(res)
    );
    this.isLoading = false;
  }
  initPasswordForm() {
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl(null, [Validators.required]),
      newPassword: new FormControl(null, [
        Validators.required,
        CustomValidators.isStrongPassword,
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        CustomValidators.isMatch('newPassword'),
      ]),
    });
  }
  initGeneralForm() {
    this.generalForm = new FormGroup({
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
  closeResult = '';
  private openModal() {
    this.modalService
      .open(this.modal, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'xl',
        modalDialogClass: 'padding:50px',
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.errorMessage = '';
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.errorMessage = '';
        }
      );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
interface LoginResponse {
  phone: string;
  name: string;
  email: null | string;
}
