package com.example.mspersonal.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name = "personal")
public class Personal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private String apellidos;
    private String dni;
    private String telefono;
    private String email;
    private String contraseña;
    @Enumerated(EnumType.STRING)
    private Cargo cargo;
    @CreationTimestamp
    private LocalDateTime fechaAniadido;


    public Personal() {
    }
    public enum Cargo {
        EMPLEADO,
        GERENTE
    }


}
