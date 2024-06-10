package com.example.msinventario.service.impl;

import com.example.msinventario.entity.Inventario;
import com.example.msinventario.repository.InventarioRepository;
import com.example.msinventario.repository.MovimientoRepository;
import com.example.msinventario.service.InventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class InventarioServiceImpl implements InventarioService {
    @Autowired
    private InventarioRepository inventarioRepository;
    @Autowired
    private MovimientoRepository movimientoRepository;
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


    public Inventario actualizarStock(Integer id, Double cantidad) {
        Inventario inventario = inventarioRepository.findById(id).get();
        inventario.setStock(inventario.getStock() + cantidad);
        return inventarioRepository.save(inventario);
    }
}
