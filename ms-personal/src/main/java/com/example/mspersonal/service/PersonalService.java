package com.example.mspersonal.service;

import com.example.mspersonal.entity.Personal;

import java.util.List;
import java.util.Optional;

public interface PersonalService {

    public List<Personal> listar();

    public Personal guardar(Personal personal);

    public Personal actualizar(Personal personal);

    public Optional<Personal> listarPorId(Integer id);

    public void eliminarPorId(Integer id);
}
