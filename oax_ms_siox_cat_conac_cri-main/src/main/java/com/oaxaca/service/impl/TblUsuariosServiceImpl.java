package com.oaxaca.service.impl;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.oaxaca.dto.TblUsuariosDto;
import com.oaxaca.entity.TblUsuarios;
import com.oaxaca.repository.TblUsuariosRepository;
import com.oaxaca.service.TblUsuariosService;
import com.oaxaca.spec.TblUsuariosSpec;
import com.oaxaca.util.FiltersUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TblUsuariosServiceImpl implements TblUsuariosService {

    private final TblUsuariosRepository tblUsuariosRepository;
    ModelMapper modelMapper = new ModelMapper();

    @Override
    public TblUsuariosDto findOne(Long id) {
         Optional<TblUsuarios> opt = tblUsuariosRepository
                .findOne(filterWithParameters(Map.of(FiltersUtil.KEY_ID, id.toString())));
         if (opt.isPresent()) {
             return mapperDto(opt.get());
         } else {
             return null;
         }
    }

    @Override
    public TblUsuarios findUser(Long id) {
       Optional<TblUsuarios> opt = tblUsuariosRepository
                .findOne(filterWithParameters(Map.of(FiltersUtil.KEY_ID, id.toString())));
         if (opt.isPresent()) {
             return opt.get();
         } else {
             return null;
         }
    }

    @Override
    public List<TblUsuariosDto> find(Map<String, String> params) {
        return tblUsuariosRepository.findAll(filterWithParameters(params))
                .stream()
                .map(this::mapperDto)
                .toList();
    }

    private TblUsuariosDto mapperDto(TblUsuarios source) {
        return modelMapper.map(source, TblUsuariosDto.class);
    }

    public Specification<TblUsuarios> filterWithParameters(Map<String, String> params) {
        return new TblUsuariosSpec().getSpecificationByFilters(params);
    }

    
    
}
