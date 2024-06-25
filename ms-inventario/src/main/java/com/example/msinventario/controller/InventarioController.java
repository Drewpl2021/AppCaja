package com.example.msinventario.controller;

import com.example.msinventario.entity.Inventario;
import com.example.msinventario.entity.InventarioDetalle;
import com.example.msinventario.repository.InventarioDetalleRepository;
import com.example.msinventario.service.InventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/inventario")
public class InventarioController {
    @Autowired
    private InventarioService inventarioService;
    @GetMapping()
    public ResponseEntity<List<Inventario>> list(){
        return ResponseEntity.ok().body(inventarioService.listar());
    }
    @PostMapping()
    public ResponseEntity<Inventario> save(@RequestBody Inventario inventario){
        return ResponseEntity.ok(inventarioService.guardar(inventario));
    }
    @PutMapping()
    public ResponseEntity<Inventario> update(@RequestBody Inventario inventario){
        return ResponseEntity.ok(inventarioService.actualizar(inventario));
    }
    @GetMapping("/{id}")
    public ResponseEntity<String> listById(@PathVariable(required = true) Integer id){
        Inventario inventario = inventarioService.listarPorId(id).orElse(null);
        if (inventario != null) {
            return ResponseEntity.ok("Este es del inventario " + id + ": " + inventario.toString());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inventario " + id + " no encontrado");
        }
    }
    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable(required = true) Integer id){ inventarioService.eliminarPorId(id);
        return "Eliminado Correctamente :3";
    }
    @GetMapping("/stocks")
    public ResponseEntity<List<String>> getAllStocks() {
        List<Inventario> inventarios = inventarioService.listar();
        List<String> stocks = inventarios.stream()
                .map(inventario -> "Esto es del inventario " + inventario.getId() + " y su stock es: " + inventario.getStock())
                .collect(Collectors.toList());
        return ResponseEntity.ok(stocks);
    }

    @GetMapping("/stocks/{id}")
    public ResponseEntity<String> getStockById(@PathVariable Integer id) {
        Optional<Inventario> inventario = inventarioService.listarPorId(id);
        if (inventario.isPresent()) {
            return ResponseEntity.ok("Esto es del inventario " + id + " y su stock es: " + inventario.get().getStock());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inventario " + id + " no encontrado");
        }
    }
}
