export const environment = {
  production: false,
  useOauth2: true,
  // Para desarrollo local usar '' (el proxy.conf.json redirige a los backends)
  // Para producción usar: 'https://siox-nginx.nidium.com.mx/siox'
  apiBaseUrl: '',

  cri: {
    cargaArchivo: '/cri/cargaArchivo',
    descargaPlantilla: '/plantillas/descargaPlantilla',
    getClasificadorRubroPaginado: '/cri/getClasificadorRubroPaginado',
    buscarClasificadorPaginado:'/cri/buscarClasificadorPaginado',
    rubro: {
      insert: '/cri/rubro/insertCatRubroCri',
      update: '/cri/rubro/updateCatRubroCri',
      getByEjercicio: '/cri/rubro/getRubroEjercicio'
    },
    tipo: {
      buscarPorEjercicio: '/cri/tipo/buscarPorEjercicio',
      insertar: '/cri/tipo/insertar',
      actualizar: '/cri/tipo/actualizar'
    },
    clase: {
      buscarPorEjercicio: '/cri/clase/buscarPorEjercicio',
      insertar: '/cri/clase/insertar',
      actualizar: '/cri/clase/actualizar'
    },
    concepto: {
      buscarPorEjercicio: '/cri/concepto/buscarPorEjercicio',
      insertar: '/cri/concepto/insertar',
      actualizar: '/cri/concepto/actualizar'
    }
  },

  conac: {
    cargaArchivo: '/conac/cargaArchivo',
    consultar: '/conac/consultar',
    genero: {
      insert: '/conac/genero/insertarGenero',
      update: '/conac/genero/updateGenero',
      getByEjercicio: '/conac/genero/getGeneroEjercicio'
    },

    grupo: {
      insert: '/conac/grupo/insertarGrupo',
      update: '/conac/grupo/updateGrupo',
      getByEjercicio: '/conac/grupo/getGrupoEjercicio'
    },

     rubro: {
      insert: '/conac/rubro/insertarRubro',
      update: '/conac/rubro/updateRubro',
      getByEjercicio: '/conac/rubro/getRubroEjercicio'
    },
    cuenta: {
      insert: '/conac/cuenta/insertarCuenta',
      update: '/conac/cuenta/updateCuenta',
      getByEjercicio: '/conac/cuenta/getCuentaEjercicio'
    },
    subCuenta: {
      insert: '/conac/subcuenta/insertarSubcuenta',
      update: '/conac/subcuenta/updateSubcuenta',
      getByEjercicio: '/conac/subcuenta/getSubcuentaEjercicio'
    },
    datosCuenta: {
      insert: '/conac/datosCuenta/insertarDatosCuenta',
      update: '/conac/datosCuenta/updateDatosCuenta',
    },
    catalogos: {
      naturaleza: '/conac/catalogos/getNaturaleza',
      estadoFinanciero: '/conac/catalogos/getEstadoFinanciero',
      posicion: '/conac/catalogos/getPosicion',
      estructura: '/conac/catalogos/getEstructura'
    },
  },
  oauth2: {
    tokenUrl: '/cri/login/login/oauth2/token',
    clientId: 'oxsDDSHUzYhBrfORNFKF4swnYZd7YgNj',
    clientSecret: 'foKKAXr8geMS3MpNqEqC83zZ8hnECyMG',
    grantType: 'client_credentials',
    scope: 'write'
  },
  auth: {
    login: '/auth/login',
    validateTwoFactor: '/auth/validate-2fa',
    resetTwoFactor: '/auth/reset-2fa',
    health: '/auth/health',
    publicTest: '/auth/public/test'
  },
  periodo: {
    consultar: '/tipoPeriodo/consultar'
  },
  estructuraCuentas: {
    consultar: '/estructuraCuentas/consultar',
    create: '/estructuraCuentas',
    updateVisible: '/estructuraCuentas',
    delete: '/estructuraCuentas',
    getById: '/estructuraCuentas',
    update: '/estructuraCuentas'
  },
  genero: {
    consultar: '/genero/consultar',
    create: '/genero/registrar',
    update: '/genero/actualizar',
    estatus: '/genero/estatus',
    getById: '/genero'
  },

    domicilio: {
      crearNombreAsentamiento: '/domicilio/nombre-asentamiento/guardar',
      paisConsultar: '/domicilio/consultar-pais',
      estadoConsultar: '/domicilio/consultar-estados',
      regionConsultar: '/domicilio/consultar-region-estado',
      distritoConsultar: '/domicilio/consultar-distrito-region',
      municipioConsultar: '/domicilio/consultar-municipios-por-distrito',
      localidadConsultar: '/domicilio/consultar-localidades',
      localidadCrear: '/domicilio/localidad',
      localidadActualizar: '/domicilio/localidad',
      localidadExisteClave: '/domicilio/localidad/existe-clave',
      localidadEstatus: '/domicilio/localidad/estatus',
      tipoAsentamiento: '/domicilio/tipo-asentamiento',
      tipoAsentamientoEstatus: '/domicilio/tipo-asentamiento',
      consultarTipoAsentamiento: '/domicilio/asentamiento/consultar-tipo-asentamiento',
      consultarNombreAsentamiento: '/domicilio/asentamiento/consultar-nombre-asentamiento',
      consultarTipoSectorGubernamental: '/domicilio/consultar-tipo-sector-gubernamental',
      crearTipoSectorGubernamental: '/domicilio/tipo-sector-gubernamental',
      vialidadConsultar: '/domicilio/vialidad/consultar-vialidad',
      vialidadCrear: '/domicilio/vialidad',
      vialidadEstatus: '/domicilio/vialidad',
      vialidadDetalle: '/domicilio/vialidad'
      ,
      // === NOMBRE ASENTAMIENTO ===
      actualizarNombreAsentamiento: '/domicilio/nombre-asentamiento/actualizar-nombre-asentamiento',
      actualizarEstatusNombreAsentamiento: '/domicilio/asentamiento/actualizar-estatus-nombre-asentamiento'
    }
};
