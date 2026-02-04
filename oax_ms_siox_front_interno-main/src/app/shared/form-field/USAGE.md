# Componente app-form-field - Guía de Uso

## 📦 Importación

```typescript
import { FormFieldComponent } from '../../../../shared/form-field';
```

Agregar a imports del componente standalone:
```typescript
imports: [
  // ... otros imports
  FormFieldComponent
]
```

---

## ✨ Ejemplo Básico

### HTML Simple:
```html
<form nz-form [formGroup]="form">
  <app-form-field
    label="CLAVE"
    placeholder="INGRESE CLAVE"
    [control]="form.get('clave')"
    [required]="true"
    [maxLength]="4"
    validationKey="clave"
  ></app-form-field>

  <app-form-field
    label="DESCRIPCIÓN"
    placeholder="INGRESE DESCRIPCIÓN"
    [control]="form.get('descripcion')"
    [required]="true"
    [maxLength]="100"
  ></app-form-field>
</form>
```

### TypeScript:
```typescript
export class ModalGeneroComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      clave: ['', [
        Validators.required,
        Validators.maxLength(4),
        Validators.pattern(/^[A-Za-z]+$/)
      ]],
      descripcion: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]]
    });
  }
}
```

---

## 🎯 Propiedades del Componente

| Propiedad | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `label` | string | ✅ | Texto del label |
| `placeholder` | string | ❌ | Placeholder del input |
| `control` | AbstractControl | ✅ | FormControl asociado |
| `required` | boolean | ❌ | Muestra asterisco rojo (default: false) |
| `maxLength` | number | ❌ | Límite de caracteres (muestra contador) |
| `type` | 'text' \| 'number' | ❌ | Tipo de input (default: 'text') |
| `inputMode` | string | ❌ | Tipo de teclado móvil ('numeric', 'email', etc.) |
| `validationKey` | string | ❌ | 'clave' para validar solo mayúsculas y números |
| `allowClear` | boolean | ❌ | Muestra botón X para limpiar (default: true) |
| `disabled` | boolean | ❌ | Deshabilita el input |
| `readonly` | boolean | ❌ | Input de solo lectura |
| `customErrors` | object | ❌ | Mensajes de error personalizados |

---

## 📝 Validaciones Soportadas

### Mensajes predeterminados:
- `required` → "ESTE CAMPO ES OBLIGATORIO."
- `maxlength` → "ESTE CAMPO DEBE CONTENER COMO MÁXIMO X CARACTERES."
- `minlength` → "ESTE CAMPO DEBE CONTENER MÍNIMO X CARACTERES."
- `pattern` → "CARACTERES PERMITIDOS (A-Z)."
- `claveExiste` → "LA CLAVE YA EXISTE."
- `email` → "EL CORREO ELECTRÓNICO NO ES VÁLIDO."
- `min` / `max` → Mensajes dinámicos

### Mensajes personalizados:
```html
<app-form-field
  label="CÓDIGO"
  [control]="form.get('codigo')"
  [customErrors]="{
    required: 'EL CÓDIGO ES OBLIGATORIO',
    claveExiste: 'ESTE CÓDIGO YA FUE REGISTRADO'
  }"
></app-form-field>
```

---

## 🎨 Características Especiales

### 1. Múltiples Errores Simultáneos
El componente muestra TODOS los errores activos a la vez:
```html
<!-- Si hay errores de required, maxlength y pattern, se muestran los 3 -->
```

### 2. Contador de Caracteres
Automático al definir `maxLength`:
```html
<app-form-field
  label="NOMBRE"
  [control]="form.get('nombre')"
  [maxLength]="50"
></app-form-field>
<!-- Muestra: "25/50" en la esquina inferior derecha -->
```

### 3. Mensaje Informativo al Alcanzar Límite
Cuando se alcanza el límite, muestra un mensaje amarillo (no es error):
```
ℹ️ SE ALCANZÓ EL MÁXIMO DE 100 CARACTERES.
```

### 4. Validación Especial para Clave
```html
<app-form-field
  label="CLAVE"
  [control]="form.get('clave')"
  validationKey="clave"
></app-form-field>
<!-- Convierte automáticamente a mayúsculas y solo permite A-Z y 0-9 -->
```

### 5. Input Numérico
```html
<app-form-field
  label="CÓDIGO POSTAL"
  [control]="form.get('codigoPostal')"
  type="number"
  inputMode="numeric"
  [maxLength]="6"
></app-form-field>
```

---

## 🔄 Migración desde Input Manual

### Antes:
```html
<div class="form-field">
  <label class="field-label">
    CLAVE<span class="required">*</span>
  </label>
  <input
    nz-input
    formControlName="clave"
    placeholder="INGRESE CLAVE"
    maxlength="4"
    (keydown)="validarClave($event)"
    (input)="limitarCaracteres($event, 4)"
    [class.input-error]="isFieldInvalid('clave')"
  />
  <div class="char-counter">
    {{ form.get('clave')?.value?.length || 0 }}/4
  </div>
  <div class="error-message" *ngIf="isFieldInvalid('clave')">
    <i nz-icon nzType="close-circle" nzTheme="fill"></i>
    {{ getErrorMessage('clave') }}
  </div>
</div>
```

### Después:
```html
<app-form-field
  label="CLAVE"
  placeholder="INGRESE CLAVE"
  [control]="form.get('clave')"
  [required]="true"
  [maxLength]="4"
  validationKey="clave"
></app-form-field>
```

**Eliminaste**:
- ~15 líneas de HTML
- Métodos `validarClave()`, `limitarCaracteres()`, `isFieldInvalid()`, `getErrorMessage()`
- Estilos CSS personalizados

---

## ✅ Ventajas

1. **Menos código**: De ~20 líneas a 6 líneas
2. **Consistencia**: Mismo diseño en toda la app
3. **Mantenibilidad**: Cambios en un solo lugar
4. **Múltiples errores**: Soportado nativamente
5. **Accesibilidad**: Iconos y mensajes claros
6. **Contador automático**: Sin lógica adicional
7. **Mensajes informativos**: Distingue errores de avisos

---

## 🚀 Uso Avanzado

### Validación personalizada con mensaje:
```typescript
this.form = this.fb.group({
  email: ['', [
    Validators.required,
    Validators.email,
    this.emailDuplicadoValidator()
  ]]
});

emailDuplicadoValidator() {
  return (control: AbstractControl) => {
    // Lógica de validación
    if (emailExiste) {
      return { emailDuplicado: 'Este correo ya está registrado' };
    }
    return null;
  };
}
```

```html
<app-form-field
  label="CORREO ELECTRÓNICO"
  [control]="form.get('email')"
  type="email"
  [customErrors]="{
    emailDuplicado: 'ESTE CORREO YA ESTÁ EN USO'
  }"
></app-form-field>
```

---

## 🎯 Ejemplo Completo: Modal Genero

Ver archivo: `modal-genero-ejemplo-con-form-field.html`
