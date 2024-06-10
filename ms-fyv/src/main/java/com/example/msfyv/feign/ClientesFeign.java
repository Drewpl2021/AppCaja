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
    public ResponseEntity<String> listById(@PathVariable(required = true) Integer id);
    default ResponseEntity<String> fallBackClientes(Integer id, Exception e) {
        return  ResponseEntity.ok("Unknown");
    }
}
