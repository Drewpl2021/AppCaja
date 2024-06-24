package com.example.msinventario.controller;

import com.example.msinventario.entity.Inventario;
import com.example.msinventario.entity.InventarioDetalle;
import com.example.msinventario.service.InventarioDetalleService;
import com.example.msinventario.service.InventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventario-detalle")
public class InventarioDetalleController {
    @Autowired
    private InventarioDetalleService inventarioDetalleService;
    @GetMapping()
    public ResponseEntity<List<InventarioDetalle>> list(){
        return ResponseEntity.ok().body(inventarioDetalleService.listar());
    }
    @PostMapping()
    public ResponseEntity<InventarioDetalle> save(@RequestBody InventarioDetalle inventarioDetalle){
        return ResponseEntity.ok(inventarioDetalleService.guardar(inventarioDetalle));
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
}
