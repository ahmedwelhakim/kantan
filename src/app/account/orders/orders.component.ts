import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from '../../shared/http.service';
import { OrdersResponse } from './orders.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  constructor(private httpService: HttpService) {}
  url = '/api/order/';
  response: OrdersResponse | null = null;
  isLoading = false;
  baseUrl = environment.apiUrl;
  ngOnInit(): void {
    this.isLoading = true;
    this.httpService.fetchData<OrdersResponse>(this.url).subscribe((res) => {
      this.response = res;
      this.isLoading = false;
    });
  }
  onReorderItem(index: number) {
    // Adding to cart -------
  }
}
