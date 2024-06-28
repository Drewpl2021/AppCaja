package com.example.mspyp.controller;

import com.example.mspyp.entity.ComprasDetallada;
import com.example.mspyp.entity.Producto;
import com.example.mspyp.service.ComprasDetalladaService;
import com.example.mspyp.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/compradetalla")
public class ComprasDetalleController {
    @Autowired
    private ComprasDetalladaService comprasDetalladaService;

    @GetMapping()
    public ResponseEntity<List<ComprasDetallada>> list(){

        return ResponseEntity.ok().body(comprasDetalladaService.listar());
    }

    @PostMapping()
    public ResponseEntity<ComprasDetallada> save(@RequestBody ComprasDetallada comprasDetallada){
        return ResponseEntity.ok(comprasDetalladaService.guardar(comprasDetallada));
    }

    @PutMapping()
    public ResponseEntity<ComprasDetallada> update(@RequestBody ComprasDetallada comprasDetallada){
        return ResponseEntity.ok(comprasDetalladaService.actualizar(comprasDetallada));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComprasDetallada> listById(@PathVariable(required = true) Integer id){
        return ResponseEntity.ok().body(comprasDetalladaService.listarPorId(id).get());
    }

    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable(required = true) Integer id){ comprasDetalladaService.eliminarPorId(id);
        return "Eliminado Correctamente :3";
    }
}
