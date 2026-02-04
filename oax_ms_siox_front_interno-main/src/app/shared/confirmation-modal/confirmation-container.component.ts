import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmationModalComponent, ConfirmationResult } from './confirmation-modal.component';
import { ConfirmationRequest, ConfirmationService } from './confirmation.service';

@Component({
  selector: 'app-confirmation-container',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent],
  template: `
    <app-confirmation-modal
      *ngIf="currentRequest"
      [(visible)]="modalVisible"
      [config]="currentRequest.config"
      [loading]="loading"
      (result)="onConfirmationResult($event)">
    </app-confirmation-modal>
  `
})
export class ConfirmationContainerComponent implements OnInit, OnDestroy {
  currentRequest: ConfirmationRequest | null = null;
  modalVisible = false;
  loading = false;
  
  private subscription = new Subscription();

  constructor(
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('ConfirmationContainerComponent constructor ejecutado');
  }

  ngOnInit(): void {
    console.log('ConfirmationContainerComponent inicializado');
    
    this.subscription.add(
      this.confirmationService.confirmationRequests$.subscribe(request => {
        console.log('Request recibido en container:', request);
        this.showConfirmation(request);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private showConfirmation(request: ConfirmationRequest): void {
    console.log('Mostrando confirmación:', request);
    this.currentRequest = request;
    this.modalVisible = true;
    this.loading = false;
    console.log('Modal visible establecido a:', this.modalVisible);
    console.log('currentRequest:', this.currentRequest);
    
    // Forzar detección de cambios
    this.cdr.detectChanges();
  }

  onConfirmationResult(result: ConfirmationResult): void {
    console.log('onConfirmationResult llamado con:', result);
    if (this.currentRequest) {
      // Si se confirma, podemos mostrar loading
      if (result.confirmed) {
        this.loading = true;
      }
      
      // Emitir el resultado
      this.currentRequest.subject.next(result);
      this.currentRequest.subject.complete();
      
      // Limpiar estado
      this.currentRequest = null;
      this.modalVisible = false;
      this.loading = false;
      
      // Forzar detección de cambios
      this.cdr.detectChanges();
    }
  }
}