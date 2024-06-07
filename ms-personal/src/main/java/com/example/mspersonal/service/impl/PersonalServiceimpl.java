package com.example.mspersonal.service.impl;

import com.example.mspersonal.entity.Personal;
import com.example.mspersonal.repository.PersonalRepository;
import com.example.mspersonal.service.PersonalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PersonalServiceimpl implements PersonalService {

    @Autowired
    private PersonalRepository personalRepository;

    @Override
    public List<Personal> listar(){

        return personalRepository.findAll();
    }

    @Override
    public Personal guardar(Personal personal) {

        return personalRepository.save(personal);
    }

    @Override
    public Personal actualizar(Personal personal) {

        return personalRepository.save(personal);
    }

    @Override
    public Optional<Personal> listarPorId(Integer id){

        return personalRepository.findById(id);
    }

    @Override
    public void eliminarPorId(Integer id) {

        personalRepository.deleteById(id);
    }
}
