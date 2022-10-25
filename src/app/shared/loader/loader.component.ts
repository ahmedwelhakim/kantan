import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  constructor() {}
  @Input('Loading') isLoading = false;
  @Input('class') class = '';
  ngOnInit(): void {}
}
