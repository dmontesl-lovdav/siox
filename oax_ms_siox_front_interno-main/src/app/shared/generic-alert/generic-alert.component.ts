import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-generic-alert',
  standalone: true,
  imports: [CommonModule, NzAlertModule],
  templateUrl: './generic-alert.component.html',
  styleUrls: ['./generic-alert.component.scss']
})
export class GenericAlertComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'info' | 'warning' | 'error' = 'info';
  @Input() icon: string = '';
  @Input() description: string = '';
  @Input() actions: Array<{ label: string; onClick: () => void }> = [];
  @Input() link?: { url: string; label: string; download?: string };
  @Output() closed = new EventEmitter<void>();

  onClose() {
    this.closed.emit();
  }
}
