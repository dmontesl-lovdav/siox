import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';

export interface ConfirmationConfig {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  icon?: string;
  width?: string | number;
}

export interface ConfirmationResult {
  confirmed: boolean;
  data?: any;
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, NzModalModule, NzButtonModule, NzIconModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() config: ConfirmationConfig = {
    title: 'Confirmación',
    message: '¿Estás seguro de realizar esta acción?',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'info',
    icon: 'question-circle',
    width: '400px'
  };
  @Input() loading: boolean = false;
  
  @Output() result = new EventEmitter<ConfirmationResult>();
  @Output() visibleChange = new EventEmitter<boolean>();

  ngOnInit() {
    console.log('ConfirmationModalComponent ngOnInit - visible:', this.visible, 'config:', this.config);
  }

  ngOnChanges() {
    console.log('ConfirmationModalComponent ngOnChanges - visible:', this.visible, 'config:', this.config);
  }

  onConfirm(): void {
    this.result.emit({ confirmed: true });
  }

  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.result.emit({ confirmed: false });
  }

  onVisibleChange(visible: boolean): void {
    this.visible = visible;
    this.visibleChange.emit(visible);
    if (!visible) {
      this.result.emit({ confirmed: false });
    }
  }

  getIconType(): string {
    const iconMap = {
      'info': 'question-circle',
      'success': 'check-circle',
      'warning': 'exclamation-circle',
      'error': 'close-circle'
    };
    return this.config.icon || iconMap[this.config.type || 'info'];
  }

  getIconColor(): string {
    const colorMap = {
      'info': '#007bff',
      'success': '#28a745',
      'warning': '#ffc107',
      'error': '#dc3545'
    };
    return colorMap[this.config.type || 'info'];
  }
}