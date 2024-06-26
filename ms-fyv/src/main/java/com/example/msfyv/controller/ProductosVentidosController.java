package com.example.msfyv.controller;


import com.example.msfyv.entity.ProductosVendidos;
import com.example.msfyv.service.ProductosVendidosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/productosVendidos")
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

    @PutMapping("/{id}")
    public ResponseEntity<ProductosVendidos> update(@PathVariable Integer id, @RequestBody ProductosVendidos productosVendidos ){
        productosVendidos.setId(id);
        return ResponseEntity.ok(productosVendidosService.actualizar(productosVendidos ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductosVendidos> listById(@PathVariable(required = true) Double id){
        return ResponseEntity.ok().body(productosVendidosService.listarPorId(id).get());
    }

    @GetMapping("/nombre/{nombreVen}")
    public ResponseEntity<List<ProductosVendidos>> listByNombreVen(@PathVariable Integer nombreVen) {
        List<ProductosVendidos> productosVendidosList = productosVendidosService.listarPorNombreVen(nombreVen);
        if (productosVendidosList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productosVendidosList);
    }



    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable(required = true) Double id){ productosVendidosService.eliminarPorId(id);
        return "Eliminado Correctamente :3";
    }
}
