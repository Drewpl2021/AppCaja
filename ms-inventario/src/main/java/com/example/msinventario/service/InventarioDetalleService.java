package com.example.msinventario.service;

import com.example.msinventario.entity.Inventario;
import com.example.msinventario.entity.InventarioDetalle;

import java.util.List;
import java.util.Optional;

public interface InventarioDetalleService {
    public List<InventarioDetalle> listar();
    InventarioDetalle guardar(InventarioDetalle inventarioDetalle);
    public InventarioDetalle actualizar(InventarioDetalle inventarioDetalle);
    public Optional<InventarioDetalle> listarPorId(Integer id);
    public void eliminarPorId(Integer id);
    double calcularCostoPromedioPonderado();
    public List<InventarioDetalle> listarEntradas();
    public List<InventarioDetalle> listarSalidas();

    // ...
    double calcularCostoTotalUltimosMeses(int meses);
}

