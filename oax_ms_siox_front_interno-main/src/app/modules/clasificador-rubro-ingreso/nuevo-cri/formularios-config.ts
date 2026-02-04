import { ConfigFormularioGenerico } from '../../../shared/formulario-captura-generico';

export const configRubro: ConfigFormularioGenerico = {
  titulo: 'Nuevo Registro de Rubro',
  secciones: [
    {
      titulo: 'Nuevo Registro de Rubro',
      campos: [
        { tipo: 'input', label: 'Clave del Rubro', formControlName: 'claveRubro', maxLength: 2, required: true },
        { tipo: 'input', label: 'Nombre del Rubro', formControlName: 'nombreRubro', required: true },
        { tipo: 'input', label: 'Descripción del Rubro', formControlName: 'descripcionRubro', required: true }
      ]
    }
  ],
  botones: [
    { label: 'Cancelar', tipo: 'default', accion: 'cancelar' },
    { label: 'Guardar', tipo: 'primary', accion: 'guardar' }
  ]
};

export const configTipo: ConfigFormularioGenerico = {
  titulo: 'Nuevo Registro de Tipo',
  secciones: [
    {
      titulo: 'Nuevo Registro de Tipo',
      campos: [
        { tipo: 'input', label: 'Clave del Tipo', formControlName: 'claveTipo', maxLength: 2, required: true },
        { tipo: 'input', label: 'Nombre del Tipo', formControlName: 'nombreTipo', required: true },
        { tipo: 'input', label: 'Descripción del Tipo', formControlName: 'descripcionTipo', required: true }
      ]
    }
  ],
  botones: [
    { label: 'Cancelar', tipo: 'default', accion: 'cancelar' },
    { label: 'Guardar', tipo: 'primary', accion: 'guardar' }
  ]
};

export const configClase: ConfigFormularioGenerico = {
  titulo: 'Nuevo Registro de Clase',
  secciones: [
    {
      titulo: 'Nuevo Registro de Clase',
      campos: [
        { tipo: 'input', label: 'Clave de la Clase', formControlName: 'claveClase', maxLength: 2, required: true },
        { tipo: 'input', label: 'Nombre del Clase', formControlName: 'nombreClase', required: true },
        { tipo: 'input', label: 'Descripción del Clase', formControlName: 'descripcionClase', required: true }
      ]
    }
  ],
  botones: [
    { label: 'Cancelar', tipo: 'default', accion: 'cancelar' },
    { label: 'Guardar', tipo: 'primary', accion: 'guardar' }
  ]
};

export const configConcepto: ConfigFormularioGenerico = {
  titulo: 'Nuevo Registro de Concepto',
  secciones: [
    {
      titulo: 'Nuevo Registro de Concepto',
      campos: [
        { tipo: 'input', label: 'Clave del Concepto', formControlName: 'claveConcepto', maxLength: 2, required: true },
        { tipo: 'input', label: 'Nombre del Concepto', formControlName: 'nombreConcepto', required: true },
        { tipo: 'input', label: 'Descripción del Concepto', formControlName: 'descripcionConcepto', required: true },
        { tipo: 'input', label: 'Inicio de Vigencia', formControlName: 'inicioVigencia', required: true, placeholder: 'DD/MM/AAAA' },
        { tipo: 'input', label: 'Fin de Vigencia', formControlName: 'finVigencia', required: true, placeholder: 'DD/MM/AAAA' }
      ]
    }
  ],
  botones: [
    { label: 'Cancelar', tipo: 'default', accion: 'cancelar' },
    { label: 'Guardar', tipo: 'primary', accion: 'guardar' }
  ]
};
