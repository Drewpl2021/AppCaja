package com.example.msclientes.service.impl;

import com.example.msclientes.entity.Clientes;
import com.example.msclientes.repository.ClientesRepository;
import com.example.msclientes.service.ClientesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientesServiceimpl implements ClientesService {

    @Autowired
    private ClientesRepository clientesRepository;

    @Override
    public List<Clientes> listar(){

        return clientesRepository.findAll();
    }

    @Override
    public Clientes guardar(Clientes clientes) {

        return clientesRepository.save(clientes);
    }

    @Override
    public Clientes actualizar(Clientes clientes) {

        return clientesRepository.save(clientes);
    }

    @Override
    public Optional<Clientes> listarPorId(Integer id){

        return clientesRepository.findById(id);
    }

    @Override
    public void eliminarPorId(Integer id) {

        clientesRepository.deleteById(id);
    }
}
