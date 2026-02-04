import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { ConfirmationContainerComponent } from './shared/confirmation-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NzProgressModule, ConfirmationContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isCollapsed = false;
  isLoading = false;
  showSpinner = false;
  spinnerPercent = 0;
  private spinnerInterval: any;

  constructor(private cdr: ChangeDetectorRef) {
    // Exponer funciones globales para mostrar/ocultar spinner
    (window as any).showGlobalSpinner = () => {
      setTimeout(() => {
        this.showSpinner = true;
        this.startSpinnerAnimation();
        this.cdr.detectChanges();
      });
    };
    (window as any).hideGlobalSpinner = () => {
      setTimeout(() => {
        this.showSpinner = false;
        this.stopSpinnerAnimation();
        this.cdr.detectChanges();
      });
    };
  }

  ngOnInit(): void {
    console.log('AppComponent ngOnInit ejecutado');
    // Eliminar referencia a breadcrumbService, solo dejar la animación del spinner
    setInterval(() => {
      const spinnerArc = document.querySelector('.spinner-arc');
      const spinnerText = document.querySelector('.spinner-text') as HTMLElement;
      if (spinnerArc && spinnerText) {
        // Obtener el ángulo actual del círculo giratorio
        const style = window.getComputedStyle(spinnerArc);
        const matrix = style.transform;
        let angle = 0;
        if (matrix && matrix !== 'none') {
          const values = matrix.split('(')[1].split(')')[0].split(',');
          const a = parseFloat(values[0]);
          const b = parseFloat(values[1]);
          angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
        }
        // Convertir el ángulo a porcentaje para el gradiente
        const percent = Math.abs(angle) / 360 * 100;
        spinnerText.style.setProperty('--spinner-progress', percent + '%');
      }
    }, 100);
  }

  startSpinnerAnimation() {
    this.spinnerPercent = 0;
    this.spinnerInterval = setInterval(() => {
      this.spinnerPercent = (this.spinnerPercent + 5) % 100;
    }, 50);
  }

  stopSpinnerAnimation() {
    clearInterval(this.spinnerInterval);
    this.spinnerPercent = 80;
  }
}
