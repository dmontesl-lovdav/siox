package com.oaxaca.service;

import java.util.List;
import java.util.Map;

import com.oaxaca.dto.TblUsuariosDto;
import com.oaxaca.entity.TblUsuarios;

public interface TblUsuariosService {
    public TblUsuariosDto findOne(Long id);
    public TblUsuarios findUser(Long id);

    public List<TblUsuariosDto> find(Map<String, String> params);
}
