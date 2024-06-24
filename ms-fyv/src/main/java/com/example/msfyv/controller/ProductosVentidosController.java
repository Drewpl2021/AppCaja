package com.example.msfyv.controller;


import com.example.msfyv.entity.ProductosVendidos;
import com.example.msfyv.service.ProductosVendidosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/factura")
public class ProductosVentidosController {
    @Autowired
    private ProductosVendidosService productosVendidosService;

    @GetMapping()
    public ResponseEntity<List<ProductosVendidos>> list(){

        return ResponseEntity.ok().body(productosVendidosService.listar());
    }

    @PostMapping()
    public ResponseEntity<ProductosVendidos> save(@RequestBody ProductosVendidos productosVendidos ){
        return ResponseEntity.ok(productosVendidosService.guardar(productosVendidos ));
    }

    @PutMapping()
    public ResponseEntity<ProductosVendidos> update(@RequestBody ProductosVendidos productosVendidos ){
        return ResponseEntity.ok(productosVendidosService.actualizar(productosVendidos ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductosVendidos> listById(@PathVariable(required = true) Double id){
        return ResponseEntity.ok().body(productosVendidosService.listarPorId(id).get());
    }

    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable(required = true) Double id){ productosVendidosService.eliminarPorId(id);
        return "Eliminado Correctamente :3";
    }
}
