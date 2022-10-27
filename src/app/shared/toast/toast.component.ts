import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  constructor() {}
  delay = 2000;
  shown = false;
  @Input('message') message = '';
  @Output() messageChange: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    this.shown = true;
    setTimeout(() => {
      this.shown = false;
      this.message = '';
      this.messageChange.emit(this.message);
    }, this.delay);
    this.message = changes['message'].currentValue;
  }
}
