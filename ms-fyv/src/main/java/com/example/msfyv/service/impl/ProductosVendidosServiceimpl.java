package com.example.msfyv.service.impl;


import com.example.msfyv.dto.ProductoDto;
import com.example.msfyv.entity.ProductosVendidos;
import com.example.msfyv.feign.ProductoFeign;
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
    @Autowired
    private ProductoFeign productoFeign;

    @Override
    public List<ProductosVendidos> listar(){

        return productosVendidosRepository.findAll();
    }

    @Override
    public ProductosVendidos guardar(ProductosVendidos productosVendidos ) {

        return productosVendidosRepository.save(productosVendidos );
    }

    @Override
    public Optional<ProductosVendidos> listarPorId(Double id){
        Optional<ProductosVendidos> productosVendidos= productosVendidosRepository.findById(id);
        ProductoDto productoDto = productoFeign.listById(productosVendidos.get().getProductoId()).getBody();
        productosVendidos.get().setProductoDto(productoDto);
        return productosVendidosRepository.findById(id);
    }

    @Override
    public ProductosVendidos actualizar(ProductosVendidos productosVendidos ) {
        return productosVendidosRepository.save(productosVendidos );
    }

    @Override
    public List<ProductosVendidos> listarPorNombreVen(Integer nombreVen) {
        List<ProductosVendidos> productosVendidosList = productosVendidosRepository.findByNombreVen(nombreVen);
        for (ProductosVendidos productosVendidos : productosVendidosList) {
            ProductoDto productoDto = productoFeign.listById(productosVendidos.getProductoId()).getBody();
            productosVendidos.setProductoDto(productoDto);
        }
        return productosVendidosList;
    }



    @Override
    public void eliminarPorId(Double id) {

        productosVendidosRepository.deleteById(id);
    }
}
