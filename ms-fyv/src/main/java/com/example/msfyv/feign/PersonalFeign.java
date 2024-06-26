package com.example.msfyv.feign;


import com.example.msfyv.dto.PersonalDto;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-personal", path = "/personal")
public interface PersonalFeign {

    @GetMapping("/{id}")
    @CircuitBreaker(name = "personalListarPorIdCB", fallbackMethod = "fallBackPersonal")
    public ResponseEntity<PersonalDto> listById(@PathVariable(required = true) Integer id);
    default ResponseEntity<PersonalDto>fallBackPersonal(Integer id, Exception e) {

        return  ResponseEntity.ok(new PersonalDto());
    }

}
