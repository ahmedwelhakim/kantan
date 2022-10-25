import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'task1';
  constructor(
    private authService: AuthService,
    private modalService: NgbModal
  ) {}
  ngOnInit() {
    this.authService.autoLogin();
  }
  public open(modal: any): void {
    this.modalService.open(modal);
  }
}
