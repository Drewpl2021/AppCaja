package com.example.msfyv.service.impl;


import com.example.msfyv.dto.ClientesDto;
import com.example.msfyv.dto.PersonalDto;
import com.example.msfyv.dto.ProductoDto;
import com.example.msfyv.entity.Factura;
import com.example.msfyv.entity.RegistroVentas;
import com.example.msfyv.feign.PersonalFeign;
import com.example.msfyv.feign.ProductoFeign;
import com.example.msfyv.repository.RegistroVentasRepository;
import com.example.msfyv.service.RegistroVentasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class RegistroVentaServiceimpl implements RegistroVentasService {
    @Autowired
    private RegistroVentasRepository registroVentasRepository;

    @Autowired
    private PersonalFeign personalFeign;

    @Override
    public List<RegistroVentas> listar(){

        return registroVentasRepository.findAll();
    }

    @Override
    public RegistroVentas guardar(RegistroVentas registroVentas ) {
        // Establecer la fecha y hora actuales
        registroVentas.setFecha_hora(new Date());

        return registroVentasRepository.save(registroVentas);
    }

    @Override
    public RegistroVentas actualizar(RegistroVentas registroVentas ) {

        return registroVentasRepository.save(registroVentas );
    }



    @Override
    public void eliminarPorId(Double id) {

        registroVentasRepository.deleteById(id);
    }
    @Override
    public Optional<RegistroVentas> listarPorId(Double id){
        Optional<RegistroVentas> registroVentas= registroVentasRepository.findById(id);
        PersonalDto personalDto = personalFeign.listById(registroVentas.get().getPersonalId()).getBody();
        registroVentas.get().setPersonalDto(personalDto);
        return registroVentasRepository.findById(id);
    }






}
