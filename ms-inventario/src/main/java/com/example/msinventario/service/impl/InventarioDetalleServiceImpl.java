package com.example.msinventario.service.impl;

import com.example.msinventario.entity.Inventario;
import com.example.msinventario.entity.InventarioDetalle;
import com.example.msinventario.repository.InventarioDetalleRepository;
import com.example.msinventario.repository.InventarioRepository;
import com.example.msinventario.service.InventarioDetalleService;
import com.example.msinventario.service.InventarioService;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class InventarioDetalleServiceImpl implements InventarioDetalleService {
    @Autowired
    private InventarioDetalleRepository inventarioDetalleRepository;
    @Autowired
    private InventarioService inventarioService;

    @Override
    public List<InventarioDetalle> listar(){

        return inventarioDetalleRepository.findAll();
    }

    @Override
    @Transactional
    public InventarioDetalle guardar(InventarioDetalle inventarioDetalle) {
        // Verificar que el objeto Inventario asociado con InventarioDetalle no sea nulo
        if (inventarioDetalle.getInventario() == null) {
            throw new RuntimeException("InventarioDetalle no contiene un Inventario");
        }
        Inventario inventario = inventarioService.listarPorId(inventarioDetalle.getInventario().getId())
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado"));
        double cambioStock = inventarioDetalle.getEntrada() - inventarioDetalle.getSalida();

        inventario.setStock(inventario.getStock() + cambioStock);
        inventarioDetalle = inventarioDetalleRepository.save(inventarioDetalle);
        // Guardar el inventario actualizado
        inventarioService.guardar(inventario);

        return inventarioDetalle;
    }
    @Override
    public InventarioDetalle actualizar(InventarioDetalle inventarioDetalle) {

        return inventarioDetalleRepository.save(inventarioDetalle);
    }

    @Override
    public Optional<InventarioDetalle> listarPorId(Integer id){

        return inventarioDetalleRepository.findById(id);
    }

    @Override
    public void eliminarPorId(Integer id) {

        inventarioDetalleRepository.deleteById(id);
    }


}
