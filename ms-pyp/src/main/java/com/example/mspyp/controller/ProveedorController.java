package com.example.mspyp.controller;

import com.example.mspyp.entity.Proveedor;
import com.example.mspyp.service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/proveedor")
public class ProveedorController {

    @Autowired
    private ProveedorService proveedorService;

    @GetMapping()
    public ResponseEntity<List<Proveedor>> list(){

        return ResponseEntity.ok().body(proveedorService.listar());
    }

    @PostMapping()
    public ResponseEntity<Proveedor> save(@RequestBody Proveedor proveedor){
        return ResponseEntity.ok(proveedorService.guardar(proveedor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Proveedor> update(@PathVariable Integer id, @RequestBody Proveedor proveedor){
        proveedor.setId(id);
        return ResponseEntity.ok(proveedorService.actualizar(proveedor));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proveedor> listById(@PathVariable(required = true) Integer id){
        return ResponseEntity.ok().body(proveedorService.listarPorId(id).get());
    }

    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable(required = true) Integer id){ proveedorService.eliminarPorId(id);
        return "Eliminado Correctamente :3";
    }
}
