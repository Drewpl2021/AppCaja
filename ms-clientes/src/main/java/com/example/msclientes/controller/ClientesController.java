package com.example.msclientes.controller;

import com.example.msclientes.entity.Clientes;
import com.example.msclientes.service.ClientesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClientesController {
    @Autowired
    private ClientesService clientesService;

    @GetMapping()
    public ResponseEntity<List<Clientes>> list(){

        return ResponseEntity.ok().body(clientesService.listar());
    }

    @PostMapping()
    public ResponseEntity<Clientes> save(@RequestBody Clientes clientes){
        return ResponseEntity.ok(clientesService.guardar(clientes));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Clientes> update(@PathVariable Integer id, @RequestBody Clientes clientes) {
        clientes.setId(id);  // Asegúrate de que el ID está establecido en el objeto Personal
        return ResponseEntity.ok(clientesService.actualizar(clientes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Clientes> listById(@PathVariable(required = true) Integer id){
        return ResponseEntity.ok().body(clientesService.listarPorId(id).get());
    }

    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable(required = true) Integer id){ clientesService.eliminarPorId(id);
        return "Eliminado Correctamente :3";
    }
}
