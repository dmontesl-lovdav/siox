package com.oaxaca.service;

import java.util.List;
import java.util.Map;

import com.oaxaca.dto.CatPaisDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.dto.DistritoRegionDTO;
import com.oaxaca.dto.RegionEstadoDTO;

public interface ICatDomicilioService {
        com.oaxaca.dto.ConsultaRespuesta<String> actualizarEstatusLocalidades(java.util.List<Integer> ids,
                        Boolean estatus);

        boolean existeClaveLocalidadEnOtros(Integer id, Integer clave);

        boolean existeClaveLocalidad(Integer clave);

        com.oaxaca.dto.ConsultaRespuesta<String> insertarLocalidad(com.oaxaca.entity.CatLocalidad localidad);

        com.oaxaca.entity.CatLocalidad actualizarLocalidad(Integer id, com.oaxaca.entity.CatLocalidad localidad);

        ConsultaRespuesta<List<com.oaxaca.dto.LocalidadDTO>> getLocalidades(
                        String municipio,
                        String claveLocalidad,
                        String descripcion,
                        String usuarioCreacion,
                        String fechaAlta,
                        String sort,
                        Integer page,
                        Integer pageSize);

        ConsultaRespuesta<List<com.oaxaca.dto.MunicipioDistritoDTO>> getMunicipiosPorDistrito(
                        String distrito,
                        String claveMunicipio,
                        String municipio,
                        String fechaAlta,
                        String sort,
                        Integer page,
                        Integer pageSize);

        ConsultaRespuesta<List<DistritoRegionDTO>> getDistritoRegionRespuesta(String region, String id,
                        String nombre, String fechaAlta, String sort, Integer page, Integer pageSize);

        ConsultaRespuesta<List<CatPaisDTO>> getCatPais(Integer id, String nombre, String fechaAlta,
                        String sort, Integer page, Integer pageSize);

        ConsultaRespuesta<List<com.oaxaca.dto.CatEstadoDTO>> getCatEstados(
                        String pais,
                        String id,
                        String estado,
                        String clave,
                        String fechaAlta,
                        String sort,
                        Integer page,
                        Integer pageSize);

        //ConsultaRespuesta<List<RegionEstadoDTO>> getRegionEstadoRespuesta(String estado, String id, String region,
                        //String fechaAlta, String sort, Integer page, Integer pageSize);
        ConsultaRespuesta<List<RegionEstadoDTO>> getRegionEstadoRespuesta(Map<String, String> params, String sort, Integer page, Integer pageSize);

        ConsultaRespuesta<List<com.oaxaca.dto.VialidadDTO>> consultarVialidad(
                        String busqueda,
                        String sort,
                        Integer page,
                        Integer pageSize);

        ConsultaRespuesta<List<com.oaxaca.dto.TipoAsentamientoDTO>> consultarTipoAsentamiento(
                        String busqueda,
                        String sort,
                        Integer page,
                        Integer pageSize);

        ConsultaRespuesta<Integer> guardarVialidad(Map<String, String> body);

        ConsultaRespuesta<Boolean> actualizarEstatusVialidad(Integer id, Map<String, Boolean> body);

        ConsultaRespuesta<String> actualizarDetalleVialidad(Integer id, Map<String, String> body);
}
