package com.example.msfyv.feign;
import com.example.msfyv.dto.ProductoDto;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-pyp", path = "/producto")
public interface ProductoFeign {
    @GetMapping("/{id}")
    @CircuitBreaker(name = "productoListarPorIdCB", fallbackMethod = "fallBackProducto")
    public ResponseEntity<ProductoDto> listById(@PathVariable(required = true) Integer id);
    default ResponseEntity<ProductoDto>fallBackProducto(Integer id, Exception e) {
        ProductoDto productoDto = new ProductoDto();
        productoDto.setId(9000000);
        return  ResponseEntity.ok(productoDto);
    }
    //@GetMapping("/{id}/precio")
    //@CircuitBreaker(name = "productoPrecioCB", fallbackMethod = "fallBackPrecio")
    //public ResponseEntity<Double> getPrecio(@PathVariable(required = true) Integer id);


    //default ResponseEntity<Double> fallBackPrecio(Integer id, Exception e) {
    //return ResponseEntity.ok(0.0);
    //}
}
