package com.example.msinventario.controller;

import com.example.msinventario.entity.Inventario;
import com.example.msinventario.entity.InventarioDetalle;
import com.example.msinventario.service.InventarioDetalleService;
import com.example.msinventario.service.InventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/detalle")
public class InventarioDetalleController {
    @Autowired
    private InventarioDetalleService inventarioDetalleService;
    @Autowired
    private InventarioService inventarioService;
    @GetMapping()
    public ResponseEntity<List<InventarioDetalle>> list(){
        return ResponseEntity.ok().body(inventarioDetalleService.listar());
    }
    @PostMapping()
    public ResponseEntity<?> save(@RequestBody InventarioDetalle inventarioDetalle){
    Inventario inventario = inventarioService.listarPorId(inventarioDetalle.getInventario().getId())
            .orElseThrow(() -> new RuntimeException("Inventario no encontrado"));
    double cambioStock = inventarioDetalle.getEntrada() - inventarioDetalle.getSalida();

    double nuevoStock = inventario.getStock() + cambioStock;
    if (nuevoStock > inventario.getStock_maximo()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El stock no puede ser mayor al stock máximo permitido");
    }
    if (nuevoStock < inventario.getStock_minimo()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El stock no puede ser menor al stock mínimo permitido");
    }

    try {
        return ResponseEntity.ok(inventarioDetalleService.guardar(inventarioDetalle));
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
    }
    @PutMapping()
    public ResponseEntity<InventarioDetalle> update(@RequestBody InventarioDetalle inventarioDetalle){
        return ResponseEntity.ok(inventarioDetalleService.actualizar(inventarioDetalle));
    }
    @GetMapping("/{id}")
    public ResponseEntity<InventarioDetalle> listById(@PathVariable(required = true) Integer id){
        return ResponseEntity.ok().body(inventarioDetalleService.listarPorId(id).get());
    }
    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable(required = true) Integer id){ inventarioDetalleService.eliminarPorId(id);
        return "Eliminado Correctamente :3";
    }

    @GetMapping("/reporte/entradas")
    public ResponseEntity<List<Map<String, Object>>> reporteEntradas(){
        List<Map<String, Object>> entradas = inventarioDetalleService.listar().stream()
                .filter(detalle -> detalle.getEntrada() > 0)
                .map(detalle -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("fecha", detalle.getFecha());
                    map.put("entrada", detalle.getEntrada());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok().body(entradas);
    }

    @GetMapping("/reporte/salidas")
    public ResponseEntity<List<Map<String, Object>>> reporteSalidas(){
        List<Map<String, Object>> salidas = inventarioDetalleService.listar().stream()
                .filter(detalle -> detalle.getSalida() > 0)
                .map(detalle -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("fecha", detalle.getFecha());
                    map.put("salida", detalle.getSalida());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok().body(salidas);
    }
    @GetMapping("/reporte/costo-meses/{meses}")
    public ResponseEntity<Double> reporteCostoTotalUltimosMeses(@PathVariable int meses){
        double costoTotal = inventarioDetalleService.calcularCostoTotalUltimosMeses(meses);
        return ResponseEntity.ok().body(costoTotal);
    }
}
