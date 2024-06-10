package com.example.msfyv.service.impl;


import com.example.msfyv.entity.RegistroVentas;
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

    @Override
    public List<RegistroVentas> listar(){

        return registroVentasRepository.findAll();
    }

    @Override
    public RegistroVentas guardar(RegistroVentas registroVentas ) {

        return registroVentasRepository.save(registroVentas);
    }

    @Override
    public RegistroVentas actualizar(RegistroVentas registroVentas ) {

        return registroVentasRepository.save(registroVentas );
    }

    @Override
    public Optional<RegistroVentas> listarPorId(Double id){

        return registroVentasRepository.findById(id);
    }

    @Override
    public void eliminarPorId(Double id) {

        registroVentasRepository.deleteById(id);
    }





}
