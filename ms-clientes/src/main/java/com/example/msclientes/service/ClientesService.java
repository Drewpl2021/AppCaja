package com.example.msclientes.service;

import com.example.msclientes.entity.Clientes;

import java.util.List;
import java.util.Optional;

public interface ClientesService {

    public List<Clientes> listar();

    public Clientes guardar(Clientes clientes);

    public Clientes actualizar(Clientes clientes);

    public Optional<Clientes> listarPorId(Integer id);

    public Optional<Clientes> buscarPorNombreRazonSocialAproximado(String nombreRazonSocial);

    public Optional<Clientes> buscarPorDniRuc(Integer dni_ruc);

    public void eliminarPorId(Integer id);

}
