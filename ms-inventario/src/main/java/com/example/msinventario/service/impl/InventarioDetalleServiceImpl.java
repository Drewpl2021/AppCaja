package com.example.msinventario.service.impl;

import com.example.msinventario.dto.ProductoDto;
import com.example.msinventario.entity.Inventario;
import com.example.msinventario.entity.InventarioDetalle;
import com.example.msinventario.feing.ProductoFeing;
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
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class InventarioDetalleServiceImpl implements InventarioDetalleService {
    @Autowired
    private InventarioDetalleRepository inventarioDetalleRepository;
    @Autowired
    private InventarioService inventarioService;
    @Autowired
    private ProductoFeing productoFeign;
    @Override
    public List<InventarioDetalle> listar(){

        return inventarioDetalleRepository.findAll();
    }

    @Override
    @Transactional
    public InventarioDetalle guardar(InventarioDetalle inventarioDetalle) {
        if (inventarioDetalle.getInventario() == null) {
            throw new RuntimeException("InventarioDetalle no contiene un Inventario");
        }

        Inventario inventario = inventarioService.listarPorId(inventarioDetalle.getInventario().getId())
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado"));

        double cambioStock = inventarioDetalle.getEntrada() - inventarioDetalle.getSalida();
        double nuevoStock = inventario.getStock() + cambioStock;

        if (nuevoStock > inventario.getStock_maximo()) {
            throw new IllegalArgumentException("El stock no puede ser mayor al stock máximo permitido");
        }

        if (nuevoStock < inventario.getStock_minimo()) {
            throw new IllegalArgumentException("El stock no puede ser menor al stock mínimo permitido");
        }


        inventario.setStock(nuevoStock);
        inventarioService.guardar(inventario);
        inventarioDetalle.setCosto_total(inventarioDetalle.getPrecio_de_compra() * inventarioDetalle.getEntrada());
        inventarioDetalle.setFecha(new Date());

        return inventarioDetalleRepository.save(inventarioDetalle);
    }
    @Override
    public InventarioDetalle actualizar(InventarioDetalle inventarioDetalle) {

        return inventarioDetalleRepository.save(inventarioDetalle);
    }

    @Override
    public Optional<InventarioDetalle> listarPorId(Integer id){
        Optional<InventarioDetalle> inventariosdetalles = inventarioDetalleRepository.findById(id);
        if (inventariosdetalles.isPresent()) {
            Integer productoId = inventariosdetalles.get().getInventario().getProductoId();//id
            ProductoDto productoDto = productoFeign.listById(productoId).getBody();
            inventariosdetalles.get().setProductoDto(productoDto);
        }
        return inventariosdetalles;
    }

    @Override
    public void eliminarPorId(Integer id) {

        inventarioDetalleRepository.deleteById(id);
    }
    @Override
    public double calcularCostoPromedioPonderado() {
        List<InventarioDetalle> detalles = listar();
        double costoTotal = detalles.stream().mapToDouble(InventarioDetalle::getCosto_total).sum();
        double cantidadTotal = detalles.stream().mapToDouble(InventarioDetalle::getEntrada).sum();
        return costoTotal / cantidadTotal;
    }
    @Override
    public List<InventarioDetalle> listarEntradas() {
    return inventarioDetalleRepository.findAll().stream()
            .filter(detalle -> detalle.getEntrada() > 0)
            .collect(Collectors.toList());
    }

    @Override
    public List<InventarioDetalle> listarSalidas() {
    return inventarioDetalleRepository.findAll().stream()
            .filter(detalle -> detalle.getSalida() > 0)
            .collect(Collectors.toList());
    }
    @Override
    public double calcularCostoTotalUltimosMeses(int meses) {
        LocalDateTime fechaLimite = LocalDateTime.now().minus(meses, ChronoUnit.MONTHS);
        return inventarioDetalleRepository.findAll().stream()
                .filter(detalle -> detalle.getFecha().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime().isAfter(fechaLimite))
                .mapToDouble(InventarioDetalle::getCosto_total)
                .sum();
    }
    @Override
    public List<InventarioDetalle> listarPorFecha(Date fecha) {
        return inventarioDetalleRepository.findAll().stream()
                .filter(detalle -> detalle.getFecha().equals(fecha))
                .collect(Collectors.toList());
    }
}
