package com.example.msinventario.service.impl;

import com.example.msinventario.entity.Inventario;
import com.example.msinventario.entity.Movimiento;
import com.example.msinventario.repository.InventarioRepository;
import com.example.msinventario.repository.MovimientoRepository;
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
    private MovimientoRepository movimientoRepository;
    private static final Logger logger = LoggerFactory.getLogger(InventarioServiceImpl.class);

    @Override
    public List<Inventario> listar(){
        return inventarioRepository.findAll();
    }
    @Override
    @Transactional
    public Inventario guardar(Inventario inventario, Movimiento movimiento) {
        Double cambioStock = movimiento.calcularCambioStock();
        logger.info("Cambio de stock calculado: {}", cambioStock);

        inventario.setStock(inventario.getStock() + cambioStock);
        logger.info("Stock actualizado: {}", inventario.getStock());

        inventario = inventarioRepository.save(inventario);
        logger.info("Inventario guardado: {}", inventario);

        movimiento.setInventario(inventario);
        movimientoRepository.save(movimiento);
        logger.info("Movimiento guardado: {}", movimiento);

        return inventario;
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





}
