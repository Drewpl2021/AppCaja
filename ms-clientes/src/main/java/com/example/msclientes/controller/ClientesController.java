package com.example.msclientes.controller;

import com.example.msclientes.entity.Clientes;
import com.example.msclientes.service.ClientesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/nombre/{nombreRazonSocial}")
    public ResponseEntity<Clientes> buscarPorNombreRazonSocialAproximado(@PathVariable String nombreRazonSocial) {
        return clientesService.buscarPorNombreRazonSocialAproximado(nombreRazonSocial)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/dni/{dni_ruc}")
    public ResponseEntity<Clientes> buscarPorDniRuc(@PathVariable Integer dni_ruc) {
        return clientesService.buscarPorDniRuc(dni_ruc)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable(required = true) Integer id){ clientesService.eliminarPorId(id);
        return "Eliminado Correctamente :3";
    }
}
