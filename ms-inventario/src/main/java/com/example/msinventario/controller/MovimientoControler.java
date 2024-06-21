package com.example.msinventario.controller;

import com.example.msinventario.entity.Inventario;
import com.example.msinventario.entity.Movimiento;
import com.example.msinventario.service.InventarioService;
import com.example.msinventario.service.MovimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/movimiento")
public class MovimientoControler {
    @Autowired
    private MovimientoService movimientoService;
    @GetMapping()
    public ResponseEntity<List<Movimiento>> list(){
        return ResponseEntity.ok().body(movimientoService.listar());
    }
    @PostMapping()
    public ResponseEntity<Movimiento> save(@RequestBody Movimiento movimiento){
        return ResponseEntity.ok(movimientoService.guardar(movimiento));
    }
    @PutMapping()
    public ResponseEntity<Movimiento> update(@RequestBody Movimiento movimiento){
        return ResponseEntity.ok(movimientoService.actualizar(movimiento));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Movimiento> listById(@PathVariable(required = true) Integer id){
        return ResponseEntity.ok().body(movimientoService.listarPorId(id).get());
    }
    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable(required = true) Integer id){ movimientoService.eliminarPorId(id);
        return "Eliminado Correctamente :3";
    }
}
