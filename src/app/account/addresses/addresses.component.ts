import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Address } from '../address.model';
import { AddressService } from './address.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
})
export class AddressesComponent implements OnInit, OnDestroy {
  constructor(
    private addressService: AddressService,
    private modalService: NgbModal
  ) {}

  addresses: Address[] = [];
  closeResult = '';
  form!: FormGroup;
  addressSub!: Subscription;
  isLoading = true;
  isEditing = false;
  errorMessage = '';
  @ViewChild('modal') modal!: ElementRef;

  ngOnInit(): void {
    this.form = this.addressService.addressForm;
    this.addressSub = this.addressService.addresses$.subscribe((res) => {
      this.addresses = res;
    });
    this.isLoading = true;
    this.addressService.fetchAddresses().subscribe({
      next: () => (this.isLoading = false),
      error: (err) => {
        this.isLoading = false;

        console.log(err);
      },
    });
  }
  onSetDefault(address: Address) {
    this.addressService
      .setDefaultAddress(address)
      .subscribe({ error: (err) => console.log(err) });
  }

  editAddress?: Address;
  onEdit(address: Address) {
    this.isEditing = true;
    this.addressService.setAdressFormValues(address);
    this.openModal();
    this.editAddress = address;
  }
  onCreateAddress() {
    this.openModal();
    this.isEditing = false;
  }
  onDelete(address: Address) {
    this.addressService
      .deleteAddress(address)
      .subscribe({ error: (err) => console.log(err) });
  }

  onSubmitAddress() {
    if (this.isEditing && this.editAddress) {
      this.addressService.submitEditAddress(this.editAddress).subscribe({
        next: () => {
          this.modalService.dismissAll();
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
    }
    if (!this.isEditing) {
      this.addressService.submitNewAddress().subscribe({
        next: () => {
          this.modalService.dismissAll();
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
    }
  }

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
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  ngOnDestroy(): void {
    this.addressSub.unsubscribe();
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
