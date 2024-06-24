package com.example.msinventario.service.impl;

import com.example.msinventario.entity.Inventario;
import com.example.msinventario.entity.InventarioDetalle;
import com.example.msinventario.repository.InventarioDetalleRepository;
import com.example.msinventario.repository.InventarioRepository;
import com.example.msinventario.service.InventarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
@Service
public class InventarioServiceImpl implements InventarioService {
    @Autowired
    private InventarioRepository inventarioRepository;
    @Autowired
    private InventarioDetalleRepository inventarioDetalleRepository;
    private static final Logger logger = LoggerFactory.getLogger(InventarioServiceImpl.class);


    @Override
    public List<Inventario> listar(){
        return inventarioRepository.findAll();
    }
    @Override
    public Inventario guardar(Inventario inventario) {
        return inventarioRepository.save(inventario);
    }
    @Override
    public Inventario actualizar(Inventario inventario) {
        return inventarioRepository.save(inventario);
    }
    @Override
    public Optional<Inventario> listarPorId(Integer id){
        return inventarioRepository.findById(id);
    }
    @Override
    public void eliminarPorId(Integer id) {
        inventarioRepository.deleteById(id);
    }

    @Transactional
    public void actualizarStock(InventarioDetalle inventarioDetalle) {
        Optional<Inventario> optInventario = inventarioRepository.findById(inventarioDetalle.getInventario().getId());
        if (optInventario.isPresent()) {
            Inventario inventario = optInventario.get();
            Double cambioStock = inventarioDetalle.calcularCambioStock();
            inventario.setStock(inventario.getStock() + cambioStock);
            inventarioRepository.save(inventario);
            logger.info("Stock actualizado para el inventario ID {}: nuevo stock {}", inventario.getId(), inventario.getStock());
        } else {
            logger.error("Inventario no encontrado para ID {}", inventarioDetalle.getInventario().getId());
            throw new RuntimeException("Inventario no encontrado");
        }
    }
}
