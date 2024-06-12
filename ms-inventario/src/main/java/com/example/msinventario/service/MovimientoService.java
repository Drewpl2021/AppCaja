package com.example.msinventario.service;

import com.example.msinventario.entity.Inventario;
import com.example.msinventario.entity.Movimiento;

import java.util.List;
import java.util.Optional;

public interface MovimientoService {
    public List<Movimiento> listar();
    Movimiento guardar(Movimiento movimiento);
    public Movimiento actualizar(Movimiento movimiento);
    public Optional<Movimiento> listarPorId(Integer id);
    public void eliminarPorId(Integer id);
}
