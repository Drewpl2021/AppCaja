package com.example.mspersonal.controller;

import com.example.mspersonal.entity.Personal;
import com.example.mspersonal.service.PersonalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/personal")
public class PersonalController {

    @Autowired
    private PersonalService personalService;

    @GetMapping()
    public ResponseEntity<List<Personal>> list(){

        return ResponseEntity.ok().body(personalService.listar());
    }

    @PostMapping()
    public ResponseEntity<Personal> save(@RequestBody Personal personal){
        return ResponseEntity.ok(personalService.guardar(personal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Personal> update(@PathVariable Integer id, @RequestBody Personal personal) {
        personal.setId(id);  // Asegúrate de que el ID está establecido en el objeto Personal
        return ResponseEntity.ok(personalService.actualizar(personal));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Personal> listById(@PathVariable(required = true) Integer id){
        return ResponseEntity.ok().body(personalService.listarPorId(id).get());
    }

    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable(required = true) Integer id){ personalService.eliminarPorId(id);
        return "Eliminado Correctamente :3";
    }

}
