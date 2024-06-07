package com.example.mspyp.controller;

import com.example.mspyp.entity.Compras;
import com.example.mspyp.service.ComprasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/compras")
public class ComprasController {

    @Autowired
    private ComprasService comprasService;

    @GetMapping()
    public ResponseEntity<List<Compras>> list(){

        return ResponseEntity.ok().body(comprasService.listar());
    }

    @PostMapping()
    public ResponseEntity<Compras> save(@RequestBody Compras compras){
        return ResponseEntity.ok(comprasService.guardar(compras));
    }

    @PutMapping()
    public ResponseEntity<Compras> update(@RequestBody Compras compras){
        return ResponseEntity.ok(comprasService.actualizar(compras));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Compras> listById(@PathVariable(required = true) Integer id){
        return ResponseEntity.ok().body(comprasService.listarPorId(id).get());
    }

    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable(required = true) Integer id){ comprasService.eliminarPorId(id);
        return "Eliminado Correctamente :3";
    }

}
