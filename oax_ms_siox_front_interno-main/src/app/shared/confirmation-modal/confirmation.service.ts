import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConfirmationConfig, ConfirmationResult } from './confirmation-modal.component';

export interface ConfirmationRequest {
  id: string;
  config: ConfirmationConfig;
  subject: Subject<ConfirmationResult>;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private confirmationRequests = new Subject<ConfirmationRequest>();
  
  confirmationRequests$ = this.confirmationRequests.asObservable();

  /**
   * Muestra un modal de confirmación
   * @param config Configuración del modal
   * @returns Observable que emite el resultado de la confirmación
   */
  confirm(config: ConfirmationConfig): Observable<ConfirmationResult> {
    console.log('ConfirmationService.confirm() llamado con config:', config);
    
    const subject = new Subject<ConfirmationResult>();
    const id = this.generateId();

    const request: ConfirmationRequest = {
      id,
      config: {
        title: 'CONFIRMACIÓN',
        confirmText: 'SÍ, CONTINUAR',
        cancelText: 'NO',
        type: 'info',
        icon: 'question-circle',
        width: '420px',
        ...config
      },
      subject
    };

    console.log('Emitiendo request:', request);
    this.confirmationRequests.next(request);
    
    return subject.asObservable();
  }

  /**
   * Métodos de conveniencia para diferentes tipos de confirmación
   */
  
  confirmDelete(message: string, title?: string): Observable<ConfirmationResult> {
    return this.confirm({
      title: title || 'Eliminar elemento',
      message,
      type: 'error',
      confirmText: 'SÍ, ELIMINAR',
      cancelText: 'NO',
      icon: 'delete'
    });
  }

  confirmSave(message: string, title?: string): Observable<ConfirmationResult> {
    return this.confirm({
      title: title || 'Guardar cambios',
      message,
      type: 'info',
      confirmText: 'Guardar',
      cancelText: 'Cancelar',
      icon: 'save'
    });
  }

  confirmWarning(message: string, title?: string): Observable<ConfirmationResult> {
    return this.confirm({
      title: title || 'Advertencia',
      message,
      type: 'warning',
      confirmText: 'Continuar',
      cancelText: 'Cancelar',
      icon: 'warning'
    });
  }

  confirmInfo(message: string, title?: string): Observable<ConfirmationResult> {
    return this.confirm({
      title: title || 'Información',
      message,
      type: 'info',
      confirmText: 'Aceptar',
      cancelText: 'Cancelar',
      icon: 'info-circle'
    });
  }

  private generateId(): string {
    return `confirmation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}