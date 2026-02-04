import { ConfigFormularioGenerico } from '../../../shared/formulario-captura-generico';

export const configGenero: ConfigFormularioGenerico = {
  titulo: 'Nuevo Registro de Género',
  secciones: [
    {
      titulo: 'Nuevo Registro de Género',
      campos: [
        { tipo: 'input', label: 'Clave del Género', formControlName: 'claveGenero', maxLength: 2, required: true },
        { tipo: 'input', label: 'Descripción del Género', formControlName: 'descripcionGenero', required: true }
      ]
    }
  ],
  botones: [
    { label: 'Cancelar', tipo: 'default', accion: 'cancelar' },
    { label: 'Guardar', tipo: 'primary', accion: 'guardar' }
  ]
};

export const configGrupo: ConfigFormularioGenerico = {
  titulo: 'Nuevo Registro de Grupo',
  secciones: [
    {
      titulo: 'Nuevo Registro de Grupo',
      campos: [
        { tipo: 'input', label: 'Clave del Grupo', formControlName: 'claveGrupo', maxLength: 2, required: true },
        { tipo: 'input', label: 'Descripción del Grupo', formControlName: 'descripcionGrupo', required: true }
      ]
    }
  ],
  botones: [
    { label: 'Cancelar', tipo: 'default', accion: 'cancelar' },
    { label: 'Guardar', tipo: 'primary', accion: 'guardar' }
  ]
};

export const configRubro: ConfigFormularioGenerico = {
  titulo: 'Nuevo Registro de Rubro',
  secciones: [
    {
      titulo: 'Nuevo Registro de Rubro',
      campos: [
        { tipo: 'input', label: 'Clave del Rubro', formControlName: 'claveRubro', maxLength: 2, required: true },
        { tipo: 'input', label: 'Descripción del Rubro', formControlName: 'descripcionRubro', required: true }
      ]
    }
  ],
  botones: [
    { label: 'Cancelar', tipo: 'default', accion: 'cancelar' },
    { label: 'Guardar', tipo: 'primary', accion: 'guardar' }
  ]
};

export const configCuenta: ConfigFormularioGenerico = {
  titulo: 'Nuevo Registro de Cuenta',
  secciones: [
    {
      titulo: 'Nuevo Registro de Cuenta',
      campos: [
        { tipo: 'input', label: 'Clave de la Cuenta', formControlName: 'claveCuenta', maxLength: 2, required: true },
        { tipo: 'input', label: 'Descripción de la Cuenta', formControlName: 'descripcionCuenta', required: true },
      ]
    }
  ],
  botones: [
    { label: 'Cancelar', tipo: 'default', accion: 'cancelar' },
    { label: 'Guardar', tipo: 'primary', accion: 'guardar' }
  ]
};

export const configSubCuenta: ConfigFormularioGenerico = {
  titulo: 'Nuevo Registro de  SubCuenta',
  secciones: [
    {
      titulo: 'Nuevo Registro de SubCuenta',
      campos: [
        { tipo: 'input', label: 'Clave de la SubCuenta', formControlName: 'claveSubCuenta', maxLength: 2, required: true },
        { tipo: 'input', label: 'Descripción de la SubCuenta', formControlName: 'descripcionSubCuenta', required: true },
      ]
    }
  ],
  botones: [
    { label: 'Cancelar', tipo: 'default', accion: 'cancelar' },
    { label: 'Guardar', tipo: 'primary', accion: 'guardar' }
  ]
};

export const configEdicionSubcuenta: ConfigFormularioGenerico = {
  titulo: 'Editar Subcuenta',
  secciones: [
    {
      titulo: 'Editar Subcuenta',
      campos: [
        { tipo: 'input', label: 'Clave de la SubCuenta', formControlName: 'claveSubCuenta', maxLength: 2, required: true, disabled: true },
        { tipo: 'input', label: 'Descripción de la SubCuenta', formControlName: 'descripcionSubCuenta', required: true },
      ]
    }
  ],
  botones: [
    { label: 'Cancelar', tipo: 'default', accion: 'cancelar' },
    { label: 'Guardar', tipo: 'primary', accion: 'guardar' }
  ]
};

export const configDatosCuenta: ConfigFormularioGenerico = {
  titulo: 'Datos de la Cuenta',
  secciones: [
    {
      titulo: 'Datos de la Cuenta',
      campos: [
        { 
          tipo: 'select', 
          label: 'Naturaleza', 
          formControlName: 'naturaleza', 
          required: true, 
          placeholder: 'SELECCIONE',
          opciones: [] // Las opciones se cargarán dinámicamente desde el servicio
        },
        { 
          tipo: 'select', 
          label: 'Estado Financiero', 
          formControlName: 'estadoFinanciero', 
          required: true, 
          placeholder: 'SELECCIONE',
          opciones: [] // Las opciones se cargarán dinámicamente desde el servicio
        },
        { 
          tipo: 'select', 
          label: 'Posición', 
          formControlName: 'posicion', 
          required: true, 
          placeholder: 'SELECCIONE',
          opciones: [] // Las opciones se cargarán dinámicamente desde el servicio
        },
        { 
          tipo: 'select', 
          label: 'Estructura', 
          formControlName: 'estructura', 
          required: true, 
          placeholder: 'SELECCIONE',
          opciones: [] // Las opciones se cargarán dinámicamente desde el servicio
        },
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

export const configDatosCuentaEdicion: ConfigFormularioGenerico = {
  titulo: 'Editar Datos de la Cuenta',
  secciones: [
    {
      titulo: 'Editar Datos de la Cuenta',
      campos: [
        { 
          tipo: 'select', 
          label: 'Naturaleza', 
          formControlName: 'naturaleza', 
          required: true, 
          placeholder: 'SELECCIONE',
          opciones: [] // Las opciones se cargarán dinámicamente desde el servicio
        },
        { 
          tipo: 'select', 
          label: 'Estado Financiero', 
          formControlName: 'estadoFinanciero', 
          required: true, 
          placeholder: 'SELECCIONE',
          opciones: [] // Las opciones se cargarán dinámicamente desde el servicio
        },
        { 
          tipo: 'select', 
          label: 'Posición', 
          formControlName: 'posicion', 
          required: true, 
          placeholder: 'SELECCIONE',
          opciones: [] // Las opciones se cargarán dinámicamente desde el servicio
        },
        { 
          tipo: 'select', 
          label: 'Estructura', 
          formControlName: 'estructura', 
          required: true, 
          placeholder: 'SELECCIONE',
          opciones: [] // Las opciones se cargarán dinámicamente desde el servicio
        },
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