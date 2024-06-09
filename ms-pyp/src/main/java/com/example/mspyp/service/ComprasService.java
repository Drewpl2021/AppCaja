package com.example.mspyp.service;

import com.example.mspyp.entity.Compras;

import java.util.List;
import java.util.Optional;

public interface ComprasService {

    public List<Compras> listar();

    public Compras guardar(Compras compras);

    public Compras actualizar(Compras compras);

    public Optional<Compras> listarPorId(Integer id);

    public void eliminarPorId(Integer id);


}
