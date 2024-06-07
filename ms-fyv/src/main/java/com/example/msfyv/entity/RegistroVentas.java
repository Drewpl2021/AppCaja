package com.example.msfyv.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "registro_ventas")
public class RegistroVentas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;

    public RegistroVentas() {
    }
}
