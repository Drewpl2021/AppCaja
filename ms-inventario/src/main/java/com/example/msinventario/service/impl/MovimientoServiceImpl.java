package com.example.msinventario.service.impl;

import com.example.msinventario.entity.Movimiento;
import com.example.msinventario.repository.MovimientoRepository;
import com.example.msinventario.service.MovimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class MovimientoServiceImpl implements MovimientoService {
    @Autowired
    private MovimientoRepository movimientoRepository;

    @Override
    public List<Movimiento> listar(){

        return movimientoRepository.findAll();
    }

    @Override
    public Movimiento guardar(Movimiento clientes) {

        return movimientoRepository.save(clientes);
    }

    @Override
    public Movimiento actualizar(Movimiento clientes) {

        return movimientoRepository.save(clientes);
    }

    @Override
    public Optional<Movimiento> listarPorId(Integer id){

        return movimientoRepository.findById(id);
    }

    @Override
    public void eliminarPorId(Integer id) {

        movimientoRepository.deleteById(id);
    }
}
