import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbOffcanvas,
  OffcanvasDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { User } from './../auth/auth.model';
import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  closeResult = '';

  constructor(
    private offcanvasService: NgbOffcanvas,
    private authService: AuthService,
    private router: Router
  ) {}
  isCollapsed = false;
  user: User | null = null;
  userSub!: Subscription;
  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((u) => (this.user = u));
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  collapseToggle() {
    this.isCollapsed = !this.isCollapsed;
  }

  open(content: TemplateRef<any>) {
    this.offcanvasService
      .open(content, {
        ariaLabelledBy: 'offcanvas-basic-title',
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

  onLogout() {
    this.offcanvasService.dismiss();
    this.authService.logout();
    this.router.navigate(['/']);
  }
  private getDismissReason(reason: any): string {
    if (reason === OffcanvasDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === OffcanvasDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on the backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
