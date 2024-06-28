package com.example.mspyp.service.impl;

import com.example.mspyp.entity.Compras;
import com.example.mspyp.entity.Producto;
import com.example.mspyp.repository.ComprasRepository;
import com.example.mspyp.repository.ProductoRepository;
import com.example.mspyp.service.ComprasService;
import com.example.mspyp.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ComprasServiceimpl implements ComprasService {

    @Autowired
    private ComprasRepository comprasRepository;
    @Autowired
    private ProductoServiceimpl productoRepository;
    @Autowired
    private ProductoService productoService;
    @Override
    public List<Compras> listar(){

        return comprasRepository.findAll();
    }
    @Override
    public Compras guardar(Compras compras) {
    return comprasRepository.save(compras);

    }
    @Override
    public Compras actualizar(Compras compras) {

        return comprasRepository.save(compras);
    }
    @Override
    public Optional<Compras> listarPorId(Integer id){

        return comprasRepository.findById(id);
    }
    @Override
    public void eliminarPorId(Integer id) {
        comprasRepository.deleteById(id);
    }

}
