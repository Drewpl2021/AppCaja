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
    private String apellido;
    private String dni;
    private String telefono;
    private String email;
    private String contraseña;
    @Enumerated(EnumType.STRING)
    private Cargo cargo;
    @CreationTimestamp
    private LocalDateTime fechaAñadido;
    public Personal() {
    }
    public enum Cargo {
        EMPLEADO,
        GERENTE
    }


}
