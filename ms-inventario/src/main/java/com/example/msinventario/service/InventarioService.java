package com.example.msinventario.service;

import com.example.msinventario.entity.Inventario;
import com.example.msinventario.entity.InventarioDetalle;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface InventarioService {
    public List<Inventario> listar();
    Inventario guardar(Inventario inventario);
    public Inventario actualizar(Inventario inventario);
    public Optional<Inventario> listarPorId(Integer id);
    public void eliminarPorId(Integer id);

}
