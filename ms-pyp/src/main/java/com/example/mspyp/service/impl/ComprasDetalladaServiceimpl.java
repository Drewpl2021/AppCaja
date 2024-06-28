package com.example.mspyp.service.impl;

import com.example.mspyp.entity.Compras;
import com.example.mspyp.entity.ComprasDetallada;
import com.example.mspyp.entity.Producto;
import com.example.mspyp.repository.ComprasDetalladaRepository;
import com.example.mspyp.repository.ProductoRepository;
import com.example.mspyp.service.ComprasDetalladaService;
import com.example.mspyp.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.beans.Transient;
import java.util.List;
import java.util.Optional;

@Service
public class ComprasDetalladaServiceimpl implements ComprasDetalladaService {
    @Autowired
    private ComprasDetalladaRepository comprasDetalladaRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private ProductoService productoService;
    @Override
    public List<ComprasDetallada> listar(){

        return comprasDetalladaRepository.findAll();
    }
    @Override
    @Transient
    public ComprasDetallada guardar(ComprasDetallada comprasDetallada) {
        Producto producto = productoService.listarPorId(comprasDetallada.getProducto().getId()).get();
        producto.setStock(producto.getStock() + comprasDetallada.getCantidad());
        productoRepository.save(producto);
        return comprasDetalladaRepository.save(comprasDetallada);
    }
    @Override
        public ComprasDetallada actualizar(ComprasDetallada comprasDetallada) {

        return comprasDetalladaRepository.save(comprasDetallada);
    }
    @Override
    public Optional<ComprasDetallada> listarPorId(Integer id){

        return comprasDetalladaRepository.findById(id);
    }
    @Override
    public void eliminarPorId(Integer id) {
        comprasDetalladaRepository.deleteById(id);
    }

}
