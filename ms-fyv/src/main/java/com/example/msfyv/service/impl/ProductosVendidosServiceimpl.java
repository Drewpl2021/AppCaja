package com.example.msfyv.service.impl;

import com.example.msfyv.entity.ProductosVendidos;
import com.example.msfyv.repository.ProductosVendidosRepository;
import com.example.msfyv.service.ProductosVendidosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class ProductosVendidosServiceimpl implements ProductosVendidosService{

    @Autowired
    private ProductosVendidosRepository productosVendidosRepository;

    @Override
    public List<ProductosVendidos> listar(){

        return productosVendidosRepository.findAll();
    }

    @Override
    public ProductosVendidos guardar(ProductosVendidos productosVendidos ) {

        return productosVendidosRepository.save(productosVendidos );
    }

    @Override
    public ProductosVendidos actualizar(ProductosVendidos productosVendidos ) {

        return productosVendidosRepository.save(productosVendidos );
    }

    @Override
    public Optional<ProductosVendidos> listarPorId(Double id){

        return productosVendidosRepository.findById(id);
    }

    @Override
    public void eliminarPorId(Double id) {

        productosVendidosRepository.deleteById(id);
    }
}
