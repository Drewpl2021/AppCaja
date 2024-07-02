package com.example.msfyv.service;


import com.example.msfyv.entity.ProductosVendidos;

import java.util.List;
import java.util.Optional;

public interface ProductosVendidosService {
    public List<ProductosVendidos> listar();

    public ProductosVendidos guardar(ProductosVendidos productosVendidos );

    public ProductosVendidos actualizar(ProductosVendidos productosVendidos );

    public Optional<ProductosVendidos> listarPorId(Double id);

    public void eliminarPorId(Double id);

    public List<ProductosVendidos> listarPorNombreVen(Integer nombreVen);
}
