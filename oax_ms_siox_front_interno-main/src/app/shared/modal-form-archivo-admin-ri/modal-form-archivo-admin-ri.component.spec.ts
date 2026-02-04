import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormArchivoAdminRiComponent } from './modal-form-archivo-admin-ri.component';

describe('ModalFormArchivoAdminRiComponent', () => {
  let component: ModalFormArchivoAdminRiComponent;
  let fixture: ComponentFixture<ModalFormArchivoAdminRiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFormArchivoAdminRiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFormArchivoAdminRiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
