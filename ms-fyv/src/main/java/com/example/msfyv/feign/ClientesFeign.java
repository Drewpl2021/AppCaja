package com.example.msfyv.feign;

import com.example.msfyv.dto.ClientesDto;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "clientes-service", path = "/clientes")
public interface ClientesFeign {

    @GetMapping("/{id}")
    @CircuitBreaker(name = "clientesListarPorIdCB", fallbackMethod = "fallBackClientes")
    public ResponseEntity<ClientesDto> listById(@PathVariable(required = true) Integer id);
    default ResponseEntity<ClientesDto> fallBackClientes(Integer id, Exception e) {
        ClientesDto cliente = new ClientesDto();
        cliente.setNombre("Nombre no disponible"); // Puedes establecer el nombre que desees aquí
        return ResponseEntity.ok(cliente);
    }

}
