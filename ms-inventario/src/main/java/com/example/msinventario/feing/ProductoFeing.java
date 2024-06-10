package com.example.msinventario.feing;

import com.example.msinventario.dto.ProductoDto;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-pyp", path = "/producto")
public interface ProductoFeing {
    @GetMapping("/{id}")
    @CircuitBreaker(name = "productoListarPorIdPr", fallbackMethod = "fallBackProductos")
    public ResponseEntity<ProductoDto> listarPorId(@PathVariable(required = true) Integer id);
    default ResponseEntity<ProductoDto>fallBackProducto(Integer id, Exception e) {
        ProductoDto productoDto = new ProductoDto();
        productoDto.setId(9000000);
        return  ResponseEntity.ok(productoDto);
    }
}
