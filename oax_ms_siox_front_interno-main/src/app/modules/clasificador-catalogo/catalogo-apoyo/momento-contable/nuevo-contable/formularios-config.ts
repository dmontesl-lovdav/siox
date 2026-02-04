import { ConfigFormularioGenerico } from '../../../../../shared/formulario-captura-generico';

export const configContable: ConfigFormularioGenerico = {
  titulo: 'Nuevo Registro de Momento Contable',
  secciones: [
    {
      titulo: '',
      campos: [
        {
          tipo: 'input',
          label: 'CLAVE',
          formControlName: 'clave',
          required: true,
          maxLength: 20,
          placeholder: 'INGRESE LA CLAVE'
        },
        {
          tipo: 'input',
          label: 'MOMENTO CONTABLE',
          formControlName: 'momentoContable',
          required: true,
          maxLength: 250,
          placeholder: 'INGRESE EL NOMBRE'
        },
        {
          tipo: 'select',
          label: 'TIPO DE PÓLIZA',
          formControlName: 'tipoPoliza',
          required: true,
          placeholder: 'SELECCIONE EL TIPO DE PÓLIZA',
          opciones: []
        }
      ]
    }
  ],
  botones: [
    { label: 'Cancelar', tipo: 'default', accion: 'cancelar' },
    { label: 'Guardar', tipo: 'primary', accion: 'guardar' }
  ]
};
