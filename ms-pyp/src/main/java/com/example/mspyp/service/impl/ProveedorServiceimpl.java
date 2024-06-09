package com.example.mspyp.service.impl;


import com.example.mspyp.entity.Proveedor;
import com.example.mspyp.repository.ProveedorRepository;
import com.example.mspyp.service.ProductoService;
import com.example.mspyp.service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProveedorServiceimpl implements ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Override
    public List<Proveedor> listar(){

        return proveedorRepository.findAll();
    }
    @Override
    public Proveedor guardar(Proveedor proveedor) {

        return proveedorRepository.save(proveedor);
    }
    @Override
    public Proveedor actualizar(Proveedor proveedor) {

        return proveedorRepository.save(proveedor);
    }
    @Override
    public Optional<Proveedor> listarPorId(Integer id){

        return proveedorRepository.findById(id);
    }
    @Override
    public void eliminarPorId(Integer id) {
        proveedorRepository.deleteById(id);
    }

}
